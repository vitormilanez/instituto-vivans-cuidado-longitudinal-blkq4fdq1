import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, UrgentCareWarning } from '@/components/CommonUI'
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
import { ActionPeriod } from '@/data/mockData'

interface PeriodConfig {
  id: 'manha' | 'tarde' | 'noite'
  label: string
  timeRange: string
  icon: typeof Sun
}

const PERIOD_CONFIGS: PeriodConfig[] = [
  {
    id: 'manha',
    label: 'Manhã',
    timeRange: '06h00 às 12h00 · Acordar e desjejum',
    icon: Sun,
  },
  {
    id: 'tarde',
    label: 'Tarde',
    timeRange: '12h00 às 18h00 · Almoço e lanche vespertino',
    icon: Sunset,
  },
  {
    id: 'noite',
    label: 'Noite',
    timeRange: '18h00 às 23h00 · Jantar e higiene do sono',
    icon: Moon,
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
    latestApprovedPlan,
    preConsultation,
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

  // HTML5 Drag and Drop Handlers
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

  // Helper to get normalized period
  const normalizePeriod = (period?: ActionPeriod): 'manha' | 'tarde' | 'noite' => {
    if (period === 'tarde' || period === 'noite') return period
    return 'manha'
  }

  return (
    <div className="space-y-6">
      {/* Quick Entry Banner to Prescriptions & Exams */}
      <div className="rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] shrink-0">
            <Clock className="size-4 text-[#2E5E4E]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1E1E1C]">
              Precisa consultar suas receitas ativas ou laudos de exames?
            </p>
            <p className="text-[11px] text-[#5C5C57]">
              Acesse as formulações vigentes de magnésio, CoQ10 e biomarcadores laboratoriais.
            </p>
          </div>
        </div>

        <Link
          to="/paciente/receitas-exames"
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm shrink-0"
        >
          <span>Ver Receitas &amp; Exames</span>
          <Check className="size-3.5 text-[#FFFFFF]" />
        </Link>
      </div>

      {/* BANNER DE PLANO VALIDADO E RECENTEMENTE ENVIADO PELO MÉDICO */}
      {latestApprovedPlan && (
        <article className="overflow-hidden rounded-3xl border border-[#2E5E4E]/30 bg-[#FFFFFF] shadow-card">
          <div className="bg-[#2E5E4E] p-4 sm:p-5 text-[#FAF8F4] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-[#FAF8F4]/15 border border-[#FAF8F4]/20 text-[#FAF8F4] shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-sm sm:text-base font-bold text-[#FAF8F4]">
                    Plano Validado em Consulta Online
                  </span>
                  <span className="rounded-full bg-[#FAF8F4]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF8F4]">
                    Oficial V I N V A N S E
                  </span>
                </div>
                <p className="text-xs text-[#FAF8F4]/80">
                  {latestApprovedPlan.doctorName} · {latestApprovedPlan.approvedAt}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F4] px-3 py-1 text-xs font-bold text-[#2E5E4E] shadow-sm">
              <CheckCircle2 className="size-3.5 text-[#2E5E4E]" />
              <span>Aprovado &amp; Ativo</span>
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-4 text-xs text-[#1E1E1C]">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Col 1: Decisões e Condutas */}
              <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#2E5E4E] text-[#FFFFFF] text-[10px] font-bold">
                    1
                  </span>
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                    Decisões &amp; Condutas
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {latestApprovedPlan.decisions.map((dec, i) => (
                    <li key={i} className="text-xs text-[#1E1E1C] flex items-start gap-1.5">
                      <span className="text-[#2E5E4E] font-bold mt-0.5">•</span>
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Pendências */}
              <div className="rounded-2xl border border-[#EAD7BA] bg-[#FAF8F4] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#C49A5B] text-[#FFFFFF] text-[10px] font-bold">
                    2
                  </span>
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#9E7A3D]">
                    Pendências
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {latestApprovedPlan.pendingTasks.map((pen, i) => (
                    <li key={i} className="text-xs text-[#5C5C57] flex items-start gap-1.5">
                      <span className="text-[#C49A5B] font-bold mt-0.5">•</span>
                      <span>{pen}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Próximos Passos */}
              <div className="rounded-2xl border border-[#C8DFE8] bg-[#FAF8F4] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#2C6E8A] text-[#FFFFFF] text-[10px] font-bold">
                    3
                  </span>
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2C6E8A]">
                    Próximos Passos
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {latestApprovedPlan.nextSteps.map((step, i) => (
                    <li key={i} className="text-xs text-[#5C5C57] flex items-start gap-1.5">
                      <span className="text-[#2C6E8A] font-bold mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {latestApprovedPlan.additionalNotes && (
              <div className="rounded-xl bg-[#FAF8F4] border border-[#E8E3D9] p-3 text-[11px] text-[#5C5C57] italic">
                <strong>Nota do Dr. Guilherme:</strong> “{latestApprovedPlan.additionalNotes}”
              </div>
            )}
          </div>
        </article>
      )}

      {/* Hero Header: Objetivo da Marina */}
      <section className="overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-7 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EFEA] px-3 py-1 text-xs font-bold text-[#2E5E4E]">
                <Target className="size-3.5 text-[#2E5E4E]" />
                <span>Programa Ativo · Dia 29 de 90</span>
              </span>
              <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
              Seu Plano de Cuidado
            </h1>

            {/* Marina's objective */}
            <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 text-xs sm:text-sm text-[#1E1E1C] space-y-1">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#2E5E4E] flex items-center gap-1.5">
                <Target className="size-3.5 text-[#2E5E4E]" />
                <span>Seu objetivo declarado:</span>
              </p>
              <p className="italic font-serif text-sm sm:text-base text-[#1E1E1C] leading-snug">
                “
                {preConsultation?.objective ||
                  'Manter a redução ponderal gradual com preservação de disposição e regularização do sono.'}
                ”
              </p>
              <p className="text-[11px] text-[#5C5C57] pt-1">
                Foco acordado em consulta: Crononutrição do jantar às 19h30, saciedade sem
                restrições extremas e higiene do sono.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#2E5E4E] bg-[#E7EFEA] px-4 text-xs font-bold text-[#2E5E4E] hover:bg-[#2E5E4E] hover:text-[#FFFFFF] transition-all shadow-subtle cursor-pointer"
            >
              <Plus className="size-4" />
              <span>{isAdding ? 'Fechar Formulário' : 'Adicionar Ação'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdherenceExplainModal(true)}
              className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] px-3 text-[11px] font-semibold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-colors cursor-pointer"
            >
              <Info className="size-3.5 text-[#2E5E4E]" />
              <span>Como funciona a adesão?</span>
            </button>
          </div>
        </div>

        {/* Global Progress Summary Strip */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-[#EFECE5] pt-4">
          <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
              Progresso Geral
            </p>
            <p className="text-xl font-bold text-[#2E5E4E] mt-0.5">{percentMedical}%</p>
            <p className="text-[10px] text-[#5C5C57]">
              {completedMedical} de {totalMedical} ações feitas
            </p>
          </div>

          <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2E5E4E]">Em Dia</p>
            <p className="text-xl font-bold text-[#1E1E1C] mt-0.5">{onTimeMedical} ações</p>
            <p className="text-[10px] text-[#5C5C57]">Planejadas para hoje</p>
          </div>

          <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#B7832F]">
              Ponto de Atenção
            </p>
            <p className="text-xl font-bold text-[#B7832F] mt-0.5">
              {delayedMedical > 0 ? `${delayedMedical} atrasada` : 'Nenhuma pendência'}
            </p>
            <p className="text-[10px] text-[#B7832F]">
              {delayedMedical > 0 ? 'Lanche vespertino 16h30' : 'Tudo em dia'}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
              Check-ins de Retorno
            </p>
            <p className="text-xl font-bold text-[#1E1E1C] mt-0.5">
              {completedCheckins}/{totalCheckins}
            </p>
            <p className="text-[10px] text-[#5C5C57]">
              Próxima rev: {returnJourney?.nextReviewDate?.split('(')[0] || '14 dias'}
            </p>
          </div>
        </div>
      </section>

      {/* Add Custom Action Form */}
      {isAdding && (
        <form
          onSubmit={handleAddAction}
          className="rounded-3xl border border-[#2E5E4E]/40 bg-[#FFFFFF] p-5 sm:p-6 animate-fade-in space-y-4 shadow-card"
        >
          <div className="flex items-center justify-between border-b border-[#EFECE5] pb-2">
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#1E1E1C]">
              Adicionar nova ação de autocuidado ao seu plano
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[#8A8A84] hover:text-[#1E1E1C] cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_180px_160px]">
            <div>
              <label className="block text-[11px] font-bold text-[#1E1E1C] mb-1">
                Qual é a ação que você deseja acompanhar?
              </label>
              <input
                type="text"
                placeholder="Ex: Fazer chá de camomila morno às 21h30..."
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3.5 py-2 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1E1E1C] mb-1">
                Período do Dia
              </label>
              <select
                value={newActionPeriod}
                onChange={(e) => setNewActionPeriod(e.target.value as any)}
                className="w-full min-h-[44px] rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
              >
                <option value="manha">🌅 Manhã</option>
                <option value="tarde">🌤️ Tarde</option>
                <option value="noite">🌙 Noite</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1E1E1C] mb-1">Categoria</label>
              <select
                value={newActionCategory}
                onChange={(e) => setNewActionCategory(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3 py-2 text-xs text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
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
            <label className="block text-[11px] font-bold text-[#1E1E1C] mb-1">
              Por que esta ação é importante para você? (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Me ajuda a desacelerar e dormir melhor sem acordar de madrugada..."
              value={newActionRationale}
              onChange={(e) => setNewActionRationale(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3.5 py-2 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="min-h-[44px] rounded-xl border border-[#E8E3D9] px-4 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm cursor-pointer"
            >
              Salvar Ação no Plano
            </button>
          </div>
        </form>
      )}

      {/* HIGHLIGHT: PRÓXIMA AÇÃO RECOMENDADA DO DIA */}
      {primaryAction ? (
        <article className="overflow-hidden rounded-3xl border border-[#C49A5B]/40 bg-[#FBF5EB] p-5 sm:p-7 text-[#1E1E1C] shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAD7BA] pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#C49A5B] text-[#FFFFFF] text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E7A3D]">
                Próxima Ação Recomendada do Dia
              </span>
            </div>
            <span className="rounded-full bg-[#FFFFFF] px-3 py-1 text-[11px] font-semibold text-[#9E7A3D] border border-[#EAD7BA]">
              Foco Prioritário
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#FFFFFF] text-[#9E7A3D] border border-[#EAD7BA] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {normalizePeriod(primaryAction.period) === 'noite'
                    ? '🌙 Noite'
                    : normalizePeriod(primaryAction.period) === 'tarde'
                      ? '🌤️ Tarde'
                      : '🌅 Manhã'}
                </span>
                <span className="text-xs text-[#5C5C57]">• {primaryAction.category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] leading-tight">
                {primaryAction.action}
              </h3>
              <p className="text-xs text-[#5C5C57] leading-relaxed">
                {primaryAction.doctorRationale ||
                  'Orientação validada pelo Dr. Guilherme para preservar energia e otimizar o repouso.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8A8A84] pt-1">
                <span>Frequência: {primaryAction.frequency || 'Diário'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleCarePlan(primaryAction.id)}
              className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-[#2E5E4E] px-6 text-xs sm:text-sm font-bold text-[#FFFFFF] shadow-sm transition-all hover:bg-[#24493D] active:scale-95 cursor-pointer shrink-0"
              title="Concluir esta ação em 1 toque"
            >
              <CheckCircle2 className="size-5 text-[#FFFFFF]" />
              <span>Concluir em 1 toque</span>
            </button>
          </div>
        </article>
      ) : (
        <article className="rounded-3xl border border-[#C3D6CC] bg-[#E7EFEA] p-5 text-center text-[#2E5E4E] space-y-2">
          <CheckCircle2 className="size-8 mx-auto text-[#2E5E4E]" />
          <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
            Todas as ações principais de hoje foram concluídas!
          </h3>
          <p className="text-xs text-[#5C5C57] max-w-md mx-auto">
            Excelente constância, Marina. Seu progresso foi registrado para o Dr. Guilherme
            acompanhar no prontuário.
          </p>
        </article>
      )}

      {/* FILTER BUTTONS & VIEW SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Type filter */}
        <div className="flex rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-1 shadow-subtle">
          <button
            type="button"
            onClick={() => setFilterType('todos')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              filterType === 'todos'
                ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
            }`}
          >
            Todas as Ações ({carePlans.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('medico')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              filterType === 'medico'
                ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
            }`}
          >
            Aprovadas pelo Médico ({medicalActions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ia')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ia'
                ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
            }`}
          >
            Sugestões IA ({aiSuggestedActions.length})
          </button>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#8A8A84] hidden sm:inline">Filtrar período:</span>
          {(['todos', 'manha', 'tarde', 'noite'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriodTab(p)}
              className={`min-h-[32px] rounded-lg px-2.5 text-[11px] font-bold capitalize transition-all cursor-pointer ${
                selectedPeriodTab === p
                  ? 'bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]'
                  : 'text-[#5C5C57] hover:bg-[#F1EEE7] border border-transparent'
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

      {/* ROTINA DIÁRIA POR PERÍODO */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE5] pb-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C]">
              Rotina Diária por Período
            </h2>
            <p className="text-xs text-[#5C5C57] mt-0.5">
              Organize suas ações conforme a sua rotina real. Arraste ou use os botões discretos
              para mover entre os períodos.
            </p>
          </div>
          <span className="rounded-full bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1 text-xs text-[#5C5C57] font-semibold flex items-center gap-1">
            <ArrowRightLeft className="size-3 text-[#2E5E4E]" />
            <span>Reordenação flexível</span>
          </span>
        </div>

        {PERIOD_CONFIGS.filter(
          (pConf) => selectedPeriodTab === 'todos' || selectedPeriodTab === pConf.id,
        ).map((periodConf) => {
          const PeriodIcon = periodConf.icon
          const periodId = periodConf.id

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
              className={`rounded-3xl border transition-all p-5 sm:p-6 space-y-4 ${
                isDropTarget
                  ? 'border-[#2E5E4E] bg-[#E7EFEA] shadow-card ring-2 ring-[#2E5E4E]/30'
                  : 'border-[#E8E3D9] bg-[#FFFFFF] shadow-card'
              }`}
            >
              {/* Period Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE5] pb-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] text-[#2E5E4E] shadow-subtle">
                    <PeriodIcon className="size-5 text-[#2E5E4E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E1E1C]">
                        {periodConf.label}
                      </h3>
                      <span className="rounded-full bg-[#FAF8F4] border border-[#E8E3D9] px-2.5 py-0.5 text-xs font-bold text-[#5C5C57]">
                        {totalInPeriod} {totalInPeriod === 1 ? 'ação' : 'ações'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5C57]">{periodConf.timeRange}</p>
                  </div>
                </div>

                <span className="hidden sm:inline text-[11px] font-medium text-[#8A8A84]">
                  Solte aqui para mover para a {periodConf.label}
                </span>
              </div>

              {/* Empty state for period */}
              {totalInPeriod === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-[#E8E3D9] bg-[#FAF8F4] p-6 text-center text-xs text-[#8A8A84] space-y-1">
                  <p className="font-semibold text-[#1E1E1C]">
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
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2E5E4E]">
                      <ShieldCheck className="size-4 text-[#2E5E4E]" />
                      <span>Orientações Aprovadas pelo Dr. Guilherme</span>
                    </div>

                    {periodMedicalActions.map((item) => {
                      const isDelayed = !item.completed && item.timingStatus === 'atrasado'
                      return (
                        <article
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          className={`rounded-2xl border p-4 sm:p-4.5 transition-all shadow-subtle cursor-grab active:cursor-grabbing ${
                            item.completed
                              ? 'border-[#C3D6CC] bg-[#E7EFEA]'
                              : isDelayed
                                ? 'border-[#EAD7BA] bg-[#F7EFDF]'
                                : 'border-[#E8E3D9] bg-[#FAF8F4] hover:border-[#2E5E4E]/40'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <button
                              type="button"
                              onClick={() => toggleCarePlan(item.id)}
                              className={`grid size-9 shrink-0 place-items-center rounded-2xl border transition-all cursor-pointer ${
                                item.completed
                                  ? 'border-[#2E5E4E] bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                                  : 'border-[#E8E3D9] bg-[#FFFFFF] text-transparent hover:border-[#2E5E4E]'
                              }`}
                              aria-label={`Marcar ${item.action} como ${item.completed ? 'pendente' : 'concluída'}`}
                            >
                              <Check className="size-5 stroke-[3]" />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#2E5E4E]">
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
                                  item.completed ? 'text-[#8A8A84] line-through' : 'text-[#1E1E1C]'
                                }`}
                              >
                                {item.action}
                              </h4>

                              {item.doctorRationale && (
                                <p className="mt-1.5 text-xs text-[#5C5C57] leading-relaxed">
                                  <strong>Por que fazer:</strong> {item.doctorRationale}
                                </p>
                              )}

                              {/* Mobile-First Reorder Controls */}
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFECE5] pt-2.5">
                                <div className="text-[11px] text-[#8A8A84]">
                                  Frequência:{' '}
                                  <strong className="text-[#1E1E1C]">
                                    {item.frequency || 'Diário'}
                                  </strong>
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-[#8A8A84] hidden sm:inline mr-1">
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
                                        className={`min-h-[30px] rounded-lg px-2 text-[10px] font-bold transition-all cursor-pointer ${
                                          isCurrent
                                            ? 'bg-[#2E5E4E] text-[#FFFFFF] cursor-default'
                                            : 'border border-[#E8E3D9] bg-[#FFFFFF] text-[#5C5C57] hover:border-[#2E5E4E] hover:text-[#2E5E4E]'
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
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E7A3D]">
                      <Sparkles className="size-4 text-[#C49A5B]" />
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
                      className="rounded-2xl border border-[#C49A5B]/30 bg-[#FBF5EB] p-4 space-y-2 shadow-subtle cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#9E7A3D]">{item.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#FFFFFF] text-[#9E7A3D] border border-[#EAD7BA] px-2 py-0.5">
                          Rascunho para Consulta
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#1E1E1C]">
                        💡 {item.action}
                      </h4>

                      {item.aiDraftNote && (
                        <p className="text-xs text-[#5C5C57] leading-relaxed italic">
                          “{item.aiDraftNote}”
                        </p>
                      )}

                      {/* Move buttons for AI action */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EAD7BA] pt-2 text-[11px] text-[#5C5C57]">
                        <span className="font-semibold text-[#9E7A3D]">
                          Requer validação médica
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#8A8A84] hidden sm:inline mr-1">
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
                                className={`min-h-[28px] rounded-lg px-2 text-[10px] font-bold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#2E5E4E] text-[#FFFFFF] cursor-default'
                                    : 'border border-[#E8E3D9] bg-[#FFFFFF] text-[#5C5C57] hover:border-[#2E5E4E] hover:text-[#2E5E4E]'
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
      <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE5] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Acompanhamento Pós-Consulta (14 Dias)
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
              {returnJourney?.title || 'Plano de Retorno e Adaptação'}
            </h3>
          </div>
          <StatusBadge tone="green">
            {completedCheckins} de {totalCheckins} Check-ins Realizados
          </StatusBadge>
        </div>

        <p className="text-xs text-[#5C5C57] leading-relaxed">
          {returnJourney?.summary ||
            'Check-ins periódicos para acompanhar o impacto do jantar antecipado nos despertares noturnos.'}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scheduledCheckins.map((chk) => (
            <div
              key={chk.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between ${
                chk.status === 'concluido'
                  ? 'border-[#C3D6CC] bg-[#E7EFEA]'
                  : 'border-[#E8E3D9] bg-[#FAF8F4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <strong className="text-[#2E5E4E]">Dia {chk.dayOffset}</strong>
                  <StatusBadge tone={chk.status === 'concluido' ? 'green' : 'amber'}>
                    {chk.status === 'concluido' ? 'Concluído' : 'Pendente'}
                  </StatusBadge>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1E1E1C] leading-snug">
                  {chk.title}
                </h4>
                <p className="text-[11px] text-[#5C5C57] mt-1">{chk.scheduledDate}</p>
                {chk.value && (
                  <p className="mt-2 text-[11px] font-bold text-[#2E5E4E] rounded-lg bg-[#FFFFFF] border border-[#C3D6CC] px-2 py-1">
                    Registro: {chk.value}
                  </p>
                )}
              </div>

              {chk.status !== 'concluido' ? (
                <button
                  type="button"
                  onClick={() => completeScheduledCheckin(chk.id, 'Realizado', 'Check-in pontual')}
                  className="mt-3 min-h-[40px] w-full rounded-xl bg-[#2E5E4E] py-2 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-colors cursor-pointer"
                >
                  Registrar Agora
                </button>
              ) : (
                <div className="mt-3 pt-2 border-t border-[#C3D6CC]/60 text-[10px] text-[#2F7D5B] font-bold flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-elevation space-y-4 animate-fade-in-up text-[#1E1E1C]">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]">
                  <Target className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                  Como a adesão ao plano funciona?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdherenceExplainModal(false)}
                className="text-[#8A8A84] hover:text-[#1E1E1C] cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5C5C57] leading-relaxed">
              <p>
                A <strong className="text-[#1E1E1C]">adesão</strong> na V I N V A N S E é uma
                métrica de consistência de hábitos,{' '}
                <strong className="text-[#1E1E1C]">não uma nota ou cobrança</strong>.
              </p>
              <div className="rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] p-3.5 space-y-2 text-[#1E1E1C]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#2E5E4E]">
                  Como é calculada no protótipo:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-[#5C5C57]">
                  <li>
                    <strong className="text-[#1E1E1C]">Ações do dia:</strong> Percentual de
                    orientações médicas marcadas como feitas (atualmente {percentMedical}%).
                  </li>
                  <li>
                    <strong className="text-[#1E1E1C]">Check-ins de retorno:</strong> Registros
                    regulares acordados na consulta ({completedCheckins} de {totalCheckins}).
                  </li>
                  <li>
                    <strong className="text-[#1E1E1C]">Diário sem julgamento:</strong> Envio de
                    fotos e avaliações de saciedade para contextualizar a evolução.
                  </li>
                </ul>
              </div>
              <p>
                <strong className="text-[#1E1E1C]">Por que importa:</strong> O Dr. Guilherme utiliza
                a adesão para entender se o plano cabe na sua rotina real ou se precisa ser
                ajustado. Nada é feito de forma punitiva.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAdherenceExplainModal(false)}
                className="min-h-[44px] rounded-xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] cursor-pointer"
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
