import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { Calendar as CalendarIcon, Video, FileText, Filter } from 'lucide-react'

export default function DoctorAgenda() {
  const { appointments } = useVivans()
  const [selectedDay, setSelectedDay] = useState<'hoje' | 'amanha' | 'semana'>('hoje')
  const [modalityFilter, setModalityFilter] = useState<'todos' | 'teleconsulta' | 'presencial'>(
    'todos',
  )

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDay === 'hoje' && !apt.date.toLowerCase().includes('hoje')) return false
    if (selectedDay === 'amanha' && !apt.date.toLowerCase().includes('amanhã')) return false

    if (modalityFilter === 'teleconsulta' && !apt.modality.toLowerCase().includes('teleconsulta'))
      return false
    if (modalityFilter === 'presencial' && !apt.modality.toLowerCase().includes('presencial'))
      return false

    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Grade de Atendimentos
            </span>
            <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Agenda do Médico
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5C57]">
            Gerenciamento de consultas online integradas e atendimentos presenciais.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-1 shadow-subtle">
          {[
            { id: 'hoje', label: 'Hoje (25 ago)' },
            { id: 'amanha', label: 'Amanhã (26 ago)' },
            { id: 'semana', label: 'Esta Semana' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDay(d.id as any)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                selectedDay === d.id
                  ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 text-xs shadow-card">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#2E5E4E]" />
          <span className="font-bold text-[#1E1E1C]">Modalidade:</span>
          {(['todos', 'teleconsulta', 'presencial'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModalityFilter(m)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                modalityFilter === m
                  ? 'bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#5C5C57]">
          {filteredAppointments.length} consultas nesta visualização
        </span>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {filteredAppointments.map((apt) => (
          <article
            key={apt.id}
            className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 shadow-card space-y-4 hover:border-[#2E5E4E]/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE5] pb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] px-2.5 py-1 font-mono text-xs font-bold">
                  {apt.time}
                </span>
                <StatusBadge tone={apt.statusTone || 'green'}>{apt.status}</StatusBadge>
                <span className="text-xs text-[#5C5C57]">• {apt.modality}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/medico/pacientes/${apt.patientId || 'marina-costa'}`}
                  className="flex min-h-9 items-center gap-1 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-3 text-xs font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-colors"
                >
                  <FileText className="size-3.5 text-[#2E5E4E]" />
                  <span>Prontuário</span>
                </Link>

                <Link
                  to={`/medico/consulta/${apt.id}`}
                  className="flex min-h-9 items-center gap-1.5 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all"
                >
                  <Video className="size-3.5 text-[#FFFFFF]" />
                  <span>Entrar na Consulta</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] items-center">
              <VivansAvatar
                src={apt.patientAvatarUrl}
                name={apt.patient}
                initials={apt.initials}
                size="md"
                className="border border-[#E8E3D9] shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">{apt.patient}</h3>
                <p className="text-xs text-[#5C5C57]">{apt.type}</p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-[#8A8A84]">
                  <span>Objetivo: {apt.objective}</span>
                </div>
              </div>

              {/* Pre-visit status */}
              <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs space-y-1 text-right">
                <span className="font-bold text-[#2E5E4E] block">{apt.preVisit}</span>
                <span className="text-[11px] text-[#5C5C57]">
                  {apt.preVisitTone === 'green'
                    ? '✓ Resumo estruturado pronto'
                    : 'Pendente de envio'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
