import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
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
} from 'lucide-react'

export default function DoctorPatients() {
  const { patients, setSelectedPatientId } = useVivans()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterAttention, setFilterAttention] = useState<
    'todos' | 'regulares' | 'atrasados' | 'atencao'
  >('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 4

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

  const handleFilterChange = (filter: 'todos' | 'atencao' | 'regulares') => {
    setFilterAttention(filter)
    setCurrentPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Registro e Coorte Longitudinal de Pacientes · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Coorte Clínica Longitudinal
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Pacientes em Acompanhamento
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Visão longitudinal contínua: objetivos do paciente, linha do tempo e dossiê assistido
            por IA.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bfe4d8] bg-[#ebf6f2] px-4 py-2.5 text-xs text-[#075f50]">
          Total na Coorte: <strong>{patients.length} Pacientes em ciclo</strong> (15 Regulares · 4
          Atrasados · 3 Atenção)
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#dfe8e3] bg-white p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8ba29a]" />
          <input
            type="text"
            placeholder="Buscar por nome, foco ou sintoma..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#dfe8e3] pl-10 pr-4 py-2 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-[#60766f] mr-1">Filtrar:</span>
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
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:bg-[#f4f7f5]'
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

      {/* Patients Table / Editorial Cards */}
      <div className="grid gap-4">
        {displayedPatients.length === 0 ? (
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-12 text-center text-xs text-[#60766f]">
            Nenhum paciente encontrado para o filtro selecionado.
          </div>
        ) : (
          displayedPatients.map((p) => {
            return (
              <article
                key={p.id}
                className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm transition-all hover:border-[#0b7b68] hover:shadow-md"
              >
                <div className="grid gap-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">
                  {/* Patient summary */}
                  <div className="flex items-center gap-3.5">
                    <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-sm font-bold text-[#0b6a5b]">
                      {p.initials}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#17372f]">{p.name}</h3>
                      <p className="text-xs text-[#60766f]">{p.focus}</p>
                      <span className="text-[11px] text-[#8ba29a]">{p.cycle}</span>
                    </div>
                  </div>

                  {/* Longitudinal Metrics & Attention point */}
                  <div className="grid gap-3 sm:grid-cols-3 border-y sm:border-y-0 sm:border-x border-[#edf2ef] py-3 sm:py-0 sm:px-5">
                    <div>
                      <p className="text-[11px] text-[#698078] uppercase font-bold">Evolução</p>
                      <p className="text-base font-bold text-[#17372f]">{p.progress}</p>
                      <span className="text-[10px] text-[#0b7b68] font-medium">
                        Adesão {p.adherence}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#698078] uppercase font-bold">
                        Ponto de Atenção
                      </p>
                      <div className="mt-0.5">
                        <StatusBadge tone={p.tone}>{p.attention}</StatusBadge>
                      </div>
                      <span className="text-[10px] text-[#698078]">{p.lastContact}</span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#698078] uppercase font-bold">
                        Próxima Consulta
                      </p>
                      <p className="text-xs font-semibold text-[#17372f] mt-0.5">
                        {p.nextConsultation}
                      </p>
                      <span className="text-[10px] text-[#0b7b68]">{p.prescriptionCount}</span>
                    </div>
                  </div>

                  {/* Direct Action Links */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <Link
                      to={`/medico/pacientes/${p.id}`}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] transition-colors shadow-sm"
                    >
                      <span>Ver Prontuário &amp; Dossiê</span>
                      <ChevronRight className="size-4" />
                    </Link>

                    {p.name === 'Marina Costa' && (
                      <Link
                        to="/medico/consulta/apt-marina"
                        className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-[#dfe8e3] bg-white px-3 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
                      >
                        <span>Abrir Sala de Vídeo</span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      {/* Accessible Numbered Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#dfe8e3] pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="min-h-10 rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5] disabled:opacity-40 disabled:cursor-not-allowed"
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
                    ? 'bg-[#17372f] text-white shadow-sm'
                    : 'bg-white border border-[#dfe8e3] text-[#60766f] hover:bg-[#f4f7f5]'
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
            className="min-h-10 rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
