import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { Send, Bot, Shield, User, Clock, CheckCheck } from 'lucide-react'

export default function PatientMessages() {
  const { messages, sendMessage } = useVivans()
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
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Mensagens com a Equipe
          </h1>
          <p className="text-sm text-[#60766f]">
            Canal direto para dúvidas de rotina, relatos de sintomas e orientações do Dr. Guilherme
            Martins.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8e3] bg-white px-3.5 py-2 text-xs">
          <div className="size-2 rounded-full bg-[#0b7b68] animate-pulse" />
          <span className="font-bold text-[#17372f]">Dr. Guilherme Martins</span>
          <span className="text-[#698078]">· Online</span>
        </div>
      </section>

      {/* Chat Container */}
      <div className="rounded-3xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Safety Header Banner */}
        <div className="bg-[#f8faf9] border-b border-[#edf2ef] px-6 py-2.5 text-xs text-[#698078] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-[#0b7b68]" />
            <span>
              Respostas clínicas são sempre validadas pelo médico. Nenhuma conduta é automatizada
              pela IA.
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[#0b7b68]">Ambiente Seguro</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient'
            const isDoctor = msg.sender === 'doctor'
            const isDraft = msg.sender === 'ai_draft'

            if (isDraft) {
              // Patient does not see unapproved internal AI drafts or sees them clearly labelled as preview
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-md rounded-2xl border border-[#f0d59c] bg-[#fffbf2] p-3.5 text-xs text-[#805f24] text-center space-y-1"
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-[#70480e]">
                    <Bot className="size-3.5 text-[#a37628]" />
                    <span>Sugestão de resposta da IA em validação pelo médico</span>
                  </div>
                  <p className="italic text-[#825b0b]">"{msg.content}"</p>
                </div>
              )
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#698078]">
                  <span>{msg.author}</span>
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
            className="flex-1 rounded-2xl border border-[#dfe8e3] bg-white px-4 py-3 text-xs sm:text-sm text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-11 place-items-center rounded-2xl bg-[#0b7b68] text-white hover:bg-[#096656] transition-colors shrink-0 shadow-sm"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#dfe8e3] bg-white p-4 text-xs text-[#60766f] flex items-start gap-2">
        <Clock className="size-4 text-[#0b7b68] shrink-0 mt-0.5" />
        <p>
          Horário de atendimento assíncrono: Segunda a sexta, das 8h às 19h. Relatos enviados fora
          do horário serão revisados na primeira hora do dia seguinte.
        </p>
      </div>
    </div>
  )
}
