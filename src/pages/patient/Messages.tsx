import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { Send, Bot, Shield, Clock, CheckCheck, Sparkles, Activity, ArrowRight } from 'lucide-react'

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
          <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
            Comunicação Integrada
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Mensagens com a Equipe
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5C57]">
            Canal direto para dúvidas de rotina, resumos semanais e orientações do Dr. Guilherme
            Martins.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] px-3.5 py-2 text-xs shadow-subtle">
          <div className="size-2 rounded-full bg-[#2E5E4E] animate-pulse" />
          <span className="font-bold text-[#1E1E1C]">Dr. Guilherme Martins</span>
          <span className="text-[#2E5E4E] font-medium">· Online</span>
        </div>
      </section>

      {/* Chat Container */}
      <div className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] shadow-card overflow-hidden flex flex-col h-[600px]">
        {/* Safety Header Banner */}
        <div className="bg-[#FAF8F4] border-b border-[#EFECE5] px-4 sm:px-6 py-2.5 text-xs text-[#5C5C57] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-[#2E5E4E] shrink-0" />
            <span className="truncate">
              Mensagens e orientações enviadas pela equipe médica humana · Rascunhos de IA
              identificados
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[#2E5E4E] shrink-0">
            Ambiente Seguro
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF8F4]/40">
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient'
            const isDraft = msg.sender === 'ai_draft'
            const isTeamSummary = msg.sender === 'team_summary'

            if (isDraft) {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md rounded-2xl border border-[#C49A5B]/40 bg-[#FBF5EB] p-3.5 text-xs text-[#9E7A3D] text-center space-y-1 shadow-subtle"
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-[#9E7A3D]">
                    <Bot className="size-3.5 text-[#C49A5B]" />
                    <span>Sugestão de resposta da IA em validação pelo médico</span>
                  </div>
                  <p className="italic text-[#5C5C57]">"{msg.content}"</p>
                </div>
              )
            }

            /* Resumo Semanal de Adesão como Mensagem da Equipe */
            if (isTeamSummary && msg.weeklySummary) {
              const summary = msg.weeklySummary
              return (
                <div key={msg.id} className="mx-auto w-full max-w-xl animate-fade-in my-2">
                  <div className="flex items-center justify-between gap-2 mb-1 px-1 text-[11px] text-[#5C5C57]">
                    <div className="flex items-center gap-2 font-bold text-[#2E5E4E]">
                      <VivansAvatar
                        src={msg.authorAvatarUrl}
                        name={msg.author}
                        initials="IV"
                        size="sm"
                        className="border border-[#C3D6CC]"
                      />
                      <span>{msg.author}</span>
                    </div>
                    <span>{msg.time}</span>
                  </div>

                  <article className="overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 shadow-card space-y-4">
                    {/* Header of weekly card */}
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#EFECE5] pb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E7EFEA] border border-[#C3D6CC] px-2.5 py-0.5 text-[10px] font-bold text-[#2E5E4E] shadow-subtle uppercase tracking-wider">
                          <Activity className="size-3" />
                          <span>Comunicado da Equipe</span>
                        </span>
                        <h3 className="mt-1.5 font-serif text-lg sm:text-xl font-bold text-[#1E1E1C]">
                          Seu Resumo Semanal de Adesão
                        </h3>
                        <p className="text-[11px] text-[#5C5C57] font-medium">
                          {summary.periodLabel}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#E7F2EC] border border-[#C3D6CC] px-3 py-1 text-xs font-bold text-[#2F7D5B]">
                        Nível Excelente
                      </span>
                    </div>

                    {/* Warm, objective team message body */}
                    <div className="space-y-2 text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
                      <p>
                        Olá, Marina! A equipe do Dr. Guilherme preparou este resumo para celebrar a
                        sua dedicação aos hábitos acordados.
                      </p>
                      <div className="rounded-2xl bg-[#FAF8F4] p-3.5 border border-[#E8E3D9] space-y-1">
                        <p className="font-bold text-[#1E1E1C] text-xs sm:text-sm">
                          🎯 Você concluiu{' '}
                          <strong className="text-[#2E5E4E]">
                            {summary.completedActions} de {summary.totalActions} ações
                          </strong>{' '}
                          desta semana!
                        </p>
                        <p className="text-xs text-[#5C5C57]">
                          Sua adesão manteve-se em{' '}
                          <strong className="text-[#2E5E4E]">{summary.adherencePct}%</strong>, com
                          uma tendência positiva de{' '}
                          <strong className="text-[#2E5E4E]">+{summary.trendPct}%</strong> em
                          relação ao início do programa.
                        </p>
                      </div>
                    </div>

                    {/* Visual metrics pill grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#8A8A84]">
                          Ações Cumpridas
                        </p>
                        <p className="text-lg font-bold text-[#2E5E4E] mt-0.5">
                          {summary.completedActions}/{summary.totalActions}
                        </p>
                        <span className="text-[10px] text-[#5C5C57]">80% da meta</span>
                      </div>
                      <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#8A8A84]">
                          Adesão Semanal
                        </p>
                        <p className="text-lg font-bold text-[#2E5E4E] mt-0.5">
                          {summary.adherencePct}%
                        </p>
                        <span className="text-[10px] text-[#2F7D5B] font-semibold">
                          +{summary.trendPct}% tendência
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9] text-center">
                        <p className="text-[10px] uppercase font-bold text-[#8A8A84]">
                          Variação Ponderal
                        </p>
                        <p className="text-lg font-bold text-[#1E1E1C] mt-0.5">−1,8 kg</p>
                        <span className="text-[10px] text-[#5C5C57]">Consistente</span>
                      </div>
                    </div>

                    {/* Friendly Next Step Card */}
                    <div className="rounded-2xl border border-[#C49A5B]/30 bg-[#FBF5EB] p-3.5 space-y-1">
                      <p className="font-bold text-xs text-[#9E7A3D] flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#C49A5B]" />
                        <span>Próximo passo amigável da semana:</span>
                      </p>
                      <p className="text-xs text-[#5C5C57] leading-relaxed font-medium">
                        {summary.nextFriendlyStep}
                      </p>
                    </div>

                    {/* AI Draft Identification */}
                    {summary.aiDraftNote && (
                      <div className="rounded-xl border border-[#C49A5B]/30 bg-[#FBF5EB] px-3 py-2 text-[11px] text-[#9E7A3D] flex items-center gap-2">
                        <Bot className="size-3.5 shrink-0 text-[#C49A5B]" />
                        <span className="leading-snug">
                          <strong className="text-[#1E1E1C]">Nota de governança:</strong>{' '}
                          {summary.aiDraftNote} Mensagem oficial enviada pela equipe de cuidado.
                        </span>
                      </div>
                    )}

                    {/* Quick navigation to Plan */}
                    <div className="flex justify-end pt-1">
                      <Link
                        to="/paciente/plano"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2E5E4E] hover:underline underline-offset-4"
                      >
                        <span>Ver suas ações no Plano</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </article>

                  <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8A8A84]">
                    <CheckCheck className="size-3 text-[#2E5E4E]" />
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
                  className={`flex items-center gap-2 px-1 text-[11px] text-[#5C5C57] ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <VivansAvatar
                    src={msg.authorAvatarUrl}
                    name={msg.author}
                    initials={isPatient ? 'MC' : 'GM'}
                    size="sm"
                    className="border border-[#E8E3D9]"
                  />
                  <span className="font-medium">{msg.author}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-md rounded-3xl px-4.5 py-3 text-xs sm:text-sm leading-relaxed shadow-subtle ${
                    isPatient
                      ? 'bg-[#2E5E4E] text-[#FFFFFF] font-medium rounded-tr-sm'
                      : 'bg-[#FFFFFF] text-[#1E1E1C] border border-[#E8E3D9] rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8A8A84]">
                  <CheckCheck className="size-3 text-[#2E5E4E]" />
                  <span>Entregue</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="border-t border-[#EFECE5] p-3 sm:p-4 bg-[#FAF8F4] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Digite sua dúvida ou relato para o Dr. Guilherme..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 min-h-[44px] rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] px-4 py-2.5 text-xs sm:text-sm text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-11 place-items-center rounded-2xl bg-[#2E5E4E] text-[#FFFFFF] hover:bg-[#24493D] transition-all shrink-0 shadow-sm cursor-pointer active:scale-95"
            aria-label="Enviar mensagem"
          >
            <Send className="size-4 text-[#FFFFFF]" />
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 text-xs text-[#5C5C57] flex items-start gap-2 shadow-card">
        <Clock className="size-4 text-[#2E5E4E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Horário de atendimento assíncrono da equipe: Segunda a sexta, das 8h às 19h. Relatos
          enviados fora do horário são revisados na primeira hora do dia seguinte.
        </p>
      </div>
    </div>
  )
}
