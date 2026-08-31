import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge } from '@/components/CommonUI'
import {
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle2,
  Bell,
  Activity,
  Check,
  UserCheck,
  Stethoscope,
  ExternalLink,
  Info,
  Flame,
  Moon,
  HeartPulse,
} from 'lucide-react'

interface AlertItem {
  patient: string
  patientId: string
  title: string
  context: string
  tag: string
  tone: 'amber' | 'rose' | 'blue'
  category: string
  icon: typeof AlertTriangle
  suggestedAction: string
  timeAgo: string
  keyMetric?: { label: string; val: string }
}

export default function DoctorOverview() {
  const { patients, appointments, reports, nudged, nudgeDelayedPatients, notify } = useVivans()
  const navigate = useNavigate()

  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)
  const [filterTag, setFilterTag] = useState<'all' | 'priority' | 'symptom' | 'report'>('all')

  const alerts: AlertItem[] = [
    {
      patient: 'Marina Costa',
      patientId: 'marina-costa',
      title: 'Padrão de sono curto compilado para observação médica',
      context:
        'Média de 5h42 com despertares às 3h. Pré-consulta vinculada indica correlação a ser avaliada com crononutrição do jantar (20h30).',
      tag: 'Revisar no retorno (10:30)',
      tone: 'amber',
      category: 'Sono & Crononutrição',
      icon: Moon,
      suggestedAction: 'Abrir sala de consulta às 10:30 e revisar crononutrição.',
      timeAgo: 'Hoje · 09:18',
      keyMetric: { label: 'Sono médio', val: '5h42 (−1h30)' },
    },
    {
      patient: 'Paulo Mendes',
      patientId: 'paulo-mendes',
      title: 'Registro de desconforto gástrico matinal',
      context:
        'Sintoma informado no check-in de hoje. Dados compilados para avaliação médica antes de manter posologia vigente.',
      tag: 'Observação de sintoma',
      tone: 'rose',
      category: 'Sintoma Agudo',
      icon: HeartPulse,
      suggestedAction: 'Revisar receita digital #RX-1051 e acolher sintoma na consulta das 16:30.',
      timeAgo: 'Hoje · 08:12',
      keyMetric: { label: 'Queixa', val: 'Enjoo matinal' },
    },
    {
      patient: 'Ana Ribeiro',
      patientId: 'ana-ribeiro',
      title: 'Relatório longitudinal compilado aguardando validação',
      context:
        'Adesão de 88% e ganho de 12% na força funcional. Síntese estruturada aguardando assinatura médica para envio.',
      tag: 'Aprovação de relatório',
      tone: 'blue',
      category: 'Documento Clínico',
      icon: FileText,
      suggestedAction: 'Aprovar relatório mensal na central de relatórios.',
      timeAgo: 'Ontem · 18:40',
      keyMetric: { label: 'Adesão / Força', val: '88% · +12%' },
    },
  ]

  const filteredAlerts = alerts.filter((a) => {
    if (filterTag === 'priority') return a.tone === 'amber'
    if (filterTag === 'symptom') return a.tone === 'rose'
    if (filterTag === 'report') return a.tone === 'blue'
    return true
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header / Greeting Section - Warm, Clean & Editorial */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#112822] via-[#17372f] to-[#1e483e] p-6 sm:p-8 text-white shadow-[0_16px_36px_rgba(17,40,34,0.18)]">
        {/* Subtle background glow circle */}
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-[#206354]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 size-56 rounded-full bg-[#e49d45]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#cbe2da] border border-white/10">
                <Calendar className="size-3.5 text-[#9fe0ce]" />
                Terça-feira, 25 de agosto de 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9fe0ce]/15 px-3 py-1 text-xs font-semibold text-[#a6ecd9] border border-[#9fe0ce]/20">
                <Activity className="size-3 text-[#9fe0ce]" />5 Consultas no dia
              </span>
            </div>

            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-tight">
                Bom dia, Dr. Guilherme
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#b6d3ca] max-w-2xl font-light leading-relaxed">
                Você tem <strong className="font-semibold text-white">5 consultas agendadas</strong>{' '}
                e{' '}
                <strong className="font-semibold text-[#fcd690]">
                  3 pacientes demandando atenção
                </strong>{' '}
                clínica hoje.
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              disabled={nudged}
              onClick={nudgeDelayedPatients}
              className={`group flex items-center gap-2.5 min-h-[46px] rounded-[18px] px-5 text-xs font-bold transition-all shadow-md ${
                nudged
                  ? 'bg-white/15 text-[#b9d5cc] cursor-default border border-white/10'
                  : 'bg-[#9fe0ce] text-[#0d2a23] hover:bg-[#bdf3e5] hover:shadow-[0_8px_20px_rgba(159,224,206,0.35)] active:scale-[0.98]'
              }`}
            >
              {nudged ? (
                <>
                  <Check className="size-4 text-[#9fe0ce]" />
                  <span>Lembrete enviado aos 5 atrasados</span>
                </>
              ) : (
                <>
                  <Send className="size-4 text-[#0d2a23] transition-transform group-hover:translate-x-0.5" />
                  <span>Enviar lembrete aos 5 atrasados</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Executive Summary / Modern KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {/* Card 1: Agenda */}
        <div
          onClick={() => navigate('/medico/agenda')}
          className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[#DEE7E2] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(17,40,34,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#097260]/40 hover:shadow-[0_12px_24px_rgba(9,114,96,0.08)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#556D66]">
              Agenda do Dia
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#EAF3EF] text-[#097260] transition-colors group-hover:bg-[#097260] group-hover:text-white">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#112822]">5</span>
            <span className="text-xs text-[#556D66]">atendimentos</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#F3F7F5] pt-3 text-xs">
            <span className="text-[#556D66]">
              Próxima às <strong className="text-[#112822] font-semibold">10:30</strong> (Marina C.)
            </span>
            <ChevronRight className="size-3.5 text-[#556D66] transition-transform group-hover:translate-x-1 group-hover:text-[#097260]" />
          </div>
        </div>

        {/* Card 2: Caixa de Atenção */}
        <div
          onClick={() => {
            document.getElementById('atencao-box')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[#F8DEB0] bg-[#FEFBF5] p-5 sm:p-6 shadow-[0_4px_16px_rgba(125,83,8,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C57D19]/60 hover:shadow-[0_12px_24px_rgba(197,125,25,0.12)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5B0B]">
              Caixa de Atenção
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#FEEED1] text-[#C57D19] transition-colors group-hover:bg-[#C57D19] group-hover:text-white">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#7D5308]">3</span>
            <span className="text-xs text-[#8A5B0B]">casos por exceção</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#F8DEB0]/50 pt-3 text-xs">
            <span className="text-[#8A5B0B] truncate">1 novo sintoma + 2 desvios de sono</span>
            <ChevronRight className="size-3.5 text-[#8A5B0B] transition-transform group-hover:translate-x-1 group-hover:text-[#7D5308]" />
          </div>
        </div>

        {/* Card 3: Relatórios */}
        <div
          onClick={() => navigate('/medico/relatorios')}
          className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[#DEE7E2] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(17,40,34,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#355B88]/40 hover:shadow-[0_12px_24px_rgba(53,91,136,0.08)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#556D66]">
              Relatórios na Fila
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#EFF5FC] text-[#355B88] transition-colors group-hover:bg-[#355B88] group-hover:text-white">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#112822]">4</span>
            <span className="text-xs text-[#556D66]">em acompanhamento</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#F3F7F5] pt-3 text-xs">
            <span className="text-[#556D66]">2 prontos para validação</span>
            <ChevronRight className="size-3.5 text-[#556D66] transition-transform group-hover:translate-x-1 group-hover:text-[#355B88]" />
          </div>
        </div>
      </section>

      {/* 3. Main Two-Column Layout: Attention Box (Primary) & Today's Timeline */}
      <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
        {/* Left Column: Caixa de Atenção Organizada por Exceção */}
        <section id="atencao-box" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-xl bg-[#FEEED1] text-[#C57D19]">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                  Caixa de Atenção
                </h2>
                <p className="text-xs text-[#556D66]">Organizada por exceção clínica</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 rounded-xl bg-[#EAF3EF]/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterTag('all')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  filterTag === 'all'
                    ? 'bg-white text-[#112822] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Todos (3)
              </button>
              <button
                type="button"
                onClick={() => setFilterTag('priority')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  filterTag === 'priority'
                    ? 'bg-white text-[#7D5308] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Prioritários
              </button>
              <button
                type="button"
                onClick={() => setFilterTag('symptom')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  filterTag === 'symptom'
                    ? 'bg-white text-[#8E2E28] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Sintomas
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {filteredAlerts.map((al) => {
              const IconComponent = al.icon
              const isHighlight = al.patientId === 'marina-costa'
              return (
                <div
                  key={al.patient}
                  onClick={() => setSelectedAlert(al)}
                  className={`group relative cursor-pointer rounded-[20px] border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,40,34,0.06)] ${
                    isHighlight
                      ? 'border-[#C57D19]/40 bg-gradient-to-r from-[#FEFBF5] to-white ring-1 ring-[#C57D19]/20'
                      : 'border-[#DEE7E2] hover:border-[#097260]/40'
                  }`}
                >
                  {/* Top line: Patient + Clinical Reason Tag + Action */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center rounded-xl text-xs font-bold ${
                          al.tone === 'amber'
                            ? 'bg-[#FEEED1] text-[#7D5308]'
                            : al.tone === 'rose'
                              ? 'bg-[#FCF0EE] text-[#8E2E28]'
                              : 'bg-[#EFF5FC] text-[#244C77]'
                        }`}
                      >
                        <IconComponent className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#112822]">{al.patient}</h3>
                          <span className="text-[11px] text-[#556D66]">· {al.timeAgo}</span>
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#556D66]">
                          {al.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge tone={al.tone}>{al.tag}</StatusBadge>
                    </div>
                  </div>

                  {/* Middle: Clinical observation */}
                  <div className="mt-3.5 pl-12 space-y-1">
                    <p className="font-semibold text-xs sm:text-sm text-[#112822] leading-snug">
                      {al.title}
                    </p>
                    <p className="text-xs text-[#556D66] leading-relaxed line-clamp-2">
                      {al.context}
                    </p>
                  </div>

                  {/* Bottom: Action bar */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F3F7F5] pl-12 pt-3">
                    {al.keyMetric ? (
                      <div className="text-[11px] text-[#556D66]">
                        {al.keyMetric.label}:{' '}
                        <strong className="font-bold text-[#112822]">{al.keyMetric.val}</strong>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#097260] transition-colors group-hover:text-[#075f50]">
                      <span>Revisar Contexto</span>
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* AI Disclaimer Box - Secondary & Elegant */}
          <div className="rounded-[18px] border border-[#DEE7E2] bg-[#F5F8F6] p-4 text-xs text-[#556D66] transition-colors hover:bg-white">
            <div className="flex items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#EAF3EF] text-[#097260] mt-0.5">
                <Sparkles className="size-3.5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#112822]">
                    Apoio Clínico Estruturado
                  </span>
                  <span className="rounded-full bg-[#EAF3EF] px-2 py-0.5 text-[10px] font-semibold text-[#097260]">
                    IA Auxiliar
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#556D66]">
                  Rascunhos de síntese organizados a partir de biossinais e relatos. Nenhuma
                  conduta, prescrição ou diagnóstico é emitido de forma autônoma.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Timeline of Today's Consultations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-xl bg-[#EAF3EF] text-[#097260]">
                <Clock className="size-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                  Agenda do Dia
                </h2>
                <p className="text-xs text-[#556D66]">Linha do tempo das consultas</p>
              </div>
            </div>
            <Link
              to="/medico/agenda"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#097260] hover:text-[#075f50] hover:underline"
            >
              <span>Ver completa</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Timeline list */}
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#DEE7E2]">
            {appointments.map((apt) => {
              const isNext = apt.status === 'Próxima' || apt.patient === 'Marina Costa'
              const isCompleted = apt.status === 'Concluída'

              return (
                <div key={apt.id} className="relative group">
                  {/* Timeline marker node */}
                  <div
                    className={`absolute -left-6 top-5 size-3 rounded-full border-2 bg-white transition-all ${
                      isNext
                        ? 'border-[#097260] bg-[#097260] ring-4 ring-[#097260]/15'
                        : isCompleted
                          ? 'border-[#556D66] bg-[#556D66]'
                          : 'border-[#DEE7E2] bg-white group-hover:border-[#097260]'
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`rounded-[20px] border p-4.5 sm:p-5 transition-all duration-200 ${
                      isNext
                        ? 'border-[#097260] bg-white ring-2 ring-[#097260]/10 shadow-[0_8px_20px_rgba(9,114,96,0.08)]'
                        : isCompleted
                          ? 'border-[#DEE7E2] bg-[#FDFCFA]/70 opacity-90'
                          : 'border-[#DEE7E2] bg-white hover:border-[#097260]/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#112822] bg-[#F5F8F6] px-2.5 py-1 rounded-lg border border-[#DEE7E2]">
                          {apt.time}
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-[#112822] block">
                            {apt.patient}
                          </strong>
                        </div>
                      </div>
                      <StatusBadge tone={apt.statusTone}>{apt.status}</StatusBadge>
                    </div>

                    <p className="text-xs text-[#556D66] mb-3">
                      {apt.type} · <span className="italic font-medium">{apt.preVisit}</span>
                    </p>

                    <div className="flex items-center justify-between gap-2 border-t border-[#F3F7F5] pt-3">
                      <Link
                        to={`/medico/pacientes/${apt.patient.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-semibold text-[#556D66] hover:text-[#112822] transition-colors"
                      >
                        Prontuário Longitudinal
                      </Link>

                      <Link
                        to={`/medico/consulta/${apt.id}`}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                          isNext
                            ? 'text-[#097260] hover:text-[#075f50] hover:underline'
                            : 'text-[#556D66] hover:text-[#112822]'
                        }`}
                      >
                        <span>Entrar na Consulta</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* 4. Alert Detail / Clinical Context Drawer Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] border border-[#DEE7E2] bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F3F7F5] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`grid size-10 place-items-center rounded-2xl ${
                    selectedAlert.tone === 'amber'
                      ? 'bg-[#FEEED1] text-[#7D5308]'
                      : selectedAlert.tone === 'rose'
                        ? 'bg-[#FCF0EE] text-[#8E2E28]'
                        : 'bg-[#EFF5FC] text-[#244C77]'
                  }`}
                >
                  <selectedAlert.icon className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#112822]">
                      {selectedAlert.patient}
                    </h3>
                    <StatusBadge tone={selectedAlert.tone}>{selectedAlert.tag}</StatusBadge>
                  </div>
                  <p className="text-xs text-[#556D66]">
                    {selectedAlert.category} · {selectedAlert.timeAgo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="rounded-full p-1.5 text-[#556D66] hover:bg-[#F5F8F6] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-xs leading-relaxed text-[#556D66]">
              <div className="space-y-1.5">
                <strong className="text-sm font-bold text-[#112822] block">
                  {selectedAlert.title}
                </strong>
                <p className="text-xs text-[#556D66] leading-relaxed">{selectedAlert.context}</p>
              </div>

              {selectedAlert.keyMetric && (
                <div className="flex items-center justify-between rounded-xl border border-[#DEE7E2] bg-[#FDFCFA] px-4 py-2.5">
                  <span className="font-medium text-[#556D66]">
                    {selectedAlert.keyMetric.label}
                  </span>
                  <span className="font-bold text-[#112822]">{selectedAlert.keyMetric.val}</span>
                </div>
              )}

              {/* Recommended Clinical Action */}
              <div className="rounded-[18px] bg-[#EAF3EF]/70 border border-[#DEE7E2] p-4 text-[#112822] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-[#097260]">
                  <Stethoscope className="size-3.5" />
                  <span>Conduta Recomendada para o Médico:</span>
                </div>
                <p className="text-xs font-semibold text-[#112822]">
                  {selectedAlert.suggestedAction}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#556D66]">
                  <li>Cruzar dados históricos no prontuário longitudinal.</li>
                  <li>Avaliar no atendimento clínico sem decisão autônoma prévia do sistema.</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="min-h-10 rounded-[14px] border border-[#DEE7E2] px-4 text-xs font-bold text-[#556D66] hover:bg-[#F5F8F6] transition-colors"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedAlert.patientId
                  setSelectedAlert(null)
                  navigate(`/medico/pacientes/${targetId}`)
                }}
                className="min-h-10 rounded-[14px] bg-[#097260] px-5 text-xs font-bold text-white hover:bg-[#075f50] transition-colors shadow-sm"
              >
                Abrir Prontuário Longitudinal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
