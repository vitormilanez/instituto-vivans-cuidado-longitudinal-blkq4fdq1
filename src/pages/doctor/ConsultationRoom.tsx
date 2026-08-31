import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
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
} from 'lucide-react'

export default function DoctorConsultationRoom() {
  const { id } = useParams<{ id: string }>()
  const { preConsultation, addCarePlanItem, notify } = useVivans()
  const navigate = useNavigate()

  // Consultation state
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [consultationStage, setConsultationStage] = useState<'in_call' | 'post_call'>('in_call')

  // Clinical notes state
  const [freeNotes, setFreeNotes] = useState(
    'Paciente relata boa adesão ao prato noturno com aumento de saciedade. Queixa central de sono interrompido às 3h com sensação de fadiga às 16h.',
  )
  const [structuredCopilot, setStructuredCopilot] = useState(
    '• Diagnóstico longitudinal: Emagrecimento em curso com preservação muscular.\n• Hipótese de sono: Crononutrição desajustada (jantar tardio às 20h30 gerando pico glicêmico tardio).\n• Conduta proposta: Antecipar jantar para 19h30, infusão de camomila e desligamento de telas às 22h.',
  )

  // New action form for care plan
  const [newAction, setNewAction] = useState('Antecipar horário do jantar para as 19h30')
  const [savedPlanDraft, setSavedPlanDraft] = useState(false)
  const [approvedAndSent, setApprovedAndSent] = useState(false)

  const handleSaveDraft = () => {
    setSavedPlanDraft(true)
    notify('Rascunho da consulta salvo no prontuário interno.')
  }

  const handleApproveAndPublishToPatient = () => {
    addCarePlanItem({
      action: newAction,
      category: 'Hábitos alimentares · Ajuste pós-consulta',
      type: 'medical',
      completed: false,
    })
    setApprovedAndSent(true)
    notify('Plano aprovado e sincronizado na aba Plano da paciente Marina Costa!')
  }

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <SimulationDisclaimer text="Ambiente de Teleconsulta Simulado · Instituto Vivans Telehealth" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfe8e3] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-[#e67e76] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e67e76]">
              {consultationStage === 'in_call'
                ? 'Consulta em Andamento (00:14:32)'
                : 'Consulta Encerrada · Síntese Final'}
            </span>
            <StatusBadge tone="green">Marina Costa · Retorno 30 min</StatusBadge>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#17372f]">
            Atendimento Clínico · Dr. Guilherme Martins
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {consultationStage === 'in_call' ? (
            <button
              type="button"
              onClick={() => setConsultationStage('post_call')}
              className="min-h-10 rounded-xl bg-[#e67e76] px-4 text-xs font-bold text-white hover:bg-[#c96159] transition-colors flex items-center gap-1.5"
            >
              <PhoneOff className="size-3.5" />
              <span>Encerrar Atendimento</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/medico')}
              className="min-h-10 rounded-xl bg-[#17372f] px-5 text-xs font-bold text-white hover:bg-[#0e2721]"
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
          <article className="overflow-hidden rounded-3xl bg-[#17372f] shadow-lg relative min-h-[420px] flex flex-col justify-between p-4">
            {/* Patient Video Preview Screen */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/40 grid place-items-center">
              {isVideoOn ? (
                <div className="relative w-full h-full">
                  <img
                    src="https://img.usecurling.com/ppl/512?gender=female&seed=42"
                    alt="Marina Costa (Vídeo Demonstrativo)"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Marina Costa (Paciente)
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/70 space-y-2">
                  <VideoOff className="size-12 mx-auto text-white/40" />
                  <p className="text-xs font-medium">Câmera desativada na simulação</p>
                </div>
              )}

              {/* Doctor PiP preview */}
              <div className="absolute top-3 right-3 w-28 h-20 rounded-xl border border-white/20 bg-[#0e2721] overflow-hidden shadow-md">
                <img
                  src="https://img.usecurling.com/ppl/256?gender=male&seed=15"
                  alt="Dr. Guilherme Martins"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] text-white">
                  Você
                </span>
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-colors ${
                  isMicOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-[#e67e76] text-white'
                }`}
              >
                {isMicOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`grid size-11 place-items-center rounded-2xl transition-colors ${
                  isVideoOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-[#e67e76] text-white'
                }`}
              >
                {isVideoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
              </button>

              <div className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-bold text-[#9fe0ce]">
                HD · Conexão Criptografada (Demonstração)
              </div>
            </div>
          </article>

          {/* Patient Objective and Pre-visit summary in view during call */}
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Contexto da Pré-Consulta
              </span>
              <StatusBadge tone="green">Recebida</StatusBadge>
            </div>
            <p className="text-xs text-[#45655c] leading-relaxed italic bg-[#f8faf9] p-3 rounded-xl border border-[#edf2ef]">
              “{preConsultation.objective}”
            </p>
          </div>
        </div>

        {/* Right Side: Copilot Structuring & Plan Builder */}
        <div className="space-y-5">
          <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#0b7b68]" />
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Copiloto e Registro Clínico
                </h3>
              </div>
              <AiDraftBadge status="Copiloto Estruturador" />
            </div>

            {/* Notes Section 1: Free Notes by Doctor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#17372f]">
                Anotações Livres do Médico durante o atendimento:
              </label>
              <textarea
                rows={3}
                value={freeNotes}
                onChange={(e) => setFreeNotes(e.target.value)}
                className="w-full rounded-2xl border border-[#dfe8e3] p-3 text-xs leading-relaxed text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              />
            </div>

            {/* Notes Section 2: AI Structured Notes (Draft) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0b6a5b]">
                  Síntese Estruturada Organizada pela IA:
                </label>
                <span className="text-[10px] text-[#698078]">Revisável</span>
              </div>
              <textarea
                rows={4}
                value={structuredCopilot}
                onChange={(e) => setStructuredCopilot(e.target.value)}
                className="w-full rounded-2xl border border-[#b9d8cf] bg-[#f8faf9] p-3 text-xs leading-relaxed text-[#3b534b] focus:border-[#0b7b68] focus:outline-none"
              />
            </div>

            {/* Plan Builder: Adjust Care Plan directly for Marina */}
            <div className="rounded-2xl border border-[#dfe8e3] bg-[#fdfbf7] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#17372f]">
                  Atualização do Plano de Cuidado do Paciente
                </p>
                <StatusBadge tone="amber">Requer Aprovação Médica</StatusBadge>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#60766f] mb-1">
                  Nova orientação para o dia a dia da Marina:
                </label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe8e3] bg-white px-3 py-2 text-xs font-bold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="min-h-10 rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
                >
                  Salvar Rascunho
                </button>

                {approvedAndSent ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b6a5b] py-2">
                    <CheckCircle2 className="size-4" />
                    <span>Plano Aprovado e Publicado!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApproveAndPublishToPatient}
                    className="min-h-10 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Aprovar e Enviar ao Paciente</span>
                  </button>
                )}
              </div>
            </div>

            {/* Safety rule message */}
            <div className="rounded-xl border border-[#dfe8e3] bg-[#f8faf9] p-3 text-[11px] text-[#698078]">
              <strong>Controle Clínico Rigoroso:</strong> Nenhuma alteração é visível no aplicativo
              da paciente antes de sua aprovação expressa.
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
