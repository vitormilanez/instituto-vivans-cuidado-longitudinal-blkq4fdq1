import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight,
  TrendingDown,
  Moon,
  Footprints,
  Flame,
  Check,
  ChevronRight,
  ShieldCheck,
  Target,
  FileCheck,
  Pill,
  Clock,
  Video,
} from 'lucide-react'

export default function PatientToday() {
  const {
    carePlans = [],
    toggleCarePlan,
    selectedPatient,
    returnJourney,
    scheduledCheckins = [],
    preConsultation,
    prescriptions = [],
    medications = [],
  } = useVivans()

  const [filter, setFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos')

  // Marina's active prescriptions & continuous meds
  const marinaPrescriptions = prescriptions.filter((p) => p.patientId === 'marina-costa')
  const marinaMedications = medications.filter((m) => m.patientId === 'marina-costa')
  const activeRx = marinaPrescriptions.find((p) => p.status === 'ativa') || marinaPrescriptions[0]

  // Medical actions vs AI Suggestions
  const medicalPlans = carePlans.filter((p) => p.type === 'medical')
  const filteredPlans = medicalPlans.filter((p) => {
    if (filter === 'todos') return true
    return p.period === filter
  })

  // Calculations for today's habits
  const completedCount = medicalPlans.filter((p) => p.completed).length
  const totalCount = medicalPlans.length
  const adherencePercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Primary action of the day (highest focus recommendation)
  const primaryAction =
    carePlans.find((p) => p.type === 'medical' && p.isPrimaryToday && !p.completed) ||
    carePlans.find((p) => p.type === 'medical' && !p.completed) ||
    null

  const currentWeight = selectedPatient?.currentWeight ?? 78.2
  const startWeight = selectedPatient?.startWeight ?? 80.0
  const targetWeight = selectedPatient?.targetWeight ?? 72.0
  const remainingWeight = (currentWeight - targetWeight).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Top Disclaimer */}
      <SimulationDisclaimer text="Acompanhamento de Saúde e Longevidade · Instituto Vivans" />

      {/* Hero Header Card with Dark/Gold Translucent Aesthetic */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-[#D6B270]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3 py-1 text-xs font-bold text-[#0F0F0F] shadow-sm">
                <Sparkles className="size-3.5" />
                <span>Hoje · Dia 29 de 90</span>
              </span>
              <StatusBadge tone="green">Plano Ativo</StatusBadge>
              <span className="text-xs text-[#ADADAD]">Ciclo 1 · Longevidade Metabólica</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Olá, Marina. Que bom ter você aqui.
            </h1>

            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              Seu foco clínico hoje está no jantar antecipado às 19h30 e no aporte de magnésio para
              otimizar seu descanso. Você completou{' '}
              <strong className="text-[#D6B270]">
                {completedCount} de {totalCount}
              </strong>{' '}
              ações programadas ({adherencePercentage}% do dia).
            </p>

            {/* Quick Metrics Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2 backdrop-blur-sm">
                <TrendingDown className="size-4 text-[#D6B270]" />
                <span className="text-xs font-bold text-white">78,2 kg</span>
                <span className="text-[10px] text-[#D6B270] font-semibold">(−1,8 kg)</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2 backdrop-blur-sm">
                <Moon className="size-4 text-[#E8C391]" />
                <span className="text-xs font-bold text-white">5h42</span>
                <span className="text-[10px] text-[#F59E0B] font-semibold">(despertar 3h)</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2 backdrop-blur-sm">
                <Footprints className="size-4 text-[#D6B270]" />
                <span className="text-xs font-bold text-white">6.420 passos</span>
                <span className="text-[10px] text-[#D6B270] font-semibold">Meta batida</span>
              </div>
            </div>
          </div>

          {/* Doctor Connection Badge */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#333333] bg-[#1A1A1A]/90 p-4 lg:self-stretch lg:justify-center backdrop-blur-md shadow-inner">
            <VivansAvatar
              src={DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#D6B270]/50"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#D6B270] animate-pulse" />
                <p className="text-xs font-bold text-white">{DOCTOR_PROFILE.name}</p>
              </div>
              <p className="text-[11px] font-mono text-[#D6B270]">{DOCTOR_PROFILE.crm}</p>
              <p className="text-[10px] text-[#ADADAD] mt-0.5">
                Próx. retorno: <strong className="text-white">Hoje, 10:30</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Banner to Prescriptions & Continuous Meds */}
      <section className="rounded-2xl border border-[#D6B270]/30 bg-gradient-to-r from-[#1A1A1A] via-[#1F1D17] to-[#141414] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/40 shrink-0">
            <Pill className="size-5 text-[#E8C391]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Receitas e Medicamentos Ativos no seu Prontuário
              </span>
              <span className="rounded-full bg-[#D6B270]/20 px-2 py-0.5 text-[10px] font-bold text-[#E8C391] border border-[#D6B270]/30">
                {marinaMedications.length} em uso
              </span>
            </div>
            <p className="text-[11px] text-[#ADADAD] mt-0.5">
              Magnésio Bisglicinato 350mg, Coenzima Q10 100mg e laudos de exames laboratoriais.
            </p>
          </div>
        </div>

        <Link
          to="/paciente/receitas-exames"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-sm shrink-0"
        >
          <span>Acessar Receitas &amp; Exames</span>
          <ChevronRight className="size-4" />
        </Link>
      </section>

      {/* HIGHLIGHT: PRÓXIMA AÇÃO RECOMENDADA DO DIA */}
      {primaryAction && (
        <article className="overflow-hidden rounded-3xl border border-[#D6B270]/40 bg-[#141414] p-5 sm:p-7 text-white shadow-[0_12px_28px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#D6B270] text-[#0F0F0F] text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8C391]">
                Próxima Ação Recomendada do Dia
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#CCCCCC] border border-white/10">
              Foco Prioritário
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {primaryAction.period === 'noite'
                    ? '🌙 Noite'
                    : primaryAction.period === 'tarde'
                      ? '🌤️ Tarde'
                      : '🌅 Manhã'}
                </span>
                <span className="text-xs text-[#ADADAD]">• {primaryAction.category}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                {primaryAction.action}
              </h2>
              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                {primaryAction.doctorRationale ||
                  'Orientação validada pelo Dr. Guilherme para preservar energia e otimizar o repouso.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleCarePlan(primaryAction.id)}
              className="flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs sm:text-sm font-bold text-[#0F0F0F] shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
              title="Concluir esta ação em 1 toque"
            >
              <CheckCircle2 className="size-5 text-[#0F0F0F]" />
              <span>Concluir em 1 toque</span>
            </button>
          </div>
        </article>
      )}

      {/* Main Grid: Hoje & Resumo da Semana */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column: Ações de Cuidado do Dia */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Suas Ações de Hoje
              </h2>
              <p className="text-xs text-[#ADADAD]">
                Orientadas e aprovadas pelo Dr. Guilherme Martins
              </p>
            </div>

            {/* Period Filters */}
            <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
              {(['todos', 'manha', 'tarde', 'noite'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilter(p)}
                  className={`min-h-[34px] rounded-xl px-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                    filter === p
                      ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                      : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* List of actions */}
          <div className="space-y-3">
            {filteredPlans.map((item) => (
              <article
                key={item.id}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all backdrop-blur-md ${
                  item.completed
                    ? 'border-[#D6B270]/30 bg-[#D6B270]/10'
                    : 'border-[#333333] bg-[#1A1A1A]/80 hover:border-[#D6B270]/40'
                }`}
              >
                {/* 1-touch accessible button */}
                <button
                  type="button"
                  onClick={() => toggleCarePlan(item.id)}
                  className={`grid size-9 shrink-0 place-items-center rounded-2xl border transition-all cursor-pointer ${
                    item.completed
                      ? 'border-[#D6B270] bg-[#D6B270] text-[#0F0F0F] shadow-sm'
                      : 'border-[#444444] bg-[#0F0F0F] text-transparent hover:border-[#D6B270]'
                  }`}
                  aria-label={`Marcar ${item.action} como ${item.completed ? 'pendente' : 'concluída'}`}
                >
                  <Check className="size-5 stroke-[3]" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-[#D6B270]">{item.category}</span>
                    <span className="text-[10px] text-[#888888] capitalize">
                      {item.period === 'manha' && '🌅 Manhã'}
                      {item.period === 'tarde' && '🌤️ Tarde'}
                      {item.period === 'noite' && '🌙 Noite'}
                    </span>
                  </div>

                  <h3
                    className={`mt-1 font-serif text-sm sm:text-base font-bold leading-snug ${
                      item.completed ? 'text-[#888888] line-through' : 'text-white'
                    }`}
                  >
                    {item.action}
                  </h3>

                  {item.doctorRationale && (
                    <p className="mt-1 text-xs text-[#ADADAD] leading-relaxed">
                      {item.doctorRationale}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Direct link to full Plan */}
          <div className="flex justify-end">
            <Link
              to="/paciente/plano"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6B270] hover:underline underline-offset-4"
            >
              <span>Ver plano completo com sugestões de IA</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Consulta de Hoje & Resumo Semanal */}
        <div className="space-y-5">
          {/* Appointment Today Card */}
          <section className="rounded-3xl border border-[#D6B270]/40 bg-[#1A1A1A]/90 p-5 sm:p-6 text-white shadow-lg space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[#D6B270]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8C391]">
                  Consulta Hoje às 10:30
                </span>
              </div>
              <StatusBadge tone="green">Confirmada</StatusBadge>
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Retorno de 30 Dias com Dr. Guilherme
              </h3>
              <p className="text-xs text-[#CCCCCC] mt-1 leading-relaxed">
                Teleconsulta para avaliação dos despertares noturnos às 3h e evolução da perda de
                peso.
              </p>
            </div>

            {/* Pre-consultation pill */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E8C391]">Pré-consulta Guiada:</span>
                <span className="text-[10px] font-semibold text-white">
                  {preConsultation.completed ? '✓ Concluída e Vinculada' : 'Pendente de envio'}
                </span>
              </div>
              <p className="text-[#ADADAD] text-[11px]">
                {preConsultation.completed
                  ? 'O Dr. Guilherme já possui a síntese estruturada das suas dúvidas.'
                  : 'Preencha em 4 min para orientar o médico antes da chamada.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/medico/consulta/apt-marina"
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-sm"
              >
                <Video className="size-4" />
                <span>Entrar na Sala Virtual</span>
              </Link>

              <Link
                to="/paciente/pre-consulta"
                className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#333333] bg-white/5 px-3 text-xs font-bold text-white hover:bg-white/10 transition-all"
              >
                <Sparkles className="size-3.5 text-[#D6B270]" />
                <span>
                  {preConsultation.completed ? 'Revisar Pré-Consulta' : 'Preencher Pré-Consulta'}
                </span>
              </Link>
            </div>
          </section>

          {/* Weekly Summary Card */}
          <section className="rounded-3xl border border-[#333333] bg-[#141414] p-5 sm:p-6 shadow-sm space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#D6B270]" />
                <h3 className="font-serif text-base font-bold text-white">
                  Resumo Semanal de Adesão
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#D6B270]">Semana 4 (18–25 Ago)</span>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/5 p-4 text-xs text-[#CCCCCC] space-y-2">
              <p className="font-bold text-white">🎯 82% de constância nos hábitos combinados</p>
              <p className="text-[#ADADAD] leading-relaxed">
                Excelente adesão ao café da manhã proteico e à caminhada vespertina. O jantar às
                19h30 segue em fase de adaptação.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Ações Concluídas</p>
                <p className="text-lg font-bold text-[#D6B270] mt-0.5">
                  {completedCount}/{totalCount}
                </p>
              </div>
              <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Tendência</p>
                <p className="text-lg font-bold text-white mt-0.5">+8% vs início</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/paciente/evolucao"
                className="text-xs font-bold text-[#D6B270] hover:underline underline-offset-4"
              >
                Ver histórico de evolução &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Safety Warning */}
      <UrgentCareWarning />
    </div>
  )
}
