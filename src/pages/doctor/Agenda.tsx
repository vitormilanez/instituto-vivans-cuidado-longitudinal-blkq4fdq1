import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileText,
  Filter,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  UserCheck,
} from 'lucide-react'

export default function DoctorAgenda() {
  const { appointments, notify } = useVivans()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === 'todos') return true
    if (filterStatus === 'confirmadas')
      return apt.status === 'Confirmada' || apt.status === 'Próxima'
    if (filterStatus === 'concluidas') return apt.status === 'Concluída'
    if (filterStatus === 'atencao') return apt.status === 'A confirmar'
    return true
  })

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Agenda Clínica e Preparação de Consultas · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Agenda do Dr. Guilherme Martins
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Consultas e Atendimentos
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Acesso direto ao preparo de pré-consulta e ao ambiente de teleconsulta com copiloto
            clínico.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-2xl border border-[#dfe8e3] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'dia'
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:text-[#17372f]'
              }`}
            >
              Visão do Dia (Hoje)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'semana'
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:text-[#17372f]'
              }`}
            >
              Visão Semanal
            </button>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe8e3] bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#60766f] flex items-center gap-1 mr-2">
            <Filter className="size-3.5" />
            <span>Filtrar por:</span>
          </span>
          {[
            { id: 'todos', label: 'Todas (5)' },
            { id: 'confirmadas', label: 'Confirmadas (3)' },
            { id: 'concluidas', label: 'Concluídas (1)' },
            { id: 'atencao', label: 'Requer Atenção (1)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatus(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterStatus === f.id
                  ? 'bg-[#e8f4f0] text-[#0b6a5b] border border-[#c2e2d8]'
                  : 'text-[#60766f] hover:bg-[#f4f7f5]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#698078]">
          Exibindo <strong>{filteredAppointments.length}</strong> consultas
        </div>
      </div>

      {/* Appointments List View */}
      {viewMode === 'dia' ? (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="rounded-3xl border border-[#dfe8e3] bg-white p-12 text-center text-xs text-[#60766f]">
              Nenhuma consulta encontrada para o filtro selecionado.
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const isCurrent = apt.patient === 'Marina Costa'
              return (
                <article
                  key={apt.id}
                  className={`rounded-3xl border p-6 transition-all ${
                    isCurrent
                      ? 'border-[#0b7b68] bg-[#f8faf9] ring-2 ring-[#0b7b68]/20 shadow-md'
                      : 'border-[#dfe8e3] bg-white hover:border-[#b9d8cf] shadow-sm'
                  }`}
                >
                  <div className="grid gap-5 lg:grid-cols-[180px_1fr_auto] lg:items-center">
                    {/* Time & status */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-[#0b7b68]" />
                        <span className="font-mono text-lg font-bold text-[#17372f]">
                          {apt.time}
                        </span>
                      </div>
                      <StatusBadge tone={apt.statusTone}>{apt.status}</StatusBadge>
                      <p className="text-[11px] text-[#698078]">{apt.type}</p>
                    </div>

                    {/* Patient Context & Pre-Visit Synthesis */}
                    <div className="space-y-2 border-l border-[#edf2ef] pl-0 sm:pl-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#17372f]">
                          {apt.patient}
                        </h3>
                        <StatusBadge tone={apt.preVisitTone}>{apt.preVisit}</StatusBadge>
                      </div>

                      <p className="text-xs text-[#45655c] leading-relaxed">
                        <strong>Objetivo relatado:</strong> {apt.objective}
                      </p>

                      <div className="flex flex-wrap gap-2 text-[11px] text-[#698078]">
                        <span className="rounded-md bg-[#ebf6f2] px-2 py-0.5 font-semibold text-[#075f50]">
                          Foco Clínico: {apt.aiFocus}
                        </span>
                        {apt.metrics.map(([label, val, trend]) => (
                          <span
                            key={label}
                            className="rounded-md bg-white border border-[#dfe8e3] px-2 py-0.5"
                          >
                            {label}: <strong>{val}</strong> ({trend})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <Link
                        to={`/medico/consulta/${apt.id}`}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] transition-colors shadow-sm"
                      >
                        <Video className="size-3.5" />
                        <span>Abrir Sala de Consulta</span>
                      </Link>

                      <Link
                        to={`/medico/pacientes/${apt.patient.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5] transition-colors"
                      >
                        <FileText className="size-3.5 text-[#60766f]" />
                        <span>Dossiê Longitudinal</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      ) : (
        /* Week View Grid */
        <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-5 gap-4">
            {[
              {
                day: 'Segunda, 24 ago',
                count: '4 consultas',
                list: ['Lúcia Barbosa (Concluída)', 'Ana Ribeiro'],
              },
              {
                day: 'Terça, 25 ago (Hoje)',
                count: '5 consultas',
                list: [
                  '09:00 Lúcia B.',
                  '10:30 Marina C.',
                  '11:30 Rafael L.',
                  '14:00 Ana R.',
                  '16:30 Paulo M.',
                ],
              },
              {
                day: 'Quarta, 26 ago',
                count: '3 consultas',
                list: ['09:30 Carlos S.', '11:00 Beatriz M.', '15:00 Fernanda P.'],
              },
              {
                day: 'Quinta, 27 ago',
                count: '4 consultas',
                list: ['10:00 Jorge N.', '14:30 Marina C. (Acomp)', '16:00 Helena R.'],
              },
              {
                day: 'Sexta, 28 ago',
                count: '2 consultas',
                list: ['09:00 Sessão Clínica', '11:00 Roberto T.'],
              },
            ].map((col, idx) => (
              <div
                key={col.day}
                className={`rounded-2xl border p-4 space-y-3 ${
                  idx === 1 ? 'border-[#0b7b68] bg-[#f8faf9]' : 'border-[#edf2ef] bg-white'
                }`}
              >
                <div className="border-b border-[#edf2ef] pb-2">
                  <p className="text-xs font-bold text-[#17372f]">{col.day}</p>
                  <span className="text-[11px] text-[#0b7b68] font-semibold">{col.count}</span>
                </div>
                <div className="space-y-1.5">
                  {col.list.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#dfe8e3] bg-white p-2 text-xs font-medium text-[#45655c]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
