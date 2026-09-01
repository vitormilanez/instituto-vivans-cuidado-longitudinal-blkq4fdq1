import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { QuickConsultationModal } from '@/components/QuickConsultationModal'
import { Search, Plus, ChevronRight } from 'lucide-react'

export default function DoctorPatients() {
  const { patients } = useVivans()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterTone, setFilterTone] = useState<'todos' | 'green' | 'amber' | 'rose'>('todos')
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false)

  const filteredPatients = patients.filter((p) => {
    const matches =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.attention.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matches) return false
    if (filterTone === 'todos') return true
    return p.tone === filterTone
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Gestão da Coorte
            </span>
            <StatusBadge tone="green">{patients.length} Cadastrados</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Carteira de Pacientes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5C57]">
            Acompanhamento longitudinal de adesão, desfechos metabólicos e linha do tempo clínica.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickModalOpen(true)}
          className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="size-4 text-[#FFFFFF]" />
          <span>Cadastrar / Atender Novo</span>
        </button>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 shadow-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8A84]" />
          <input
            type="text"
            placeholder="Buscar por nome, foco clínico ou sintoma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] pl-9 pr-4 py-2 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#5C5C57] font-semibold mr-1">Status:</span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'green', label: 'Regulares' },
            { id: 'amber', label: 'Atrasados' },
            { id: 'rose', label: 'Atenção' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterTone(f.id as any)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                filterTone === f.id
                  ? 'bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle & Count Indicator */}
      <div className="flex items-center justify-between px-1 text-xs text-[#5C5C57]">
        <span>
          Mostrando{' '}
          <strong className="text-[#1E1E1C] font-semibold">{filteredPatients.length}</strong> de{' '}
          {patients.length} pacientes
        </span>
        <span className="text-[11px] text-[#8A8A84] hidden sm:inline">
          Toque em qualquer paciente para abrir o prontuário completo
        </span>
      </div>

      {/* Patients List with warm ivory / sage green editorial styling */}
      <div className="space-y-3.5">
        {filteredPatients.map((p) => (
          <article
            key={p.id}
            onClick={() => navigate(`/medico/pacientes/${p.id}`)}
            className="group relative rounded-2xl sm:rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 sm:p-5 shadow-sm hover:shadow-card hover:border-[#2E5E4E]/40 hover:bg-[#FAF8F4] transition-all cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left & Center: Portrait, Full Name, Focus & Subtle Indicator */}
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <VivansAvatar
                  src={p.avatarUrl}
                  name={p.name}
                  initials={p.initials}
                  size="lg"
                  className="border-2 border-[#FAF8F4] group-hover:border-[#C3D6CC] shadow-subtle shrink-0 transition-colors"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  {/* Row 1: Full Name (never truncated) & Subtle Symptom / Status Indicator */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors whitespace-normal leading-snug">
                      {p.name}
                    </h2>

                    {/* Subtle Symptom Indicator (small dot + discrete text, no heavy fill) */}
                    <div className="inline-flex items-center gap-1.5 py-0.5 text-xs">
                      <StatusBadge tone={p.tone} variant="subtle">
                        {p.attention}
                      </StatusBadge>
                    </div>
                  </div>

                  {/* Row 2: Focus & Clinical Context */}
                  <p className="text-xs text-[#5C5C57] leading-relaxed">{p.focus}</p>

                  {/* Row 3: Secondary Info in muted gray font for visual breathing room */}
                  <p className="text-[11px] text-[#8A8A84]">{p.cycle}</p>
                </div>
              </div>

              {/* Right: Adherence & Next Appointment + Discrete Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-[#EFECE5] shrink-0">
                {/* Adherence & Next Appointment */}
                <div className="text-left md:text-right space-y-0.5">
                  <div className="flex items-baseline md:justify-end gap-1.5">
                    <span className="text-xs font-bold text-[#1E1E1C]">{p.adherence}</span>
                    <span className="text-[11px] text-[#5C5C57]">adesão</span>
                    {p.progress && (
                      <span className="text-[11px] font-medium text-[#2E5E4E] ml-1">
                        ({p.progress})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C5C57]">{p.nextConsultation}</p>
                </div>

                {/* Discrete Prontuário link/action button */}
                <div className="flex items-center gap-1 text-xs font-bold text-[#2E5E4E] group-hover:translate-x-0.5 transition-transform">
                  <span className="hidden sm:inline text-xs font-semibold text-[#5C5C57] group-hover:text-[#2E5E4E]">
                    Prontuário
                  </span>
                  <div className="size-8 rounded-full bg-[#FAF8F4] group-hover:bg-[#E7EFEA] border border-[#E8E3D9] group-hover:border-[#C3D6CC] flex items-center justify-center transition-colors">
                    <ChevronRight className="size-4 text-[#2E5E4E]" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredPatients.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#E8E3D9] bg-[#FAF8F4] p-8 text-center text-xs text-[#8A8A84]">
            Nenhum paciente encontrado com o filtro aplicado.
          </div>
        )}
      </div>

      <QuickConsultationModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        initialAction="video"
      />
    </div>
  )
}
