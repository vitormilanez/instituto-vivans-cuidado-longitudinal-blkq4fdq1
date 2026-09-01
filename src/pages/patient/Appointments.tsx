import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer, UrgentCareWarning } from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import { Calendar, Clock, Video, Sparkles, ChevronRight } from 'lucide-react'

export default function PatientAppointments() {
  const { preConsultation } = useVivans()

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Agendamentos e Jornada de Consultas · Instituto Vivans" />

      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">Suas Consultas</p>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Agenda e Acompanhamento Clínico
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5C5C57]">
          Consultas presenciais e por telemedicina estruturadas para o cuidado longitudinal.
        </p>
      </section>

      {/* Main Appointment Highlight */}
      <article className="overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 text-[#1E1E1C] shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE5] pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E7EFEA] border border-[#C3D6CC] px-3 py-1 text-xs font-bold text-[#2E5E4E]">
              <Calendar className="size-3.5" />
              <span>Próxima Consulta · Hoje</span>
            </span>
            <StatusBadge tone="green">Confirmada</StatusBadge>
          </div>
          <span className="text-xs text-[#5C5C57]">Telemedicina Segura</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1E1C]">
              Retorno de 30 Dias · Longevidade &amp; Metabolismo
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
              Avaliação de adesão ao plano, resposta ao ajuste nutricional vespertino e alinhamento
              dos próximos 30 dias de acompanhamento.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#5C5C57]">
              <div className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1.5">
                <Clock className="size-4 text-[#2E5E4E]" />
                <span className="font-bold text-[#1E1E1C]">Hoje, às 10:30 (45 min)</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1.5">
                <Video className="size-4 text-[#2E5E4E]" />
                <span className="font-bold text-[#1E1E1C]">Sala Virtual Google Meet</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4">
            <VivansAvatar
              src={DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#2E5E4E]/40"
            />
            <div>
              <p className="text-xs font-bold text-[#1E1E1C]">{DOCTOR_PROFILE.name}</p>
              <p className="text-[11px] font-mono text-[#2E5E4E] font-semibold">
                {DOCTOR_PROFILE.crm}
              </p>
              <p className="text-[10px] text-[#5C5C57]">Médico Responsável</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#EFECE5]">
          <Link
            to="/medico/consulta/apt-marina"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2E5E4E] px-6 text-xs sm:text-sm font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all active:scale-95"
          >
            <Video className="size-4" />
            <span>Entrar na Sala de Teleconsulta</span>
          </Link>

          <Link
            to="/paciente/pre-consulta"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] px-6 text-xs sm:text-sm font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-all"
          >
            <Sparkles className="size-4 text-[#2E5E4E]" />
            <span>
              {preConsultation.completed
                ? 'Ver Síntese de Pré-Consulta Enviada'
                : 'Preencher Pré-Consulta Guiada'}
            </span>
          </Link>
        </div>
      </article>

      {/* Pre-Consultation Status Card */}
      <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#2E5E4E]" />
            <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
              Status da Pré-Consulta Guiada
            </h3>
          </div>
          {preConsultation.completed ? (
            <StatusBadge tone="green">Enviada ao Médico</StatusBadge>
          ) : (
            <StatusBadge tone="amber">Pendente de Preenchimento</StatusBadge>
          )}
        </div>

        <p className="text-xs text-[#5C5C57] leading-relaxed">
          {preConsultation.completed
            ? 'Suas respostas foram compiladas em uma síntese clínica estruturada que já está disponível no prontuário do Dr. Guilherme.'
            : 'A pré-consulta leva menos de 4 minutos e permite que o médico inicie o atendimento conhecendo suas principais dúvidas e sintomas.'}
        </p>

        <div className="flex justify-end">
          <Link
            to="/paciente/pre-consulta"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E5E4E] hover:underline underline-offset-4"
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
      <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">Histórico de Atendimentos</h3>

        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1E1E1C]">
                  Consulta de Abertura do Ciclo
                </span>
                <span className="text-[10px] text-[#8A8A84]">Presencial · Instituto Vivans</span>
              </div>
              <p className="text-xs text-[#5C5C57]">
                28 de julho de 2024 · Definição do plano de longevidade de 90 dias
              </p>
            </div>
            <span className="rounded-full bg-[#E7EFEA] border border-[#C3D6CC] px-3 py-1 text-xs font-semibold text-[#2E5E4E] self-start sm:self-auto">
              Realizada (100%)
            </span>
          </div>
        </div>
      </section>

      <UrgentCareWarning />
    </div>
  )
}
