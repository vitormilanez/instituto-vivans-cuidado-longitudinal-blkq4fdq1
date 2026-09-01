import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { Send, CheckCircle2 } from 'lucide-react'

export default function DoctorMessages() {
  const { messages, sendMessage, approveAiDraft } = useVivans()
  const [inputText, setInputText] = useState('')
  const [filterPatient, setFilterPatient] = useState('Marina Costa')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendMessage(inputText.trim(), 'doctor')
    setInputText('')
  }

  const patientThreads = [
    {
      name: 'Marina Costa',
      unread: 0,
      tag: 'Sono / Pré-consulta',
      last: 'Hoje · 08:45',
      avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=88',
      initials: 'MC',
    },
    {
      name: 'Paulo Mendes',
      unread: 1,
      tag: 'Enjoo relatado',
      last: 'Hoje · 08:12',
      avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=33',
      initials: 'PM',
    },
    {
      name: 'Ana Ribeiro',
      unread: 0,
      tag: 'Relatório aprovado',
      last: 'Ontem · 18:40',
      avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=42',
      initials: 'AR',
    },
    {
      name: 'Rafael Lima',
      unread: 0,
      tag: 'Anamnese 68%',
      last: 'Ontem · 11:05',
      avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=54',
      initials: 'RL',
    },
  ]

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Central de Mensagens Clínicas · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
            Comunicação da Equipe Médica
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Mensagens com Pacientes
          </h1>
          <p className="text-sm text-[#5C5C57]">
            Atendimento assíncrono com apoio de rascunhos inteligentes para aprovação médica.
          </p>
        </div>
      </section>

      {/* Main Layout: Patients Threads (Left) vs Active Chat (Right) */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Patient threads list */}
        <aside className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 shadow-card space-y-3">
          <div className="border-b border-[#EFECE5] pb-3 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Conversas por Paciente
            </span>
          </div>

          <div className="space-y-2">
            {patientThreads.map((pt) => {
              const isSelected = filterPatient === pt.name
              return (
                <button
                  key={pt.name}
                  type="button"
                  onClick={() => setFilterPatient(pt.name)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E7EFEA] border border-[#C3D6CC] shadow-subtle'
                      : 'border border-[#E8E3D9] bg-[#FAF8F4] hover:bg-[#F1EEE7]'
                  }`}
                >
                  <VivansAvatar
                    src={pt.avatarUrl}
                    name={pt.name}
                    initials={pt.initials}
                    size="md"
                    className="border border-[#E8E3D9] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-xs text-[#1E1E1C] truncate">{pt.name}</strong>
                      <span className="text-[10px] text-[#8A8A84] shrink-0">{pt.last}</span>
                    </div>
                    <p className="text-[11px] text-[#5C5C57] truncate">{pt.tag}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Active Chat Thread */}
        <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] shadow-card overflow-hidden flex flex-col h-[600px]">
          {/* Thread Header */}
          <div className="border-b border-[#EFECE5] bg-[#FAF8F4] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VivansAvatar
                src={
                  patientThreads.find((p) => p.name === filterPatient)?.avatarUrl ||
                  'https://img.usecurling.com/ppl/512?gender=female&seed=88'
                }
                name={filterPatient}
                initials={filterPatient
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
                size="md"
                className="border border-[#E8E3D9]"
              />
              <div>
                <strong className="text-sm text-[#1E1E1C] block">{filterPatient}</strong>
                <span className="text-xs text-[#5C5C57]">Em acompanhamento · Dia 29 de 90</span>
              </div>
            </div>

            <StatusBadge tone="green">Canal Seguro</StatusBadge>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F4]/50">
            {messages.map((msg) => {
              const isDoctor = msg.sender === 'doctor'
              const isDraft = msg.sender === 'ai_draft'

              if (isDraft) {
                return (
                  <div
                    key={msg.id}
                    className="mx-auto max-w-xl rounded-2xl border border-[#C49A5B]/40 bg-[#FBF5EB] p-4 space-y-3 shadow-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
                      </div>
                      <StatusBadge tone="amber">Aguardando Validação</StatusBadge>
                    </div>

                    <p className="text-xs text-[#9E7A3D] italic bg-[#FFFFFF] p-3 rounded-xl border border-[#EAD7BA]">
                      "{msg.content}"
                    </p>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => approveAiDraft(msg.id)}
                        className="min-h-9 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Aprovar e Enviar como Mensagem do Médico</span>
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 px-1 text-[11px] text-[#5C5C57] ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <VivansAvatar
                      src={msg.authorAvatarUrl}
                      name={msg.author}
                      initials={isDoctor ? 'GM' : 'MC'}
                      size="sm"
                      className="border border-[#E8E3D9]"
                    />
                    <span>{msg.author}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-subtle ${
                      isDoctor
                        ? 'bg-[#2E5E4E] text-[#FFFFFF] font-medium rounded-tr-sm'
                        : 'bg-[#FFFFFF] text-[#1E1E1C] border border-[#E8E3D9] rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="border-t border-[#EFECE5] p-4 bg-[#FAF8F4] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Escrever mensagem para ${filterPatient}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] px-4 py-3 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
            />
            <button
              type="submit"
              className="grid size-11 place-items-center rounded-2xl bg-[#2E5E4E] text-[#FFFFFF] hover:bg-[#24493D] transition-all shrink-0 shadow-sm cursor-pointer"
            >
              <Send className="size-4 text-[#FFFFFF]" />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
