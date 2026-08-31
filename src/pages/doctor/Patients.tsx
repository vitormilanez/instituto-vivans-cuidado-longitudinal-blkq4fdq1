import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Clock,
  ChevronRight,
  ShieldAlert,
  Send,
  Check,
  Calendar,
  AlertTriangle,
  UserCheck,
  Stethoscope,
  Activity,
  HeartPulse,
} from 'lucide-react'

export default function DoctorPatients() {
  const { patients, setSelectedPatientId, nudgeSinglePatient, nudgedPatientIds } = useVivans()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Retain filter state from URL or default
  const initialSearch = searchParams.get('q') || ''
  const initialFilter =
    (searchParams.get('status') as 'todos' | 'regulares' | 'atrasados' | 'atencao') || 'todos'

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [filterAttention, setFilterAttention] = useState<
    'todos' | 'regulares' | 'atrasados' | 'atencao'
  >(initialFilter)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.attention.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (filterAttention === 'todos') return true
    if (filterAttention === 'regulares') return p.tone === 'green'
    if (filterAttention === 'atrasados') return p.tone === 'amber'
    if (filterAttention === 'atencao') return p.tone === 'rose'
    return true
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1
  const displayedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleFilterChange = (filter: 'todos' | 'regulares' | 'atrasados' | 'atencao') => {
    setFilterAttention(filter)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (filter === 'todos') {
      newParams.delete('status')
    } else {
      newParams.set('status', filter)
    }
    setSearchParams(newParams, { replace: true })
  }

  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (!val) {
      newParams.delete('q')
    } else {
      newParams.set('q', val)
    }
    setSearchParams(newParams, { replace: true })
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Registro e Coorte Longitudinal de Pacientes · Instituto Vivans" />

      {/* Clean Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#097260]">
              Carteira Médica · Instituto Vivans
            </span>
            <span className="rounded-full bg-[#EAF3EF] px-2 py-0.5 text-[11px] font-semibold text-[#075f50]">
              {patients.length} Pacientes
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#112822]">
            Pacientes em Acompanhamento
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#556D66] max-w-2xl">
            Clique em qualquer paciente para abrir o prontuário longitudinal individual completo,
            com histórico, pré-consulta, evolução e biossinais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/medico')}
            className="flex min-h-10 items-center gap-1.5 rounded-xl border border-[#DEE7E2] bg-white px-4 text-xs font-bold text-[#556D66] hover:bg-[#F5F8F6] transition-colors"
          >
            &larr; Visão Geral do Painel
          </button>
        </div>
      </section>

      {/* Clean Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[20px] border border-[#DEE7E2] bg-white p-4 shadow-[0_2px_12px_rgba(17,40,34,0.03)]">
        <div className="relative w-full sm:w-88">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8C9E97]" />
          <input
            type="text"
            placeholder="Buscar por nome, foco clínico ou sintoma..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#DEE7E2] bg-[#FDFCFA] pl-10 pr-4 py-2.5 text-xs text-[#112822] placeholder:text-[#8C9E97] focus:border-[#097260] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-bold text-[#556D66] mr-1 hidden lg:inline">
            Filtrar status:
          </span>
          {[
            { id: 'todos', label: `Todos (${patients.length})` },
            { id: 'regulares', label: 'Regulares (15)' },
            { id: 'atrasados', label: 'Atrasados (4)' },
            { id: 'atencao', label: 'Atenção (3)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFilterChange(f.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterAttention === f.id
                  ? 'bg-[#112822] text-white shadow-xs'
                  : 'text-[#556D66] hover:bg-[#F5F8F6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-[#698078] px-1">
        <span>
          Exibindo <strong>{displayedPatients.length}</strong> de{' '}
          <strong>{filteredPatients.length}</strong> pacientes encontrados
        </span>
        <span>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>
      </div>

      {/* Clean, Low-Noise Patients List */}
      <div className="grid gap-3.5">
        {displayedPatients.length === 0 ? (
          <div className="rounded-[24px] border border-[#DEE7E2] bg-white p-12 text-center text-xs text-[#556D66] space-y-2">
            <p className="font-semibold text-sm text-[#112822]">Nenhum paciente encontrado</p>
            <p>Tente ajustar a busca ou o filtro de status selecionado.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setFilterAttention('todos')
                setSearchParams({}, { replace: true })
              }}
              className="mt-2 text-xs font-bold text-[#097260] hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          displayedPatients.map((p) => {
            const hasNudge = nudgedPatientIds.includes(p.id)
            const isAttention = p.tone === 'rose'
            const isDelayed = p.tone === 'amber'

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/medico/pacientes/${p.id}`)}
                className="group relative cursor-pointer rounded-[22px] border border-[#DEE7E2] bg-white p-5 shadow-[0_2px_12px_rgba(17,40,34,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#097260]/60 hover:shadow-[0_8px_24px_rgba(17,40,34,0.08)]"
              >
                <div className="grid gap-4 lg:grid-cols-[280px_1fr_auto] lg:items-center">
                  {/* Left: Patient Avatar + Identity + Clinical Focus */}
                  <div className="flex items-center gap-3.5">
                    <VivansAvatar
                      src={p.avatarUrl}
                      name={p.name}
                      initials={p.initials}
                      size="lg"
                      className="border border-[#DEE7E2] shadow-2xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-[#112822] group-hover:text-[#097260] transition-colors truncate">
                          {p.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#556D66] truncate">{p.focus}</p>
                      <span className="text-[11px] text-[#8C9E97] block mt-0.5">{p.cycle}</span>
                    </div>
                  </div>

                  {/* Middle: Key Longitudinal Indicators (Adherence, Status/Symptom, Next Action) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-y lg:border-y-0 lg:border-x border-[#F3F7F5] py-3 lg:py-0 lg:px-5 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#556D66]">
                        Adesão &amp; Evolução
                      </p>
                      <p className="text-sm font-bold text-[#112822] mt-0.5">{p.progress}</p>
                      <span className="text-[11px] text-[#097260] font-semibold">
                        Adesão {p.adherence}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#556D66]">
                        Ponto de Atenção / Sintoma
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <StatusBadge tone={p.tone}>{p.attention}</StatusBadge>
                      </div>
                      <span className="text-[10px] text-[#556D66] block mt-0.5">
                        Contato: {p.lastContact}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#556D66]">
                        Próxima Consulta
                      </p>
                      <p className="text-xs font-semibold text-[#112822] mt-0.5 truncate">
                        {p.nextConsultation}
                      </p>
                      <span className="text-[10px] text-[#097260] font-medium block">
                        {p.prescriptionCount}
                      </span>
                    </div>
                  </div>

                  {/* Right: Clean CTAs and Nudge Status */}
                  <div className="flex flex-wrap sm:flex-nowrap lg:flex-col items-stretch gap-2 shrink-0">
                    <Link
                      to={`/medico/pacientes/${p.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#097260] px-4 text-xs font-bold text-white hover:bg-[#075f50] transition-colors shadow-2xs"
                    >
                      <span>Abrir Perfil Completo</span>
                      <ChevronRight className="size-3.5" />
                    </Link>

                    {(isDelayed || isAttention) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          nudgeSinglePatient(p.id, p.name)
                        }}
                        className={`flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-all border ${
                          hasNudge
                            ? 'border-[#BFE4D8] bg-[#EAF3EF] text-[#075F50]'
                            : 'border-[#DEE7E2] bg-white text-[#556D66] hover:bg-[#F5F8F6] hover:text-[#112822]'
                        }`}
                      >
                        {hasNudge ? (
                          <>
                            <Check className="size-3 text-[#097260]" />
                            <span>Cutucão Enviado</span>
                          </>
                        ) : (
                          <>
                            <Send className="size-3" />
                            <span>Cutucar / Lembrete</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Accessible Numbered Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#DEE7E2] pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="min-h-10 rounded-xl border border-[#DEE7E2] bg-white px-4 text-xs font-bold text-[#112822] hover:bg-[#F5F8F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`size-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#112822] text-white shadow-sm'
                    : 'bg-white border border-[#DEE7E2] text-[#556D66] hover:bg-[#F5F8F6]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="min-h-10 rounded-xl border border-[#DEE7E2] bg-white px-4 text-xs font-bold text-[#112822] hover:bg-[#F5F8F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
