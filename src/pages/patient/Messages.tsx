import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import {
  Send,
  Bot,
  Shield,
  Clock,
  CheckCheck,
  Sparkles,
  TrendingUp,
  Activity,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Target,
} from 'lucide-react'

export default function PatientMessages() {
  const { messages = [], sendMessage } = useVivans()
  const [inputText, setInputText] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendMessage(inputText.trim(), 'patient')
    setInputText('')
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Canal de Mensagens e Comunicação Clínica · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Comunicação Integrada
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#17372f]">
            Mensagens com a Equipe
          </h1>
          <p className="text-xs sm:text-sm text-[#60766f]">
            Canal direto para dúvidas de rotina, resumos semanais e orientações do Dr. Guilherme
            Martins.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8e3] bg-white px-3.5 py-2 text-xs shadow-2xs">
          <div className="size-2 rounded-full bg-[#0b7b68] animate-pulse" />
          <span className="font-bold text-[#17372f]">Dr. Guilherme Martins</span>
          <span className="text-[#698078]">· Online</span>
        </div>
      </section>

      {/* Chat Container */}
      <div className="rounded-3xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Safety Header Banner */}
        <div className="bg-[#f8faf9] border-b border-[#edf2ef] px-4 sm:px-6 py-2.5 text-xs text-[#698078] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-[#0b7b68] shrink-0" />
            <span className="truncate">
              Mensagens e orientações enviadas pela equipe médica humana · Rascunhos de IA
              identificados
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[#0b7b68] shrink-0">
            Ambiente Seguro
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient'
            const isDraft = msg.sender === 'ai_draft'
            const isTeamSummary = msg.sender === 'team_summary'

            if (isDraft) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md rounded-2xl border border-[#f0d59c] bg-[#fffbf2] p-3.5 text-xs text-[#805f24] text-center space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-[#70480e]">
                    <Bot className="size-3.5 text-[#a37628]" />
                    <span>Sugestão de resposta da IA em validação pelo médico</span>
                  </div>
                  <p className="italic text-[#825b0b]">"{msg.content}"</p>
                </div>
              )
            }

            /* Resumo Semanal de Adesão como Mensagem da Equipe */
            if (isTeamSummary && msg.weeklySummary) {
              const summary = msg.weeklySummary
              return (
                <div key={msg.id} className="mx-auto w-full max-w-xl animate-fade-in my-2">
                  <div className="flex items-center justify-between gap-2 mb-1 px-1 text-[11px] text-[#698078]">
                    <div className="flex items-center gap-2 font-bold text-[#0b7b68]">
                      <VivansAvatar
                        src={msg.authorAvatarUrl}
                        name={msg.author}
                        initials="IV"
                        size="sm"
                        className="border border-[#9fc9bd]"
                      />
                      <span>{msg.author}</span>
                    </div>
                    <span>{msg.time}</span>
                  </div>

                  <article className="overflow-hidden rounded-3xl border-2 border-[#9fc9bd] bg-gradient-to-br from-[#ebf6f2] via-[#f7faf8] to-white p-5 sm:p-6 shadow-md space-y-4">
                    {/* Header of weekly card */}
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#cfe5dc] pb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0b7b68] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs uppercase tracking-wider">
                          <Activity className="size-3" />
                          <span>Comunicado da Equipe</span>
                        </span>
                        <h3 className="mt-1.5 font-serif text-lg sm:text-xl font-bold text-[#17372f]">
                          Seu Resumo Semanal de Adesão
                        </h3>
                        <p className="text-[11px] text-[#526a62] font-medium">
                          {summary.periodLabel}
                        </p>
                      </div>
                      <span className="rounded-full bg-white border border-[#bfe4d8] px-3 py-1 text-xs font-bold text-[#075f50] shadow-2xs">
                        Nível Excelente
                      </span>
                    </div>

                    {/* Warm, objective team message body */}
                    <div className="space-y-2 text-xs sm:text-sm text-[#1e3e34] leading-relaxed">
                      <p>
                        Olá, Marina! A equipe do Dr. Guilherme preparou este resumo para celebrar a
                        sua dedicação aos hábitos acordados.
                      </p>
                      <div className="rounded-2xl bg-white p-3.5 border border-[#d8ebe3] space-y-1 shadow-2xs">
                        <p className="font-bold text-[#17372f] text-xs sm:text-sm">
                          🎯 Você concluiu{' '}
                          <strong className="text-[#0b7b68]">
                            {summary.completedActions} de {summary.totalActions} ações
                          </strong>{' '}
                          desta semana!
                        </p>
                        <p className="text-xs text-[#526b63]">
                          Sua adesão manteve-se em{' '}
                          <strong className="text-[#0b7b68]">{summary.adherencePct}%</strong>, com
                          uma tendência positiva de <strong>+{summary.trendPct}%</strong> em relação
                          ao início do programa.
                        </p>
                      </div>
                    </div>

                    {/* Visual metrics pill grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#698078]">
                          Ações Cumpridas
                        </p>
                        <p className="text-lg font-bold text-[#0b7b68] mt-0.5">
                          {summary.completedActions}/{summary.totalActions}
                        </p>
                        <span className="text-[10px] text-[#556d66]">80% da meta</span>
                      </div>
                      <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#698078]">
                          Adesão Semanal
                        </p>
                        <p className="text-lg font-bold text-[#0b7b68] mt-0.5">
                          {summary.adherencePct}%
                        </p>
                        <span className="text-[10px] text-[#0b7b68] font-semibold">
                          +{summary.trendPct}% tendência
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white p-3 border border-[#dfe8e3] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#698078]">
                          Variação Ponderal
                        </p>
                        <p className="text-lg font-bold text-[#17372f] mt-0.5">−1,8 kg</p>
                        <span className="text-[10px] text-[#556d66]">Consistente</span>
                      </div>
                    </div>

                    {/* Friendly Next Step Card */}
                    <div className="rounded-2xl border border-[#bfe4d8] bg-[#f2f9f6] p-3.5 space-y-1">
                      <p className="font-bold text-xs text-[#0b7b68] flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#0b7b68]" />
                        <span>Próximo passo amigável da semana:</span>
                      </p>
                      <p className="text-xs text-[#29423b] leading-relaxed font-medium">
                        {summary.nextFriendlyStep}
                      </p>
                    </div>

                    {/* AI Draft Identification / Team transparency badge */}
                    {summary.aiDraftNote && (
                      <div className="rounded-xl border border-[#f0d59c] bg-[#fffbf2] px-3 py-2 text-[11px] text-[#805f24] flex items-center gap-2">
                        <Bot className="size-3.5 shrink-0 text-[#a37628]" />
                        <span className="leading-snug">
                          <strong>Nota de governança:</strong> {summary.aiDraftNote} Mensagem
                          oficial enviada pela equipe de cuidado.
                        </span>
                      </div>
                    )}

                    {/* Quick navigation to Plan */}
                    <div className="flex justify-end pt-1">
                      <Link
                        to="/paciente/plano"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0b7b68] hover:underline underline-offset-4"
                      >
                        <span>Ver suas ações no Plano</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </article>

                  <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8a9c96]">
                    <CheckCheck className="size-3 text-[#0b7b68]" />
                    <span>Entregue à paciente · Oficial do Instituto Vivans</span>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'} gap-1`}
              >
                <div
                  className={`flex items-center gap-2 px-1 text-[11px] text-[#698078] ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <VivansAvatar
                    src={msg.authorAvatarUrl}
                    name={msg.author}
                    initials={isPatient ? 'MC' : 'GM'}
                    size="sm"
                    className="border border-[#dfe8e3]"
                  />
                  <span className="font-medium">{msg.author}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-md rounded-3xl px-4.5 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isPatient
                      ? 'bg-[#17372f] text-white rounded-tr-sm'
                      : 'bg-[#edf7f4] text-[#17372f] border border-[#b9d8cf] rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8a9c96]">
                  <CheckCheck className="size-3 text-[#0b7b68]" />
                  <span>Entregue</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="border-t border-[#edf2ef] p-3 sm:p-4 bg-[#fbfcfb] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Digite sua dúvida ou relato para o Dr. Guilherme..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 min-h-[44px] rounded-2xl border border-[#dfe8e3] bg-white px-4 py-2.5 text-xs sm:text-sm text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-11 place-items-center rounded-2xl bg-[#0b7b68] text-white hover:bg-[#096656] transition-colors shrink-0 shadow-sm cursor-pointer active:scale-95"
            aria-label="Enviar mensagem"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#dfe8e3] bg-white p-4 text-xs text-[#60766f] flex items-start gap-2 shadow-2xs">
        <Clock className="size-4 text-[#0b7b68] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Horário de atendimento assíncrono da equipe: Segunda a sexta, das 8h às 19h. Relatos
          enviados fora do horário são revisados na primeira hora do dia seguinte.
        </p>
      </div>
    </div>
  )
}
