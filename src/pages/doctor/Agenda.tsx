import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileText,
  User,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarCheck,
  Plus,
} from 'lucide-react'

export default function DoctorAgenda() {
  const { appointments, notify } = useVivans()
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
      <SimulationDisclaimer text="Agenda Clínica e Grade de Teleconsultas · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
              Grade de Atendimentos
            </span>
            <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agenda do Médico
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#ADADAD]">
            Gerenciamento de teleconsultas com Google Meet integrado e atendimentos presenciais.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
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
                  ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                  : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#333333] bg-[#1A1A1A] p-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#D6B270]" />
          <span className="font-bold text-[#CCCCCC]">Modalidade:</span>
          {(['todos', 'teleconsulta', 'presencial'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModalityFilter(m)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                modalityFilter === m
                  ? 'bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/40'
                  : 'text-[#ADADAD] hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#ADADAD]">
          {filteredAppointments.length} consultas nesta visualização
        </span>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {filteredAppointments.map((apt) => (
          <article
            key={apt.id}
            className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-5 sm:p-6 shadow-sm space-y-4 hover:border-[#D6B270]/40 transition-all backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#333333] pb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-xl bg-[#D6B270]/15 text-[#E8C391] border border-[#D6B270]/30 px-2.5 py-1 font-mono text-xs font-bold">
                  {apt.time}
                </span>
                <StatusBadge tone={apt.statusTone || 'green'}>{apt.status}</StatusBadge>
                <span className="text-xs text-[#ADADAD]">• {apt.modality}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/medico/pacientes/${apt.patientId || 'marina-costa'}`}
                  className="flex min-h-9 items-center gap-1 rounded-xl border border-[#333333] bg-white/5 px-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <FileText className="size-3.5 text-[#D6B270]" />
                  <span>Prontuário</span>
                </Link>

                <Link
                  to={`/medico/consulta/${apt.id}`}
                  className="flex min-h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-sm transition-all"
                >
                  <Video className="size-3.5 text-[#0F0F0F]" />
                  <span>Entrar no Meet</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] items-center">
              <VivansAvatar
                src={
                  apt.patient === 'Marina Costa'
                    ? 'https://img.usecurling.com/ppl/512?gender=female&seed=88'
                    : apt.patient === 'Ana Ribeiro'
                      ? 'https://img.usecurling.com/ppl/512?gender=female&seed=42'
                      : 'https://img.usecurling.com/ppl/512?gender=male&seed=33'
                }
                name={apt.patient}
                initials={apt.initials}
                size="lg"
                className="border border-[#333333]"
              />

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white">{apt.patient}</h3>
                <p className="text-xs text-[#CCCCCC]">{apt.type}</p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-[#ADADAD]">
                  <span>Objetivo: {apt.objective}</span>
                </div>
              </div>

              {/* Pre-visit status */}
              <div className="rounded-2xl border border-[#D6B270]/30 bg-[#0F0F0F] p-3 text-xs space-y-1 text-right">
                <span className="font-bold text-[#E8C391] block">{apt.preVisit}</span>
                <span className="text-[11px] text-[#888888]">
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
