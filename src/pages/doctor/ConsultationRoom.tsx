import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
  CheckCircle2,
  FileText,
  Plus,
  ArrowRight,
  ShieldAlert,
  Send,
  Save,
  PenLine,
  UserCheck,
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
        ? 'Protocolo Inicial · Instituto Vivans'
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

  const patientAvatarUrl = isNewOrTempPatient
    ? 'https://img.usecurling.com/ppl/512?gender=female&seed=88'
    : currentPatient?.name === 'Marina Costa'
      ? 'https://img.usecurling.com/ppl/512?gender=female&seed=42'
      : currentPatient?.name === 'Ana Ribeiro'
        ? 'https://img.usecurling.com/ppl/512?gender=female&seed=12'
        : currentPatient?.name === 'Paulo Mendes'
          ? 'https://img.usecurling.com/ppl/512?gender=male&seed=33'
          : 'https://img.usecurling.com/ppl/512?gender=female&seed=64'

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <SimulationDisclaimer text="Ambiente de Teleconsulta Simulado (Google Meet Integrado) · Instituto Vivans Telehealth" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333333] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCA5A5]">
              {consultationStage === 'in_call'
                ? 'Consulta em Andamento (Google Meet · 00:14:32)'
                : 'Consulta Encerrada · Síntese Final'}
            </span>
            <StatusBadge tone="green">
              {currentPatient?.name || 'Paciente'} ·{' '}
              {isNewOrTempPatient ? 'Primeira Consulta' : 'Retorno 30 min'}
            </StatusBadge>
            {currentPatient?.email && (
              <span className="hidden sm:inline text-xs text-[#ADADAD]">
                ({currentPatient.email})
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Atendimento Clínico · Dr. Guilherme Martins
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {consultationStage === 'in_call' ? (
            <button
              type="button"
              onClick={() => setConsultationStage('post_call')}
              className="min-h-10 rounded-xl bg-[#EF4444] px-4 text-xs font-bold text-white hover:brightness-110 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PhoneOff className="size-3.5" />
              <span>Encerrar Atendimento</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/medico')}
              className="min-h-10 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 cursor-pointer shadow-sm"
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
          <article className="overflow-hidden rounded-3xl bg-[#141414] border border-[#333333] shadow-lg relative min-h-[420px] flex flex-col justify-between p-4 backdrop-blur-md">
            {/* Patient Video Preview Screen */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/60 grid place-items-center border border-white/10">
              {isVideoOn ? (
                <div className="relative w-full h-full">
                  <img
                    src={patientAvatarUrl}
                    alt={`${currentPatient?.name || 'Paciente'} (Vídeo Demonstrativo)`}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-3 left-3 rounded-xl bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                    {currentPatient?.name || 'Paciente'} (Paciente)
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#ADADAD] space-y-2">
                  <VideoOff className="size-12 mx-auto text-[#777777]" />
                  <p className="text-xs font-medium">Câmera desativada na simulação</p>
                </div>
              )}

              {/* Doctor PiP preview */}
              <div className="absolute top-3 right-3 w-28 h-20 rounded-xl border border-[#D6B270]/40 bg-[#0F0F0F] overflow-hidden shadow-md relative">
                <img
                  src={DOCTOR_PROFILE.avatarUrl}
                  alt={DOCTOR_PROFILE.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] text-white">
                  Você ({DOCTOR_PROFILE.name})
                </span>
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                    : 'bg-[#EF4444] text-white'
                }`}
              >
                {isMicOn ? (
                  <Mic className="size-5 text-[#E8C391]" />
                ) : (
                  <MicOff className="size-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-all cursor-pointer ${
                  isVideoOn
                    ? 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                    : 'bg-[#EF4444] text-white'
                }`}
              >
                {isVideoOn ? (
                  <Video className="size-5 text-[#E8C391]" />
                ) : (
                  <VideoOff className="size-5" />
                )}
              </button>

              <div className="rounded-2xl bg-[#D6B270]/10 border border-[#D6B270]/30 px-4 py-2 text-xs font-bold text-[#E8C391] backdrop-blur-sm">
                HD · Conexão Criptografada (Demonstração)
              </div>
            </div>
          </article>

          {/* Patient Objective and Pre-visit summary in view during call */}
          <div className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-5 shadow-sm space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
                {isNewOrTempPatient ? 'Foco da Primeira Consulta' : 'Contexto da Pré-Consulta'}
              </span>
              <StatusBadge tone="green">
                {isNewOrTempPatient ? 'Novo Cadastro' : 'Recebida'}
              </StatusBadge>
            </div>
            <p className="text-xs text-[#CCCCCC] leading-relaxed italic bg-[#0F0F0F] p-3 rounded-xl border border-[#333333]">
              {isNewOrTempPatient
                ? `“Avaliação inicial com o Dr. Guilherme Martins. Mapeamento longitudinal de metabolismo e hábitos.”`
                : `“${currentPatient?.report?.summary || preConsultation.objective}”`}
            </p>
          </div>
        </div>

        {/* Right Side: Copilot Structuring & Plan Builder */}
        <div className="space-y-5">
          <article className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-5 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#D6B270]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Registro Clínico e Síntese de Apoio
                </h3>
              </div>
              <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
            </div>

            {/* Notes Section 1: Free Notes by Doctor with Quick Notes Reference */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <PenLine className="size-3.5 text-[#D6B270]" />
                  <span>Anotações clínicas do médico durante o atendimento:</span>
                </label>
                <span className="text-[10px] text-[#ADADAD]">Salvas no histórico</span>
              </div>
              <textarea
                rows={3}
                value={freeNotes}
                onChange={(e) => setFreeNotes(e.target.value)}
                className="w-full rounded-2xl border border-[#333333] bg-[#0F0F0F] p-3 text-xs leading-relaxed text-white focus:border-[#D6B270] focus:outline-none"
              />
            </div>

            {/* Previous Quick Notes Snippet */}
            {currentPatient?.quickNotes && currentPatient.quickNotes.length > 0 && (
              <div className="rounded-xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-2.5 text-xs text-[#E8C391]">
                <div className="flex items-center justify-between font-bold text-[10px] uppercase text-[#D6B270]">
                  <span>Última anotação pré-consulta:</span>
                  <span>{currentPatient.quickNotes[0].createdAt}</span>
                </div>
                <p className="mt-1 text-[11px] text-white leading-snug">
                  {currentPatient.quickNotes[0].content}
                </p>
              </div>
            )}

            {/* Notes Section 2: AI Structured Notes (Draft) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#E8C391]">
                  Estruturação de dados para apoio à tomada de decisão:
                </label>
                <span className="text-[10px] text-[#888888]">Texto editável pelo médico</span>
              </div>
              <textarea
                rows={4}
                value={structuredCopilot}
                onChange={(e) => setStructuredCopilot(e.target.value)}
                className="w-full rounded-2xl border border-[#333333] bg-[#0F0F0F] p-3 text-xs leading-relaxed text-[#CCCCCC] focus:border-[#D6B270] focus:outline-none"
              />
            </div>

            {/* Plan Builder: Adjust Care Plan & Activate Return Journey directly */}
            <div className="rounded-2xl border border-[#D6B270]/30 bg-[#141414] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
                  Ativação do Plano de Retorno &amp; Check-ins
                </p>
                <StatusBadge tone="amber">Requer Validação Médica</StatusBadge>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#ADADAD] mb-1">
                  Orientação acordada para a jornada de retorno:
                </label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#0F0F0F] px-3 py-2 text-xs font-bold text-white focus:border-[#D6B270] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="min-h-10 rounded-xl border border-[#333333] bg-[#1A1A1A] px-4 text-xs font-bold text-[#ADADAD] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Salvar Rascunho Clínico
                </button>

                {approvedAndSent ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8C391] py-2">
                    <CheckCircle2 className="size-4 text-[#D6B270]" />
                    <span>
                      Plano de Retorno Ativado no App de {currentPatient?.name || 'Paciente'}!
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmModalOpen(true)}
                    className="min-h-10 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Aprovar &amp; Ativar Check-ins de Retorno</span>
                  </button>
                )}
              </div>
            </div>

            {/* Safety rule message */}
            <div className="rounded-xl border border-[#333333] bg-[#0F0F0F] p-3 text-[11px] text-[#888888]">
              <strong className="text-[#ADADAD]">Governança Clínica:</strong> Toda síntese gerada
              por IA funciona como rascunho de apoio documental; o plano e as orientações só entram
              em vigor após deliberação e validação médica.
            </div>
          </article>
        </div>
      </div>

      {/* Confirmation Modal for Clinical Approval */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-2xl animate-fade-in-up space-y-4 text-white">
            <div className="flex items-center gap-3 border-b border-[#333333] pb-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/30">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Confirmar Validação Médica
                </h3>
                <p className="text-xs text-[#ADADAD]">
                  Publicação no perfil de {currentPatient?.name || 'Paciente'}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#CCCCCC] leading-relaxed space-y-2">
              <p>Você está prestes a aprovar e publicar oficialmente a orientação clínica:</p>
              <div className="rounded-xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-3 text-xs font-bold text-[#E8C391]">
                "{newAction}"
              </div>
              <p className="text-[11px] text-[#888888]">
                Esta ação substituirá o rascunho de IA e ficará visível imediatamente na aba "Plano"
                e "Hoje" do aplicativo da paciente.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="min-h-10 rounded-xl border border-[#333333] px-4 text-xs font-bold text-[#ADADAD] hover:bg-white/5 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApproveAndPublishToPatient}
                className="min-h-10 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-sm cursor-pointer"
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
