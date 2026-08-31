import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  Filter,
  User,
  Clock,
  AlertTriangle,
} from 'lucide-react'

export default function DoctorMessages() {
  const { messages, sendMessage, approveAiDraft, notify } = useVivans()
  const [inputText, setInputText] = useState('')
  const [filterPatient, setFilterPatient] = useState('Marina Costa')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    sendMessage(inputText.trim(), 'doctor')
    setInputText('')
  }

  const patientThreads = [
    { name: 'Marina Costa', unread: 0, tag: 'Sono / Pré-consulta', last: 'Hoje · 08:45' },
    { name: 'Paulo Mendes', unread: 1, tag: 'Enjoo relatado', last: 'Hoje · 08:12' },
    { name: 'Ana Ribeiro', unread: 0, tag: 'Relatório aprovado', last: 'Ontem · 18:40' },
    { name: 'Rafael Lima', unread: 0, tag: 'Anamnese 68%', last: 'Ontem · 11:05' },
  ]

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Central de Mensagens Clínicas · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Comunicação da Equipe Médica
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Mensagens com Pacientes
          </h1>
          <p className="text-sm text-[#60766f]">
            Atendimento assíncrono com apoio de rascunhos inteligentes para aprovação médica.
          </p>
        </div>
      </section>

      {/* Main Layout: Patients Threads (Left) vs Active Chat (Right) */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Patient threads list */}
        <aside className="rounded-3xl border border-[#dfe8e3] bg-white p-4 shadow-sm space-y-3">
          <div className="border-b border-[#edf2ef] pb-3 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
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
                  className={`w-full rounded-2xl p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-[#e8f4f0] border border-[#b9d8cf] shadow-sm'
                      : 'border border-[#edf2ef] hover:bg-[#f8faf9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs text-[#17372f]">{pt.name}</strong>
                    <span className="text-[10px] text-[#698078]">{pt.last}</span>
                  </div>
                  <p className="text-[11px] text-[#45655c] truncate">{pt.tag}</p>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Active Chat Thread */}
        <section className="rounded-3xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Thread Header */}
          <div className="border-b border-[#edf2ef] bg-[#f8faf9] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-[#0b7b68] text-white text-xs font-bold">
                MC
              </div>
              <div>
                <strong className="text-sm text-[#17372f] block">{filterPatient}</strong>
                <span className="text-xs text-[#698078]">Em acompanhamento · Dia 29 de 90</span>
              </div>
            </div>

            <StatusBadge tone="green">Canal Seguro</StatusBadge>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => {
              const isDoctor = msg.sender === 'doctor'
              const isDraft = msg.sender === 'ai_draft'

              if (isDraft) {
                return (
                  <div
                    key={msg.id}
                    className="mx-auto max-w-xl rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-[#0b7b68]" />
                        <span className="text-xs font-bold text-[#0b6a5b]">
                          Rascunho Sugerido pelo Copiloto IA (Apenas você vê)
                        </span>
                      </div>
                      <StatusBadge tone="amber">Aguardando Validação</StatusBadge>
                    </div>

                    <p className="text-xs text-[#17372f] italic bg-white p-3 rounded-xl border border-[#b9d8cf]">
                      "{msg.content}"
                    </p>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => approveAiDraft(msg.id)}
                        className="min-h-9 rounded-xl bg-[#0b7b68] px-4 text-xs font-bold text-white hover:bg-[#096656] shadow-sm flex items-center gap-1.5"
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
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#698078]">
                    <span>{msg.author}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      isDoctor
                        ? 'bg-[#17372f] text-white rounded-tr-sm'
                        : 'bg-[#f4f7f5] text-[#17372f] border border-[#dfe8e3] rounded-tl-sm'
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
            className="border-t border-[#edf2ef] p-4 bg-[#fbfcfb] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Escrever mensagem para ${filterPatient}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-2xl border border-[#dfe8e3] bg-white px-4 py-3 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
            />
            <button
              type="submit"
              className="grid size-11 place-items-center rounded-2xl bg-[#0b7b68] text-white hover:bg-[#096656] transition-colors shrink-0 shadow-sm"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
