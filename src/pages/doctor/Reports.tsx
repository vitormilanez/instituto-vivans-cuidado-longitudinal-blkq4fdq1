import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  EvidenceModal,
} from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Check,
  Search,
  Filter,
  Eye,
  Send,
  BookOpen,
} from 'lucide-react'

export default function DoctorReports() {
  const { reports, approveReport, notify } = useVivans()

  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '')
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0]

  const handleSimulateExport = () => {
    notify('Simulação: Relatório clínico exportado em formato PDF com assinatura digital.')
  }

  const handleSendToPatient = () => {
    if (activeReport) {
      approveReport(activeReport.id, 'Relatório aprovado e enviado')
    }
  }

  const filteredReports = reports.filter(
    (r) =>
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Relatórios Clínicos e Sínteses para Validação Médica · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
            Governança e Documentação Clínica
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            Relatórios e Sínteses de Acompanhamento
          </h1>
          <p className="text-sm text-[#ADADAD]">
            Rascunhos gerados por IA organizados em camadas para deliberação e envio aos pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateExport}
          className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-[#333333] bg-[#1A1A1A] px-4 text-xs font-bold text-white hover:bg-white/10 transition-colors shadow-sm cursor-pointer"
        >
          <Download className="size-4 text-[#D6B270]" />
          <span>Exportar Dossiê (PDF)</span>
        </button>
      </section>

      {/* Main Layout: Reports Selector (Left) vs Active Report Canvas (Right) */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Reports Index */}
        <aside className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-4 shadow-sm space-y-3 backdrop-blur-md">
          <div className="border-b border-[#333333] pb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
              Relatórios em Aberto ({reports.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredReports.map((rep) => {
              const isSelected = rep.id === activeReport?.id
              const tone = rep.status === 'aprovado' ? 'green' : 'amber'
              return (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`w-full rounded-2xl p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D6B270]/15 border border-[#D6B270]/40 shadow-sm'
                      : 'border border-[#333333] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs text-white">{rep.patientName}</strong>
                    <StatusBadge tone={tone}>{rep.status}</StatusBadge>
                  </div>
                  <p className="font-serif text-xs font-bold text-[#E8C391] leading-snug">
                    {rep.title}
                  </p>
                  <span className="text-[10px] text-[#888888] mt-1 block">{rep.period}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Active Report Canvas */}
        {activeReport && (
          <article className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-8 shadow-sm space-y-6 backdrop-blur-md">
            {/* Header of the document */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#333333] pb-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Dossiê Clínico Estruturado
                  </span>
                  <StatusBadge tone={activeReport.status === 'aprovado' ? 'green' : 'amber'}>
                    {activeReport.status}
                  </StatusBadge>
                </div>

                <h2 className="font-serif text-2xl font-bold text-white leading-tight">
                  {activeReport.title}
                </h2>
                <p className="text-xs text-[#ADADAD]">
                  Paciente: <strong className="text-white">{activeReport.patientName}</strong> ·
                  Ciclo de 90 Dias · {activeReport.period}
                </p>
              </div>

              {/* Approval Button */}
              <div>
                {activeReport.status === 'aprovado' ? (
                  <div className="flex items-center gap-1.5 rounded-2xl bg-[#D6B270]/15 border border-[#D6B270]/30 px-4 py-2.5 text-xs font-bold text-[#E8C391]">
                    <CheckCircle2 className="size-4 text-[#D6B270]" />
                    <span>Aprovado &amp; Enviado ao Paciente</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendToPatient}
                    className="flex min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Aprovar e Enviar ao Paciente</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mandatory AI Draft Notice Banner */}
            <div className="rounded-2xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>
              <p className="text-xs text-[#E8C391] leading-relaxed">
                Este relatório foi sintetizado automaticamente a partir dos biossinais (peso, sono,
                adesão) e relatos pré-consulta. O médico deve revisar a adequação dos tópicos antes
                de disponibilizar ao paciente.
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  1. Resumo Executivo da Evolução
                </h3>
                <div className="rounded-2xl bg-[#0F0F0F] p-4 text-xs text-[#CCCCCC] leading-relaxed border border-[#333333]">
                  {activeReport.summary ||
                    'A paciente manteve excelente adesão aos hábitos matinais e vespertinos, com redução ponderal constante. Ponto focal para o próximo ciclo: estabilização do sono através da antecipação do jantar e suplementação.'}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  2. Conduta Terapêutica Validada
                </h3>
                <div className="rounded-2xl bg-[#0F0F0F] p-4 text-xs text-[#CCCCCC] leading-relaxed border border-[#333333] space-y-2">
                  <p>
                    • <strong>Crononutrição:</strong> Jantar antecipado às 19h30 para reduzir
                    despertares por volta das 3h.
                  </p>
                  <p>
                    • <strong>Suplementação:</strong> Magnésio Bisglicinato 350mg 1h antes de
                    deitar.
                  </p>
                  <p>
                    • <strong>Acompanhamento:</strong> Check-ins programados aos dias 3, 7 e 14.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Medical Signature */}
            <div className="border-t border-[#333333] pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#ADADAD]">
              <div>
                <p className="font-bold text-white">Dr. Guilherme Martins</p>
                <p className="text-[11px] font-mono text-[#D6B270]">CRM/SP 184.920 · RQE 92.110</p>
              </div>
              <span className="text-[11px] text-[#888888]">
                Instituto Vivans · Sistema de Prontuário Eletrônico Auditado
              </span>
            </div>
          </article>
        )}
      </div>

      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  )
}
