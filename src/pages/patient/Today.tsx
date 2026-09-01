import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, UrgentCareWarning } from '@/components/CommonUI'
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
  Check,
  ChevronRight,
  Pill,
  Video,
} from 'lucide-react'

export default function PatientToday() {
  const {
    carePlans = [],
    toggleCarePlan,
    selectedPatient,
    scheduledCheckins = [],
    preConsultation,
    prescriptions = [],
    medications = [],
  } = useVivans()

  const [filter, setFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos')

  // Marina's active prescriptions & continuous meds
  const marinaPrescriptions = prescriptions.filter((p) => p.patientId === 'marina-costa')
  const marinaMedications = medications.filter((m) => m.patientId === 'marina-costa')

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

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 text-[#1E1E1C] shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EFEA] px-3 py-1 text-xs font-bold text-[#2E5E4E]">
                <Sparkles className="size-3.5 text-[#2E5E4E]" />
                <span>Hoje · Dia 29 de 90</span>
              </span>
              <StatusBadge tone="green">Plano Ativo</StatusBadge>
              <span className="text-xs text-[#5C5C57]">Ciclo 1 · Longevidade Metabólica</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1E1E1C] leading-tight">
              Olá, Marina. Que bom ter você aqui.
            </h1>

            <p className="text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
              Seu foco clínico hoje está no jantar antecipado às 19h30 e no aporte de magnésio para
              otimizar seu descanso. Você completou{' '}
              <strong className="text-[#2E5E4E]">
                {completedCount} de {totalCount}
              </strong>{' '}
              ações programadas ({adherencePercentage}% do dia).
            </p>

            {/* Quick Metrics Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] px-3.5 py-2">
                <TrendingDown className="size-4 text-[#2E5E4E]" />
                <span className="text-xs font-bold text-[#1E1E1C]">78,2 kg</span>
                <span className="text-[10px] text-[#2F7D5B] font-semibold">(−1,8 kg)</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] px-3.5 py-2">
                <Moon className="size-4 text-[#C49A5B]" />
                <span className="text-xs font-bold text-[#1E1E1C]">5h42</span>
                <span className="text-[10px] text-[#B7832F] font-semibold">(despertar 3h)</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] px-3.5 py-2">
                <Footprints className="size-4 text-[#2E5E4E]" />
                <span className="text-xs font-bold text-[#1E1E1C]">6.420 passos</span>
                <span className="text-[10px] text-[#2F7D5B] font-semibold">Meta batida</span>
              </div>
            </div>
          </div>

          {/* Doctor Connection Badge */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 lg:self-stretch lg:justify-center shadow-subtle">
            <VivansAvatar
              src={DOCTOR_PROFILE.photoUrl || DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#2E5E4E]/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#2E5E4E] animate-pulse" />
                <p className="text-xs font-bold text-[#1E1E1C]">{DOCTOR_PROFILE.name}</p>
              </div>
              <p className="text-[11px] font-mono text-[#2E5E4E] font-semibold">
                {DOCTOR_PROFILE.crm}
              </p>
              <p className="text-[10px] text-[#5C5C57] mt-0.5">
                Próx. retorno: <strong className="text-[#1E1E1C]">Hoje, 10:30</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Banner to Prescriptions & Continuous Meds */}
      <section className="rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] shrink-0">
            <Pill className="size-5 text-[#2E5E4E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1E1E1C]">
                Receitas e Medicamentos Ativos no seu Prontuário
              </span>
              <span className="rounded-full bg-[#E7EFEA] px-2 py-0.5 text-[10px] font-bold text-[#2E5E4E] border border-[#C3D6CC]">
                {marinaMedications.length} em uso
              </span>
            </div>
            <p className="text-[11px] text-[#5C5C57] mt-0.5">
              Magnésio Bisglicinato 350mg, Coenzima Q10 100mg e laudos de exames laboratoriais.
            </p>
          </div>
        </div>

        <Link
          to="/paciente/receitas-exames"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm shrink-0"
        >
          <span>Acessar Receitas &amp; Exames</span>
          <ChevronRight className="size-4" />
        </Link>
      </section>

      {/* HIGHLIGHT: PRÓXIMA AÇÃO RECOMENDADA DO DIA */}
      {primaryAction && (
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
                  {primaryAction.period === 'noite'
                    ? '🌙 Noite'
                    : primaryAction.period === 'tarde'
                      ? '🌤️ Tarde'
                      : '🌅 Manhã'}
                </span>
                <span className="text-xs text-[#5C5C57]">• {primaryAction.category}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] leading-tight">
                {primaryAction.action}
              </h2>
              <p className="text-xs text-[#5C5C57] leading-relaxed">
                {primaryAction.doctorRationale ||
                  'Orientação validada pelo Dr. Guilherme para preservar energia e otimizar o repouso.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleCarePlan(primaryAction.id)}
              className="flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl bg-[#2E5E4E] px-6 text-xs sm:text-sm font-bold text-[#FFFFFF] shadow-sm transition-all hover:bg-[#24493D] active:scale-95 cursor-pointer shrink-0"
              title="Concluir esta ação em 1 toque"
            >
              <CheckCircle2 className="size-5 text-[#FFFFFF]" />
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
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C]">
                Suas Ações de Hoje
              </h2>
              <p className="text-xs text-[#5C5C57]">
                Orientadas e aprovadas pelo Dr. Guilherme Martins
              </p>
            </div>

            {/* Period Filters */}
            <div className="flex rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-1 shadow-subtle">
              {(['todos', 'manha', 'tarde', 'noite'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilter(p)}
                  className={`min-h-[34px] rounded-xl px-3 text-xs font-bold capitalize transition-all cursor-pointer ${
                    filter === p
                      ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                      : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
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
                className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all shadow-subtle ${
                  item.completed
                    ? 'border-[#C3D6CC] bg-[#E7EFEA]'
                    : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2E5E4E]/40'
                }`}
              >
                {/* 1-touch accessible button */}
                <button
                  type="button"
                  onClick={() => toggleCarePlan(item.id)}
                  className={`grid size-9 shrink-0 place-items-center rounded-2xl border transition-all cursor-pointer ${
                    item.completed
                      ? 'border-[#2E5E4E] bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                      : 'border-[#E8E3D9] bg-[#FAF8F4] text-transparent hover:border-[#2E5E4E]'
                  }`}
                  aria-label={`Marcar ${item.action} como ${item.completed ? 'pendente' : 'concluída'}`}
                >
                  <Check className="size-5 stroke-[3]" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-[#2E5E4E]">{item.category}</span>
                    <span className="text-[10px] text-[#8A8A84] capitalize">
                      {item.period === 'manha' && '🌅 Manhã'}
                      {item.period === 'tarde' && '🌤️ Tarde'}
                      {item.period === 'noite' && '🌙 Noite'}
                    </span>
                  </div>

                  <h3
                    className={`mt-1 font-serif text-sm sm:text-base font-bold leading-snug ${
                      item.completed ? 'text-[#8A8A84] line-through' : 'text-[#1E1E1C]'
                    }`}
                  >
                    {item.action}
                  </h3>

                  {item.doctorRationale && (
                    <p className="mt-1 text-xs text-[#5C5C57] leading-relaxed">
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E5E4E] hover:underline underline-offset-4"
            >
              <span>Ver plano completo com sugestões de IA</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Consulta de Hoje & Resumo Semanal */}
        <div className="space-y-5">
          {/* Appointment Today Card */}
          <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 text-[#1E1E1C] shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[#2E5E4E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Consulta Hoje às 10:30
                </span>
              </div>
              <StatusBadge tone="green">Confirmada</StatusBadge>
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E1E1C]">
                Retorno de 30 Dias com Dr. Guilherme
              </h3>
              <p className="text-xs text-[#5C5C57] mt-1 leading-relaxed">
                Teleconsulta para avaliação dos despertares noturnos às 3h e evolução da perda de
                peso.
              </p>
            </div>

            {/* Pre-consultation pill */}
            <div className="rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2E5E4E]">Pré-consulta Guiada:</span>
                <span className="text-[10px] font-semibold text-[#2F7D5B]">
                  {preConsultation.completed ? '✓ Concluída e Vinculada' : 'Pendente de envio'}
                </span>
              </div>
              <p className="text-[#5C5C57] text-[11px]">
                {preConsultation.completed
                  ? 'O Dr. Guilherme já possui a síntese estruturada das suas dúvidas.'
                  : 'Preencha em 4 min para orientar o médico antes da chamada.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/medico/consulta/apt-marina"
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm"
              >
                <Video className="size-4" />
                <span>Entrar na Sala Virtual</span>
              </Link>

              <Link
                to="/paciente/pre-consulta"
                className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] px-3 text-xs font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-all"
              >
                <Sparkles className="size-3.5 text-[#2E5E4E]" />
                <span>
                  {preConsultation.completed ? 'Revisar Pré-Consulta' : 'Preencher Pré-Consulta'}
                </span>
              </Link>
            </div>
          </section>

          {/* Weekly Summary Card */}
          <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#2E5E4E]" />
                <h3 className="font-serif text-base font-bold text-[#1E1E1C]">
                  Resumo Semanal de Adesão
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#2E5E4E]">Semana 4 (18–25 Ago)</span>
            </div>

            <div className="rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] p-4 text-xs text-[#5C5C57] space-y-2">
              <p className="font-bold text-[#1E1E1C]">
                🎯 82% de constância nos hábitos combinados
              </p>
              <p className="text-[#5C5C57] leading-relaxed">
                Excelente adesão ao café da manhã proteico e à caminhada vespertina. O jantar às
                19h30 segue em fase de adaptação.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Ações Concluídas</p>
                <p className="text-lg font-bold text-[#2E5E4E] mt-0.5">
                  {completedCount}/{totalCount}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Tendência</p>
                <p className="text-lg font-bold text-[#1E1E1C] mt-0.5">+8% vs início</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/paciente/evolucao"
                className="text-xs font-bold text-[#2E5E4E] hover:underline underline-offset-4"
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
