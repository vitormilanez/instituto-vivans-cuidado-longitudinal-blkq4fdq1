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
          <p className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
            Comunicação Integrada
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Mensagens com a Equipe
          </h1>
          <p className="text-xs sm:text-sm text-[#ADADAD]">
            Canal direto para dúvidas de rotina, resumos semanais e orientações do Dr. Guilherme
            Martins.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#333333] bg-[#1A1A1A] px-3.5 py-2 text-xs shadow-sm">
          <div className="size-2 rounded-full bg-[#D6B270] animate-pulse" />
          <span className="font-bold text-white">Dr. Guilherme Martins</span>
          <span className="text-[#ADADAD]">· Online</span>
        </div>
      </section>

      {/* Chat Container */}
      <div className="rounded-3xl border border-[#333333] bg-[#1A1A1A] shadow-lg overflow-hidden flex flex-col h-[600px] backdrop-blur-md">
        {/* Safety Header Banner */}
        <div className="bg-[#141414] border-b border-[#333333] px-4 sm:px-6 py-2.5 text-xs text-[#ADADAD] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-[#D6B270] shrink-0" />
            <span className="truncate">
              Mensagens e orientações enviadas pela equipe médica humana · Rascunhos de IA
              identificados
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[#D6B270] shrink-0">
            Ambiente Seguro
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0F0F0F]/50">
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient'
            const isDraft = msg.sender === 'ai_draft'
            const isTeamSummary = msg.sender === 'team_summary'

            if (isDraft) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3.5 text-xs text-[#FCD34D] text-center space-y-1 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-[#FCD34D]">
                    <Bot className="size-3.5 text-[#F59E0B]" />
                    <span>Sugestão de resposta da IA em validação pelo médico</span>
                  </div>
                  <p className="italic text-[#CCCCCC]">"{msg.content}"</p>
                </div>
              )
            }

            /* Resumo Semanal de Adesão como Mensagem da Equipe */
            if (isTeamSummary && msg.weeklySummary) {
              const summary = msg.weeklySummary
              return (
                <div key={msg.id} className="mx-auto w-full max-w-xl animate-fade-in my-2">
                  <div className="flex items-center justify-between gap-2 mb-1 px-1 text-[11px] text-[#ADADAD]">
                    <div className="flex items-center gap-2 font-bold text-[#D6B270]">
                      <VivansAvatar
                        src={msg.authorAvatarUrl}
                        name={msg.author}
                        initials="IV"
                        size="sm"
                        className="border border-[#D6B270]/40"
                      />
                      <span>{msg.author}</span>
                    </div>
                    <span>{msg.time}</span>
                  </div>

                  <article className="overflow-hidden rounded-3xl border-2 border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
                    {/* Header of weekly card */}
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#333333] pb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-2.5 py-0.5 text-[10px] font-bold text-[#0F0F0F] shadow-xs uppercase tracking-wider">
                          <Activity className="size-3" />
                          <span>Comunicado da Equipe</span>
                        </span>
                        <h3 className="mt-1.5 font-serif text-lg sm:text-xl font-bold text-white">
                          Seu Resumo Semanal de Adesão
                        </h3>
                        <p className="text-[11px] text-[#ADADAD] font-medium">
                          {summary.periodLabel}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#D6B270]/20 border border-[#D6B270]/30 px-3 py-1 text-xs font-bold text-[#E8C391]">
                        Nível Excelente
                      </span>
                    </div>

                    {/* Warm, objective team message body */}
                    <div className="space-y-2 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                      <p>
                        Olá, Marina! A equipe do Dr. Guilherme preparou este resumo para celebrar a
                        sua dedicação aos hábitos acordados.
                      </p>
                      <div className="rounded-2xl bg-[#0F0F0F] p-3.5 border border-[#333333] space-y-1">
                        <p className="font-bold text-white text-xs sm:text-sm">
                          🎯 Você concluiu{' '}
                          <strong className="text-[#D6B270]">
                            {summary.completedActions} de {summary.totalActions} ações
                          </strong>{' '}
                          desta semana!
                        </p>
                        <p className="text-xs text-[#ADADAD]">
                          Sua adesão manteve-se em{' '}
                          <strong className="text-[#D6B270]">{summary.adherencePct}%</strong>, com
                          uma tendência positiva de{' '}
                          <strong className="text-[#D6B270]">+{summary.trendPct}%</strong> em
                          relação ao início do programa.
                        </p>
                      </div>
                    </div>

                    {/* Visual metrics pill grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#888888]">
                          Ações Cumpridas
                        </p>
                        <p className="text-lg font-bold text-[#D6B270] mt-0.5">
                          {summary.completedActions}/{summary.totalActions}
                        </p>
                        <span className="text-[10px] text-[#ADADAD]">80% da meta</span>
                      </div>
                      <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#888888]">
                          Adesão Semanal
                        </p>
                        <p className="text-lg font-bold text-[#D6B270] mt-0.5">
                          {summary.adherencePct}%
                        </p>
                        <span className="text-[10px] text-[#D6B270] font-semibold">
                          +{summary.trendPct}% tendência
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#888888]">
                          Variação Ponderal
                        </p>
                        <p className="text-lg font-bold text-white mt-0.5">−1,8 kg</p>
                        <span className="text-[10px] text-[#ADADAD]">Consistente</span>
                      </div>
                    </div>

                    {/* Friendly Next Step Card */}
                    <div className="rounded-2xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-3.5 space-y-1">
                      <p className="font-bold text-xs text-[#D6B270] flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#D6B270]" />
                        <span>Próximo passo amigável da semana:</span>
                      </p>
                      <p className="text-xs text-[#E8C391] leading-relaxed font-medium">
                        {summary.nextFriendlyStep}
                      </p>
                    </div>

                    {/* AI Draft Identification */}
                    {summary.aiDraftNote && (
                      <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-3 py-2 text-[11px] text-[#FCD34D] flex items-center gap-2">
                        <Bot className="size-3.5 shrink-0 text-[#F59E0B]" />
                        <span className="leading-snug">
                          <strong className="text-white">Nota de governança:</strong>{' '}
                          {summary.aiDraftNote} Mensagem oficial enviada pela equipe de cuidado.
                        </span>
                      </div>
                    )}

                    {/* Quick navigation to Plan */}
                    <div className="flex justify-end pt-1">
                      <Link
                        to="/paciente/plano"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D6B270] hover:underline underline-offset-4"
                      >
                        <span>Ver suas ações no Plano</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </article>

                  <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#888888]">
                    <CheckCheck className="size-3 text-[#D6B270]" />
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
                  className={`flex items-center gap-2 px-1 text-[11px] text-[#ADADAD] ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <VivansAvatar
                    src={msg.authorAvatarUrl}
                    name={msg.author}
                    initials={isPatient ? 'MC' : 'GM'}
                    size="sm"
                    className="border border-[#333333]"
                  />
                  <span className="font-medium">{msg.author}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-md rounded-3xl px-4.5 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isPatient
                      ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] font-medium rounded-tr-sm'
                      : 'bg-[#141414] text-[#FFFFFF] border border-[#333333] rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#888888]">
                  <CheckCheck className="size-3 text-[#D6B270]" />
                  <span>Entregue</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="border-t border-[#333333] p-3 sm:p-4 bg-[#141414] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Digite sua dúvida ou relato para o Dr. Guilherme..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 min-h-[44px] rounded-2xl border border-[#333333] bg-[#0F0F0F] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#777777] focus:border-[#D6B270] focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-11 place-items-center rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] hover:brightness-110 transition-all shrink-0 shadow-sm cursor-pointer active:scale-95"
            aria-label="Enviar mensagem"
          >
            <Send className="size-4 text-[#0F0F0F]" />
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#333333] bg-[#1A1A1A] p-4 text-xs text-[#ADADAD] flex items-start gap-2 shadow-sm">
        <Clock className="size-4 text-[#D6B270] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Horário de atendimento assíncrono da equipe: Segunda a sexta, das 8h às 19h. Relatos
          enviados fora do horário são revisados na primeira hora do dia seguinte.
        </p>
      </div>
    </div>
  )
}
