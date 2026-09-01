import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge } from '@/components/CommonUI'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
  CheckCircle2,
  PenLine,
} from 'lucide-react'

export default function DoctorConsultationRoom() {
  const { id } = useParams<{ id: string }>()
  const { patients, appointments, preConsultation, addCarePlanItem, addPatientQuickNote, notify } =
    useVivans()
  const navigate = useNavigate()

  // Find matching patient or appointment
  const currentPatient = React.useMemo(() => {
    if (!id) return patients[0]
    // Check if id matches an appointment
    const matchedApt = appointments.find((a) => a.id === id)
    if (matchedApt) {
      const p = patients.find(
        (pt) =>
          pt.name.toLowerCase() === matchedApt.patient.toLowerCase() ||
          pt.id === matchedApt.patient.toLowerCase().replace(/\s+/g, '-'),
      )
      if (p) return p
    }
    // Check direct patient id
    const directMatch = patients.find((p) => p.id === id)
    if (directMatch) return directMatch
    return patients[0]
  }, [id, patients, appointments])

  const isNewOrTempPatient = currentPatient?.isTemporary || currentPatient?.progress === 'Novo'

  // Consultation state
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [consultationStage, setConsultationStage] = useState<'in_call' | 'post_call'>('in_call')

  // Clinical notes state initialized dynamically
  const [freeNotes, setFreeNotes] = useState(() => {
    if (isNewOrTempPatient) {
      return `Primeira consulta de acolhimento para ${currentPatient?.name || 'Novo Paciente'}. Mapeamento de objetivos de longevidade e perfil metabólico.`
    }
    const previousQuickNote = currentPatient?.quickNotes?.[0]?.content
    if (previousQuickNote) {
      return `[Anotação prévia do prontuário: "${previousQuickNote}"]\n\nPaciente ${currentPatient?.name || ''} relata adesão ao plano com evolução (${currentPatient?.progress || 'estável'}).`
    }
    return `Paciente ${currentPatient?.name || ''} relata adesão ao plano com evolução (${currentPatient?.progress || 'estável'}). Foco atual: ${currentPatient?.focus || 'rotina de longevidade'}.`
  })

  const [structuredCopilot, setStructuredCopilot] = useState(() => {
    if (isNewOrTempPatient) {
      return `• Anamnese Inicial: Avaliação de estilo de vida, queixas principais e histórico familiar de ${currentPatient?.name}.\n• Hipóteses Clínicas: Foco em longevidade ativa e adequação metabólica.\n• Próximos Passos: Solicitação de painel de exames, definição de metas graduais e retorno em 30 dias.`
    }
    return `• Síntese dos relatos: Evolução ponderal (${currentPatient?.progress}) e adesão de ${currentPatient?.adherence || '82%'}.\n• Observação clínica: ${currentPatient?.insight?.detail || currentPatient?.attention || 'Acompanhamento longitudinal'}.\n• Tópicos para deliberação médica: Ajuste de hábitos, validação de suplementação e ativação de check-ins programados.`
  })

  // New action form for care plan
  const [newAction, setNewAction] = useState(() => {
    if (isNewOrTempPatient) {
      return 'Iniciar protocolo de hidratação (35ml/kg) e diário alimentar'
    }
    return currentPatient?.nextSteps?.[0] || 'Antecipar o horário do jantar para as 19h30'
  })
  const [savedPlanDraft, setSavedPlanDraft] = useState(false)
  const [approvedAndSent, setApprovedAndSent] = useState(false)

  const handleSaveDraft = () => {
    if (currentPatient && freeNotes.trim()) {
      addPatientQuickNote(currentPatient.id, freeNotes.trim(), 'evolucao')
    }
    setSavedPlanDraft(true)
    notify('Rascunho clínico e anotações gravadas no prontuário.')
  }

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const handleApproveAndPublishToPatient = () => {
    addCarePlanItem({
      action: newAction,
      category: isNewOrTempPatient
        ? 'Protocolo Inicial · V I N V A N S E'
        : 'Crononutrição · Ajuste pós-consulta',
      type: 'medical',
      completed: false,
      frequency: 'Diário',
    })
    setApprovedAndSent(true)
    setConfirmModalOpen(false)
    notify(
      `Plano pós-consulta aprovado e jornada ativada para ${currentPatient?.name || 'o paciente'}.`,
    )
  }

  const patientAvatarUrl =
    currentPatient?.avatarUrl ||
    (isNewOrTempPatient
      ? 'https://img.usecurling.com/ppl/512?gender=female&seed=88'
      : 'https://img.usecurling.com/ppl/512?gender=female&seed=88')
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E3D9] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-[#B4553F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4553F]">
              {consultationStage === 'in_call'
                ? 'Consulta em Andamento (00:14:32)'
                : 'Consulta Encerrada · Síntese Final'}
            </span>
            <StatusBadge tone="green">
              {currentPatient?.name || 'Paciente'} ·{' '}
              {isNewOrTempPatient ? 'Primeira Consulta' : 'Retorno 30 min'}
            </StatusBadge>
            {currentPatient?.email && (
              <span className="hidden sm:inline text-xs text-[#5C5C57]">
                ({currentPatient.email})
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1E1E1C]">
            Consulta Online · Dr. Guilherme Martins
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {consultationStage === 'in_call' ? (
            <button
              type="button"
              onClick={() => setConsultationStage('post_call')}
              className="min-h-10 rounded-xl bg-[#B4553F] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#9E3E2A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PhoneOff className="size-3.5" />
              <span>Encerrar Atendimento</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/medico')}
              className="min-h-10 rounded-xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] cursor-pointer shadow-sm"
            >
              Voltar ao Painel Geral
            </button>
          )}
        </div>
      </div>

      {/* Split Screen Layout: Video (Left) vs Copilot & Notes (Right) */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Mock Video Call */}
        <div className="space-y-4">
          <article className="overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#E8E3D9] shadow-card relative min-h-[420px] flex flex-col justify-between p-4">
            {/* Patient Video Preview Screen */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#FAF8F4] grid place-items-center border border-[#E8E3D9]">
              {isVideoOn ? (
                <div className="relative w-full h-full">
                  <img
                    src={patientAvatarUrl}
                    alt={`${currentPatient?.name || 'Paciente'} (Vídeo Demonstrativo)`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-xl bg-[#1E1E1C]/80 px-3 py-1 text-xs font-semibold text-[#FFFFFF] backdrop-blur-md">
                    {currentPatient?.name || 'Paciente'} (Paciente)
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#5C5C57] space-y-2">
                  <VideoOff className="size-12 mx-auto text-[#8A8A84]" />
                  <p className="text-xs font-medium">Câmera desativada na simulação</p>
                </div>
              )}

              {/* Doctor PiP preview */}
              <div className="absolute bottom-3 right-3 z-10 w-28 h-20 sm:w-32 sm:h-24 rounded-2xl border-2 border-[#FFFFFF] bg-[#FAF8F4] overflow-hidden shadow-elevation">
                <img
                  src={DOCTOR_PROFILE.photoUrl || DOCTOR_PROFILE.avatarUrl}
                  alt={DOCTOR_PROFILE.name}
                  className="w-full h-full object-cover block"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-[#1E1E1C]/85 px-1.5 py-0.5 text-[10px] font-semibold text-[#FFFFFF] backdrop-blur-sm shadow-sm pointer-events-none">
                  Você
                </span>
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-all cursor-pointer shadow-subtle ${
                  isMicOn
                    ? 'bg-[#FAF8F4] text-[#2E5E4E] hover:bg-[#F1EEE7] border border-[#E8E3D9]'
                    : 'bg-[#B4553F] text-[#FFFFFF]'
                }`}
              >
                {isMicOn ? (
                  <Mic className="size-5 text-[#2E5E4E]" />
                ) : (
                  <MicOff className="size-5 text-[#FFFFFF]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-all cursor-pointer shadow-subtle ${
                  isVideoOn
                    ? 'bg-[#FAF8F4] text-[#2E5E4E] hover:bg-[#F1EEE7] border border-[#E8E3D9]'
                    : 'bg-[#B4553F] text-[#FFFFFF]'
                }`}
              >
                {' '}
                {isVideoOn ? (
                  <Video className="size-5 text-[#2E5E4E]" />
                ) : (
                  <VideoOff className="size-5" />
                )}
              </button>

              <div className="rounded-2xl bg-[#E7EFEA] border border-[#C3D6CC] px-4 py-2 text-xs font-bold text-[#2E5E4E]">
                HD · Conexão Criptografada (Demonstração)
              </div>
            </div>
          </article>

          {/* Patient Objective and Pre-visit summary in view during call */}
          <div className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                {isNewOrTempPatient ? 'Foco da Primeira Consulta' : 'Contexto da Pré-Consulta'}
              </span>
              <StatusBadge tone="green">
                {isNewOrTempPatient ? 'Novo Cadastro' : 'Recebida'}
              </StatusBadge>
            </div>
            <p className="text-xs text-[#5C5C57] leading-relaxed italic bg-[#FAF8F4] p-3 rounded-xl border border-[#E8E3D9]">
              {isNewOrTempPatient
                ? `“Avaliação inicial com o Dr. Guilherme Martins. Mapeamento longitudinal de metabolismo e hábitos.”`
                : `“${currentPatient?.report?.summary || preConsultation.objective}”`}
            </p>
          </div>
        </div>

        {/* Right Side: Copilot Structuring & Plan Builder */}
        <div className="space-y-5">
          <article className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE5] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#2E5E4E]" />
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                  Registro Clínico e Síntese de Apoio
                </h3>
              </div>
              <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
            </div>

            {/* Notes Section 1: Free Notes by Doctor with Quick Notes Reference */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1E1E1C] flex items-center gap-1.5">
                  <PenLine className="size-3.5 text-[#2E5E4E]" />
                  <span>Anotações clínicas do médico durante o atendimento:</span>
                </label>
                <span className="text-[10px] text-[#5C5C57]">Salvas no histórico</span>
              </div>
              <textarea
                rows={3}
                value={freeNotes}
                onChange={(e) => setFreeNotes(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs leading-relaxed text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
              />
            </div>

            {/* Previous Quick Notes Snippet */}
            {currentPatient?.quickNotes && currentPatient.quickNotes.length > 0 && (
              <div className="rounded-xl border border-[#C3D6CC] bg-[#E7EFEA] p-2.5 text-xs text-[#2E5E4E]">
                <div className="flex items-center justify-between font-bold text-[10px] uppercase text-[#2E5E4E]">
                  <span>Última anotação pré-consulta:</span>
                  <span>{currentPatient.quickNotes[0].createdAt}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#1E1E1C] leading-snug">
                  {currentPatient.quickNotes[0].content}
                </p>
              </div>
            )}

            {/* Notes Section 2: AI Structured Notes (Draft) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#2E5E4E]">
                  Estruturação de dados para apoio à tomada de decisão:
                </label>
                <span className="text-[10px] text-[#5C5C57]">Texto editável pelo médico</span>
              </div>
              <textarea
                rows={4}
                value={structuredCopilot}
                onChange={(e) => setStructuredCopilot(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs leading-relaxed text-[#5C5C57] focus:border-[#2E5E4E] focus:outline-none"
              />
            </div>

            {/* Plan Builder: Adjust Care Plan & Activate Return Journey directly */}
            <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Ativação do Plano de Retorno &amp; Check-ins
                </p>
                <StatusBadge tone="amber">Requer Validação Médica</StatusBadge>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C5C57] mb-1">
                  Orientação acordada para a jornada de retorno:
                </label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3 py-2 text-xs font-bold text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="min-h-10 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-4 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Salvar Rascunho Clínico
                </button>

                {approvedAndSent ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F7D5B] py-2">
                    <CheckCircle2 className="size-4 text-[#2F7D5B]" />
                    <span>
                      Plano de Retorno Ativado no App de {currentPatient?.name || 'Paciente'}!
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmModalOpen(true)}
                    className="min-h-10 rounded-xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Aprovar &amp; Ativar Check-ins de Retorno</span>
                  </button>
                )}
              </div>
            </div>

            {/* Safety rule message */}
            <div className="rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-[11px] text-[#5C5C57]">
              <strong className="text-[#1E1E1C]">Governança Clínica:</strong> Toda síntese gerada
              por IA funciona como rascunho de apoio documental; o plano e as orientações só entram
              em vigor após deliberação e validação médica.
            </div>
          </article>
        </div>
      </div>

      {/* Confirmation Modal for Clinical Approval */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-elevation animate-fade-in-up space-y-4 text-[#1E1E1C]">
            <div className="flex items-center gap-3 border-b border-[#EFECE5] pb-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                  Confirmar Validação Médica
                </h3>
                <p className="text-xs text-[#5C5C57]">
                  Publicação no perfil de {currentPatient?.name || 'Paciente'}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#5C5C57] leading-relaxed space-y-2">
              <p>Você está prestes a aprovar e publicar oficialmente a orientação clínica:</p>
              <div className="rounded-xl border border-[#C3D6CC] bg-[#E7EFEA] p-3 text-xs font-bold text-[#2E5E4E]">
                "{newAction}"
              </div>
              <p className="text-[11px] text-[#8A8A84]">
                Esta ação substituirá o rascunho de IA e ficará visível imediatamente na aba "Plano"
                e "Hoje" do aplicativo da paciente.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="min-h-10 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApproveAndPublishToPatient}
                className="min-h-10 rounded-xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm cursor-pointer"
              >
                Confirmar e Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
