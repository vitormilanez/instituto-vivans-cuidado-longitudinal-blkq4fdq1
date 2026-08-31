import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  ClinicalLayerBadge,
  SimulationDisclaimer,
} from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import { QuickConsultationModal } from '@/components/QuickConsultationModal'
import {
  Sparkles,
  Users,
  Calendar,
  Clock,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Send,
  UserCheck,
  Video,
  PenLine,
  Search,
  Filter,
  Check,
  Radio,
  ChevronRight,
  HeartPulse,
} from 'lucide-react'

export default function DoctorOverview() {
  const {
    patients,
    appointments,
    reports,
    nudged,
    nudgeDelayedPatients,
    nudgeSinglePatient,
    nudgedPatientIds,
    setSelectedPatientId,
    notify,
  } = useVivans()
  const navigate = useNavigate()

  const [activeSegment, setActiveSegment] = useState<
    'todos' | 'regulares' | 'atencao' | 'atrasados'
  >('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isQuickConsultationOpen, setIsQuickConsultationOpen] = useState(false)

  // Segmenting cohort data
  const totalPatients = patients.length
  const regularPatients = patients.filter((p) => p.tone === 'green')
  const delayedPatients = patients.filter((p) => p.tone === 'amber')
  const attentionPatients = patients.filter((p) => p.tone === 'rose')

  // Detect virtual waiting room patient
  const waitingPatients = patients.filter((p) => p.isOnlineInWaitingRoom)
  const primaryWaitingPatient = waitingPatients[0] || patients.find((p) => p.id === 'marina-costa')

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.attention.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (activeSegment === 'todos') return true
    if (activeSegment === 'regulares') return p.tone === 'green'
    if (activeSegment === 'atrasados') return p.tone === 'amber'
    if (activeSegment === 'atencao') return p.tone === 'rose'
    return true
  })

  // Next upcoming appointment
  const nextApt = appointments[0]

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Painel Clínico Longitudinal · Instituto Vivans" />

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-[#D6B270]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3 py-1 text-xs font-bold text-[#0F0F0F] shadow-sm">
                <Sparkles className="size-3.5" />
                <span>Painel de Longevidade</span>
              </span>
              <StatusBadge tone="green">Coorte Ativa: {totalPatients} Pacientes</StatusBadge>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Bem-vindo, {DOCTOR_PROFILE.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              Hoje você tem{' '}
              <strong className="text-[#D6B270]">
                {appointments.filter((a) => a.date.includes('Hoje')).length} consultas agendadas
              </strong>
              . A paciente <strong className="text-white">Marina Costa</strong> enviou a
              pré-consulta e aguarda na sala virtual.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <button
                type="button"
                onClick={() => setIsQuickConsultationOpen(true)}
                className="flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Video className="size-4 text-[#0F0F0F]" />
                <span>Iniciar Teleconsulta Rápida (Meet)</span>
              </button>

              <Link
                to="/medico/agenda"
                className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-[#333333] bg-white/5 px-4 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Calendar className="size-4 text-[#D6B270]" />
                <span>Ver Agenda do Dia</span>
              </Link>
            </div>
          </div>

          {/* Virtual Waiting Room Status Card */}
          <div className="rounded-2xl border border-[#D6B270]/30 bg-[#1A1A1A]/90 p-5 lg:w-80 shadow-inner backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E8C391]">
                <Radio className="size-3.5 text-[#D6B270] animate-pulse" />
                <span>Sala de Espera Virtual</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D6B270]/20 px-2 py-0.5 text-[10px] font-bold text-[#E8C391] border border-[#D6B270]/30">
                <span className="size-1.5 rounded-full bg-[#D6B270] animate-ping" />1 online
              </span>
            </div>

            {primaryWaitingPatient && (
              <div className="rounded-xl bg-[#0F0F0F] p-3 border border-[#333333] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{primaryWaitingPatient.name}</p>
                    <p className="text-[10px] text-[#ADADAD]">
                      Aguardando há {primaryWaitingPatient.waitingSince || '4 min'}
                    </p>
                  </div>
                  <Link
                    to={`/medico/consulta/${primaryWaitingPatient.id}`}
                    className="flex min-h-8 items-center gap-1 rounded-lg bg-[#D6B270] px-2.5 text-[11px] font-bold text-[#0F0F0F] hover:bg-[#E8C391] transition-colors"
                  >
                    <span>Atender</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveSegment('todos')}
          className={`rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
            activeSegment === 'todos'
              ? 'border-[#D6B270] bg-[#D6B270]/15 ring-2 ring-[#D6B270]/30'
              : 'border-[#333333] bg-[#1A1A1A] hover:border-[#D6B270]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ADADAD]">
              Coorte Ativa
            </span>
            <Users className="size-4 text-[#D6B270]" />
          </div>
          <p className="font-serif text-3xl font-bold text-white mt-2">{totalPatients}</p>
          <span className="text-[11px] text-[#D6B270] font-semibold">100% monitorados</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('regulares')}
          className={`rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
            activeSegment === 'regulares'
              ? 'border-[#D6B270] bg-[#D6B270]/15 ring-2 ring-[#D6B270]/30'
              : 'border-[#333333] bg-[#1A1A1A] hover:border-[#D6B270]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8C391]">
              Adesão Regular
            </span>
            <CheckCircle2 className="size-4 text-[#D6B270]" />
          </div>
          <p className="font-serif text-3xl font-bold text-white mt-2">{regularPatients.length}</p>
          <span className="text-[11px] text-[#E8C391] font-semibold">&ge; 80% consistência</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('atrasados')}
          className={`rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
            activeSegment === 'atrasados'
              ? 'border-[#F59E0B] bg-[#F59E0B]/20 ring-2 ring-[#F59E0B]/40'
              : 'border-[#333333] bg-[#1A1A1A] hover:border-[#F59E0B]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCD34D]">
              Atrasados
            </span>
            <Clock className="size-4 text-[#F59E0B]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#FCD34D] mt-2">
            {delayedPatients.length}
          </p>
          <span className="text-[11px] text-[#FCD34D] font-semibold">Requerem lembrete</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('atencao')}
          className={`rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
            activeSegment === 'atencao'
              ? 'border-[#EF4444] bg-[#EF4444]/20 ring-2 ring-[#EF4444]/40'
              : 'border-[#333333] bg-[#1A1A1A] hover:border-[#EF4444]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCA5A5]">
              Atenção Clínica
            </span>
            <AlertTriangle className="size-4 text-[#EF4444]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#FCA5A5] mt-2">
            {attentionPatients.length}
          </p>
          <span className="text-[11px] text-[#FCA5A5] font-semibold">Sintoma / queixa recente</span>
        </button>
      </div>

      {/* Main Grid: Cohort Patients & Next Appointment */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: Patients List */}
        <section className="space-y-4 rounded-3xl border border-[#333333] bg-[#1A1A1A] p-5 sm:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#333333] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Pacientes em Acompanhamento
              </h2>
              <p className="text-xs text-[#ADADAD]">
                Clique no paciente para abrir o prontuário completo
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Buscar por nome ou foco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[#333333] bg-[#0F0F0F] pl-9 pr-4 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D6B270] focus:outline-none"
              />
            </div>
          </div>

          {/* Patient Cards */}
          <div className="space-y-3">
            {filteredPatients.map((p) => {
              const hasNudge = nudgedPatientIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/medico/pacientes/${p.id}`)}
                  className="rounded-2xl border border-[#333333] bg-[#141414] p-4.5 hover:border-[#D6B270]/50 hover:bg-[#1A1A1A] transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <VivansAvatar
                        src={p.avatarUrl}
                        name={p.name}
                        initials={p.initials}
                        size="md"
                        className="border border-[#333333] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white group-hover:text-[#D6B270] transition-colors truncate">
                            {p.name}
                          </h3>
                          <StatusBadge tone={p.tone}>{p.attention}</StatusBadge>
                        </div>
                        <p className="text-xs text-[#ADADAD] truncate">{p.focus}</p>
                        <span className="text-[10px] text-[#888888]">{p.cycle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-white">{p.adherence} adesão</p>
                        <p className="text-[10px] text-[#ADADAD]">{p.nextConsultation}</p>
                      </div>

                      <Link
                        to={`/medico/pacientes/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex min-h-9 items-center gap-1 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3.5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-sm"
                      >
                        <span>Prontuário</span>
                        <ChevronRight className="size-3.5 text-[#0F0F0F]" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-2 text-xs text-[#ADADAD]">
            <span>
              Exibindo {filteredPatients.length} de {patients.length} pacientes
            </span>
            <Link to="/medico/pacientes" className="text-[#D6B270] font-bold hover:underline">
              Ver carteira completa &rarr;
            </Link>
          </div>
        </section>

        {/* Right Column: Next Appointment & Action Shortcut */}
        <aside className="space-y-4">
          {nextApt && (
            <article className="rounded-3xl border border-[#D6B270]/30 bg-[#1A1A1A] p-6 shadow-md space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#D6B270]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E8C391]">
                    Próxima Consulta de Hoje
                  </span>
                </div>
                <StatusBadge tone="green">Confirmada</StatusBadge>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {nextApt.patient} · {nextApt.time}
                </h3>
                <p className="text-xs text-[#ADADAD] mt-0.5">{nextApt.type}</p>
              </div>

              <div className="rounded-2xl bg-[#0F0F0F] p-3.5 border border-[#333333] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-[#E8C391]">Pré-consulta recebida:</strong>
                  <span className="text-[10px] font-bold text-[#D6B270]">✓ Estruturada</span>
                </div>
                <p className="text-[#CCCCCC] leading-relaxed italic text-[11px]">
                  “{nextApt.reported}”
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to={`/medico/consulta/${nextApt.id}`}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-md"
                >
                  <Video className="size-4" />
                  <span>Entrar na Sala Virtual (Meet)</span>
                </Link>

                <Link
                  to={`/medico/pacientes/${nextApt.patientId || 'marina-costa'}`}
                  className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#333333] bg-white/5 px-3 text-xs font-bold text-white hover:bg-white/10 transition-all"
                >
                  <FileText className="size-3.5 text-[#D6B270]" />
                  <span>Abrir Prontuário Longitudinal</span>
                </Link>
              </div>
            </article>
          )}

          {/* Quick AI Governance Card */}
          <div className="rounded-3xl border border-[#333333] bg-[#141414] p-5 text-xs text-[#ADADAD] space-y-2 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#D6B270]">
              <Sparkles className="size-4 text-[#D6B270]" />
              <span className="text-xs">Copiloto Clínico Vivans</span>
            </div>
            <p className="leading-relaxed text-[#888888]">
              Todas as sugestões diagnósticas e posológicas são compiladas como rascunhos de apoio.
              A validação médica humana permanece como premissa mandatória.
            </p>
          </div>
        </aside>
      </div>

      <QuickConsultationModal
        isOpen={isQuickConsultationOpen}
        onClose={() => setIsQuickConsultationOpen(false)}
        initialAction="video"
        initialPatientId="marina-costa"
      />
    </div>
  )
}
