import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer, UrgentCareWarning } from '@/components/CommonUI'
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Heart,
  Moon,
  Footprints,
  MessageSquare,
  Smile,
  ChevronRight,
  Watch,
  Target,
  Check,
  AlertCircle,
  HelpCircle,
  X,
  Plus,
  FileText,
} from 'lucide-react'

export default function PatientToday() {
  const {
    carePlans = [],
    toggleCarePlan,
    preConsultation,
    returnJourney,
    scheduledCheckins = [],
    completeScheduledCheckin,
    notify,
  } = useVivans()
  const navigate = useNavigate()

  const [checkinOpen, setCheckinOpen] = useState(false)
  const [activeCheckinItem, setActiveCheckinItem] = useState<(typeof scheduledCheckins)[0] | null>(
    null,
  )
  const [checkinWeight, setCheckinWeight] = useState('78.2')
  const [checkinMood, setCheckinMood] = useState<'bem' | 'moderado' | 'cansada'>('bem')
  const [checkinNote, setCheckinNote] = useState('')
  const [watchConnected, setWatchConnected] = useState(false)
  const [showAdherenceExplain, setShowAdherenceExplain] = useState(false)

  // Medical actions stats
  const medicalPlans = carePlans.filter((p) => p.type === 'medical')
  const completedPlansCount = medicalPlans.filter((p) => p.completed).length
  const totalPlansCount = medicalPlans.length
  const planProgressPct =
    totalPlansCount > 0 ? Math.round((completedPlansCount / totalPlansCount) * 100) : 0

  // Single primary recommended action of the day
  const primaryAction =
    medicalPlans.find((p) => p.isPrimaryToday && !p.completed) ||
    medicalPlans.find((p) => !p.completed) ||
    null

  // Scheduled check-ins stats
  const completedCheckinsCount = scheduledCheckins.filter((c) => c.status === 'concluido').length
  const totalScheduledCheckins = scheduledCheckins.length
  const nextPendingCheckin = scheduledCheckins.find((c) => c.status !== 'concluido')

  // Overall weekly adherence text calculation: "Você está em dia com 4 de 5 ações desta semana"
  const weeklyTotalActions = 5
  const weeklyCompletedActions = completedPlansCount >= 1 ? 4 : 3

  const handleOpenCheckinModal = (chk?: (typeof scheduledCheckins)[0]) => {
    setActiveCheckinItem(chk || nextPendingCheckin || scheduledCheckins[0])
    setCheckinOpen(true)
  }

  const handleCompleteCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeCheckinItem) {
      const val =
        activeCheckinItem.type === 'peso'
          ? `${checkinWeight} kg`
          : activeCheckinItem.type === 'humor'
            ? `Disposição: ${checkinMood === 'bem' ? 'Disposta' : checkinMood === 'moderado' ? 'Moderada' : 'Cansada'}`
            : 'Concluído'
      completeScheduledCheckin(activeCheckinItem.id, val, checkinNote || undefined)
    }
    setCheckinOpen(false)
    setCheckinNote('')
    notify('Check-in registrado com sucesso. Bom progresso, Marina!')
  }

  return (
    <div className="space-y-6">
      {/* Simulation Notice */}
      <SimulationDisclaimer text="Protótipo Demonstrativo · Instituto Vivans" />

      {/* Greeting & Header with Clear Objective */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b7b68] px-3 py-1 text-xs font-bold text-white shadow-xs">
              <Target className="size-3.5" />
              <span>Dia 29 de 90 · Plano em andamento</span>
            </span>
            <StatusBadge tone="gray">Dr. Guilherme Martins</StatusBadge>
          </div>

          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#17372f] sm:text-4xl">
            Bom dia, Marina
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5a736a] max-w-xl">
            Aqui está o seu foco de hoje. Passos simples e sustentáveis, sem sobrecarga ou rigidez.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {nextPendingCheckin ? (
            <button
              type="button"
              onClick={() => handleOpenCheckinModal(nextPendingCheckin)}
              className="min-h-12 w-full sm:w-auto cursor-pointer rounded-2xl bg-[#0b7b68] px-5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_rgba(11,123,104,0.22)] transition-all hover:bg-[#086555] active:scale-95 flex items-center justify-center gap-2"
            >
              <Activity className="size-4" />
              <span>Fazer Check-in (Dia {nextPendingCheckin.dayOffset})</span>
            </button>
          ) : (
            <div className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#ebf6f2] border border-[#bfe4d8] px-4 text-xs font-bold text-[#075f50]">
              <CheckCircle2 className="size-4 text-[#0b7b68]" />
              <span>Check-ins de hoje em dia</span>
            </div>
          )}
        </div>
      </section>

      {/* 1. ADESÃO DA SEMANA: Contextualizada, Legível por Texto e Clara */}
      <article className="rounded-3xl border border-[#bfe4d8] bg-gradient-to-br from-[#ebf6f2] via-[#f8faf9] to-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d8ebe3] pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0b7b68] animate-pulse" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#17372f]">
              Sua Adesão Esta Semana (82%)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAdherenceExplain(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#0b7b68] hover:underline underline-offset-4"
          >
            <HelpCircle className="size-3.5" />
            <span>O que significa adesão?</span>
          </button>
        </div>

        {/* Text-First Accessible Summary */}
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-center">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-[#17372f]">
              Você está em dia com{' '}
              <strong className="text-[#0b7b68] font-bold">
                {weeklyCompletedActions} de {weeklyTotalActions} ações
              </strong>{' '}
              desta semana.
            </p>
            <p className="text-xs text-[#526b63] leading-relaxed">
              Falta realizar o ajuste do horário do jantar e o registro de foto no diário. Não se
              preocupe: a adesão é para guiar o médico sobre a sua rotina real, não para gerar
              cobrança.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#dfe8e3] shrink-0">
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0b7b68] leading-none">82%</p>
              <span className="text-[10px] text-[#698078] font-medium">+6% vs. início</span>
            </div>
            <div className="size-10 rounded-xl bg-[#edf7f4] grid place-items-center text-[#0b7b68]">
              <Activity className="size-5" />
            </div>
          </div>
        </div>

        {/* Visual Progress Bar with Text Labels */}
        <div className="space-y-1">
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#e1eae5]">
            <div
              className="h-full rounded-full bg-[#0b7b68] transition-all duration-500"
              style={{ width: '82%' }}
              role="progressbar"
              aria-valuenow={82}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Adesão ao plano 82%"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#698078]">
            <span>Consistência em construção</span>
            <span className="font-bold text-[#0b7b68]">Nível Excelente</span>
          </div>
        </div>
      </article>

      {/* 2. UMA ÚNICA AÇÃO PRINCIPAL DE HOJE (Hero Card com Conclusão em 1 Toque) */}
      {primaryAction ? (
        <article className="overflow-hidden rounded-3xl bg-[#17372f] text-white shadow-[0_16px_40px_rgba(23,55,47,0.16)] flex flex-col justify-between">
          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#9fe0ce]">
                  <Sparkles className="size-3.5" />
                  <span>Ação Prioritária de Hoje (O que preciso fazer agora)</span>
                </span>
                <h3 className="mt-2.5 font-serif text-2xl font-bold sm:text-3xl text-white leading-tight">
                  {primaryAction.action}
                </h3>
              </div>
              <span className="rounded-full bg-[#0b7b68] px-3 py-1 text-xs font-bold text-white shadow-xs">
                {primaryAction.period === 'noite' ? 'Noite · até 19:30' : 'Hoje'}
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-[#d6e8e2] leading-relaxed max-w-xl">
              {primaryAction.doctorRationale ||
                'Orientação validada pelo Dr. Guilherme Martins para melhorar o repouso e saciedade sem restrições extremas.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => toggleCarePlan(primaryAction.id)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-xs sm:text-sm font-bold text-[#17372f] hover:bg-[#eaf4f1] transition-all shadow-md active:scale-95 cursor-pointer"
                title="Concluir esta ação em 1 toque"
              >
                <Check className="size-4 text-[#0b7b68] stroke-[3]" />
                <span>Marcar como feita em 1 toque</span>
              </button>

              <Link
                to="/paciente/diario"
                className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-4 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                <span>Abrir Diário</span>
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 text-center bg-black/10">
            <div className="p-3.5 border-r border-white/10">
              <p className="text-xl font-bold text-white">29</p>
              <p className="text-[10px] text-[#b8d3cb]">Dias de cuidado</p>
            </div>
            <div className="p-3.5 border-r border-white/10">
              <p className="text-xl font-bold text-[#9fe0ce]">{planProgressPct}%</p>
              <p className="text-[10px] text-[#b8d3cb]">Plano hoje</p>
            </div>
            <div className="p-3.5">
              <p className="text-xl font-bold text-white">−1,8 kg</p>
              <p className="text-[10px] text-[#b8d3cb]">Evolução total</p>
            </div>
          </div>
        </article>
      ) : (
        /* ESTADO DE TUDO CONCLUÍDO */
        <article className="rounded-3xl border border-[#bfe4d8] bg-[#ebf6f2] p-6 sm:p-7 shadow-sm text-center space-y-3">
          <div className="grid size-14 place-items-center rounded-full bg-[#0b7b68] text-white mx-auto shadow-md">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#17372f]">Tudo concluído por hoje!</h3>
          <p className="text-xs sm:text-sm text-[#45655c] max-w-md mx-auto leading-relaxed">
            Parabéns pela consistência, Marina. Todas as ações prescritas para hoje foram marcadas.
            O Dr. Guilherme já consegue visualizar o seu progresso no prontuário.
          </p>
          <div className="pt-2">
            <Link
              to="/paciente/plano"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555] transition-colors"
            >
              Ver visão completa do plano
            </Link>
          </div>
        </article>
      )}

      {/* NOVO: CARD DE DESTAQUE "RECEITAS & EXAMES" (Acesso Rápido) */}
      <article className="overflow-hidden rounded-3xl border border-[#bfe4d8] bg-gradient-to-r from-[#eaf3ef] via-white to-[#f4faf7] p-5 sm:p-6 shadow-sm hover:border-[#0b7b68]/40 transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#0b7b68] text-white shadow-xs shrink-0">
              <FileText className="size-6 text-[#9fe0ce]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Prescrições &amp; Laudos
                </span>
                <StatusBadge tone="green">1 Receita Ativa</StatusBadge>
                <span className="text-[11px] text-[#556d66]">· 3 Exames com Laudo</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17372f]">
                Receita Ativa: Suporte Metabólico &amp; Sono
              </h3>
              <p className="text-xs sm:text-sm text-[#45655c]">
                Magnésio Bisglicinato + Inositol e Coenzima Q10. Consulte posologias, exames
                recentes e procedimentos sugeridos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/paciente/receitas-exames"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] transition-all shadow-sm active:scale-98"
            >
              <span>Acessar Receitas &amp; Exames</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>

      {/* Pre-consultation Highlight Card */}
      <article className="overflow-hidden rounded-3xl border border-[#9fc9bd] bg-white shadow-[0_12px_34px_rgba(28,55,47,0.06)]">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#17372f] text-xs font-bold uppercase tracking-wider text-white shadow-md shrink-0">
            <Sparkles className="size-6 text-[#9fe0ce]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Pré-consulta Instituto Vivans
              </span>
              <StatusBadge tone={preConsultation?.completed ? 'green' : 'amber'}>
                {preConsultation?.completed ? 'Resumo enviado ao médico' : 'Pendente · 4 min'}
              </StatusBadge>
            </div>
            <h2 className="mt-2 font-serif text-lg sm:text-xl font-bold text-[#17372f]">
              {preConsultation?.completed
                ? 'Seu objetivo e relato já estão no preparo do Dr. Guilherme'
                : 'Conte por voz ou texto suas dúvidas e evolução recente'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#60766f]">
              O copiloto organiza seu relato para que a consulta foque direto nas suas prioridades
              de sono e rotina.
            </p>
          </div>
          <Link
            to="/paciente/pre-consulta"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#0b7b68] px-5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#096656] shadow-sm shrink-0"
          >
            <span>
              {preConsultation?.completed ? 'Ver resumo enviado' : 'Iniciar pré-consulta'}
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="border-t border-[#e2ece8] bg-[#f7faf8] px-5 py-2.5 text-xs text-[#698078] sm:px-6 flex items-center justify-between">
          <span>Áudio descartado após transcrição · Governança LGPD · Validação prévia</span>
          <span className="hidden sm:inline font-bold text-[#0b7b68]">Ambiente Seguro</span>
        </div>
      </article>

      {/* Main Grid: Consulta & Quick Care List & Health Signals */}
      <section className="grid gap-5 md:grid-cols-3">
        {/* Próxima Consulta */}
        <article className="flex flex-col justify-between rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-6 shadow-sm">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Próxima Consulta
                </p>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#17372f]">
                  Hoje, 10:30
                </h3>
              </div>
              <StatusBadge tone="green">Confirmada</StatusBadge>
            </div>
            <p className="mt-2.5 text-xs text-[#60766f] leading-relaxed">
              Dr. Guilherme Martins · Retorno de 30 min por vídeo.
            </p>

            <div className="mt-4 rounded-2xl bg-[#f4f7f5] p-3 text-xs space-y-1 text-[#45655c]">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-[#0b7b68]" />
                <span>Horário de Brasília (Telemedicina Vivans)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#0b7b68]" />
                <span>Pré-consulta vinculada ao prontuário</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Link
              to="/medico/consulta/apt-marina"
              className="flex-1 min-h-11 flex items-center justify-center rounded-xl bg-[#0b7b68] text-xs font-bold text-white hover:bg-[#096656] transition-colors"
            >
              Entrar na Sala Virtual
            </Link>
            <Link
              to="/paciente/consultas"
              className="min-h-11 px-3.5 flex items-center justify-center rounded-xl border border-[#dfe8e3] text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5] transition-colors"
            >
              Agenda
            </Link>
          </div>
        </article>

        {/* Lista Rápida de Ações do Plano com Checkbox em 1 toque */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Ações do Plano ({completedPlansCount}/{totalPlansCount})
                </p>
                <h4 className="font-serif text-base font-bold text-[#17372f]">
                  Orientações de Hoje
                </h4>
              </div>
              <span className="text-lg font-bold text-[#0b7b68]">{planProgressPct}%</span>
            </div>

            <div className="space-y-2 mb-3">
              {medicalPlans.slice(0, 3).map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => toggleCarePlan(plan.id)}
                  className="w-full flex items-center gap-2.5 rounded-xl border border-[#edf2ef] p-2.5 text-left text-xs transition-colors hover:bg-[#f8faf9] cursor-pointer"
                >
                  <div
                    className={`size-6 rounded-lg border grid place-items-center shrink-0 transition-colors ${
                      plan.completed
                        ? 'border-[#0b7b68] bg-[#0b7b68] text-white shadow-2xs'
                        : 'border-[#b7c7c1] bg-white text-transparent'
                    }`}
                  >
                    <Check className="size-4 stroke-[3]" />
                  </div>
                  <span
                    className={`line-clamp-1 font-medium ${
                      plan.completed ? 'text-[#698078] line-through' : 'text-[#17372f]'
                    }`}
                  >
                    {plan.action}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/paciente/plano"
            className="text-xs font-bold text-[#0b6a5b] hover:underline underline-offset-4 block text-center pt-2"
          >
            Ver todas as orientações &rarr;
          </Link>
        </article>

        {/* Sinais e Smartwatch */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Sinais do Relógio
              </p>
              <StatusBadge tone={watchConnected ? 'green' : 'gray'}>
                {watchConnected ? 'Sincronizado' : 'Demonstração'}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#698078] mb-1">
                  <Moon className="size-3.5 text-[#5e77d9]" />
                  <span>Sono médio</span>
                </div>
                <p className="text-lg font-bold text-[#17372f]">5h42</p>
                <span className="text-[10px] text-[#c96a3b] font-medium">
                  Atenção (3h despertares)
                </span>
              </div>
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#698078] mb-1">
                  <Footprints className="size-3.5 text-[#0b7b68]" />
                  <span>Passos</span>
                </div>
                <p className="text-lg font-bold text-[#17372f]">6.420</p>
                <span className="text-[10px] text-[#0b7b68] font-medium">Meta 6.000 OK</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWatchConnected(true)
              notify('Sincronização de biossinais simulada com sucesso.')
            }}
            className="w-full text-center text-xs font-bold text-[#0b6a5b] hover:underline underline-offset-4 cursor-pointer pt-2"
          >
            {watchConnected ? 'Sinais atualizados agora' : 'Sincronizar Smartwatch (Demo)'}
          </button>
        </article>
      </section>

      {/* ADHERENCE EXPLANATION MODAL */}
      {showAdherenceExplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#e8f4f0] text-[#0b7b68]">
                  <Activity className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  O que é adesão ao plano?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdherenceExplain(false)}
                className="text-[#60766f] hover:text-[#17372f]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#45655c] leading-relaxed">
              <p>
                A <strong>adesão</strong> (atualmente em <strong>82%</strong>) mede a sua
                regularidade nos hábitos acordados em consulta.
              </p>
              <div className="rounded-2xl bg-[#f4f7f5] p-3.5 space-y-1.5 text-[#17372f]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#0b7b68]">
                  Como calculamos:
                </p>
                <p className="text-xs text-[#45655c]">
                  Contabilizamos se as orientações médicas e os check-ins programados foram
                  realizados ao longo da semana.
                </p>
              </div>
              <p>
                <strong>Importante:</strong> Não prometemos perda de peso rápida nem tratamos adesão
                como teste. O objetivo é dar ao Dr. Guilherme visibilidade real para ajustar
                condutas de forma acolhedora.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAdherenceExplain(false)}
                className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Check-in Modal */}
      {checkinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCompleteCheckin}
            className="w-full max-w-md rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div>
                <span className="text-xs font-bold text-[#0b7b68] uppercase tracking-wider">
                  {activeCheckinItem ? `Dia ${activeCheckinItem.dayOffset} do Retorno` : 'Check-in'}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  {activeCheckinItem?.title || 'Check-in de Acompanhamento'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckinOpen(false)}
                className="text-[#60766f] hover:bg-[#f4f7f5] rounded-full p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {activeCheckinItem?.type === 'peso' && (
                <div>
                  <label className="block text-xs font-bold text-[#17372f] mb-1">
                    Peso aferido pela manhã em jejum (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkinWeight}
                    onChange={(e) => setCheckinWeight(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-[#dfe8e3] px-3.5 py-2 text-sm font-bold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-[11px] text-[#698078]">
                    Último registro compilado: 78,2 kg (−1,8 kg acumulado)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#17372f] mb-2">
                  Percepção de disposição e sono:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bem', label: 'Disposta', icon: '⚡' },
                    { id: 'moderado', label: 'Moderada', icon: '🌤️' },
                    { id: 'cansada', label: 'Cansada', icon: '😴' },
                  ].map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setCheckinMood(mood.id as any)}
                      className={`min-h-12 rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                        checkinMood === mood.id
                          ? 'border-[#0b7b68] bg-[#edf7f4] text-[#0b7b68] ring-2 ring-[#0b7b68]/20'
                          : 'border-[#dfe8e3] text-[#60766f] hover:bg-[#f8faf9]'
                      }`}
                    >
                      <div className="text-lg">{mood.icon}</div>
                      <div>{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17372f] mb-1">
                  Notas para o Dr. Guilherme (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jantar antecipado para 19h30 correu bem..."
                  value={checkinNote}
                  onChange={(e) => setCheckinNote(e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-[#dfe8e3] px-3 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckinOpen(false)}
                className="w-1/2 min-h-11 rounded-xl border border-[#dfe8e3] text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 min-h-11 rounded-xl bg-[#0b7b68] text-xs font-bold text-white shadow-md hover:bg-[#096656]"
              >
                Salvar Check-in
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Urgent Care Notice */}
      <UrgentCareWarning />
    </div>
  )
}
