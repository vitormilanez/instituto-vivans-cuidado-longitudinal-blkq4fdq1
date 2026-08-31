import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Target,
  Check,
  X,
  Info,
  Sun,
  Sunset,
  Moon,
  Clock,
  ArrowRightLeft,
} from 'lucide-react'
import { CarePlanItem, ActionPeriod } from '@/data/mockData'

interface PeriodConfig {
  id: 'manha' | 'tarde' | 'noite'
  label: string
  timeRange: string
  icon: typeof Sun
  toneBg: string
  toneBorder: string
  toneText: string
  accentColor: string
}

const PERIOD_CONFIGS: PeriodConfig[] = [
  {
    id: 'manha',
    label: 'Manhã',
    timeRange: '06h00 às 12h00 · Acordar e desjejum',
    icon: Sun,
    toneBg: 'bg-[#fffcf2]',
    toneBorder: 'border-[#f5e4bc]',
    toneText: 'text-[#8a5b0f]',
    accentColor: '#d48b11',
  },
  {
    id: 'tarde',
    label: 'Tarde',
    timeRange: '12h00 às 18h00 · Almoço e lanche vespertino',
    icon: Sunset,
    toneBg: 'bg-[#fef8f4]',
    toneBorder: 'border-[#fbd8c7]',
    toneText: 'text-[#9c4d21]',
    accentColor: '#c95b28',
  },
  {
    id: 'noite',
    label: 'Noite',
    timeRange: '18h00 às 23h00 · Jantar e higiene do sono',
    icon: Moon,
    toneBg: 'bg-[#f2f6fc]',
    toneBorder: 'border-[#d0e0f5]',
    toneText: 'text-[#204a7a]',
    accentColor: '#3a6ea5',
  },
]

export default function PatientPlan() {
  const {
    carePlans = [],
    toggleCarePlan,
    addCarePlanItem,
    updateCarePlanPeriod,
    returnJourney,
    scheduledCheckins = [],
    completeScheduledCheckin,
    preConsultation,
    notify,
  } = useVivans()

  const [newActionText, setNewActionText] = useState('')
  const [newActionCategory, setNewActionCategory] = useState('Hábitos alimentares')
  const [newActionPeriod, setNewActionPeriod] = useState<'manha' | 'tarde' | 'noite'>('manha')
  const [newActionRationale, setNewActionRationale] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [filterType, setFilterType] = useState<'todos' | 'medico' | 'ia'>('todos')
  const [selectedPeriodTab, setSelectedPeriodTab] = useState<'todos' | 'manha' | 'tarde' | 'noite'>(
    'todos',
  )
  const [showAdherenceExplainModal, setShowAdherenceExplainModal] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverPeriod, setDragOverPeriod] = useState<'manha' | 'tarde' | 'noite' | null>(null)

  // Separating Approved vs AI Suggestions
  const medicalActions = carePlans.filter((p) => p.type === 'medical')
  const aiSuggestedActions = carePlans.filter((p) => p.type === 'ai_suggestion')

  // Status counts for medical actions
  const completedMedical = medicalActions.filter((p) => p.completed).length
  const totalMedical = medicalActions.length
  const delayedMedical = medicalActions.filter(
    (p) => !p.completed && p.timingStatus === 'atrasado',
  ).length
  const onTimeMedical = totalMedical - delayedMedical - completedMedical

  const percentMedical = totalMedical > 0 ? Math.round((completedMedical / totalMedical) * 100) : 0

  // Primary action of the day (highest focus recommendation)
  const primaryAction =
    carePlans.find((p) => p.type === 'medical' && p.isPrimaryToday && !p.completed) ||
    carePlans.find((p) => p.type === 'medical' && !p.completed) ||
    null

  const completedCheckins = scheduledCheckins.filter((c) => c.status === 'concluido').length
  const totalCheckins = scheduledCheckins.length

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newActionText.trim()) return
    addCarePlanItem({
      action: newActionText.trim(),
      category: newActionCategory,
      type: 'medical',
      completed: false,
      period: newActionPeriod,
      timingStatus: 'pendente_hoje',
      frequency: 'Ação pessoal adicionada pela paciente',
      doctorRationale:
        newActionRationale.trim() || 'Ação pessoal de autocuidado integrada pela paciente.',
    })
    setNewActionText('')
    setNewActionRationale('')
    setIsAdding(false)
  }

  // Quick Move period handler (click-based mobile friendly)
  const handleMoveAction = (itemId: string, targetPeriod: 'manha' | 'tarde' | 'noite') => {
    updateCarePlanPeriod(itemId, targetPeriod)
  }

  // HTML5 Drag and Drop Handlers (works on desktop / tablets)
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    setDraggedItemId(id)
  }

  const handleDragOver = (e: React.DragEvent, period: 'manha' | 'tarde' | 'noite') => {
    e.preventDefault()
    if (dragOverPeriod !== period) {
      setDragOverPeriod(period)
    }
  }

  const handleDragLeave = () => {
    setDragOverPeriod(null)
  }

  const handleDrop = (e: React.DragEvent, period: 'manha' | 'tarde' | 'noite') => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedItemId
    if (id) {
      updateCarePlanPeriod(id, period)
    }
    setDraggedItemId(null)
    setDragOverPeriod(null)
  }

  // Helper to get normalized period (defaulting 'livre' to 'manha')
  const normalizePeriod = (period?: ActionPeriod): 'manha' | 'tarde' | 'noite' => {
    if (period === 'tarde' || period === 'noite') return period
    return 'manha'
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Orientações Médicas e Ações de Cuidado · Instituto Vivans" />

      {/* Hero Header: Objetivo da Marina nas palavras dela */}
      <section className="overflow-hidden rounded-3xl border border-[#bfe4d8] bg-gradient-to-br from-[#ebf6f2] via-[#f7faf8] to-white p-5 sm:p-7 shadow-[0_8px_24px_rgba(11,123,104,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b7b68] px-3 py-1 text-xs font-bold text-white shadow-xs">
                <Target className="size-3.5" />
                <span>Programa Ativo · Dia 29 de 90</span>
              </span>
              <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#17372f]">
              Seu Plano de Cuidado
            </h1>

            {/* Marina's objective in her own words */}
            <div className="rounded-2xl border border-[#cbe4dc] bg-white/90 p-4 text-xs sm:text-sm text-[#1e3e34] shadow-2xs space-y-1">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#0b7b68] flex items-center gap-1.5">
                <Target className="size-3.5" />
                <span>Seu objetivo declarado:</span>
              </p>
              <p className="italic font-serif text-sm sm:text-base text-[#17372f] leading-snug">
                “
                {preConsultation?.objective ||
                  'Manter a redução ponderal gradual com preservação de disposição e regularização do sono.'}
                ”
              </p>
              <p className="text-[11px] text-[#698078] pt-1">
                Foco acordado em consulta: Crononutrição do jantar às 19h30, saciedade sem
                restrições extremas e higiene do sono.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#0b7b68] bg-white px-4 text-xs font-bold text-[#0b7b68] hover:bg-[#edf7f4] transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <Plus className="size-4" />
              <span>{isAdding ? 'Fechar Formulário' : 'Adicionar Ação'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdherenceExplainModal(true)}
              className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-2xl bg-white/70 px-3 text-[11px] font-semibold text-[#526a62] hover:bg-white hover:text-[#17372f] transition-colors"
            >
              <Info className="size-3.5 text-[#0b7b68]" />
              <span>Como funciona a adesão?</span>
            </button>
          </div>
        </div>

        {/* Global Progress Summary Strip */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-[#d8ebe3] pt-4">
          <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#698078]">
              Progresso Geral
            </p>
            <p className="text-xl font-bold text-[#0b7b68] mt-0.5">{percentMedical}%</p>
            <p className="text-[10px] text-[#556d66]">
              {completedMedical} de {totalMedical} ações feitas
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b7b68]">Em Dia</p>
            <p className="text-xl font-bold text-[#17372f] mt-0.5">{onTimeMedical} ações</p>
            <p className="text-[10px] text-[#556d66]">Planejadas para hoje</p>
          </div>

          <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#a06015]">
              Ponto de Atenção
            </p>
            <p className="text-xl font-bold text-[#8d4e0b] mt-0.5">
              {delayedMedical > 0 ? `${delayedMedical} atrasada` : 'Nenhuma pendência'}
            </p>
            <p className="text-[10px] text-[#8d4e0b]">
              {delayedMedical > 0 ? 'Lanche vespertino 16h30' : 'Tudo em dia'}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3 border border-[#dfe8e3]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e776e]">
              Check-ins de Retorno
            </p>
            <p className="text-xl font-bold text-[#17372f] mt-0.5">
              {completedCheckins}/{totalCheckins}
            </p>
            <p className="text-[10px] text-[#556d66]">
              Próxima rev: {returnJourney?.nextReviewDate?.split('(')[0] || '14 dias'}
            </p>
          </div>
        </div>
      </section>

      {/* Add Custom Action Form */}
      {isAdding && (
        <form
          onSubmit={handleAddAction}
          className="rounded-3xl border border-[#b9d8cf] bg-[#edf7f4] p-5 sm:p-6 animate-fade-in space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-[#cfe5dc] pb-2">
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#17372f]">
              Adicionar nova ação de autocuidado ao seu plano
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[#60766f] hover:text-[#17372f]"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_180px_160px]">
            <div>
              <label className="block text-[11px] font-bold text-[#17372f] mb-1">
                Qual é a ação que você deseja acompanhar?
              </label>
              <input
                type="text"
                placeholder="Ex: Fazer chá de camomila morno às 21h30..."
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-[#dfe8e3] bg-white px-3.5 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#17372f] mb-1">
                Período do Dia
              </label>
              <select
                value={newActionPeriod}
                onChange={(e) => setNewActionPeriod(e.target.value as any)}
                className="w-full min-h-[44px] rounded-xl border border-[#dfe8e3] bg-white px-3 py-2 text-xs font-semibold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              >
                <option value="manha">🌅 Manhã</option>
                <option value="tarde">🌤️ Tarde</option>
                <option value="noite">🌙 Noite</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#17372f] mb-1">Categoria</label>
              <select
                value={newActionCategory}
                onChange={(e) => setNewActionCategory(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-[#dfe8e3] bg-white px-3 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              >
                <option value="Hábitos alimentares">Hábitos alimentares</option>
                <option value="Sono e recuperação">Sono e recuperação</option>
                <option value="Atividade física">Atividade física</option>
                <option value="Hidratação & Saciedade">Hidratação & Saciedade</option>
                <option value="Autocuidado">Autocuidado pessoal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#17372f] mb-1">
              Por que esta ação é importante para você? (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Me ajuda a desacelerar e dormir melhor sem acordar de madrugada..."
              value={newActionRationale}
              onChange={(e) => setNewActionRationale(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-[#dfe8e3] bg-white px-3.5 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="min-h-[44px] rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f] hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656] shadow-sm active:scale-98"
            >
              Salvar Ação no Plano
            </button>
          </div>
        </form>
      )}

      {/* HIGHLIGHT: PRÓXIMA AÇÃO RECOMENDADA DO DIA (1 Toque) */}
      {primaryAction ? (
        <article className="overflow-hidden rounded-3xl bg-[#17372f] p-5 sm:p-7 text-white shadow-[0_12px_32px_rgba(23,55,47,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#9fe0ce] text-[#17372f] text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9fe0ce]">
                Próxima Ação Recomendada do Dia
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#d6e8e2]">
              Foco Prioritário
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#0b7b68] px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                  {normalizePeriod(primaryAction.period) === 'noite'
                    ? '🌙 Noite'
                    : normalizePeriod(primaryAction.period) === 'tarde'
                      ? '🌤️ Tarde'
                      : '🌅 Manhã'}
                </span>
                <span className="text-xs text-[#9cc7ba]">• {primaryAction.category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                {primaryAction.action}
              </h3>
              <p className="text-xs text-[#d6e8e2] leading-relaxed">
                {primaryAction.doctorRationale ||
                  'Orientação validada pelo Dr. Guilherme para preservar energia e otimizar o repouso.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9cc7ba] pt-1">
                <span>Frequência: {primaryAction.frequency || 'Diário'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleCarePlan(primaryAction.id)}
              className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-white px-6 text-xs sm:text-sm font-bold text-[#17372f] shadow-lg transition-all hover:bg-[#eaf4f1] active:scale-95 cursor-pointer shrink-0"
              title="Concluir esta ação em 1 toque"
            >
              <CheckCircle2 className="size-5 text-[#0b7b68]" />
              <span>Concluir em 1 toque</span>
            </button>
          </div>
        </article>
      ) : (
        <article className="rounded-3xl border border-[#bfe4d8] bg-[#ebf6f2] p-5 text-center text-[#075f50] space-y-2">
          <CheckCircle2 className="size-8 mx-auto text-[#0b7b68]" />
          <h3 className="font-serif text-lg font-bold">
            Todas as ações principais de hoje foram concluídas!
          </h3>
          <p className="text-xs text-[#3b534b] max-w-md mx-auto">
            Excelente constância, Marina. Seu progresso foi registrado para o Dr. Guilherme
            acompanhar no prontuário.
          </p>
        </article>
      )}

      {/* FILTER BUTTONS & VIEW SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Type filter */}
        <div className="flex rounded-2xl border border-[#dfe8e3] bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilterType('todos')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-colors ${
              filterType === 'todos'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            Todas as Ações ({carePlans.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('medico')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-colors ${
              filterType === 'medico'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            Aprovadas pelo Médico ({medicalActions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ia')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-colors ${
              filterType === 'ia'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            Sugestões IA ({aiSuggestedActions.length})
          </button>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#698078] hidden sm:inline">Filtrar período:</span>
          {(['todos', 'manha', 'tarde', 'noite'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriodTab(p)}
              className={`min-h-[32px] rounded-lg px-2.5 text-[11px] font-bold capitalize transition-all ${
                selectedPeriodTab === p
                  ? 'bg-[#edf7f4] text-[#0b7b68] border border-[#b9d8cf]'
                  : 'text-[#60766f] hover:bg-white border border-transparent'
              }`}
            >
              {p === 'todos'
                ? 'Todos os horários'
                : p === 'manha'
                  ? '🌅 Manhã'
                  : p === 'tarde'
                    ? '🌤️ Tarde'
                    : '🌙 Noite'}
            </button>
          ))}
        </div>
      </div>

      {/* REORGANIZAÇÃO DE AÇÕES POR PERÍODO DO DIA (MANHÃ / TARDE / NOITE) */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17372f]">
              Rotina Diária por Período
            </h2>
            <p className="text-xs text-[#60766f] mt-0.5">
              Organize suas ações conforme a sua rotina real. Arraste ou use os botões discretos
              para mover entre os períodos.
            </p>
          </div>
          <span className="rounded-full bg-[#f4f7f5] border border-[#dfe8e3] px-3 py-1 text-xs text-[#526b63] font-semibold flex items-center gap-1">
            <ArrowRightLeft className="size-3 text-[#0b7b68]" />
            <span>Reordenação flexível</span>
          </span>
        </div>

        {PERIOD_CONFIGS.filter(
          (pConf) => selectedPeriodTab === 'todos' || selectedPeriodTab === pConf.id,
        ).map((periodConf) => {
          const PeriodIcon = periodConf.icon
          const periodId = periodConf.id

          // Actions in this period
          const periodMedicalActions = medicalActions.filter(
            (item) => normalizePeriod(item.period) === periodId,
          )
          const periodAiActions = aiSuggestedActions.filter(
            (item) => normalizePeriod(item.period) === periodId,
          )

          const isDropTarget = dragOverPeriod === periodId
          const totalInPeriod =
            (filterType === 'ia' ? 0 : periodMedicalActions.length) +
            (filterType === 'medico' ? 0 : periodAiActions.length)

          return (
            <section
              key={periodId}
              onDragOver={(e) => handleDragOver(e, periodId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, periodId)}
              className={`rounded-3xl border-2 transition-all p-5 sm:p-6 space-y-4 ${
                isDropTarget
                  ? 'border-[#0b7b68] bg-[#edf7f4] shadow-md ring-2 ring-[#0b7b68]/20'
                  : 'border-[#dfe8e3] bg-white shadow-sm'
              }`}
            >
              {/* Period Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl border ${periodConf.toneBg} ${periodConf.toneBorder} ${periodConf.toneText} shadow-2xs`}
                  >
                    <PeriodIcon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17372f]">
                        {periodConf.label}
                      </h3>
                      <span className="rounded-full bg-[#f4f7f5] border border-[#dfe8e3] px-2.5 py-0.5 text-xs font-bold text-[#526b63]">
                        {totalInPeriod} {totalInPeriod === 1 ? 'ação' : 'ações'}
                      </span>
                    </div>
                    <p className="text-xs text-[#698078]">{periodConf.timeRange}</p>
                  </div>
                </div>

                <span className="hidden sm:inline text-[11px] font-medium text-[#698078]">
                  Solte aqui para mover para a {periodConf.label}
                </span>
              </div>

              {/* Empty state for period */}
              {totalInPeriod === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-[#dfe8e3] bg-[#fbfcfb] p-6 text-center text-xs text-[#789087] space-y-1">
                  <p className="font-semibold text-[#17372f]">
                    Nenhuma ação alocada para a {periodConf.label}
                  </p>
                  <p>
                    Use os botões de mover em outras ações para distribuí-las neste horário da sua
                    rotina.
                  </p>
                </div>
              )}

              {/* MEDICAL ACTIONS IN THIS PERIOD */}
              {(filterType === 'todos' || filterType === 'medico') &&
                periodMedicalActions.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0b7b68]">
                      <ShieldCheck className="size-4 text-[#0b7b68]" />
                      <span>Orientações Aprovadas pelo Dr. Guilherme</span>
                    </div>

                    {periodMedicalActions.map((item) => {
                      const isDelayed = !item.completed && item.timingStatus === 'atrasado'
                      return (
                        <article
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          className={`rounded-2xl border p-4 sm:p-4.5 transition-all shadow-2xs cursor-grab active:cursor-grabbing ${
                            item.completed
                              ? 'border-[#b9d8cf] bg-[#f4faf7]'
                              : isDelayed
                                ? 'border-[#f8deb0] bg-[#fffcf5]'
                                : 'border-[#dfe8e3] bg-[#fafcfb] hover:border-[#9fc9bd]'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Interactive Checkbox with >=44px touch target */}
                            <button
                              type="button"
                              onClick={() => toggleCarePlan(item.id)}
                              className={`grid size-9 shrink-0 place-items-center rounded-2xl border transition-all cursor-pointer ${
                                item.completed
                                  ? 'border-[#0b7b68] bg-[#0b7b68] text-white shadow-xs'
                                  : 'border-[#b7c7c1] bg-white text-transparent hover:border-[#0b7b68]'
                              }`}
                              aria-label={`Marcar ${item.action} como ${item.completed ? 'pendente' : 'concluída'}`}
                            >
                              <Check className="size-5 stroke-[3]" />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#0b7b68]">
                                  {item.category}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {item.completed ? (
                                    <StatusBadge tone="green">
                                      Concluído{' '}
                                      {item.lastCompletedAt ? `· ${item.lastCompletedAt}` : ''}
                                    </StatusBadge>
                                  ) : isDelayed ? (
                                    <StatusBadge tone="amber">Atenção · Pendente</StatusBadge>
                                  ) : (
                                    <StatusBadge tone="blue">Em dia · Hoje</StatusBadge>
                                  )}
                                </div>
                              </div>

                              <h4
                                className={`mt-1 font-serif text-base font-bold leading-snug ${
                                  item.completed ? 'text-[#45655c] line-through' : 'text-[#17372f]'
                                }`}
                              >
                                {item.action}
                              </h4>

                              {item.doctorRationale && (
                                <p className="mt-1.5 text-xs text-[#526b63] leading-relaxed">
                                  <strong>Por que fazer:</strong> {item.doctorRationale}
                                </p>
                              )}

                              {/* Mobile-First Reorder Controls (Move to other periods) */}
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-2.5">
                                <div className="text-[11px] text-[#698078]">
                                  Frequência: <strong>{item.frequency || 'Diário'}</strong>
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-[#698078] hidden sm:inline mr-1">
                                    Mover para:
                                  </span>
                                  {(['manha', 'tarde', 'noite'] as const).map((targetP) => {
                                    const isCurrent = normalizePeriod(item.period) === targetP
                                    const targetLabel =
                                      targetP === 'manha'
                                        ? '🌅 Manhã'
                                        : targetP === 'tarde'
                                          ? '🌤️ Tarde'
                                          : '🌙 Noite'
                                    return (
                                      <button
                                        key={targetP}
                                        type="button"
                                        disabled={isCurrent}
                                        onClick={() => handleMoveAction(item.id, targetP)}
                                        className={`min-h-[30px] rounded-lg px-2 text-[10px] font-bold transition-all ${
                                          isCurrent
                                            ? 'bg-[#17372f] text-white cursor-default'
                                            : 'border border-[#dfe8e3] bg-white text-[#526b63] hover:border-[#0b7b68] hover:text-[#0b7b68] cursor-pointer'
                                        }`}
                                        title={`Mover para ${targetLabel}`}
                                      >
                                        {targetLabel}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}

              {/* AI SUGGESTIONS IN THIS PERIOD */}
              {(filterType === 'todos' || filterType === 'ia') && periodAiActions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#a06015]">
                      <Sparkles className="size-4 text-[#c57d19]" />
                      <span>Sugestões do Copiloto (IA)</span>
                    </div>
                    <AiDraftBadge
                      status="Rascunho gerado com IA - requer validação médica"
                      variant="compact"
                    />
                  </div>

                  {periodAiActions.map((item) => (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="rounded-2xl border border-[#e6c98c] bg-[#fffcf5] p-4 space-y-2 shadow-2xs cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#a06015]">{item.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#fef3db] text-[#8d4e0b] px-2 py-0.5">
                          Rascunho para Consulta
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#17372f]">
                        💡 {item.action}
                      </h4>

                      {item.aiDraftNote && (
                        <p className="text-xs text-[#60766f] leading-relaxed italic">
                          “{item.aiDraftNote}”
                        </p>
                      )}

                      {/* Move buttons for AI action */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f0ebe0] pt-2 text-[11px] text-[#825b0b]">
                        <span className="font-semibold">Requer validação médica</span>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#825b0b] hidden sm:inline mr-1">
                            Mover para:
                          </span>
                          {(['manha', 'tarde', 'noite'] as const).map((targetP) => {
                            const isCurrent = normalizePeriod(item.period) === targetP
                            const targetLabel =
                              targetP === 'manha'
                                ? '🌅 Manhã'
                                : targetP === 'tarde'
                                  ? '🌤️ Tarde'
                                  : '🌙 Noite'
                            return (
                              <button
                                key={targetP}
                                type="button"
                                disabled={isCurrent}
                                onClick={() => handleMoveAction(item.id, targetP)}
                                className={`min-h-[28px] rounded-lg px-2 text-[10px] font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-[#8d4e0b] text-white cursor-default'
                                    : 'border border-[#e6c98c] bg-white text-[#8d4e0b] hover:bg-[#fef3db] cursor-pointer'
                                }`}
                              >
                                {targetLabel}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* CHECK-INS PROGRAMADOS DO RETORNO */}
      <section className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Acompanhamento Pós-Consulta (14 Dias)
            </span>
            <h3 className="font-serif text-xl font-bold text-[#17372f]">
              {returnJourney?.title || 'Plano de Retorno e Adaptação'}
            </h3>
          </div>
          <StatusBadge tone="green">
            {completedCheckins} de {totalCheckins} Check-ins Realizados
          </StatusBadge>
        </div>

        <p className="text-xs text-[#526b63] leading-relaxed">
          {returnJourney?.summary ||
            'Check-ins periódicos para acompanhar o impacto do jantar antecipado nos despertares noturnos.'}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scheduledCheckins.map((chk) => (
            <div
              key={chk.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between ${
                chk.status === 'concluido'
                  ? 'border-[#bfe4d8] bg-[#f8fcfb]'
                  : 'border-[#dfe8e3] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <strong className="text-[#0b7b68]">Dia {chk.dayOffset}</strong>
                  <StatusBadge tone={chk.status === 'concluido' ? 'green' : 'amber'}>
                    {chk.status === 'concluido' ? 'Concluído' : 'Pendente'}
                  </StatusBadge>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#17372f] leading-snug">
                  {chk.title}
                </h4>
                <p className="text-[11px] text-[#60766f] mt-1">{chk.scheduledDate}</p>
                {chk.value && (
                  <p className="mt-2 text-[11px] font-bold text-[#0b6a5b] rounded-lg bg-[#edf7f4] px-2 py-1">
                    Registro: {chk.value}
                  </p>
                )}
              </div>

              {chk.status !== 'concluido' ? (
                <button
                  type="button"
                  onClick={() => completeScheduledCheckin(chk.id, 'Realizado', 'Check-in pontual')}
                  className="mt-3 min-h-[40px] w-full rounded-xl bg-[#0b7b68] py-2 text-xs font-bold text-white hover:bg-[#086555] transition-colors cursor-pointer"
                >
                  Registrar Agora
                </button>
              ) : (
                <div className="mt-3 pt-2 border-t border-black/5 text-[10px] text-[#0b7b68] font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>Concluído ({chk.completedAt})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ADHERENCE EXPLANATION MODAL */}
      {showAdherenceExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#e8f4f0] text-[#0b7b68]">
                  <Target className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Como a adesão ao plano funciona?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdherenceExplainModal(false)}
                className="text-[#60766f] hover:text-[#17372f]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#45655c] leading-relaxed">
              <p>
                A <strong>adesão</strong> no Instituto Vivans é uma métrica de consistência de
                hábitos, <strong>não uma nota ou cobrança</strong>.
              </p>
              <div className="rounded-2xl bg-[#f4f7f5] p-3.5 space-y-2 text-[#17372f]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#0b7b68]">
                  Como é calculada no protótipo:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-[#45655c]">
                  <li>
                    <strong>Ações do dia:</strong> Percentual de orientações médicas marcadas como
                    feitas (atualmente {percentMedical}%).
                  </li>
                  <li>
                    <strong>Check-ins de retorno:</strong> Registros regulares acordados na consulta
                    ({completedCheckins} de {totalCheckins}).
                  </li>
                  <li>
                    <strong>Diário sem julgamento:</strong> Envio de fotos e avaliações de saciedade
                    para contextualizar a evolução.
                  </li>
                </ul>
              </div>
              <p>
                <strong>Por que importa:</strong> O Dr. Guilherme utiliza a adesão para entender se
                o plano cabe na sua rotina real ou se precisa ser ajustado. Nada é feito de forma
                punitiva.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAdherenceExplainModal(false)}
                className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety warning */}
      <UrgentCareWarning />
    </div>
  )
}
