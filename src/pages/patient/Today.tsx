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
} from 'lucide-react'

export default function PatientToday() {
  const {
    carePlans,
    toggleCarePlan,
    preConsultation,
    returnJourney,
    scheduledCheckins,
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

  const completedPlansCount = carePlans.filter((p) => p.completed).length
  const totalPlansCount = carePlans.length
  const planProgressPct =
    totalPlansCount > 0 ? Math.round((completedPlansCount / totalPlansCount) * 100) : 0

  const completedCheckinsCount = scheduledCheckins.filter((c) => c.status === 'concluido').length
  const totalScheduledCheckins = scheduledCheckins.length
  const nextPendingCheckin = scheduledCheckins.find((c) => c.status !== 'concluido')

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
      <SimulationDisclaimer text="Ambiente do Paciente (Marina Costa) · Demonstração de Cuidado Longitudinal Instituto Vivans" />

      {/* Greeting & Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="green">Plano em andamento · Dia 29 de 90</StatusBadge>
            <StatusBadge tone="gray">Dr. Guilherme Martins</StatusBadge>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#17372f] sm:text-4xl">
            Bom dia, Marina
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Hoje temos o essencial para o seu dia. Um pequeno passo sustentável de cada vez.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => handleOpenCheckinModal()}
            className="min-h-12 w-full sm:w-auto cursor-pointer rounded-2xl bg-[#0b7b68] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(11,123,104,0.22)] transition-all hover:bg-[#086555] active:scale-95 flex items-center justify-center gap-2"
          >
            <Activity className="size-4" />
            <span>
              {nextPendingCheckin
                ? `Fazer Próximo Check-in (${nextPendingCheckin.dayOffset}º dia)`
                : 'Todos os Check-ins em Dia'}
            </span>
          </button>
        </div>
      </section>

      {/* Pre-consultation Highlight Card */}
      <article className="overflow-hidden rounded-3xl border border-[#9fc9bd] bg-white shadow-[0_12px_34px_rgba(28,55,47,0.06)]">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#17372f] text-xs font-bold uppercase tracking-wider text-white shadow-md">
            <Sparkles className="size-6 text-[#9fe0ce]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Pré-consulta Instituto Vivans
              </span>
              <StatusBadge tone={preConsultation.completed ? 'green' : 'amber'}>
                {preConsultation.completed ? 'Resumo enviado ao médico' : 'Pendente · 5 min'}
              </StatusBadge>
            </div>
            <h2 className="mt-2 font-serif text-xl font-bold text-[#17372f]">
              {preConsultation.completed
                ? 'Seu objetivo e relato já estão no preparo do Dr. Guilherme'
                : 'Conte por voz ou texto suas dúvidas e evolução'}
            </h2>
            <p className="mt-1 text-sm text-[#60766f]">
              A assistente organiza o seu relato para que o médico foque no que realmente importa na
              consulta.
            </p>
          </div>
          <Link
            to="/paciente/pre-consulta"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#0b7b68] px-5 text-sm font-bold text-white transition-all hover:bg-[#096656] shadow-sm"
          >
            <span>{preConsultation.completed ? 'Ver resumo enviado' : 'Iniciar pré-consulta'}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="border-t border-[#e2ece8] bg-[#f7faf8] px-5 py-3 text-xs text-[#698078] sm:px-6 flex items-center justify-between">
          <span>
            Áudio descartado após transcrição · Consentimento informado · Revisão antes de enviar
          </span>
          <span className="hidden sm:inline font-bold text-[#0b7b68]">
            LGPD Compliant (Simulado)
          </span>
        </div>
      </article>

      {/* Retorno Pós-Consulta: Jornada com Plano Ativado e Check-ins Programados */}
      <article className="rounded-3xl border border-[#bfe4d8] bg-gradient-to-br from-[#ebf6f2] to-[#ffffff] p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8ebe3] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#0b7b68] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Jornada de Retorno Pós-Consulta · Plano Ativo
              </span>
              <StatusBadge tone="green">Aprovado pelo Dr. Guilherme</StatusBadge>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17372f]">
              {returnJourney.title}
            </h2>
            <p className="text-xs text-[#556d66] leading-relaxed max-w-2xl">
              {returnJourney.summary}
            </p>
          </div>

          <div className="flex flex-col items-end text-xs">
            <span className="font-bold text-[#17372f]">
              {completedCheckinsCount} de {totalScheduledCheckins} check-ins concluídos
            </span>
            <span className="text-[11px] text-[#60766f]">
              Próxima revisão: {returnJourney.nextReviewDate}
            </span>
          </div>
        </div>

        {/* Timeline of Scheduled Check-ins */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-[#17372f] uppercase tracking-wider">
            Linha de Check-ins Programados:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scheduledCheckins.map((chk) => {
              const isDone = chk.status === 'concluido'
              return (
                <div
                  key={chk.id}
                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                    isDone
                      ? 'border-[#bfe4d8] bg-white'
                      : 'border-[#dfe8e3] bg-white hover:border-[#0b7b68]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#0b7b68]">Dia {chk.dayOffset}</span>
                      <StatusBadge tone={isDone ? 'green' : 'amber'}>
                        {isDone ? 'Concluído' : 'Agendado'}
                      </StatusBadge>
                    </div>
                    <h4 className="font-serif text-xs font-bold text-[#17372f] leading-snug">
                      {chk.title}
                    </h4>
                    <p className="text-[11px] text-[#60766f] mt-1">{chk.scheduledDate}</p>
                    {chk.value && (
                      <div className="mt-2 rounded-lg bg-[#edf7f4] px-2.5 py-1 text-[11px] font-bold text-[#0b6a5b]">
                        Registro: {chk.value}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#edf2ef]">
                    {isDone ? (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0b7b68]">
                        <CheckCircle2 className="size-3.5" />
                        <span>Realizado ({chk.completedAt})</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenCheckinModal(chk)}
                        className="w-full rounded-xl bg-[#0b7b68] py-1.5 text-xs font-bold text-white hover:bg-[#086555] transition-colors"
                      >
                        Concluir este check-in
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </article>

      {/* Main Grid: Next Step & Appointment */}
      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Next step hero card */}
        <article className="overflow-hidden rounded-3xl bg-[#17372f] text-white shadow-[0_16px_40px_rgba(23,55,47,0.16)] flex flex-col justify-between">
          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9cc7ba]">
                  Próxima Ação no Plano
                </p>
                <h3 className="mt-2 font-serif text-2xl font-bold sm:text-3xl text-white">
                  Registrar foto do jantar
                </h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#d6e8e2]">
                Até 21:00
              </span>
            </div>
            <p className="mt-3 text-sm text-[#d6e8e2] leading-relaxed max-w-xl">
              Tire uma foto do seu prato no diário para acompanhar grupos alimentares e saciedade,
              sem precisar contar calorias.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/paciente/diario"
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-[#17372f] hover:bg-[#eaf4f1] transition-colors"
              >
                <span>Abrir Diário Alimentar</span>
                <ChevronRight className="size-4" />
              </Link>
              <Link
                to="/paciente/plano"
                className="flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-4 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Ver Todas as Ações ({totalPlansCount})
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 text-center">
            <div className="p-4 border-r border-white/10">
              <p className="text-2xl font-bold text-white">29</p>
              <p className="text-[11px] text-[#b8d3cb]">Dias de cuidado</p>
            </div>
            <div className="p-4 border-r border-white/10">
              <p className="text-2xl font-bold text-[#9fe0ce]">{planProgressPct}%</p>
              <p className="text-[11px] text-[#b8d3cb]">Adesão hoje</p>
            </div>
            <div className="p-4">
              <p className="text-2xl font-bold text-white">−1,8kg</p>
              <p className="text-[11px] text-[#b8d3cb]">Evolução total</p>
            </div>
          </div>
        </article>

        {/* Next Appointment Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Próxima Consulta
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#17372f]">Hoje, 10:30</h3>
              </div>
              <StatusBadge tone="green">Confirmada</StatusBadge>
            </div>
            <p className="mt-3 text-sm text-[#60766f]">
              Dr. Guilherme Martins · Retorno longitudinal de 30 min por vídeo.
            </p>

            <div className="mt-4 rounded-2xl bg-[#f4f7f5] p-3.5 text-xs space-y-1.5 text-[#45655c]">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-[#0b7b68]" />
                <span>Horário de Brasília (Ambiente Seguro)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#0b7b68]" />
                <span>Pré-consulta conectada ao prontuário</span>
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
              className="min-h-11 px-4 flex items-center justify-center rounded-xl border border-[#dfe8e3] text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5] transition-colors"
            >
              Histórico
            </Link>
          </div>
        </article>
      </section>

      {/* Secondary Cards: Care Plan Summary & Health Connect */}
      <section className="grid gap-5 md:grid-cols-3">
        {/* Quick plan interactive list */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Plano de Hoje
              </p>
              <h4 className="font-serif text-lg font-bold text-[#17372f]">
                {completedPlansCount} de {totalPlansCount} Ações
              </h4>
            </div>
            <span className="text-xl font-bold text-[#0b7b68]">{planProgressPct}%</span>
          </div>

          <div className="space-y-2 mb-4">
            {carePlans.slice(0, 3).map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => toggleCarePlan(plan.id)}
                className="w-full flex items-center gap-2.5 rounded-xl border border-[#edf2ef] p-2.5 text-left text-xs transition-colors hover:bg-[#f8faf9]"
              >
                <div
                  className={`size-5 rounded-full border grid place-items-center shrink-0 ${
                    plan.completed
                      ? 'border-[#0b7b68] bg-[#0b7b68] text-white'
                      : 'border-[#b7c7c1] text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span
                  className={`line-clamp-1 font-medium ${plan.completed ? 'text-[#698078] line-through' : 'text-[#17372f]'}`}
                >
                  {plan.action}
                </span>
              </button>
            ))}
          </div>

          <Link
            to="/paciente/plano"
            className="text-xs font-bold text-[#0b6a5b] hover:underline underline-offset-4 block text-center"
          >
            Ver detalhes do plano &rarr;
          </Link>
        </article>

        {/* Watch & Biosignals Card */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Sinais do Relógio
              </p>
              <StatusBadge tone={watchConnected ? 'green' : 'gray'}>
                {watchConnected ? 'Sincronizado' : 'Simulação'}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#698078] mb-1">
                  <Moon className="size-3.5 text-[#5e77d9]" />
                  <span>Sono médio</span>
                </div>
                <p className="text-lg font-bold text-[#17372f]">5h42</p>
                <span className="text-[10px] text-[#c96a3b] font-medium">Abaixo do padrão</span>
              </div>
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#698078] mb-1">
                  <Footprints className="size-3.5 text-[#0b7b68]" />
                  <span>Passos</span>
                </div>
                <p className="text-lg font-bold text-[#17372f]">6.420</p>
                <span className="text-[10px] text-[#0b7b68] font-medium">Meta 6.000</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWatchConnected(true)
              notify('Sincronização de relógio demonstrativa atualizada.')
            }}
            className="w-full text-center text-xs font-bold text-[#0b6a5b] hover:underline underline-offset-4"
          >
            {watchConnected ? 'Sinais atualizados agora' : 'Conectar Apple Watch / Garmin (Demo)'}
          </button>
        </article>

        {/* Doctor Message Card */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Mensagem do Médico
              </p>
              <StatusBadge tone="blue">Hoje · 08:30</StatusBadge>
            </div>

            <div className="rounded-2xl bg-[#edf7f4] border border-[#c2e2d8] p-3.5 text-xs text-[#17372f] leading-relaxed mb-3">
              <p className="font-semibold text-[#0b7b68] mb-1">Dr. Guilherme Martins:</p>
              “Bom dia, Marina! Vi suas respostas da pré-consulta. Vamos focar nos despertares
              noturnos na nossa consulta das 10:30.”
            </div>
          </div>

          <Link
            to="/paciente/mensagens"
            className="w-full text-center text-xs font-bold text-[#0b6a5b] hover:underline underline-offset-4"
          >
            Responder ao Dr. Guilherme &rarr;
          </Link>
        </article>
      </section>

      {/* Urgent care disclaimer footer */}
      <UrgentCareWarning />

      {/* Daily Check-in Modal */}
      {checkinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCompleteCheckin}
            className="w-full max-w-md rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up"
          >
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
              <div>
                <span className="text-xs font-bold text-[#0b7b68] uppercase tracking-wider">
                  {activeCheckinItem
                    ? `Dia ${activeCheckinItem.dayOffset} do Plano Pós-Consulta`
                    : 'Check-in'}
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

            <div className="mt-4 space-y-4">
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
                    className="w-full rounded-xl border border-[#dfe8e3] px-3.5 py-2.5 text-sm font-bold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-[11px] text-[#698078]">
                    Último registro compilado: 78,2 kg (−1,8 kg acumulado)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#17372f] mb-2">
                  Percepção de disposição e recuperação:
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
                  Notas adicionais para a equipe médica:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jantar antecipado às 19h30, sono sem intercorrências..."
                  value={checkinNote}
                  onChange={(e) => setCheckinNote(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe8e3] px-3 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
                />
              </div>

              <div className="rounded-2xl bg-[#f4f7f5] p-3 text-xs text-[#526a62]">
                <p className="font-semibold text-[#17372f] mb-0.5">Acompanhamento longitudinal:</p>
                Os check-ins alimentam a linha de evolução do Dr. Guilherme sem necessidade de
                consultas desnecessárias.
              </div>
            </div>

            <div className="mt-6 flex gap-3">
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
    </div>
  )
}
