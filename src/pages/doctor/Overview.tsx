import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import { QuickConsultationModal } from '@/components/QuickConsultationModal'
import {
  Sparkles,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Video,
  Search,
  Radio,
  ChevronRight,
} from 'lucide-react'

export default function DoctorOverview() {
  const { patients, appointments, setSelectedPatientId, notify } = useVivans()
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
      <section className="relative overflow-hidden rounded-[28px] border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 text-[#1E1E1C] shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EFEA] px-3 py-1 text-xs font-bold text-[#2E5E4E]">
                <Sparkles className="size-3.5 text-[#2E5E4E]" />
                <span>Painel de Longevidade</span>
              </span>
              <StatusBadge tone="green">Coorte Ativa: {totalPatients} Pacientes</StatusBadge>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1E1E1C] leading-tight">
              Bem-vindo, {DOCTOR_PROFILE.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
              Hoje você tem{' '}
              <strong className="text-[#2E5E4E]">
                {appointments.filter((a) => a.date.includes('Hoje')).length} consultas agendadas
              </strong>
              . A paciente <strong className="text-[#1E1E1C]">Marina Costa</strong> enviou a
              pré-consulta e aguarda na sala virtual.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <button
                type="button"
                onClick={() => setIsQuickConsultationOpen(true)}
                className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-5 font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Video className="size-4 text-[#FFFFFF]" />
                <span>Iniciar Teleconsulta Rápida (Meet)</span>
              </button>

              <Link
                to="/medico/agenda"
                className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 font-semibold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-colors"
              >
                <Calendar className="size-4 text-[#2E5E4E]" />
                <span>Ver Agenda do Dia</span>
              </Link>
            </div>
          </div>

          {/* Virtual Waiting Room Status Card */}
          <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-5 lg:w-80 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                <Radio className="size-3.5 text-[#2E5E4E] animate-pulse" />
                <span>Sala de Espera Virtual</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFFFF] px-2 py-0.5 text-[10px] font-bold text-[#2E5E4E] border border-[#C3D6CC]">
                <span className="size-1.5 rounded-full bg-[#2E5E4E] animate-ping" />1 online
              </span>
            </div>

            {primaryWaitingPatient && (
              <div className="rounded-xl bg-[#FFFFFF] p-3 border border-[#C3D6CC] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#1E1E1C]">{primaryWaitingPatient.name}</p>
                    <p className="text-[10px] text-[#5C5C57]">
                      Aguardando há {primaryWaitingPatient.waitingSince || '4 min'}
                    </p>
                  </div>
                  <Link
                    to={`/medico/consulta/${primaryWaitingPatient.id}`}
                    className="flex min-h-8 items-center gap-1 rounded-lg bg-[#2E5E4E] px-2.5 text-[11px] font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-colors shadow-sm"
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
          className={`rounded-3xl border p-5 text-left transition-all cursor-pointer shadow-subtle ${
            activeSegment === 'todos'
              ? 'border-[#2E5E4E] bg-[#E7EFEA] ring-2 ring-[#2E5E4E]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2E5E4E]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C5C57]">
              Coorte Ativa
            </span>
            <Users className="size-4 text-[#2E5E4E]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#1E1E1C] mt-2">{totalPatients}</p>
          <span className="text-[11px] text-[#2E5E4E] font-semibold">100% monitorados</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('regulares')}
          className={`rounded-3xl border p-5 text-left transition-all cursor-pointer shadow-subtle ${
            activeSegment === 'regulares'
              ? 'border-[#2F7D5B] bg-[#E7F2EC] ring-2 ring-[#2F7D5B]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2F7D5B]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F7D5B]">
              Adesão Regular
            </span>
            <CheckCircle2 className="size-4 text-[#2F7D5B]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#1E1E1C] mt-2">
            {regularPatients.length}
          </p>
          <span className="text-[11px] text-[#2F7D5B] font-semibold">&ge; 80% consistência</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('atrasados')}
          className={`rounded-3xl border p-5 text-left transition-all cursor-pointer shadow-subtle ${
            activeSegment === 'atrasados'
              ? 'border-[#B7832F] bg-[#F7EFDF] ring-2 ring-[#B7832F]/40'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#B7832F]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B7832F]">
              Atrasados
            </span>
            <Clock className="size-4 text-[#B7832F]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#B7832F] mt-2">
            {delayedPatients.length}
          </p>
          <span className="text-[11px] text-[#B7832F] font-semibold">Requerem lembrete</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('atencao')}
          className={`rounded-3xl border p-5 text-left transition-all cursor-pointer shadow-subtle ${
            activeSegment === 'atencao'
              ? 'border-[#B4553F] bg-[#F6E7E2] ring-2 ring-[#B4553F]/40'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#B4553F]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B4553F]">
              Atenção Clínica
            </span>
            <AlertTriangle className="size-4 text-[#B4553F]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#B4553F] mt-2">
            {attentionPatients.length}
          </p>
          <span className="text-[11px] text-[#B4553F] font-semibold">Sintoma / queixa recente</span>
        </button>
      </div>

      {/* Main Grid: Cohort Patients & Next Appointment */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: Patients List */}
        <section className="space-y-4 rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE5] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1E1E1C]">
                Pacientes em Acompanhamento
              </h2>
              <p className="text-xs text-[#5C5C57]">
                Clique no paciente para abrir o prontuário completo
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8A84]" />
              <input
                type="text"
                placeholder="Buscar por nome ou foco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] pl-9 pr-4 py-2 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
              />
            </div>
          </div>

          {/* Patient Cards */}
          <div className="space-y-3.5">
            {filteredPatients.map((p) => {
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/medico/pacientes/${p.id}`)}
                  className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 sm:p-4.5 hover:border-[#2E5E4E]/40 hover:bg-[#F1EEE7] transition-all cursor-pointer shadow-subtle group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <VivansAvatar
                        src={p.avatarUrl}
                        name={p.name}
                        initials={p.initials}
                        size="md"
                        className="border border-[#E8E3D9] group-hover:border-[#C3D6CC] shrink-0 transition-colors"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors whitespace-normal">
                            {p.name}
                          </h3>
                          <StatusBadge tone={p.tone} variant="subtle">
                            {p.attention}
                          </StatusBadge>
                        </div>
                        <p className="text-xs text-[#5C5C57] leading-relaxed">{p.focus}</p>
                        <p className="text-[11px] text-[#8A8A84]">{p.cycle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E3D9]/60 text-xs">
                      <div className="text-left sm:text-right space-y-0.5">
                        <p className="font-bold text-[#1E1E1C]">
                          {p.adherence}{' '}
                          <span className="font-normal text-[11px] text-[#5C5C57]">adesão</span>
                        </p>
                        <p className="text-[11px] text-[#5C5C57]">{p.nextConsultation}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-[#5C5C57] group-hover:text-[#2E5E4E] transition-colors">
                        <span className="hidden md:inline">Prontuário</span>
                        <div className="size-7 rounded-full bg-[#FFFFFF] group-hover:bg-[#E7EFEA] border border-[#E8E3D9] group-hover:border-[#C3D6CC] flex items-center justify-center transition-colors">
                          <ChevronRight className="size-3.5 text-[#2E5E4E]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-2 text-xs text-[#5C5C57]">
            <span>
              Exibindo {filteredPatients.length} de {patients.length} pacientes
            </span>
            <Link to="/medico/pacientes" className="text-[#2E5E4E] font-bold hover:underline">
              Ver carteira completa &rarr;
            </Link>
          </div>
        </section>

        {/* Right Column: Next Appointment & Action Shortcut */}
        <aside className="space-y-4">
          {nextApt && (
            <article className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#2E5E4E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                    Próxima Consulta de Hoje
                  </span>
                </div>
                <StatusBadge tone="green">Confirmada</StatusBadge>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                  {nextApt.patient} · {nextApt.time}
                </h3>
                <p className="text-xs text-[#5C5C57] mt-0.5">{nextApt.type}</p>
              </div>

              <div className="rounded-2xl bg-[#FAF8F4] p-3.5 border border-[#E8E3D9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-[#2E5E4E]">Pré-consulta recebida:</strong>
                  <span className="text-[10px] font-bold text-[#2F7D5B]">✓ Estruturada</span>
                </div>
                <p className="text-[#5C5C57] leading-relaxed italic text-[11px]">
                  “{nextApt.reported}”
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to={`/medico/consulta/${nextApt.id}`}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm"
                >
                  <Video className="size-4" />
                  <span>Entrar na Sala Virtual (Meet)</span>
                </Link>

                <Link
                  to={`/medico/pacientes/${nextApt.patientId || 'marina-costa'}`}
                  className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] px-3 text-xs font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-all"
                >
                  <FileText className="size-3.5 text-[#2E5E4E]" />
                  <span>Abrir Prontuário Longitudinal</span>
                </Link>
              </div>
            </article>
          )}

          {/* Quick AI Governance Card */}
          <div className="rounded-3xl border border-[#E8E3D9] bg-[#FAF8F4] p-5 text-xs text-[#5C5C57] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#2E5E4E]">
              <Sparkles className="size-4 text-[#2E5E4E]" />
              <span className="text-xs">Copiloto Clínico Vivans</span>
            </div>
            <p className="leading-relaxed text-[#5C5C57]">
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
