import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import {
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle2,
  Bell,
  TrendingDown,
} from 'lucide-react'

export default function DoctorOverview() {
  const { patients, appointments, reports, nudged, nudgeDelayedPatients, notify } = useVivans()
  const navigate = useNavigate()

  const [selectedAlert, setSelectedAlert] = useState<{
    patient: string
    title: string
    context: string
    tag: string
    tone: 'amber' | 'rose' | 'blue'
  } | null>(null)

  const alerts = [
    {
      patient: 'Marina Costa',
      title: 'Sono abaixo do padrão por 4 noites',
      context:
        'Média de 5h42 com despertares entre 3h e 4h. Pré-consulta correlaciona com horário do jantar.',
      tag: 'Revisar hoje (10:30)',
      tone: 'amber' as const,
    },
    {
      patient: 'Paulo Mendes',
      title: 'Relatou enjoo após atualização do plano',
      context:
        'Novo sintoma informado no check-in das 08:12. Avaliar tolerância e conduta na consulta das 16:30.',
      tag: 'Novo sintoma',
      tone: 'rose' as const,
    },
    {
      patient: 'Ana Ribeiro',
      title: 'Relatório mensal pronto para validação',
      context:
        'Adesão de 88% e ganho de 12% na força funcional. Síntese preparada pela IA aguardando assinatura.',
      tag: 'Relatório mensal',
      tone: 'blue' as const,
    },
  ]

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Painel do Médico (Dr. Guilherme Martins) · Instituto Vivans Longitudinal Care" />

      {/* Greeting & Date Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="gray">Terça-feira, 25 de agosto de 2026</StatusBadge>
            <StatusBadge tone="green">5 Consultas Agendadas</StatusBadge>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#17372f] sm:text-4xl">
            Bom dia, Dr. Guilherme
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Visão longitudinal da sua coorte de pacientes. Casos que demandam atenção organizados
            por exceção.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={nudged}
            onClick={nudgeDelayedPatients}
            className={`min-h-11 rounded-2xl px-5 text-xs font-bold transition-all shadow-sm ${
              nudged
                ? 'bg-[#dfe8e3] text-[#698078] cursor-default'
                : 'bg-[#17372f] text-white hover:bg-[#0e2721]'
            }`}
          >
            {nudged ? 'Lembrete enviado aos 5 atrasados' : 'Dar um cutucão nos 5 atrasados'}
          </button>
        </div>
      </section>

      {/* 3 Executive Summary KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div
          onClick={() => navigate('/medico/agenda')}
          className="cursor-pointer rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm transition-all hover:border-[#0b7b68] hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-[#698078]">
            <span className="font-bold uppercase tracking-wider text-[#0b7b68]">Agenda do Dia</span>
            <Calendar className="size-4 text-[#0b7b68]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#17372f]">5</p>
          <p className="mt-1 text-xs text-[#60766f]">Próxima às 10:30 (Marina Costa)</p>
        </div>

        <div
          onClick={() => {
            document.getElementById('atencao-box')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="cursor-pointer rounded-3xl border border-[#f0d59c] bg-[#fffbf2] p-5 shadow-sm transition-all hover:border-[#e49d45] hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-[#805f24]">
            <span className="font-bold uppercase tracking-wider text-[#825b0b]">
              Caixa de Atenção
            </span>
            <AlertTriangle className="size-4 text-[#e49d45]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#70480e]">3</p>
          <p className="mt-1 text-xs text-[#825b0b]">1 novo sintoma + 2 desvios de sono/plano</p>
        </div>

        <div
          onClick={() => navigate('/medico/relatorios')}
          className="cursor-pointer rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm transition-all hover:border-[#456b9c] hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-[#698078]">
            <span className="font-bold uppercase tracking-wider text-[#456b9c]">
              Relatórios na Fila
            </span>
            <FileText className="size-4 text-[#456b9c]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#17372f]">4</p>
          <p className="mt-1 text-xs text-[#60766f]">2 prontos para validação médica</p>
        </div>
      </section>

      {/* Main Grid: Attention Box by Exception & Day Timeline */}
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Caixa de Atenção Organizada por Exceção */}
        <section id="atencao-box" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#e49d45]" />
              <h2 className="font-serif text-xl font-bold text-[#17372f]">
                Caixa de Atenção (Por Exceção)
              </h2>
            </div>
            <StatusBadge tone="amber">3 Casos Prioritários</StatusBadge>
          </div>

          <div className="space-y-3">
            {alerts.map((al) => (
              <div
                key={al.patient}
                onClick={() => setSelectedAlert(al)}
                className="cursor-pointer rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm transition-all hover:border-[#0b7b68] hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17372f] text-sm">{al.patient}</span>
                    <StatusBadge tone={al.tone}>{al.tag}</StatusBadge>
                  </div>
                  <span className="text-xs font-bold text-[#0b7b68] flex items-center gap-1">
                    <span>Revisar Contexto</span>
                    <ChevronRight className="size-3.5" />
                  </span>
                </div>

                <p className="font-semibold text-xs text-[#17372f] mb-1">{al.title}</p>
                <p className="text-xs text-[#60766f] leading-relaxed">{al.context}</p>
              </div>
            ))}
          </div>

          {/* AI Copilot Badge */}
          <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b] flex items-start gap-2.5">
            <Sparkles className="size-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Triagem Inteligente Segura:</strong> O sistema correlaciona biossinais e
              relatos para destacar exceções. Nenhuma conduta clínica ou diagnóstico é emitido
              autonomamente.
            </p>
          </div>
        </section>

        {/* Timeline of Today's Consultations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-[#0b7b68]" />
              <h2 className="font-serif text-xl font-bold text-[#17372f]">
                Agenda do Dia em Linha do Tempo
              </h2>
            </div>
            <Link to="/medico/agenda" className="text-xs font-bold text-[#0b6a5b] hover:underline">
              Ver completa &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`rounded-3xl border p-4.5 transition-all ${
                  apt.patient === 'Marina Costa'
                    ? 'border-[#0b7b68] bg-[#f8faf9] ring-2 ring-[#0b7b68]/15 shadow-sm'
                    : 'border-[#dfe8e3] bg-white hover:border-[#b9d8cf]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#17372f] bg-[#f4f7f5] px-2 py-1 rounded-lg">
                      {apt.time}
                    </span>
                    <strong className="text-sm text-[#17372f]">{apt.patient}</strong>
                  </div>
                  <StatusBadge tone={apt.statusTone}>{apt.status}</StatusBadge>
                </div>

                <p className="text-xs text-[#60766f] mb-3">
                  {apt.type} · <em>{apt.preVisit}</em>
                </p>

                <div className="flex items-center justify-between gap-2 border-t border-[#edf2ef] pt-3">
                  <Link
                    to={`/medico/pacientes/${apt.patient.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-semibold text-[#60766f] hover:text-[#17372f]"
                  >
                    Prontuário Longitudinal
                  </Link>
                  <Link
                    to={`/medico/consulta/${apt.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#0b7b68] hover:underline"
                  >
                    <span>Entrar na Consulta</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Alert Drawer / Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
              <div className="flex items-center gap-2">
                <StatusBadge tone={selectedAlert.tone}>{selectedAlert.tag}</StatusBadge>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  {selectedAlert.patient}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-full p-1.5 text-[#60766f] hover:bg-[#f4f7f5]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-[#45655c]">
              <div>
                <strong className="text-sm text-[#17372f] block mb-1">{selectedAlert.title}</strong>
                <p>{selectedAlert.context}</p>
              </div>

              <div className="rounded-2xl bg-[#f4f7f5] p-4 text-[#17372f] space-y-2">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#0b7b68]">
                  Ações Recomendadas para o Médico:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[#60766f]">
                  <li>Abrir prontuário longitudinal para cruzar dados históricos.</li>
                  <li>
                    Avaliar na consulta se há necessidade de ajuste de posologia ou crononutrição.
                  </li>
                  <li>Enviar mensagem rápida de acolhimento se for o caso.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="min-h-10 rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f]"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const targetPatient = selectedAlert.patient
                  setSelectedAlert(null)
                  navigate(`/medico/pacientes/${targetPatient.toLowerCase().replace(/\s+/g, '-')}`)
                }}
                className="min-h-10 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656]"
              >
                Abrir Prontuário do Paciente &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
