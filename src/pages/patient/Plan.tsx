import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { CheckCircle2, Clock, Sparkles, Shield, AlertCircle, Plus } from 'lucide-react'

export default function PatientPlan() {
  const {
    carePlans,
    toggleCarePlan,
    addCarePlanItem,
    returnJourney,
    scheduledCheckins,
    completeScheduledCheckin,
    notify,
  } = useVivans()
  const [newActionText, setNewActionText] = useState('')
  const [newActionCategory, setNewActionCategory] = useState('Hábitos alimentares')
  const [isAdding, setIsAdding] = useState(false)

  const completedCount = carePlans.filter((p) => p.completed).length
  const totalCount = carePlans.length
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const completedCheckins = scheduledCheckins.filter((c) => c.status === 'concluido').length
  const totalCheckins = scheduledCheckins.length

  const medicalActions = carePlans.filter((p) => p.type === 'medical')
  const aiSuggestedActions = carePlans.filter((p) => p.type === 'ai_suggestion')

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newActionText.trim()) return
    addCarePlanItem({
      action: newActionText.trim(),
      category: newActionCategory,
      type: 'medical',
      completed: false,
    })
    setNewActionText('')
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Plano de Cuidado Longitudinal · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Plano Longitudinal
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Seu Cuidado em Passos Simples
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Orientações validadas pelo Dr. Guilherme Martins para manter consistência sem
            sobrecarga.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex min-h-11 items-center gap-2 self-start rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5] transition-colors"
        >
          <Plus className="size-4 text-[#0b7b68]" />
          <span>{isAdding ? 'Fechar' : 'Adicionar Ação Pessoal'}</span>
        </button>
      </section>

      {/* Add Item form */}
      {isAdding && (
        <form
          onSubmit={handleAddAction}
          className="rounded-3xl border border-[#b9d8cf] bg-[#edf7f4] p-5 animate-fade-in-down"
        >
          <h4 className="font-serif text-sm font-bold text-[#17372f] mb-3">
            Adicionar nova ação de autocuidado
          </h4>
          <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
            <input
              type="text"
              placeholder="Ex: Fazer chá de camomila às 21h30..."
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              className="rounded-xl border border-[#dfe8e3] bg-white px-3.5 py-2.5 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              required
            />
            <select
              value={newActionCategory}
              onChange={(e) => setNewActionCategory(e.target.value)}
              className="rounded-xl border border-[#dfe8e3] bg-white px-3 py-2.5 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
            >
              <option value="Hábitos alimentares">Hábitos alimentares</option>
              <option value="Sono e recuperação">Sono e recuperação</option>
              <option value="Atividade física">Atividade física</option>
              <option value="Hidratação">Hidratação</option>
            </select>
            <button
              type="submit"
              className="min-h-10 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656]"
            >
              Salvar Ação
            </button>
          </div>
        </form>
      )}

      {/* Active Return Journey Header Card */}
      <article className="rounded-3xl border border-[#bfe4d8] bg-[#ebf6f2] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfe6dc] pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0b7b68] animate-pulse" />
            <h2 className="font-serif text-lg font-bold text-[#17372f]">{returnJourney.title}</h2>
          </div>
          <StatusBadge tone="green">Plano Ativo · Validação Médica OK</StatusBadge>
        </div>

        <p className="text-xs text-[#3b534b] leading-relaxed">{returnJourney.summary}</p>

        {/* Check-ins timeline track */}
        <div className="rounded-2xl bg-white p-4 border border-[#dfe8e3] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#17372f] uppercase tracking-wider">
              Check-ins Programados do Retorno ({completedCheckins}/{totalCheckins})
            </span>
            <span className="text-[#0b7b68] font-semibold">
              Revisão Médica: {returnJourney.nextReviewDate}
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {scheduledCheckins.map((chk) => (
              <div
                key={chk.id}
                className={`rounded-xl border p-2.5 text-xs flex flex-col justify-between ${
                  chk.status === 'concluido'
                    ? 'border-[#bfe4d8] bg-[#f8fcfb]'
                    : 'border-[#dfe8e3] bg-white'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="font-bold text-[#0b7b68]">Dia {chk.dayOffset}</span>
                    <StatusBadge tone={chk.status === 'concluido' ? 'green' : 'amber'}>
                      {chk.status === 'concluido' ? 'Feito' : 'Pendente'}
                    </StatusBadge>
                  </div>
                  <strong className="block text-[11px] text-[#17372f] leading-snug">
                    {chk.title}
                  </strong>
                </div>
                {chk.status !== 'concluido' && (
                  <button
                    type="button"
                    onClick={() => completeScheduledCheckin(chk.id, 'Feito', 'Registro pontual')}
                    className="mt-2 rounded-lg bg-[#0b7b68] py-1 text-[10px] font-bold text-white hover:bg-[#086555]"
                  >
                    Registrar Agora
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Progress & Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Progress Card */}
          <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Progresso do Dia
                </p>
                <h3 className="font-serif text-xl font-bold text-[#17372f] mt-1">
                  {completedCount} de {totalCount} Ações Concluídas
                </h3>
              </div>
              <span className="text-3xl font-bold text-[#0b7b68]">{percent}%</span>
            </div>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#e8efe5]">
              <div
                className="h-full rounded-full bg-[#0b7b68] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </article>

          {/* Section 1: Official Medical Guidance */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-[#0b7b68]" />
              <h3 className="font-serif text-lg font-bold text-[#17372f]">
                Orientações Aprovadas pelo Médico
              </h3>
              <StatusBadge tone="green">Vigentes</StatusBadge>
            </div>

            <div className="space-y-3">
              {medicalActions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCarePlan(item.id)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                    item.completed
                      ? 'border-[#b9d8cf] bg-[#edf7f4]'
                      : 'border-[#dfe8e3] bg-white hover:border-[#9fc9bd]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`grid size-6 place-items-center rounded-full border text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        item.completed
                          ? 'border-[#0b7b68] bg-[#0b7b68] text-white'
                          : 'border-[#b7c7c1] text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          item.completed ? 'text-[#45655c] line-through' : 'text-[#17372f]'
                        }`}
                      >
                        {item.action}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#698078]">
                        <span className="font-medium text-[#0b7b68]">{item.category}</span>
                        <span>•</span>
                        <span>Dr. Guilherme Martins</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: AI Suggestions (Pending Medical Approval) */}
          {aiSuggestedActions.length > 0 && (
            <section className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#e49d45]" />
                  <h3 className="font-serif text-lg font-bold text-[#17372f]">
                    Sugestões em Avaliação (Copiloto IA)
                  </h3>
                </div>
                <StatusBadge tone="amber">Aguardando Validação</StatusBadge>
              </div>

              <div className="space-y-3">
                {aiSuggestedActions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#f0d59c] bg-[#fffbf2] p-4.5"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="grid size-6 place-items-center rounded-full border border-[#d9a244] bg-[#fff4d8] text-xs font-bold text-[#825b0b] shrink-0 mt-0.5">
                        💡
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
                        </div>
                        <p className="text-sm font-medium text-[#70480e]">{item.action}</p>
                        {item.notes && (
                          <p className="mt-1 text-xs text-[#825b0b] italic">{item.notes}</p>
                        )}
                        <p className="mt-2 text-[11px] text-[#a07425]">
                          Esta sugestão permanece como rascunho até validação e assinatura pelo Dr.
                          Guilherme Martins.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info Panels */}
        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#17372f] p-6 text-white shadow-md">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9cc7ba]">
              Foco Desta Quinzena
            </p>
            <h3 className="font-serif text-xl font-bold mt-2 text-white">
              Regularizar Higiene do Sono
            </h3>
            <p className="mt-3 text-xs text-[#d6e8e2] leading-relaxed">
              Antes de aumentar restrições calóricas ou carga de exercícios, o Dr. Guilherme
              prioriza recuperar seu sono para reduzir o cortisol e a fadiga vespertina.
            </p>
          </div>

          <div className="rounded-3xl border border-[#f0d59c] bg-[#fffbf2] p-5 text-xs text-[#805f24]">
            <div className="flex items-center gap-2 font-bold mb-2 text-[#70480e]">
              <AlertCircle className="size-4 text-[#a37628]" />
              <span>Quando avisar a equipe</span>
            </div>
            <p className="leading-relaxed">
              Caso sinta qualquer desconforto gastrointestinal, tontura ou dor persistente, envie
              uma mensagem pelo aplicativo sem aguardar a próxima consulta.
            </p>
          </div>

          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5 text-xs text-[#60766f]">
            <p className="font-bold text-[#17372f] mb-1">Como o plano é atualizado?</p>
            <p className="leading-relaxed">
              Após cada consulta, o médico revisa as anotações do copiloto e publica uma nova versão
              atualizada do plano diretamente para você.
            </p>
          </div>

          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-5 text-xs text-[#60766f] space-y-2">
            <p className="font-bold text-[#17372f]">Prescrição Ativa Relacionada</p>
            <div className="rounded-xl bg-[#f8faf9] p-3 border border-[#edf2ef] space-y-1">
              <span className="font-bold text-[#0b7b68]">#RX-1042 · Dr. Guilherme Martins</span>
              <p className="text-[11px] text-[#60766f]">
                Modulação matinal e suporte celular (Válida até 26/09)
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
