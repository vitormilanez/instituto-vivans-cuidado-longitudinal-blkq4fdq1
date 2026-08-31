import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { QuickConsultationModal } from '@/components/QuickConsultationModal'
import {
  Users,
  Search,
  Filter,
  Plus,
  Video,
  FileText,
  ChevronRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'

export default function DoctorPatients() {
  const { patients, setSelectedPatientId } = useVivans()
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
              Gestão da Coorte
            </span>
            <StatusBadge tone="green">{patients.length} Cadastrados</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Carteira de Pacientes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#ADADAD]">
            Acompanhamento longitudinal de adesão, desfechos metabólicos e linha do tempo clínica.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickModalOpen(true)}
          className="flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="size-4 text-[#0F0F0F]" />
          <span>Cadastrar / Atender Novo</span>
        </button>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#333333] bg-[#1A1A1A] p-4 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Buscar por nome, foco clínico ou sintoma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#333333] bg-[#0F0F0F] pl-9 pr-4 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D6B270] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#888888] font-semibold mr-1">Status:</span>
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
                  ? 'bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/40'
                  : 'text-[#ADADAD] hover:text-white'
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
            className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-5 shadow-sm space-y-4 hover:border-[#D6B270]/50 hover:bg-[#1F1F1F] transition-all cursor-pointer flex flex-col justify-between backdrop-blur-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#333333] pb-3">
                <div className="flex items-center gap-3">
                  <VivansAvatar
                    src={p.avatarUrl}
                    name={p.name}
                    initials={p.initials}
                    size="md"
                    className="border border-[#333333]"
                  />
                  <div>
                    <h2 className="font-bold text-sm text-white">{p.name}</h2>
                    <span className="text-[11px] text-[#ADADAD]">{p.cycle}</span>
                  </div>
                </div>
                <StatusBadge tone={p.tone}>{p.attention}</StatusBadge>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs text-[#CCCCCC]">
                  <strong>Foco:</strong> {p.focus}
                </p>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="rounded-xl bg-[#0F0F0F] p-2 border border-[#333333]">
                    <span className="text-[10px] uppercase font-bold text-[#888888]">Adesão</span>
                    <p className="font-bold text-white text-sm mt-0.5">{p.adherence}</p>
                  </div>
                  <div className="rounded-xl bg-[#0F0F0F] p-2 border border-[#333333]">
                    <span className="text-[10px] uppercase font-bold text-[#888888]">Evolução</span>
                    <p className="font-bold text-[#D6B270] text-sm mt-0.5">{p.progress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#333333] pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#ADADAD]">{p.nextConsultation}</span>
              <span className="flex items-center gap-1 font-bold text-[#D6B270]">
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
