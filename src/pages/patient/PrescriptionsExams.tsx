import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  FileText,
  Pill,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  ShieldCheck,
  Activity,
  History,
  FileCheck,
  Stethoscope,
  ChevronRight,
  Search,
  Check,
  Info,
  ExternalLink,
  Printer,
  Download,
} from 'lucide-react'

export default function PatientPrescriptionsExams() {
  const {
    prescriptions,
    medications,
    exams,
    suggestedProcedures,
    requestPrescriptionRenewal,
    confirmProcedureInterest,
    notify,
  } = useVivans()

  const [activeTab, setActiveTab] = useState<
    'receitas' | 'medicamentos' | 'exames' | 'procedimentos'
  >('receitas')
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [renewalRequestedIds, setRenewalRequestedIds] = useState<string[]>([])

  // Filter for Marina Costa
  const marinaPrescriptions = prescriptions.filter((p) => p.patientId === 'marina-costa')
  const marinaMedications = medications.filter((m) => m.patientId === 'marina-costa')
  const marinaExams = exams.filter((e) => e.patientId === 'marina-costa')
  const marinaProcedures = suggestedProcedures.filter((p) => p.patientId === 'marina-costa')

  const activePrescription =
    marinaPrescriptions.find((p) => p.status === 'ativa') || marinaPrescriptions[0]
  const pastPrescriptions = marinaPrescriptions.filter((p) => p.id !== activePrescription?.id)

  const handleRequestRenewal = (rxId: string, rxTitle: string) => {
    requestPrescriptionRenewal(rxId)
    setRenewalRequestedIds((prev) => [...prev, rxId])
  }

  const handleSimulatedDownload = (title: string) => {
    notify(`Simulação: Documento "${title}" pronto para impressão/download seguro.`)
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Área do Paciente · Receitas & Exames do Instituto Vivans" />

      {/* Header with quick navigation tabs */}
      <section className="overflow-hidden rounded-3xl border border-[#bfe4d8] bg-gradient-to-br from-[#ebf6f2] via-[#f7faf8] to-white p-5 sm:p-7 shadow-[0_8px_24px_rgba(11,123,104,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b7b68] px-3 py-1 text-xs font-bold text-white shadow-xs">
                <FileText className="size-3.5" />
                <span>Prontuário Digital da Paciente</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#556d66] bg-white px-2.5 py-0.5 rounded-full border border-[#dfe8e3]">
                <ShieldCheck className="size-3.5 text-[#0b7b68]" />
                Validado pelo Dr. Guilherme Martins
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#17372f]">
              Receitas, Medicamentos &amp; Exames
            </h1>

            <p className="text-xs sm:text-sm text-[#45655c] leading-relaxed">
              Consulte suas prescrições vigentes, horários de suplementação, laudos laboratoriais e
              os procedimentos sugeridos pelo seu médico em um único ambiente seguro e transparente.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <VivansAvatar
              src={DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#b9d8cf] shadow-sm"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-[#17372f]">{DOCTOR_PROFILE.name}</p>
              <p className="text-[10px] font-mono text-[#0b7b68]">{DOCTOR_PROFILE.crm}</p>
              <p className="text-[10px] text-[#698078]">Médico Responsável</p>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[#d8ebe3] pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('receitas')}
            className={`min-h-10 rounded-2xl px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'receitas'
                ? 'bg-[#0b7b68] text-white shadow-sm'
                : 'bg-white text-[#45655c] border border-[#dfe8e3] hover:bg-[#edf7f4]'
            }`}
          >
            <FileCheck className="size-4" />
            <span>Receitas Médicas ({marinaPrescriptions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medicamentos')}
            className={`min-h-10 rounded-2xl px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'medicamentos'
                ? 'bg-[#0b7b68] text-white shadow-sm'
                : 'bg-white text-[#45655c] border border-[#dfe8e3] hover:bg-[#edf7f4]'
            }`}
          >
            <Pill className="size-4" />
            <span>Medicamentos em Uso ({marinaMedications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exames')}
            className={`min-h-10 rounded-2xl px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'exames'
                ? 'bg-[#0b7b68] text-white shadow-sm'
                : 'bg-white text-[#45655c] border border-[#dfe8e3] hover:bg-[#edf7f4]'
            }`}
          >
            <Activity className="size-4" />
            <span>Exames &amp; Laudos ({marinaExams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('procedimentos')}
            className={`min-h-10 rounded-2xl px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'procedimentos'
                ? 'bg-[#0b7b68] text-white shadow-sm'
                : 'bg-white text-[#45655c] border border-[#dfe8e3] hover:bg-[#edf7f4]'
            }`}
          >
            <Stethoscope className="size-4" />
            <span>Procedimentos Sugeridos ({marinaProcedures.length})</span>
          </button>
        </div>
      </section>

      {/* TAB 1: RECEITAS MÉDICAS */}
      {activeTab === 'receitas' && (
        <div className="space-y-6 animate-fade-in">
          {/* Active Prescription Hero */}
          {activePrescription && (
            <article className="overflow-hidden rounded-3xl border-2 border-[#0b7b68] bg-white p-5 sm:p-7 shadow-[0_12px_32px_rgba(11,123,104,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#0b7b68] text-white">
                    <FileCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b7b68]">
                        Receita Vigente
                      </span>
                      <StatusBadge tone="green">Ativa</StatusBadge>
                    </div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#17372f]">
                      {activePrescription.title}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#17372f] bg-[#f4f7f5] px-2.5 py-1 rounded-lg border border-[#dfe8e3] block">
                    {activePrescription.code}
                  </span>
                  <span className="text-[11px] text-[#698078] block mt-1">
                    Emitida em {activePrescription.issuedAt}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#556d66]">
                  Itens Prescritos pelo Médico
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {activePrescription.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#bfe4d8] bg-[#f8fcfb] p-4 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-sm font-bold text-[#17372f]">
                            {item.medication}
                          </strong>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-mono font-bold text-[#0b7b68] border border-[#bfe4d8] shrink-0">
                            {item.dosage}
                          </span>
                        </div>
                        <p className="text-xs text-[#075f50] font-medium mt-1">
                          Posologia: {item.posology}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-[#526a62] italic mt-2 bg-white/70 p-2 rounded-xl border border-[#dfe8e3]">
                            Nota clínica: {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-[#dfe8e3] flex items-center justify-between text-[11px] text-[#698078]">
                        <span>
                          Qtd: <strong>{item.quantity}</strong>
                        </span>
                        <span className="text-[#0b7b68] font-semibold">Uso contínuo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Instructions & Validity */}
              <div className="mt-5 rounded-2xl bg-[#f4f7f5] p-4 border border-[#dfe8e3] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#17372f]">
                  <Info className="size-4 text-[#0b7b68]" />
                  <span>Orientações Gerais do Médico</span>
                </div>
                <p className="text-xs text-[#45655c] leading-relaxed">
                  {activePrescription.instructions}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#698078] border-t border-[#e2ece8]">
                  <span>
                    Validade:{' '}
                    <strong className="text-[#17372f]">{activePrescription.validUntil}</strong>
                  </span>
                  <span className="font-mono text-[10px] text-[#556d66]">
                    Assinatura Digital ICP-Brasil: {activePrescription.digitalSignatureId}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Request Renewal & Simulated Print */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2ef] pt-4">
                <div className="flex items-center gap-2">
                  {renewalRequestedIds.includes(activePrescription.id) ? (
                    <div className="flex items-center gap-1.5 rounded-xl bg-[#eaf3ef] px-4 py-2.5 text-xs font-bold text-[#075f50] border border-[#bfe4d8]">
                      <CheckCircle2 className="size-4" />
                      <span>Solicitação de Renovação Enviada ao Médico</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleRequestRenewal(activePrescription.id, activePrescription.title)
                      }
                      className="min-h-11 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Send className="size-3.5" />
                      <span>Pedir Renovação de Receita</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSimulatedDownload(activePrescription.title)}
                    className="min-h-11 rounded-xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#45655c] hover:bg-[#f4f7f5] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="size-3.5 text-[#0b7b68]" />
                    <span>Baixar PDF (Simulação)</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#8c9e97] italic max-w-xs text-right">
                  Demonstração simulada de visualização de prescrição eletrônica. Não substitui
                  receita médica física oficial.
                </p>
              </div>
            </article>
          )}

          {/* Prescription History / Timeline */}
          <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4 text-[#0b7b68]" />
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Histórico e Linha do Tempo de Receitas
                </h3>
              </div>
              <span className="text-xs text-[#698078]">
                {marinaPrescriptions.length} registros no prontuário
              </span>
            </div>

            <div className="space-y-3">
              {marinaPrescriptions.map((rx) => {
                const isSelected = selectedPrescriptionId === rx.id
                return (
                  <div
                    key={rx.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      rx.status === 'ativa'
                        ? 'border-[#0b7b68]/40 bg-[#fbfdfc]'
                        : 'border-[#dfe8e3] bg-white hover:border-[#b9d8cf]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid size-9 place-items-center rounded-xl font-mono text-xs font-bold ${
                            rx.status === 'ativa'
                              ? 'bg-[#eaf3ef] text-[#075f50]'
                              : 'bg-[#f4f7f5] text-[#698078]'
                          }`}
                        >
                          Rx
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#17372f]">{rx.title}</strong>
                            <StatusBadge tone={rx.status === 'ativa' ? 'green' : 'gray'}>
                              {rx.status === 'ativa'
                                ? 'Ativa'
                                : rx.status === 'renovada'
                                  ? 'Renovada'
                                  : 'Vencida'}
                            </StatusBadge>
                          </div>
                          <p className="text-xs text-[#698078]">
                            {rx.doctorName} ({rx.doctorCrm}) · Emitida em {rx.issuedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#556d66] bg-[#f4f7f5] px-2 py-1 rounded-lg">
                          {rx.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedPrescriptionId(isSelected ? null : rx.id)}
                          className="min-h-9 rounded-xl border border-[#dfe8e3] bg-white px-3 text-xs font-bold text-[#0b7b68] hover:bg-[#edf7f4] transition-colors"
                        >
                          {isSelected ? 'Ocultar Detalhes' : 'Ver Itens'}
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 border-t border-[#edf2ef] pt-3 animate-fade-in space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2 text-xs">
                          {rx.items.map((it, i) => (
                            <div
                              key={i}
                              className="rounded-xl bg-[#f8faf9] p-3 border border-[#edf2ef]"
                            >
                              <p className="font-bold text-[#17372f]">
                                {it.medication} ({it.dosage})
                              </p>
                              <p className="text-[11px] text-[#556d66] mt-0.5">{it.posology}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#698078] italic">
                          Orientações: {rx.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: MEDICAMENTOS EM USO */}
      {activeTab === 'medicamentos' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#edf2ef] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Rotina Diária de Suplementação &amp; Terapêutica
                </p>
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Medicamentos e Nutracêuticos em Uso
                </h2>
                <p className="text-xs text-[#60766f] mt-0.5">
                  Relação completa com horários programados, finalidade clínica e cuidados na
                  ingestão.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f4f7f5] px-4 py-2 border border-[#dfe8e3] text-xs font-semibold text-[#17372f]">
                {marinaMedications.length} itens ativos na rotina
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {marinaMedications.map((med) => (
                <div
                  key={med.id}
                  className="rounded-2xl border border-[#bfe4d8] bg-gradient-to-b from-[#f8fcfb] to-white p-5 space-y-3 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid size-9 place-items-center rounded-xl bg-[#eaf3ef] text-[#075f50]">
                        <Pill className="size-5" />
                      </div>
                      <span className="rounded-full bg-[#0b7b68] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                        {med.frequency}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-[#17372f] leading-snug">
                        {med.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-[#0b7b68] mt-0.5">
                        {med.dosage}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-[#dfe8e3] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#17372f]">
                        <Clock className="size-3.5 text-[#0b7b68]" />
                        <span>Horário: {med.timeSlots.join(', ')}</span>
                      </div>
                      <p className="text-[11px] text-[#45655c] leading-relaxed">
                        {med.instructions}
                      </p>
                    </div>

                    {med.purpose && (
                      <div className="text-[11px] text-[#556d66] bg-[#f4f7f5] p-2.5 rounded-xl border border-[#edf2ef]">
                        <strong>Finalidade:</strong> {med.purpose}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#edf2ef] flex items-center justify-between text-[10px] text-[#698078]">
                    <span>Prescrito: {med.prescribedAt}</span>
                    <span>{med.prescribedBy}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical Patient Tip */}
            <div className="rounded-2xl border border-[#bfe4d8] bg-[#eaf3ef]/70 p-4 text-xs text-[#075f50] flex items-start gap-3">
              <Sparkles className="size-5 text-[#0b7b68] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Dica de Adesão do Instituto Vivans:</strong>
                <span>
                  Você pode acompanhar a tomada desses medicamentos diretamente pela aba "Hoje" e
                  pelo seu "Plano de Cuidado", marcando a confirmação com 1 toque para ajudar o
                  médico a entender sua tolerância e regularidade.
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: EXAMES ANTERIORES & LAUDOS */}
      {activeTab === 'exames' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#edf2ef] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Central de Laudos &amp; Biomarcadores
                </p>
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Exames Anteriores e Resultados
                </h2>
                <p className="text-xs text-[#60766f] mt-0.5">
                  Resultados laboratoriais e bioimpedâncias com resumo explicativo e leitura
                  clínica.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f4f7f5] px-4 py-2 border border-[#dfe8e3] text-xs font-semibold text-[#17372f]">
                {marinaExams.length} laudos integrados
              </div>
            </div>

            {marinaExams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#dfe8e3] p-8 text-center space-y-2">
                <Activity className="size-8 mx-auto text-[#8c9e97]" />
                <p className="text-sm font-bold text-[#17372f]">
                  Nenhum exame cadastrado no momento.
                </p>
                <p className="text-xs text-[#698078]">
                  Assim que novos laudos forem liberados pelo laboratório, eles aparecerão aqui
                  automaticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {marinaExams.map((exam) => {
                  const isExpanded = selectedExamId === exam.id
                  return (
                    <article
                      key={exam.id}
                      className="rounded-2xl border border-[#dfe8e3] bg-white p-5 hover:border-[#0b7b68]/40 transition-all shadow-2xs space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="grid size-10 place-items-center rounded-xl bg-[#eaf3ef] text-[#075f50] shrink-0">
                            <Activity className="size-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-base font-bold text-[#17372f]">
                                {exam.title}
                              </h3>
                              <StatusBadge tone="green">Concluído</StatusBadge>
                              <span className="text-[10px] font-semibold text-[#556d66] bg-[#f4f7f5] px-2 py-0.5 rounded-md border border-[#dfe8e3]">
                                {exam.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#698078] mt-0.5">
                              Realizado em <strong>{exam.performedAt}</strong> · {exam.laboratory} ·
                              Solicitante: {exam.doctorRequester}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedExamId(isExpanded ? null : exam.id)}
                            className="min-h-9 rounded-xl border border-[#dfe8e3] bg-white px-3.5 text-xs font-bold text-[#0b7b68] hover:bg-[#edf7f4] transition-colors cursor-pointer"
                          >
                            {isExpanded ? 'Ocultar Parâmetros' : 'Ver Parâmetros Completos'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulatedDownload(exam.title)}
                            className="min-h-9 rounded-xl bg-[#f4f7f5] px-3 text-xs font-semibold text-[#45655c] hover:bg-[#dfe8e3] transition-colors"
                            title="Baixar Laudo PDF"
                          >
                            <Download className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Summary Banner */}
                      <div className="rounded-xl bg-[#f8faf9] p-3.5 border border-[#edf2ef] text-xs leading-relaxed text-[#17372f] space-y-1">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-[#0b7b68] block">
                          Resumo Clínico Estruturado:
                        </span>
                        <p>{exam.summary}</p>
                      </div>

                      {/* Biomarker highlights */}
                      {exam.highlights && exam.highlights.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#556d66] mb-2">
                            Destaques dos Biomarcadores
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                            {exam.highlights
                              .slice(0, isExpanded ? exam.highlights.length : 3)
                              .map((hl, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-xl border border-[#dfe8e3] bg-white p-3 space-y-1 flex flex-col justify-between"
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-medium text-[#17372f] text-[11px]">
                                      {hl.parameter}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                        hl.status === 'otimizado'
                                          ? 'bg-[#eaf3ef] text-[#075f50]'
                                          : hl.status === 'atencao'
                                            ? 'bg-[#fef7e7] text-[#7d5308]'
                                            : 'bg-[#f4f7f5] text-[#556d66]'
                                      }`}
                                    >
                                      {hl.status === 'otimizado'
                                        ? 'Otimizado'
                                        : hl.status === 'atencao'
                                          ? 'Atenção'
                                          : 'Normal'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-serif text-sm font-bold text-[#17372f]">
                                      {hl.value}
                                    </p>
                                    <p className="text-[10px] text-[#8c9e97]">
                                      Ref: {hl.reference}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Doctor Observation if expanded */}
                      {isExpanded && exam.doctorObservations && (
                        <div className="rounded-xl bg-[#ebf6f2] p-3.5 border border-[#bfe4d8] text-xs text-[#075f50] space-y-1 animate-fade-in">
                          <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <Stethoscope className="size-3.5" />
                            Parecer do Dr. Guilherme Martins:
                          </span>
                          <p className="italic text-[#17372f]">“{exam.doctorObservations}”</p>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 4: PROCEDIMENTOS SUGERIDOS PELO MÉDICO */}
      {activeTab === 'procedimentos' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-3xl border border-[#dfe8e3] bg-white p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#edf2ef] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                  Condutas Propositivas &amp; Avaliações Futuras
                </p>
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Procedimentos Sugeridos pelo Médico
                </h2>
                <p className="text-xs text-[#60766f] mt-0.5">
                  Propostas deliberadas pelo Dr. Guilherme para acompanhamento longitudinal.
                </p>
              </div>

              <div className="rounded-2xl bg-[#eaf3ef] px-4 py-2 border border-[#bfe4d8] text-xs font-bold text-[#075f50]">
                Sugestão Médica Qualificada
              </div>
            </div>

            {/* Safe AI/Medical Governance Notice */}
            <div className="rounded-2xl border border-[#bfe4d8] bg-[#f8fcfb] p-4 text-xs text-[#17372f] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#0b7b68]">
                <ShieldCheck className="size-4" />
                <span>Governança &amp; Decisão Humana:</span>
              </div>
              <p className="text-[#45655c] leading-relaxed">
                Todas as condutas e procedimentos abaixo são{' '}
                <strong>sugestões médicas formuladas pelo Dr. Guilherme Martins</strong> e acordadas
                com você. Nenhuma decisão terapêutica ou agendamento é gerado automaticamente por
                inteligência artificial sem validação médica prévia.
              </p>
            </div>

            <div className="space-y-4">
              {marinaProcedures.map((proc) => {
                const isScheduled = proc.status === 'agendado'
                return (
                  <article
                    key={proc.id}
                    className={`rounded-2xl border p-5 transition-all shadow-2xs space-y-4 ${
                      isScheduled
                        ? 'border-[#0b7b68] bg-[#fbfdfc]'
                        : 'border-[#dfe8e3] bg-white hover:border-[#b9d8cf]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b7b68]">
                            {proc.category}
                          </span>
                          <StatusBadge tone={isScheduled ? 'green' : 'amber'}>
                            {isScheduled ? 'Agendado' : 'Sugerido'}
                          </StatusBadge>
                          <span className="text-[10px] font-semibold text-[#556d66] bg-[#f4f7f5] px-2 py-0.5 rounded-md border border-[#dfe8e3]">
                            Prioridade: {proc.priority}
                          </span>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#17372f] mt-1">
                          {proc.title}
                        </h3>
                        <p className="text-xs text-[#698078] mt-0.5">
                          Sugerido por <strong>{proc.suggestedBy}</strong> em {proc.suggestedAt}
                        </p>
                      </div>

                      {isScheduled ? (
                        <div className="rounded-xl bg-[#eaf3ef] p-3 text-right border border-[#bfe4d8]">
                          <span className="text-[10px] font-bold uppercase text-[#075f50] block">
                            Data Agendada:
                          </span>
                          <span className="font-serif text-xs font-bold text-[#17372f]">
                            {proc.scheduledFor}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => confirmProcedureInterest(proc.id)}
                          className="min-h-10 rounded-xl bg-[#0b7b68] px-4 text-xs font-bold text-white hover:bg-[#096656] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Tenho Interesse / Agendar</span>
                        </button>
                      )}
                    </div>

                    {/* Rationale and Patient Explanation */}
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl bg-[#f4f7f5] p-3 border border-[#dfe8e3] space-y-1">
                        <span className="font-bold text-[#17372f] text-[11px] block">
                          Motivo Clínico:
                        </span>
                        <p className="text-[#45655c] leading-relaxed">{proc.clinicalRationale}</p>
                      </div>

                      <div className="rounded-xl bg-[#ebf6f2] p-3 border border-[#bfe4d8] space-y-1">
                        <span className="font-bold text-[#075f50] text-[11px] block">
                          Explicação Amigável para Você:
                        </span>
                        <p className="text-[#17372f] leading-relaxed">{proc.patientExplanation}</p>
                      </div>
                    </div>

                    {proc.nextStepPrompt && (
                      <div className="text-[11px] text-[#698078] flex items-center gap-1.5 pt-1">
                        <Calendar className="size-3.5 text-[#0b7b68]" />
                        <span>
                          <strong>Próximo passo:</strong> {proc.nextStepPrompt}
                        </span>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {/* Footer Navigation & Safety */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link to="/paciente/hoje" className="text-xs font-bold text-[#0b7b68] hover:underline">
          &larr; Voltar para a Visão de Hoje
        </Link>
        <Link to="/paciente/plano" className="text-xs font-bold text-[#0b7b68] hover:underline">
          Ver Plano de Ações &rarr;
        </Link>
      </div>

      <UrgentCareWarning />
    </div>
  )
}
