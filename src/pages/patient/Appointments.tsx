import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { Calendar, Video, Clock, CheckCircle2, FileText, ArrowRight, Sparkles } from 'lucide-react'

export default function PatientAppointments() {
  const { appointments, preConsultation } = useVivans()

  // Find Marina's appointment
  const marinaApt = appointments.find((a) => a.patient === 'Marina Costa') || appointments[1]

  const pastAppointments = [
    {
      id: 'past-1',
      date: '12 de agosto de 2026',
      type: 'Primeira Consulta · Longevidade e Emagrecimento',
      doctor: 'Dr. Guilherme Martins',
      summary:
        'Definição das metas de peso (80kg -> 72kg), início do plano de saciedade noturna e solicitação de exames laboratoriais.',
      documents: ['Síntese da Consulta (PDF)', 'Plano Inicial v1.0'],
    },
    {
      id: 'past-2',
      date: '15 de julho de 2026',
      type: 'Avaliação Metabólica Inicial',
      doctor: 'Dr. Guilherme Martins',
      summary:
        'Alinhamento do protocolo de acompanhamento contínuo e orientação de rotina matinal.',
      documents: ['Anamnese Completa'],
    },
  ]

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Agenda e Histórico de Consultas · Instituto Vivans" />

      {/* Header */}
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
          Consultas e Retornos
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
          Seus Atendimentos com o Dr. Guilherme
        </h1>
        <p className="mt-1 text-sm text-[#60766f]">
          Acompanhe suas consultas agendadas, pré-consulta conversacional e prontuários
          pós-atendimento.
        </p>
      </section>

      {/* Upcoming Consultation Hero */}
      <article className="rounded-3xl border border-[#9fc9bd] bg-white p-6 sm:p-7 shadow-[0_12px_34px_rgba(28,55,47,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68]">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Próxima Consulta Agendada
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                Hoje, 25 de agosto · 10:30
              </h2>
            </div>
          </div>
          <StatusBadge tone="green">Confirmada</StatusBadge>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#60766f]">
              <Clock className="size-4 text-[#0b7b68]" />
              <span>Duração estimada: 30 minutos · Modalidade: Vídeo ao vivo</span>
            </div>
            <p className="text-xs sm:text-sm text-[#45655c] leading-relaxed">
              <strong>Objetivo registrado:</strong> “{preConsultation.objective}”
            </p>

            <div className="rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#17372f]">Status da Pré-consulta:</span>
                <StatusBadge tone={preConsultation.completed ? 'green' : 'amber'}>
                  {preConsultation.completed ? 'Enviada e Vinculada' : 'Pendente de envio'}
                </StatusBadge>
              </div>
              <p className="text-[#698078]">
                {preConsultation.completed
                  ? 'O Dr. Guilherme já recebeu a síntese do seu sono e saciedade para guiar a consulta.'
                  : 'Preencha a pré-consulta para que o médico conheça suas prioridades antes de entrar na sala.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <Link
              to="/medico/consulta/apt-marina"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#0b7b68] px-6 text-sm font-bold text-white shadow-md hover:bg-[#096656] transition-colors"
            >
              <Video className="size-4" />
              <span>Entrar na Sala Virtual</span>
            </Link>
            <Link
              to="/paciente/pre-consulta"
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5] transition-colors"
            >
              <Sparkles className="size-4 text-[#0b7b68]" />
              <span>
                {preConsultation.completed
                  ? 'Ver Resumo da Pré-Consulta'
                  : 'Fazer Pré-Consulta Estruturada'}
              </span>
            </Link>{' '}
          </div>
        </div>
      </article>

      {/* History Timeline */}
      <section className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#17372f]">Histórico de Consultas</h3>

        <div className="space-y-4">
          {pastAppointments.map((past) => (
            <div
              key={past.id}
              className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#0b7b68]">{past.date}</span>
                  <h4 className="font-serif text-base font-bold text-[#17372f]">{past.type}</h4>
                </div>
                <StatusBadge tone="gray">Concluída</StatusBadge>
              </div>

              <p className="text-xs text-[#526a62] leading-relaxed">{past.summary}</p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#edf2ef]">
                {past.documents.map((doc) => (
                  <span
                    key={doc}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe8e3] bg-[#f8faf9] px-3 py-1.5 text-xs text-[#17372f] font-medium"
                  >
                    <FileText className="size-3.5 text-[#0b7b68]" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
