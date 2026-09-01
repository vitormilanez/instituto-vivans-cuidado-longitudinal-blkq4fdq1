import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
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
      <SimulationDisclaimer text="Carteira de Pacientes e Gestão de Coortes · Instituto Vivans" />

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

      {/* Patients Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((p) => (
          <article
            key={p.id}
            onClick={() => navigate(`/medico/pacientes/${p.id}`)}
            className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 shadow-card space-y-4 hover:border-[#2E5E4E]/50 hover:bg-[#FAF8F4] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#EFECE5] pb-3">
                <div className="flex items-center gap-3">
                  <VivansAvatar
                    src={p.avatarUrl}
                    name={p.name}
                    initials={p.initials}
                    size="md"
                    className="border border-[#E8E3D9]"
                  />
                  <div>
                    <h2 className="font-bold text-sm text-[#1E1E1C]">{p.name}</h2>
                    <span className="text-[11px] text-[#5C5C57]">{p.cycle}</span>
                  </div>
                </div>
                <StatusBadge tone={p.tone}>{p.attention}</StatusBadge>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs text-[#5C5C57]">
                  <strong className="text-[#1E1E1C]">Foco:</strong> {p.focus}
                </p>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="rounded-xl bg-[#FAF8F4] p-2 border border-[#E8E3D9]">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A84]">Adesão</span>
                    <p className="font-bold text-[#1E1E1C] text-sm mt-0.5">{p.adherence}</p>
                  </div>
                  <div className="rounded-xl bg-[#FAF8F4] p-2 border border-[#E8E3D9]">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A84]">Evolução</span>
                    <p className="font-bold text-[#2E5E4E] text-sm mt-0.5">{p.progress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EFECE5] pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#5C5C57]">{p.nextConsultation}</span>
              <span className="flex items-center gap-1 font-bold text-[#2E5E4E]">
                <span>Ver Prontuário</span>
                <ChevronRight className="size-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      <QuickConsultationModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        initialAction="video"
      />
    </div>
  )
}
