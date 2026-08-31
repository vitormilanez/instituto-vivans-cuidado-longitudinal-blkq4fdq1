import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer, UrgentCareWarning } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
} from 'lucide-react'

export default function PatientAppointments() {
  const { preConsultation } = useVivans()

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Agendamentos e Jornada de Consultas · Instituto Vivans" />

      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">Suas Consultas</p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white">
          Agenda e Acompanhamento Clínico
        </h1>
        <p className="mt-1 text-sm text-[#ADADAD]">
          Consultas presenciais e por telemedicina estruturadas para o cuidado longitudinal.
        </p>
      </section>

      {/* Main Appointment Highlight */}
      <article className="overflow-hidden rounded-3xl border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-xl space-y-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333333] pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3 py-1 text-xs font-bold text-[#0F0F0F]">
              <Calendar className="size-3.5" />
              <span>Próxima Consulta · Hoje</span>
            </span>
            <StatusBadge tone="green">Confirmada</StatusBadge>
          </div>
          <span className="text-xs text-[#ADADAD]">Telemedicina Segura</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Retorno de 30 Dias · Longevidade &amp; Metabolismo
            </h2>
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              Avaliação de adesão ao plano, resposta ao ajuste nutricional vespertino e alinhamento
              dos próximos 30 dias de acompanhamento.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#ADADAD]">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                <Clock className="size-4 text-[#D6B270]" />
                <span className="font-bold text-white">Hoje, às 10:30 (45 min)</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                <Video className="size-4 text-[#D6B270]" />
                <span className="font-bold text-white">Sala Virtual Google Meet</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#333333] bg-[#0F0F0F] p-4">
            <VivansAvatar
              src={DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#D6B270]/50"
            />
            <div>
              <p className="text-xs font-bold text-white">{DOCTOR_PROFILE.name}</p>
              <p className="text-[11px] font-mono text-[#D6B270]">{DOCTOR_PROFILE.crm}</p>
              <p className="text-[10px] text-[#ADADAD]">Médico Responsável</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#333333]">
          <Link
            to="/medico/consulta/apt-marina"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs sm:text-sm font-bold text-[#0F0F0F] hover:brightness-110 shadow-md transition-all active:scale-98"
          >
            <Video className="size-4.5" />
            <span>Entrar na Sala de Teleconsulta</span>
          </Link>

          <Link
            to="/paciente/pre-consulta"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#333333] bg-white/5 px-6 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all"
          >
            <Sparkles className="size-4 text-[#D6B270]" />
            <span>
              {preConsultation.completed
                ? 'Ver Síntese de Pré-Consulta Enviada'
                : 'Preencher Pré-Consulta Guiada'}
            </span>
          </Link>
        </div>
      </article>

      {/* Pre-Consultation Status Card */}
      <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#D6B270]" />
            <h3 className="font-serif text-lg font-bold text-white">
              Status da Pré-Consulta Guiada
            </h3>
          </div>
          {preConsultation.completed ? (
            <StatusBadge tone="green">Enviada ao Médico</StatusBadge>
          ) : (
            <StatusBadge tone="amber">Pendente de Preenchimento</StatusBadge>
          )}
        </div>

        <p className="text-xs text-[#CCCCCC] leading-relaxed">
          {preConsultation.completed
            ? 'Suas respostas foram compiladas em uma síntese clínica estruturada que já está disponível no prontuário do Dr. Guilherme.'
            : 'A pré-consulta leva menos de 4 minutos e permite que o médico inicie o atendimento conhecendo suas principais dúvidas e sintomas.'}
        </p>

        <div className="flex justify-end">
          <Link
            to="/paciente/pre-consulta"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6B270] hover:underline underline-offset-4"
          >
            <span>
              {preConsultation.completed
                ? 'Revisar ou editar respostas'
                : 'Iniciar pré-consulta guiada'}
            </span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Past History */}
      <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
        <h3 className="font-serif text-lg font-bold text-white">Histórico de Atendimentos</h3>

        <div className="space-y-3">
          <div className="rounded-2xl border border-[#333333] bg-[#141414] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Consulta de Abertura do Ciclo</span>
                <span className="text-[10px] text-[#888888]">Presencial · Instituto Vivans</span>
              </div>
              <p className="text-xs text-[#ADADAD]">
                28 de julho de 2024 · Definição do plano de longevidade de 90 dias
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#CCCCCC] self-start sm:self-auto">
              Realizada (100%)
            </span>
          </div>
        </div>
      </section>

      <UrgentCareWarning />
    </div>
  )
}
