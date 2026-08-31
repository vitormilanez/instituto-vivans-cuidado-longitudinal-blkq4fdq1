import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  ClinicalLayerBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import {
  FileText,
  Pill,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Eye,
  Check,
} from 'lucide-react'

export default function PatientPrescriptionsExams() {
  const { prescriptions = [], medications = [], exams = [], notify } = useVivans()

  const [activeTab, setActiveTab] = useState<'todos' | 'receitas' | 'medicamentos' | 'exames'>(
    'todos',
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExamDetails, setSelectedExamDetails] = useState<any | null>(null)
  const [selectedRxDetails, setSelectedRxDetails] = useState<any | null>(null)

  // Filter only Marina Costa records for patient portal
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === 'marina-costa')
  const patientExams = exams.filter((e) => e.patientId === 'marina-costa')
  const patientMeds = medications.filter((m) => m.patientId === 'marina-costa')

  const handleSimulateDownload = (docName: string) => {
    notify(`Simulação: Download de "${docName}" com assinatura digital ICP-Brasil iniciado.`)
  }

  const handleSimulateSharePharmacy = (rxTitle: string) => {
    notify(
      `Simulação: Link do receituário "${rxTitle}" copiado para validação ou envio à farmácia.`,
    )
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Área de Documentos Clínicos · Receitas Digitais e Laudos Laboratoriais" />

      {/* Header Banner */}
      <section className="overflow-hidden rounded-3xl border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3 py-1 text-xs font-bold text-[#0F0F0F]">
                <ShieldCheck className="size-3.5" />
                <span>Prontuário Digital ICP-Brasil</span>
              </span>
              <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Receitas, Medicamentos &amp; Exames
            </h1>

            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
              Consulte suas prescrições vigentes, orientações de posologia, lista contínua de
              suplementos e histórico de laudos laboratoriais emitidos para o seu plano de
              longevidade.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#333333] bg-[#0F0F0F] p-4 text-xs">
            <Pill className="size-8 text-[#D6B270]" />
            <div>
              <p className="font-bold text-white">
                {patientMeds.length} Medicamentos &amp; Fórmulas
              </p>
              <p className="text-[11px] text-[#ADADAD]">
                {patientPrescriptions.length} Receitas · {patientExams.length} Exames
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Search Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('todos')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            Visão Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medicamentos')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'medicamentos'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            Medicamentos Ativos ({patientMeds.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receitas')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'receitas'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            Receitas Emitidas ({patientPrescriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exames')}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'exames'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            Exames Laboratoriais ({patientExams.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Buscar medicamento ou exame..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[40px] rounded-2xl border border-[#333333] bg-[#0F0F0F] pl-9 pr-3 text-xs text-white placeholder-[#777777] focus:border-[#D6B270] focus:outline-none shadow-inner"
          />
        </div>
      </div>

      {/* SECTION 1: MEDICAMENTOS EM USO CONTÍNUO */}
      {(activeTab === 'todos' || activeTab === 'medicamentos') && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Pill className="size-4 text-[#D6B270]" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Medicamentos e Fórmulas em Uso Contínuo
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Orientadas e validadas clinicamente para os seus horários de rotina
              </p>
            </div>
            <StatusBadge tone="green">Vigentes</StatusBadge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patientMeds.map((med) => (
              <div
                key={med.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-4 flex flex-col justify-between space-y-3 hover:border-[#D6B270]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="rounded-md bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {med.purpose}
                    </span>
                    <span className="text-[11px] text-[#ADADAD] font-semibold">
                      {med.status === 'em_uso' ? 'Em uso' : med.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-white leading-snug">
                    {med.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D6B270] mt-0.5">
                    {med.dosage} · {med.frequency}
                  </p>
                  <p className="text-xs text-[#CCCCCC] mt-2 leading-relaxed bg-[#0F0F0F] p-2.5 rounded-xl border border-[#333333]">
                    <strong>Instrução:</strong> {med.instructions}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-2 text-[11px] text-[#888888] flex items-center justify-between">
                  <span>Início: {med.prescribedAt}</span>
                  <span className="text-[#D6B270] font-bold">Ativo</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: RECEITUÁRIOS DIGITAIS */}
      {(activeTab === 'todos' || activeTab === 'receitas') && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#D6B270]" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Receituários Digitais Emitidos
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Documentos assinados com certificado digital médico padrão ICP-Brasil
              </p>
            </div>
            <span className="text-xs text-[#ADADAD]">Validade jurídica nacional</span>
          </div>

          <div className="space-y-3">
            {patientPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D6B270]/40 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">{rx.title}</span>
                    <StatusBadge tone={rx.status === 'ativa' ? 'green' : 'gray'}>
                      {rx.status === 'ativa' ? 'Receita Vigente' : 'Histórico'}
                    </StatusBadge>
                    <span className="text-[11px] text-[#ADADAD]">Código: {rx.code}</span>
                  </div>

                  <p className="text-xs text-[#CCCCCC] leading-relaxed">
                    <strong>Itens prescritos:</strong>{' '}
                    {rx.items.map((i) => i.medication).join(' • ')}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#888888] pt-1">
                    <span>Emitido em: {rx.issuedAt}</span>
                    <span>•</span>
                    <span>Válido até: {rx.validUntil || '90 dias'}</span>
                    <span>•</span>
                    <span className="text-[#D6B270] font-semibold">{rx.doctorName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedRxDetails(rx)}
                    className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#333333] bg-white/5 px-3.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <Eye className="size-3.5 text-[#D6B270]" />
                    <span>Visualizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateDownload(rx.title)}
                    className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-sm transition-all"
                  >
                    <Download className="size-3.5" />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: LAUDOS E EXAMES LABORATORIAIS */}
      {(activeTab === 'todos' || activeTab === 'exames') && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="size-4 text-[#D6B270]" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Exames &amp; Painéis Laboratoriais
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Resultados laboratoriais integrados com interpretação dos biomarcadores
              </p>
            </div>
            <StatusBadge tone="green">Laudos Importados</StatusBadge>
          </div>

          <div className="space-y-4">
            {patientExams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-5 space-y-4 hover:border-[#D6B270]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-white leading-snug">
                        {exam.title}
                      </h3>
                      <span className="text-[11px] text-[#ADADAD]">· {exam.laboratory}</span>
                    </div>
                    <p className="text-[11px] text-[#888888] mt-0.5">
                      Coleta em: {exam.performedAt} · Laudo validado por Dr. Guilherme Martins
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulateDownload(exam.title)}
                    className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#333333] bg-[#0F0F0F] px-3 text-xs font-bold text-[#D6B270] hover:bg-white/5 transition-colors self-start sm:self-auto"
                  >
                    <Download className="size-3.5" />
                    <span>Laudo Completo PDF</span>
                  </button>
                </div>

                {/* Biomarkers Table */}
                <div className="overflow-x-auto rounded-xl border border-[#333333] bg-[#0F0F0F]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#333333] bg-white/5 text-[10px] uppercase font-bold text-[#888888]">
                        <th className="p-3">Biomarcador</th>
                        <th className="p-3">Resultado</th>
                        <th className="p-3">Referência Vivans</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {exam.highlights.map((bm, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-white">{bm.parameter}</td>
                          <td className="p-3 font-semibold text-white">{bm.value}</td>
                          <td className="p-3 text-[#ADADAD]">{bm.reference}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                bm.status === 'otimizado'
                                  ? 'bg-[#D6B270]/20 text-[#E8C391]'
                                  : bm.status === 'atencao'
                                    ? 'bg-[#F59E0B]/20 text-[#FCD34D]'
                                    : 'bg-white/10 text-white'
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  bm.status === 'otimizado'
                                    ? 'bg-[#D6B270]'
                                    : bm.status === 'atencao'
                                      ? 'bg-[#F59E0B]'
                                      : 'bg-white'
                                }`}
                              />
                              {bm.status === 'otimizado'
                                ? 'Na Meta Ótima'
                                : bm.status === 'atencao'
                                  ? 'Atenção'
                                  : 'Regular'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Medical interpretation */}
                {exam.doctorObservations && (
                  <div className="rounded-xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-3.5 text-xs text-[#E8C391] space-y-1">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-[#D6B270]">
                      Síntese Clínica do Dr. Guilherme:
                    </p>
                    <p className="leading-relaxed text-[#CCCCCC]">{exam.doctorObservations}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL: VISUALIZAÇÃO DE RECEITUÁRIO */}
      {selectedRxDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-2xl space-y-5 animate-fade-in-up text-white">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/30">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {selectedRxDetails.title}
                  </h3>
                  <p className="text-xs text-[#ADADAD]">Código: {selectedRxDetails.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRxDetails(null)}
                className="text-[#ADADAD] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-[#333333] bg-[#0F0F0F] p-4 space-y-3 text-xs">
              <div className="flex justify-between text-[#ADADAD] border-b border-[#333333] pb-2">
                <span>
                  Paciente: <strong className="text-white">Marina Costa</strong>
                </span>
                <span>Data: {selectedRxDetails.issuedAt}</span>
              </div>

              <div className="space-y-3 pt-1">
                {selectedRxDetails.items.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-bold text-white text-sm">
                      {idx + 1}. {item.medication} — {item.dosage}
                    </p>
                    <p className="text-[#CCCCCC] pl-3 text-xs">{item.posology}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#333333] pt-3 text-[11px] text-[#888888] space-y-1">
                <p>Médico: {selectedRxDetails.doctorName}</p>
                <p>Assinatura Digital ICP-Brasil: SHA-256 Validated</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSimulateSharePharmacy(selectedRxDetails.title)}
                className="min-h-[44px] rounded-xl border border-[#333333] bg-[#141414] px-4 text-xs font-bold text-white hover:bg-white/10"
              >
                Copiar Link Farmácia
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSimulateDownload(selectedRxDetails.title)
                  setSelectedRxDetails(null)
                }}
                className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs font-bold text-[#0F0F0F] hover:brightness-110"
              >
                Baixar PDF Assinado
              </button>
            </div>
          </div>
        </div>
      )}

      <UrgentCareWarning />
    </div>
  )
}
