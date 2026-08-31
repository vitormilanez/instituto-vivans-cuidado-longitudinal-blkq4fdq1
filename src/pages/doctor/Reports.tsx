import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import {
  FileText,
  CheckCircle2,
  Download,
  Filter,
  Eye,
  Sparkles,
  Printer,
  Share2,
} from 'lucide-react'

export default function DoctorReports() {
  const { reports, approveReport, scheduledCheckins, notify } = useVivans()
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-marina-biweekly')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'em_revisao' | 'aprovado'>('todos')
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false)
  const [confirmApproveModal, setConfirmApproveModal] = useState<string | null>(null)

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0]

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'todos') return true
    return r.status === statusFilter
  })

  const handleApprove = (reportId: string) => {
    approveReport(reportId, 'Dr. Guilherme Martins')
    setConfirmApproveModal(null)
    notify('Relatório aprovado e disponibilizado para compartilhamento seguro.')
  }

  const handleSimulatePdfExport = () => {
    setPdfPreviewOpen(true)
    notify('Exportação de PDF compilada com sucesso.')
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Central de Relatórios Clínicos e Sínteses · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Relatórios Clínicos Longitudinal
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Relatórios e Sínteses Periódicas
          </h1>
          <p className="text-sm text-[#60766f]">
            Revisão, aprovação médica e compartilhamento de relatórios semanais, quinzenais e
            mensais.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe8e3] bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#60766f] mr-1">Status:</span>
          {[
            { id: 'todos', label: 'Todos (4)' },
            { id: 'em_revisao', label: 'Em Revisão (2)' },
            { id: 'aprovado', label: 'Aprovados (1)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === f.id
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:bg-[#f4f7f5]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Reports List (Left) vs Report Preview & Approval (Right) */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left List */}
        <div className="space-y-3">
          {filteredReports.map((rep) => {
            const isSelected = selectedReport.id === rep.id
            return (
              <article
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`cursor-pointer rounded-3xl border p-5 transition-all shadow-sm ${
                  isSelected
                    ? 'border-[#0b7b68] bg-[#f8faf9] ring-2 ring-[#0b7b68]/20'
                    : 'border-[#dfe8e3] bg-white hover:border-[#b9d8cf]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#17372f]">{rep.patientName}</span>
                  <StatusBadge
                    tone={
                      rep.status === 'aprovado'
                        ? 'green'
                        : rep.status === 'em_revisao'
                          ? 'blue'
                          : 'amber'
                    }
                  >
                    {rep.status === 'aprovado'
                      ? 'Aprovado'
                      : rep.status === 'em_revisao'
                        ? 'Em Revisão'
                        : 'Rascunho'}
                  </StatusBadge>
                </div>

                <h3 className="font-serif text-sm font-bold text-[#17372f] leading-snug">
                  {rep.title}
                </h3>
                <p className="text-[11px] text-[#698078] mt-1">{rep.period}</p>
              </article>
            )
          })}
        </div>

        {/* Right Preview Card */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge tone={selectedReport.status === 'aprovado' ? 'green' : 'blue'}>
                  {selectedReport.status === 'aprovado'
                    ? 'Aprovado e Compartilhado'
                    : 'Aguardando Aprovação do Dr. Guilherme'}
                </StatusBadge>
                <span className="text-xs text-[#698078]">{selectedReport.period}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                {selectedReport.title}
              </h2>
              <p className="text-xs text-[#0b7b68] font-semibold mt-0.5">
                Paciente: {selectedReport.patientName}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSimulatePdfExport}
                className="flex min-h-10 items-center gap-1.5 rounded-xl border border-[#dfe8e3] px-3.5 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
              >
                <Download className="size-3.5" />
                <span>Exportar PDF (Demo)</span>
              </button>
            </div>
          </div>

          {/* AI Banner */}
          <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />

          {/* Alignment with return journey for Marina */}
          {selectedReport.patientName === 'Marina Costa' && (
            <div className="rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4 text-xs text-[#45655c] space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#0b7b68] text-[11px]">
                Status dos Check-ins de Retorno Pós-Consulta:
              </span>
              <p>
                {scheduledCheckins.filter((c) => c.status === 'concluido').length} de{' '}
                {scheduledCheckins.length} check-ins concluídos na quinzena em curso.
              </p>
            </div>
          )}

          {/* Report body */}
          <div className="space-y-4 text-xs leading-relaxed text-[#45655c]">
            <div className="rounded-2xl bg-[#f8faf9] border border-[#dfe8e3] p-5 space-y-2">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Síntese Clínica Executiva:
              </p>
              <p className="text-sm text-[#17372f] leading-relaxed">{selectedReport.summary}</p>
            </div>

            {/* Metrics table in report */}
            <div className="grid grid-cols-3 gap-3">
              {selectedReport.metrics.map(([label, val]) => (
                <div key={label} className="rounded-2xl border border-[#dfe8e3] p-4 text-center">
                  <p className="text-[11px] text-[#698078] font-bold">{label}</p>
                  <p className="text-xl font-bold text-[#17372f] mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Approval History Box */}
          <div className="rounded-2xl border border-[#dfe8e3] bg-[#fcfdfc] p-4 text-xs text-[#698078] space-y-1">
            <p className="font-bold text-[#17372f]">Histórico de Auditoria Clínica:</p>
            {selectedReport.status === 'aprovado' ? (
              <p className="text-[#0b7b68]">
                ✓ Aprovado e assinado por: <strong>{selectedReport.approvedBy}</strong> em{' '}
                {selectedReport.approvedAt}.
              </p>
            ) : (
              <p>Rascunho preparado pela IA em 24 de agosto. Aguardando assinatura médica.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#edf2ef]">
            <span className="text-xs text-[#698078]">
              O paciente visualiza este documento na aba Prontuário/Consultas.
            </span>

            {selectedReport.status !== 'aprovado' && (
              <button
                type="button"
                onClick={() => setConfirmApproveModal(selectedReport.id)}
                className="min-h-11 rounded-2xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656] shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                <span>Aprovar Relatório e Compartilhar com Paciente</span>
              </button>
            )}
          </div>
        </article>
      </div>

      {/* Confirmation Modal for Approving Report */}
      {confirmApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up space-y-4">
            <div className="flex items-center gap-3 border-b border-[#edf2ef] pb-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-[#ebf6f2] text-[#075f50]">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Aprovação de Relatório Clínico
                </h3>
                <p className="text-xs text-[#698078]">Assinatura e liberação para o paciente</p>
              </div>
            </div>

            <p className="text-xs text-[#45655c] leading-relaxed">
              Você revisou a síntese gerada pela IA e atesta a precisão clínica dos dados
              apresentados. Após a aprovação, o documento ficará visível no aplicativo do paciente.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmApproveModal(null)}
                className="min-h-10 rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleApprove(confirmApproveModal)}
                className="min-h-10 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] shadow-sm"
              >
                Aprovar &amp; Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated PDF Preview Modal */}
      {pdfPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#0b7b68]" />
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Visualização de Impressão / PDF Demonstrativo
                </h3>
              </div>
              <button
                onClick={() => setPdfPreviewOpen(false)}
                className="p-1 text-[#60766f] hover:bg-[#f4f7f5] rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-[#dfe8e3] p-6 bg-[#fdfbf7] font-serif space-y-4 text-xs">
              <div className="flex justify-between border-b border-[#b9d8cf] pb-3 font-sans">
                <div>
                  <strong className="text-base text-[#17372f]">Instituto Vivans</strong>
                  <p className="text-[11px] text-[#698078]">Cuidado Longitudinal e Longevidade</p>
                </div>
                <div className="text-right text-[11px] text-[#698078]">
                  <p>Dr. Guilherme Martins · CRM 123456</p>
                  <p>Data: 25 de agosto de 2026</p>
                </div>
              </div>

              <h4 className="text-lg font-bold text-[#17372f]">
                {selectedReport.title} · {selectedReport.patientName}
              </h4>
              <p className="text-xs text-[#3b534b] leading-relaxed">{selectedReport.summary}</p>

              <div className="border-t border-dashed border-[#b9d8cf] pt-3 text-[10px] text-[#8a9c96] font-sans">
                Documento gerado em ambiente de protótipo demonstrativo.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPdfPreviewOpen(false)}
                className="min-h-10 rounded-xl bg-[#17372f] px-5 text-xs font-bold text-white hover:bg-[#0e2721]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
