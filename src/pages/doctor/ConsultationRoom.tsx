import React, { useState, useEffect } from 'react'
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
  ShieldCheck,
  FileText,
  Activity,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react'

export default function DoctorConsultationRoom() {
  const { id } = useParams<{ id: string }>()
  const {
    patients,
    appointments,
    preConsultation,
    publishApprovedConsultationPlan,
    addPatientQuickNote,
    notify,
  } = useVivans()
  const navigate = useNavigate()

  // Find matching patient or appointment
  const currentPatient = React.useMemo(() => {
    if (!id) return patients[0]
    const matchedApt = appointments.find((a) => a.id === id)
    if (matchedApt) {
      const p = patients.find(
        (pt) =>
          pt.name.toLowerCase() === matchedApt.patient.toLowerCase() ||
          pt.id === matchedApt.patient.toLowerCase().replace(/\s+/g, '-'),
      )
      if (p) return p
    }
    const directMatch = patients.find((p) => p.id === id)
    if (directMatch) return directMatch
    return patients[0]
  }, [id, patients, appointments])

  const isNewOrTempPatient = currentPatient?.isTemporary || currentPatient?.progress === 'Novo'
  const patientName = currentPatient?.name || 'Marina Costa'

  // Consultation media & stage
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenShareSource, setScreenShareSource] = useState<'dossier' | 'biomarkers'>('dossier')
  const [consultationStage, setConsultationStage] = useState<'in_call' | 'post_call'>('in_call')

  // Timer State: starts at 14m 32s (872 seconds) for realistic ongoing simulation
  const [callSeconds, setCallSeconds] = useState(872)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [timerAlertDismissed, setTimerAlertDismissed] = useState(false)

  useEffect(() => {
    if (!isTimerRunning || consultationStage === 'post_call') return
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, consultationStage])

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    }
    return `${pad(mins)}:${pad(secs)}`
  }

  const isOver30Minutes = callSeconds >= 1800 // 30 minutes threshold (1800s)

  // Simulation quick jump helper for testing
  const handleFastForwardTimer = () => {
    setCallSeconds(1860) // 31 minutes
    setTimerAlertDismissed(false)
    notify('Cronômetro avançado para 31:00 para simulação do aviso de tempo.')
  }

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

  // Structured Summary Modal State (Item 2)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)

  // Editable Structured Summary Fields
  const [decisions, setDecisions] = useState<string[]>(() => {
    if (isNewOrTempPatient) {
      return [
        'Iniciar protocolo de hidratação de 35ml/kg e diário alimentar fotográfico.',
        'Prescrever painel laboratorial de metabolismo e biossinais básais.',
      ]
    }
    return [
      'Antecipar o horário do jantar para as 19h30 para reduzir os despertares noturnos das 3h.',
      'Manter aporte hídrico de 500 ml antes das principais refeições.',
      'Manter prescrição #RX-1042 (Bisglicinato de Magnésio + Inositol às 21h30).',
    ]
  })

  const [pendingTasks, setPendingTasks] = useState<string[]>(() => {
    if (isNewOrTempPatient) {
      return [
        'Realizar exames laboratoriais na rede credenciada antes da próxima consulta.',
        'Preencher primeiros 7 dias do diário com percepções de saciedade.',
      ]
    }
    return [
      'Agendar exame de sangue complementar (perfil lipídico e glicemia de jejum).',
      'Registrar 3 fotos do jantar no diário para acompanhamento de saciedade.',
    ]
  })

  const [nextSteps, setNextSteps] = useState<string[]>(() => {
    if (isNewOrTempPatient) {
      return [
        'Ativação da jornada de acolhimento de 30 dias no app da paciente.',
        'Consulta de retorno agendada para 30 dias.',
      ]
    }
    return [
      'Acompanhar check-in programado de sono no Dia 3.',
      'Consulta de retorno em 14 dias para avaliação dos despertares.',
      'Revisão do relatório clínico quinzenal.',
    ]
  })

  const [additionalDoctorNotes, setAdditionalDoctorNotes] = useState(
    'Paciente demonstrou excelente compreensão da correlação entre o horário da digestão noturna e a qualidade do sono profundo.',
  )

  // Direct Plan Publishing Modal State (Item 3)
  const [directSendModalOpen, setDirectSendModalOpen] = useState(false)
  const [planSentSuccess, setPlanSentSuccess] = useState(false)
  const [lastSentTimestamp, setLastSentTimestamp] = useState<string | null>(null)

  // Helper function to add/remove/edit items in the structured summary
  const handleDecisionChange = (index: number, val: string) => {
    setDecisions((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }
  const handleAddDecision = () => setDecisions((prev) => [...prev, ''])
  const handleRemoveDecision = (index: number) =>
    setDecisions((prev) => prev.filter((_, i) => i !== index))

  const handlePendingChange = (index: number, val: string) => {
    setPendingTasks((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }
  const handleAddPending = () => setPendingTasks((prev) => [...prev, ''])
  const handleRemovePending = (index: number) =>
    setPendingTasks((prev) => prev.filter((_, i) => i !== index))

  const handleNextStepChange = (index: number, val: string) => {
    setNextSteps((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }
  const handleAddNextStep = () => setNextSteps((prev) => [...prev, ''])
  const handleRemoveNextStep = (index: number) =>
    setNextSteps((prev) => prev.filter((_, i) => i !== index))

  // Open the end-consultation structured modal
  const handleInitiateEndCall = () => {
    setSummaryModalOpen(true)
  }

  // Confirm closure and approve plan from End Consultation Modal
  const handleConfirmEndAndSendPlan = () => {
    const cleanedDecisions = decisions.filter((d) => d.trim().length > 0)
    const cleanedPending = pendingTasks.filter((p) => p.trim().length > 0)
    const cleanedNextSteps = nextSteps.filter((n) => n.trim().length > 0)

    publishApprovedConsultationPlan({
      patientId: currentPatient?.id || 'marina-costa',
      patientName: patientName,
      doctorName: DOCTOR_PROFILE.name,
      decisions: cleanedDecisions,
      pendingTasks: cleanedPending,
      nextSteps: cleanedNextSteps,
      careGoal: currentPatient?.focus || 'Longevidade e metabolismo',
      additionalNotes: additionalDoctorNotes.trim(),
    })

    if (currentPatient && freeNotes.trim()) {
      addPatientQuickNote(
        currentPatient.id,
        `[Síntese da Consulta Finalizada]\n${freeNotes.trim()}`,
        'evolucao',
      )
    }

    setSummaryModalOpen(false)
    setConsultationStage('post_call')
    setIsTimerRunning(false)
    setPlanSentSuccess(true)
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setLastSentTimestamp(nowTime)
    notify(`Consulta encerrada e plano validado enviado para ${patientName}!`)
  }

  // Direct Send button action (Item 3 explicit confirmation)
  const handleConfirmDirectSend = () => {
    const cleanedDecisions = decisions.filter((d) => d.trim().length > 0)
    const cleanedPending = pendingTasks.filter((p) => p.trim().length > 0)
    const cleanedNextSteps = nextSteps.filter((n) => n.trim().length > 0)

    publishApprovedConsultationPlan({
      patientId: currentPatient?.id || 'marina-costa',
      patientName: patientName,
      doctorName: DOCTOR_PROFILE.name,
      decisions: cleanedDecisions,
      pendingTasks: cleanedPending,
      nextSteps: cleanedNextSteps,
      careGoal: currentPatient?.focus || 'Longevidade e metabolismo',
      additionalNotes: additionalDoctorNotes.trim(),
    })

    setDirectSendModalOpen(false)
    setPlanSentSuccess(true)
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setLastSentTimestamp(nowTime)
  }

  const handleSaveDraft = () => {
    if (currentPatient && freeNotes.trim()) {
      addPatientQuickNote(currentPatient.id, freeNotes.trim(), 'evolucao')
    }
    notify('Rascunho clínico e anotações gravadas no prontuário.')
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
      {/* 1. HEADER COM CRONÔMETRO E STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E3D9] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`size-2 rounded-full ${
                consultationStage === 'in_call' ? 'bg-[#2F7D5B] animate-pulse' : 'bg-[#8A8A84]'
              }`}
            />
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                consultationStage === 'in_call' ? 'text-[#2E5E4E]' : 'text-[#5C5C57]'
              }`}
            >
              {consultationStage === 'in_call'
                ? `Consulta Online em Andamento (${formatTimer(callSeconds)})`
                : 'Consulta Online Encerrada · Síntese Final'}
            </span>

            <StatusBadge tone="green">
              {patientName} · {isNewOrTempPatient ? 'Primeira Consulta' : 'Retorno 30 min'}
            </StatusBadge>

            {/* Timer visual pill in header */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                isOver30Minutes
                  ? 'bg-[#F7EFDF] text-[#B7832F] border-[#EAD7BA]'
                  : 'bg-[#FAF8F4] text-[#5C5C57] border-[#E8E3D9]'
              }`}
            >
              <Clock
                className={`size-3.5 ${isOver30Minutes ? 'text-[#B7832F]' : 'text-[#5C5C57]'}`}
              />
              <span>{formatTimer(callSeconds)}</span>
              {isOver30Minutes && (
                <span className="text-[10px] uppercase font-semibold text-[#B7832F]">
                  (&gt;30 min)
                </span>
              )}
            </div>

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
            <>
              {/* Dev/Sim jump button for testing >30 min warning */}
              {!isOver30Minutes && (
                <button
                  type="button"
                  onClick={handleFastForwardTimer}
                  title="Simular passagem de tempo (> 30 min)"
                  className="hidden md:inline-flex min-h-9 items-center gap-1 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-2.5 text-[11px] font-medium text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-all cursor-pointer"
                >
                  <Clock className="size-3 text-[#C49A5B]" />
                  <span>Simular &gt;30m</span>
                </button>
              )}

              {/* Botão Enviar Plano Aprovado direto da Sala */}
              <button
                type="button"
                onClick={() => setDirectSendModalOpen(true)}
                className={`min-h-9 rounded-xl border px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  planSentSuccess
                    ? 'border-[#C3D6CC] bg-[#E7EFEA] text-[#2E5E4E]'
                    : 'border-[#2E5E4E] bg-[#2E5E4E] text-[#FFFFFF] hover:bg-[#24493D] shadow-sm'
                }`}
              >
                {planSentSuccess ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-[#2E5E4E]" />
                    <span>Plano Enviado</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Enviar plano aprovado</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleInitiateEndCall}
                className="min-h-9 rounded-xl border border-[#B4553F]/40 bg-[#FAF8F4] px-3.5 text-xs font-semibold text-[#B4553F] hover:bg-[#B4553F] hover:text-[#FFFFFF] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneOff className="size-3.5" />
                <span>Encerrar Atendimento</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/medico')}
                className="min-h-9 rounded-xl border border-[#2E5E4E]/30 bg-[#FAF8F4] px-4 text-xs font-semibold text-[#2E5E4E] hover:bg-[#2E5E4E] hover:text-[#FFFFFF] transition-all cursor-pointer"
              >
                Voltar ao Painel Geral
              </button>
              <button
                type="button"
                onClick={() => navigate('/paciente/plano')}
                className="min-h-9 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Ver Visão da Paciente</span>
                <ExternalLink className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RECURSO 1: AVISO VISUAL DE TEMPO DE CONSULTA > 30 MIN */}
      {isOver30Minutes && consultationStage === 'in_call' && !timerAlertDismissed && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-[#EAD7BA] bg-[#FBF5EB] p-3.5 sm:p-4 text-[#1E1E1C] shadow-subtle flex items-start justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#F7EFDF] text-[#B7832F] border border-[#EAD7BA] shrink-0 mt-0.5">
              <Clock className="size-5 text-[#B7832F]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-[#1E1E1C] flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-[#B7832F]" />
                  <span>Consulta acima de 30 minutos</span>
                </span>
                <span className="rounded-full bg-[#FFFFFF] border border-[#EAD7BA] px-2 py-0.2 text-[11px] font-bold text-[#B7832F]">
                  {formatTimer(callSeconds)} decorridos
                </span>
              </div>
              <p className="text-xs text-[#5C5C57] leading-relaxed">
                Considere concluir o alinhamento das condutas, encerrar o atendimento ou agendar o
                retorno da paciente. A chamada continua normalmente sem interrupções.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInitiateEndCall}
              className="hidden sm:inline-flex min-h-8 rounded-xl bg-[#2E5E4E] px-3 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] cursor-pointer transition-all items-center gap-1.5 shadow-sm"
            >
              <PhoneOff className="size-3" />
              <span>Encerrar e Resumir</span>
            </button>
            <button
              type="button"
              onClick={() => setTimerAlertDismissed(true)}
              aria-label="Dispensar aviso de tempo"
              className="rounded-lg p-1.5 text-[#8A8A84] hover:bg-[#FAF8F4] hover:text-[#1E1E1C] cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK DE PLANO ENVIADO (BANNER DISCRETO SE SUCESSO) */}
      {planSentSuccess && (
        <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-3 text-xs text-[#2E5E4E] flex items-center justify-between gap-3 animate-fade-in shadow-subtle">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#2E5E4E]" />
            <span>
              <strong>Plano enviado com sucesso:</strong> As orientações validadas já estão
              disponíveis na aba "Plano" de <strong>{patientName}</strong>
              {lastSentTimestamp ? ` (${lastSentTimestamp})` : ''}.
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/paciente/plano')}
            className="text-[11px] font-bold text-[#2E5E4E] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Conferir visão paciente</span>
            <ExternalLink className="size-3" />
          </button>
        </div>
      )}

      {/* Split Screen Layout: Video (Left) vs Copilot & Notes (Right) */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Mock Video Call */}
        <div className="space-y-4">
          <article className="overflow-hidden rounded-3xl bg-[#FFFFFF] border border-[#E8E3D9] shadow-card relative min-h-[460px] flex flex-col justify-between p-4">
            {/* Patient Video Preview Screen with Brand Backdrop Texture */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#18231F] grid place-items-center border border-[#243730] shadow-inner min-h-[340px]">
              {/* V I N V A N S E Signature Brand Texture & Ambient Gradient */}
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
                          <span>Compartilhando com {patientName}</span>
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
                              Dossiê Compartilhado · {patientName}
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
                          <p className="font-bold">Decisão principal acordada:</p>
                          <p className="text-[#1E1E1C] font-serif text-xs mt-0.5">
                            "{decisions[0] || 'Ajuste de crononutrição do jantar para as 19h30'}"
                          </p>
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
                        alt={patientName}
                        className="size-7 rounded-full object-cover border border-[#C49A5B]"
                      />
                      <span className="font-semibold text-xs text-[#FAF8F4]">
                        {patientName} está visualizando esta tela
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
                    alt={`${patientName} (Vídeo Demonstrativo)`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18231F]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 rounded-xl bg-[#18231F]/80 border border-[#FAF8F4]/15 px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] backdrop-blur-md flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#2F7D5B] animate-pulse" />
                    <span>{patientName} (Paciente)</span>
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

            {/* Video Controls bar */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 pt-1">
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

              <div className="flex items-center gap-2">
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

            {/* Notes Section 1: Free Notes by Doctor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E1E1C] flex items-center gap-1.5">
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
                rows={3}
                value={structuredCopilot}
                onChange={(e) => setStructuredCopilot(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs leading-relaxed text-[#5C5C57] focus:border-[#2E5E4E] focus:outline-none"
              />
            </div>

            {/* RECURSO 3: Painel de Envio do Plano Aprovado Direto da Sala */}
            <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-6 place-items-center rounded-lg bg-[#2E5E4E] text-[#FFFFFF]">
                    <Send className="size-3.5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                    Envio do Plano Aprovado para a Paciente
                  </p>
                </div>
                <StatusBadge tone={planSentSuccess ? 'green' : 'amber'}>
                  {planSentSuccess ? 'Plano Publicado' : 'Requer Validação'}
                </StatusBadge>
              </div>

              <div className="text-xs text-[#5C5C57] leading-relaxed">
                <p className="text-[11px]">
                  Condutas estruturadas que serão publicadas na aba <strong>Plano</strong> de{' '}
                  <strong>{patientName}</strong>:
                </p>
                <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs text-[#1E1E1C]">
                  {decisions.slice(0, 2).map((dec, i) => (
                    <li key={i} className="line-clamp-1 font-medium">
                      {dec}
                    </li>
                  ))}
                  {decisions.length > 2 && (
                    <li className="text-[11px] text-[#5C5C57] list-none">
                      + {decisions.length - 2} outra(s) orientação(ões)
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="min-h-9 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3.5 text-xs font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] hover:border-[#2E5E4E]/30 transition-all cursor-pointer"
                >
                  Salvar Rascunho
                </button>

                <button
                  type="button"
                  onClick={() => setSummaryModalOpen(true)}
                  className="min-h-9 rounded-xl border border-[#C49A5B]/50 bg-[#FBF5EB] px-3.5 text-xs font-semibold text-[#9E7A3D] hover:bg-[#F7EFDF] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="size-3.5 text-[#C49A5B]" />
                  <span>Editar Resumo IA</span>
                </button>

                {planSentSuccess ? (
                  <button
                    type="button"
                    onClick={() => setDirectSendModalOpen(true)}
                    className="min-h-9 rounded-xl border border-[#C3D6CC] bg-[#E7EFEA] px-3.5 text-xs font-bold text-[#2E5E4E] hover:bg-[#C3D6CC]/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5 text-[#2E5E4E]" />
                    <span>Reenviar / Atualizar Plano</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDirectSendModalOpen(true)}
                    className="min-h-9 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Send className="size-3.5" />
                    <span>Enviar plano aprovado</span>
                  </button>
                )}
              </div>
            </div>

            {/* Safety rule message */}
            <div className="rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-[11px] text-[#5C5C57]">
              <strong className="text-[#1E1E1C]">Governança Clínica V I N V A N S E:</strong> Toda
              síntese gerada por IA funciona como rascunho de apoio documental; o plano e as
              orientações só entram em vigor após deliberação e validação médica explícita.
            </div>
          </article>
        </div>
      </div>

      {/* RECURSO 2: MODAL DE RESUMO AUTOMÁTICO AO ENCERRAR A CONSULTA */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-7 shadow-elevation animate-fade-in-up space-y-5 text-[#1E1E1C] my-6">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE5] pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]">
                  <Sparkles className="size-6 text-[#2E5E4E]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
                    Resumo e Encerramento da Consulta
                  </h3>
                  <p className="text-xs text-[#5C5C57]">
                    Paciente: <strong>{patientName}</strong> · Duração:{' '}
                    <strong>{formatTimer(callSeconds)}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSummaryModalOpen(false)}
                className="rounded-full p-1.5 text-[#8A8A84] hover:bg-[#FAF8F4] hover:text-[#1E1E1C] transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* AI Draft Badge Obrigatório */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              <span className="text-[11px] text-[#5C5C57] italic">
                Edite os tópicos livremente antes de aprovar
              </span>
            </div>

            {/* Three Structured Sections */}
            <div className="space-y-4">
              {/* Seção 1: Decisões e Condutas */}
              <div className="rounded-2xl border border-[#C3D6CC] bg-[#FAF8F4] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-[#2E5E4E] text-[#FFFFFF] text-[10px] font-bold">
                      1
                    </span>
                    <label className="text-xs font-bold text-[#2E5E4E] uppercase tracking-wider">
                      Decisões e Condutas
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDecision}
                    className="text-[11px] font-bold text-[#2E5E4E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Adicionar item</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#5C5C57]">
                  Orientações clínicas acordadas que integrarão a rotina diária da paciente.
                </p>

                <div className="space-y-2 pt-1">
                  {decisions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2E5E4E]">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleDecisionChange(idx, e.target.value)}
                        placeholder="Descreva a decisão ou conduta..."
                        className="flex-1 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
                      />
                      {decisions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDecision(idx)}
                          className="text-[#8A8A84] hover:text-[#B4553F] p-1 cursor-pointer"
                          title="Remover conduta"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 2: Pendências */}
              <div className="rounded-2xl border border-[#EAD7BA] bg-[#FAF8F4] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-[#C49A5B] text-[#FFFFFF] text-[10px] font-bold">
                      2
                    </span>
                    <label className="text-xs font-bold text-[#9E7A3D] uppercase tracking-wider">
                      Pendências
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPending}
                    className="text-[11px] font-bold text-[#9E7A3D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Adicionar pendência</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#5C5C57]">
                  Exames, registros fotográficos ou documentos aguardados da paciente ou do
                  laboratório.
                </p>

                <div className="space-y-2 pt-1">
                  {pendingTasks.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#C49A5B]">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handlePendingChange(idx, e.target.value)}
                        placeholder="Descreva a pendência..."
                        className="flex-1 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1E1E1C] focus:border-[#C49A5B] focus:outline-none"
                      />
                      {pendingTasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePending(idx)}
                          className="text-[#8A8A84] hover:text-[#B4553F] p-1 cursor-pointer"
                          title="Remover pendência"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 3: Próximos Passos */}
              <div className="rounded-2xl border border-[#C8DFE8] bg-[#FAF8F4] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-[#2C6E8A] text-[#FFFFFF] text-[10px] font-bold">
                      3
                    </span>
                    <label className="text-xs font-bold text-[#2C6E8A] uppercase tracking-wider">
                      Próximos Passos
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNextStep}
                    className="text-[11px] font-bold text-[#2C6E8A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Adicionar passo</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#5C5C57]">
                  Check-ins programados, data de reavaliação ou retorno acordado com a paciente.
                </p>

                <div className="space-y-2 pt-1">
                  {nextSteps.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2C6E8A]">•</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleNextStepChange(idx, e.target.value)}
                        placeholder="Descreva o próximo passo..."
                        className="flex-1 rounded-xl border border-[#E8E3D9] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1E1E1C] focus:border-[#2C6E8A] focus:outline-none"
                      />
                      {nextSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNextStep(idx)}
                          className="text-[#8A8A84] hover:text-[#B4553F] p-1 cursor-pointer"
                          title="Remover próximo passo"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações adicionais do médico (opcional) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#5C5C57] block">
                  Comentário clínico de encerramento (Prontuário &amp; Linha do Tempo):
                </label>
                <textarea
                  rows={2}
                  value={additionalDoctorNotes}
                  onChange={(e) => setAdditionalDoctorNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Aviso claro de compartilhamento com a paciente */}
            <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 space-y-1.5 text-xs text-[#2E5E4E]">
              <div className="flex items-center gap-2 font-bold text-[#1E1E1C]">
                <ShieldCheck className="size-4 text-[#2E5E4E]" />
                <span>Aviso de Transparência &amp; Compartilhamento</span>
              </div>
              <p className="leading-relaxed">
                Ao confirmar o encerramento, o plano estruturado validado será{' '}
                <strong>imediatamente compartilhado com a paciente ({patientName})</strong> na visão
                "Plano" e "Hoje" do aplicativo.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#EFECE5]">
              <button
                type="button"
                onClick={() => setSummaryModalOpen(false)}
                className="w-full sm:w-auto min-h-10 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 text-xs font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-all cursor-pointer"
              >
                Voltar à Chamada
              </button>

              <button
                type="button"
                onClick={handleConfirmEndAndSendPlan}
                className="w-full sm:w-auto min-h-10 rounded-xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Check className="size-4" />
                <span>Validar, Compartilhar e Encerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECURSO 3: MODAL DE CONFIRMAÇÃO EXPLÍCITA: ENVIAR PLANO APROVADO DIRETO DA SALA */}
      {directSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-elevation animate-fade-in-up space-y-4 text-[#1E1E1C]">
            <div className="flex items-center gap-3 border-b border-[#EFECE5] pb-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] shrink-0">
                <Send className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                  Enviar plano para {patientName}?
                </h3>
                <p className="text-xs text-[#5C5C57]">Confirmação explícita de validação médica</p>
              </div>
            </div>

            <div className="text-xs text-[#5C5C57] leading-relaxed space-y-2.5">
              <p>
                Você está prestes a aprovar e disponibilizar oficialmente as seguintes orientações
                no aplicativo de <strong>{patientName}</strong>:
              </p>

              <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-3.5 space-y-1.5 text-xs text-[#1E1E1C]">
                <p className="font-bold text-[#2E5E4E] uppercase text-[10px] tracking-wider">
                  Condutas aprovadas ({decisions.length}):
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  {decisions.map((dec, i) => (
                    <li key={i} className="font-medium text-[#1E1E1C]">
                      {dec}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-[#8A8A84]">
                A paciente receberá uma notificação e o plano passará a constar na aba{' '}
                <strong>Plano</strong> com o selo de validação do Dr. Guilherme Martins.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EFECE5]">
              <button
                type="button"
                onClick={() => setDirectSendModalOpen(false)}
                className="min-h-10 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 text-xs font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDirectSend}
                className="min-h-10 rounded-xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm cursor-pointer transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Sim, enviar plano aprovado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
