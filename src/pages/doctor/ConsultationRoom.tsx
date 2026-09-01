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
  ScreenShare,
  ScreenShareOff,
  Maximize2,
  ShieldCheck,
  FileText,
  Activity,
  History,
  Info,
  Check,
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
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenShareSource, setScreenShareSource] = useState<'dossier' | 'biomarkers'>('dossier')
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

  const handleToggleScreenShare = () => {
    const nextState = !isScreenSharing
    setIsScreenSharing(nextState)
    if (nextState) {
      notify('Compartilhamento de tela ativado · O paciente agora visualiza seus dados clínicos.')
    } else {
      notify('Compartilhamento de tela encerrado.')
    }
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="size-2 rounded-full bg-[#B4553F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4553F]">
              {consultationStage === 'in_call'
                ? 'Consulta Online em Andamento (00:14:32)'
                : 'Consulta Online Encerrada · Síntese Final'}
            </span>
            <StatusBadge tone="green">
              {currentPatient?.name || 'Paciente'} ·{' '}
              {isNewOrTempPatient ? 'Primeira Consulta' : 'Retorno 30 min'}
            </StatusBadge>
            {isScreenSharing && consultationStage === 'in_call' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C49A5B]/15 border border-[#C49A5B]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#9E7A3D] animate-fade-in">
                <ScreenShare className="size-3 text-[#9E7A3D]" />
                <span>Tela Compartilhada com Paciente</span>
              </span>
            )}
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
              className="min-h-9 rounded-xl border border-[#B4553F]/30 bg-[#FAF8F4] px-3.5 text-xs font-semibold text-[#B4553F] hover:bg-[#B4553F] hover:text-[#FFFFFF] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="size-3.5" />
              <span>Encerrar Atendimento</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/medico')}
              className="min-h-9 rounded-xl border border-[#2E5E4E]/30 bg-[#FAF8F4] px-4 text-xs font-semibold text-[#2E5E4E] hover:bg-[#2E5E4E] hover:text-[#FFFFFF] transition-all cursor-pointer"
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
          <article className="overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#E8E3D9] shadow-card relative min-h-[460px] flex flex-col justify-between p-4">
            {/* Patient Video Preview Screen with Brand Backdrop Texture */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#18231F] grid place-items-center border border-[#243730] shadow-inner min-h-[340px]">
              {/* V I N V A N S E Signature Brand Texture & Ambient Gradient (Behind Video/Shared Screen) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 18% 24%, rgba(196, 154, 91, 0.22) 0%, transparent 45%),
                    radial-gradient(circle at 82% 78%, rgba(46, 94, 78, 0.45) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(250, 248, 244, 0.04) 0%, transparent 70%),
                    linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                    linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                    linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                    linear-gradient(315deg, rgba(255,255,255,0.03) 25%, #18231F 25%)
                  `,
                  backgroundPosition: '0 0, 0 0, 0 0, 16px 0, 16px 0, 0 0, 0 0',
                  backgroundSize:
                    '100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px, 32px 32px, 32px 32px',
                }}
              />

              {/* Elegant Brand Watermark Overlay */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-[#18231F]/70 border border-[#C49A5B]/25 px-2.5 py-1 backdrop-blur-md pointer-events-none">
                <span className="size-1.5 rounded-full bg-[#C49A5B]" />
                <span className="font-serif text-[10px] tracking-[0.2em] font-semibold text-[#EAD7BA] uppercase">
                  V I N V A N S E
                </span>
              </div>

              {/* Live Screen Share View (When Activated) */}
              {isScreenSharing ? (
                <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between bg-[#121A17]/90 backdrop-blur-md">
                  {/* Screen Share Header Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#2E5E4E]/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="grid size-6 place-items-center rounded-lg bg-[#C49A5B] text-[#FFFFFF]">
                        <ScreenShare className="size-3.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#FAF8F4] flex items-center gap-1.5">
                          <span>Compartilhando com {currentPatient?.name || 'Paciente'}</span>
                          <span className="size-1.5 rounded-full bg-[#C49A5B] animate-ping" />
                        </p>
                        <p className="text-[10px] text-[#A3B8B0]">
                          Projeção em tempo real · Prontuário Longitudinal &amp; Biossinais
                        </p>
                      </div>
                    </div>

                    {/* Selector of what to share */}
                    <div className="flex items-center gap-1 rounded-xl bg-[#1E2D27] p-1 border border-[#2E5E4E]/50">
                      <button
                        type="button"
                        onClick={() => setScreenShareSource('dossier')}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                          screenShareSource === 'dossier'
                            ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                            : 'text-[#A3B8B0] hover:text-[#FAF8F4]'
                        }`}
                      >
                        Dossiê &amp; Plano
                      </button>
                      <button
                        type="button"
                        onClick={() => setScreenShareSource('biomarkers')}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                          screenShareSource === 'biomarkers'
                            ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                            : 'text-[#A3B8B0] hover:text-[#FAF8F4]'
                        }`}
                      >
                        Curva de Biossinais
                      </button>
                    </div>
                  </div>

                  {/* Shared Content Area */}
                  <div className="my-3 flex-1 rounded-xl bg-[#FAF8F4] p-4 text-[#1E1E1C] shadow-lg border border-[#E8E3D9] overflow-hidden flex flex-col justify-between">
                    {screenShareSource === 'dossier' ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#E8E3D9] pb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-[#2E5E4E]" />
                            <h4 className="font-serif text-xs font-bold text-[#1E1E1C]">
                              Dossiê Compartilhado · {currentPatient?.name || 'Paciente'}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E5E4E] bg-[#E7EFEA] px-2 py-0.5 rounded-full">
                            Ciclo 1 · Dia 29/90
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-lg bg-[#FFFFFF] p-2 border border-[#E8E3D9]">
                            <p className="text-[9px] uppercase font-bold text-[#8A8A84]">Adesão</p>
                            <p className="font-bold text-[#2E5E4E]">
                              {currentPatient?.adherence || '82% regular'}
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#FFFFFF] p-2 border border-[#E8E3D9]">
                            <p className="text-[9px] uppercase font-bold text-[#8A8A84]">
                              Evolução
                            </p>
                            <p className="font-bold text-[#1E1E1C]">
                              {currentPatient?.progress || '−1,8 kg acumulado'}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-[#E7EFEA] p-2.5 text-[11px] text-[#2E5E4E] border border-[#C3D6CC]">
                          <p className="font-bold">Orientação em destaque na tela:</p>
                          <p className="text-[#1E1E1C] font-serif text-xs mt-0.5">"{newAction}"</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#E8E3D9] pb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="size-4 text-[#2E5E4E]" />
                            <h4 className="font-serif text-xs font-bold text-[#1E1E1C]">
                              Linha de Biossinais e Sono · Últimos 28 dias
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold text-[#5C5C57]">
                            Sincronizado
                          </span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex justify-between items-center bg-[#FFFFFF] p-2 rounded-lg border border-[#E8E3D9]">
                            <span>Peso (Curva Longitudinal)</span>
                            <strong className="text-[#2E5E4E]">80,0 kg → 78,2 kg (−1,8 kg)</strong>
                          </div>
                          <div className="flex justify-between items-center bg-[#FFFFFF] p-2 rounded-lg border border-[#E8E3D9]">
                            <span>Eficiência do Sono</span>
                            <strong className="text-[#B7832F]">5h42 (Despertar às 3h)</strong>
                          </div>
                          <div className="flex justify-between items-center bg-[#FFFFFF] p-2 rounded-lg border border-[#E8E3D9]">
                            <span>Passos Médios Diários</span>
                            <strong className="text-[#2E5E4E]">6.420 passos/dia</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E3D9] text-[10px] text-[#5C5C57]">
                      <span>Visualização simultânea com o paciente</span>
                      <button
                        type="button"
                        onClick={handleToggleScreenShare}
                        className="text-[#B4553F] font-bold hover:underline cursor-pointer"
                      >
                        Parar compartilhamento
                      </button>
                    </div>
                  </div>

                  {/* Patient PiP during screen share */}
                  <div className="flex items-center justify-between text-[11px] text-[#FAF8F4]">
                    <div className="flex items-center gap-2">
                      <img
                        src={patientAvatarUrl}
                        alt={currentPatient?.name}
                        className="size-7 rounded-full object-cover border border-[#C49A5B]"
                      />
                      <span className="font-semibold text-xs text-[#FAF8F4]">
                        {currentPatient?.name} está visualizando esta tela
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A3B8B0]">HD 1080p</span>
                  </div>
                </div>
              ) : isVideoOn ? (
                /* Regular Video Preview */
                <div className="relative w-full h-full min-h-[340px]">
                  <img
                    src={patientAvatarUrl}
                    alt={`${currentPatient?.name || 'Paciente'} (Vídeo Demonstrativo)`}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle brand overlay on camera */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18231F]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 rounded-xl bg-[#18231F]/80 border border-[#FAF8F4]/15 px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] backdrop-blur-md flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#2F7D5B] animate-pulse" />
                    <span>{currentPatient?.name || 'Paciente'} (Paciente)</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#EAD7BA] space-y-2 z-10 p-6">
                  <div className="size-14 mx-auto rounded-2xl bg-[#243730] border border-[#2E5E4E] grid place-items-center">
                    <VideoOff className="size-7 text-[#A3B8B0]" />
                  </div>
                  <p className="text-xs font-semibold text-[#FAF8F4]">
                    Câmera desativada na simulação
                  </p>
                  <p className="text-[11px] text-[#A3B8B0]">
                    O áudio e o compartilhamento de tela continuam ativos
                  </p>
                </div>
              )}

              {/* Doctor PiP preview */}
              <div className="absolute bottom-3 right-3 z-20 w-28 h-20 sm:w-32 sm:h-24 rounded-2xl border-2 border-[#FAF8F4]/90 bg-[#18231F] overflow-hidden shadow-elevation group">
                <img
                  src={DOCTOR_PROFILE.photoUrl || DOCTOR_PROFILE.avatarUrl}
                  alt={DOCTOR_PROFILE.name}
                  className="w-full h-full object-cover block"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-[#18231F]/85 border border-[#FAF8F4]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#FFFFFF] backdrop-blur-sm shadow-sm pointer-events-none">
                  Você
                </span>
              </div>
            </div>

            {/* Video Controls bar with Refined Editorial Buttons & Screen Share */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 pt-1">
              {/* Left group: Mic & Cam toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  title={isMicOn ? 'Silenciar Microfone' : 'Ativar Microfone'}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all cursor-pointer ${
                    isMicOn
                      ? 'border-[#E8E3D9] bg-[#FAF8F4] text-[#1E1E1C] hover:bg-[#F1EEE7] hover:border-[#2E5E4E]/40'
                      : 'border-[#B4553F]/40 bg-[#F6E7E2] text-[#B4553F]'
                  }`}
                >
                  {isMicOn ? (
                    <>
                      <Mic className="size-3.5 text-[#2E5E4E]" />
                      <span className="hidden sm:inline">Microfone</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="size-3.5 text-[#B4553F]" />
                      <span>Mutado</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  title={isVideoOn ? 'Desativar Câmera' : 'Ativar Câmera'}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all cursor-pointer ${
                    isVideoOn
                      ? 'border-[#E8E3D9] bg-[#FAF8F4] text-[#1E1E1C] hover:bg-[#F1EEE7] hover:border-[#2E5E4E]/40'
                      : 'border-[#B4553F]/40 bg-[#F6E7E2] text-[#B4553F]'
                  }`}
                >
                  {isVideoOn ? (
                    <>
                      <Video className="size-3.5 text-[#2E5E4E]" />
                      <span className="hidden sm:inline">Câmera</span>
                    </>
                  ) : (
                    <>
                      <VideoOff className="size-3.5 text-[#B4553F]" />
                      <span>Sem vídeo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Center/Right: Screen Share button & Security status */}
              <div className="flex items-center gap-2">
                {/* Screen Share Action Button (Item 1) */}
                <button
                  type="button"
                  onClick={handleToggleScreenShare}
                  title={
                    isScreenSharing
                      ? 'Clique para parar o compartilhamento de tela'
                      : 'Compartilhar tela, prontuário ou biossinais com o paciente'
                  }
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold transition-all cursor-pointer shadow-subtle ${
                    isScreenSharing
                      ? 'border-[#C49A5B] bg-[#FBF5EB] text-[#9E7A3D] ring-2 ring-[#C49A5B]/30'
                      : 'border-[#E8E3D9] bg-[#FAF8F4] text-[#1E1E1C] hover:bg-[#F1EEE7] hover:border-[#C49A5B]'
                  }`}
                >
                  {isScreenSharing ? (
                    <>
                      <ScreenShare className="size-3.5 text-[#9E7A3D]" />
                      <span className="font-bold">Compartilhamento Ativo</span>
                      <span className="hidden md:inline text-[10px] text-[#9E7A3D] font-normal">
                        (Clique p/ parar)
                      </span>
                    </>
                  ) : (
                    <>
                      <ScreenShare className="size-3.5 text-[#2E5E4E]" />
                      <span>Compartilhar Tela</span>
                    </>
                  )}
                </button>

                <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#E7EFEA] border border-[#C3D6CC] px-3 py-1.5 text-[11px] font-semibold text-[#2E5E4E]">
                  <ShieldCheck className="size-3.5 text-[#2E5E4E]" />
                  <span>HD · Criptografada</span>
                </div>
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
                  className="min-h-9 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3.5 text-xs font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] hover:border-[#2E5E4E]/30 transition-all cursor-pointer"
                >
                  Salvar Rascunho Clínico
                </button>

                {approvedAndSent ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F7D5B] py-1.5">
                    <CheckCircle2 className="size-4 text-[#2F7D5B]" />
                    <span>
                      Plano de Retorno Ativado no App de {currentPatient?.name || 'Paciente'}!
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmModalOpen(true)}
                    className="min-h-9 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Aprovar &amp; Ativar Check-ins de Retorno</span>
                  </button>
                )}
              </div>{' '}
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
                className="min-h-9 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3.5 text-xs font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApproveAndPublishToPatient}
                className="min-h-9 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm cursor-pointer transition-all active:scale-[0.98]"
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
