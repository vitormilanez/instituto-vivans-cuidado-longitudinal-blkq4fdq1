import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  EvidenceModal,
} from '@/components/CommonUI'
import { Download, CheckCircle2 } from 'lucide-react'

export default function DoctorReports() {
  const { reports, approveReport, notify, patients } = useVivans()

  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '')
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false)
  const [selectedEvidence] = useState<any | null>(null)
  const [searchTerm] = useState('')

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
          <p className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
            Governança e Documentação Clínica
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Relatórios e Sínteses de Acompanhamento
          </h1>
          <p className="text-sm text-[#5C5C57]">
            Rascunhos gerados por IA organizados em camadas para deliberação e envio aos pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateExport}
          className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] px-4 text-xs font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-colors shadow-subtle cursor-pointer"
        >
          <Download className="size-4 text-[#2E5E4E]" />
          <span>Exportar Dossiê (PDF)</span>
        </button>
      </section>

      {/* Main Layout: Reports Selector (Left) vs Active Report Canvas (Right) */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Reports Index */}
        <aside className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 shadow-card space-y-3">
          <div className="border-b border-[#EFECE5] pb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Relatórios em Aberto ({reports.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredReports.map((rep) => {
              const isSelected = rep.id === activeReport?.id
              const tone = rep.status === 'aprovado' ? 'green' : 'amber'
              const patientObj = patients.find(
                (p) => p.name.toLowerCase() === rep.patientName.toLowerCase(),
              )
              return (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`w-full rounded-2xl p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E7EFEA] border border-[#C3D6CC] shadow-subtle'
                      : 'border border-[#E8E3D9] bg-[#FAF8F4] hover:bg-[#F1EEE7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <VivansAvatar
                      src={patientObj?.avatarUrl}
                      name={rep.patientName}
                      initials={patientObj?.initials}
                      size="xs"
                      className="border border-[#E8E3D9]"
                    />
                    <strong className="text-xs text-[#1E1E1C] truncate flex-1">
                      {rep.patientName}
                    </strong>
                    <StatusBadge tone={tone}>{rep.status}</StatusBadge>
                  </div>
                  <p className="font-serif text-xs font-bold text-[#2E5E4E] leading-snug">
                    {rep.title}
                  </p>
                  <span className="text-[10px] text-[#8A8A84] mt-1 block">{rep.period}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Active Report Canvas */}
        {activeReport && (
          <article className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 shadow-card space-y-6">
            {/* Header of the document */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EFECE5] pb-5">
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Dossiê Clínico Estruturado
                  </span>
                  <StatusBadge tone={activeReport.status === 'aprovado' ? 'green' : 'amber'}>
                    {activeReport.status}
                  </StatusBadge>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#1E1E1C] leading-tight">
                  {activeReport.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#5C5C57] pt-1">
                  <VivansAvatar
                    src={
                      patients.find(
                        (p) => p.name.toLowerCase() === activeReport.patientName.toLowerCase(),
                      )?.avatarUrl
                    }
                    name={activeReport.patientName}
                    initials={
                      patients.find(
                        (p) => p.name.toLowerCase() === activeReport.patientName.toLowerCase(),
                      )?.initials
                    }
                    size="xs"
                    className="border border-[#E8E3D9]"
                  />
                  <span>
                    Paciente: <strong className="text-[#1E1E1C]">{activeReport.patientName}</strong>{' '}
                    · Ciclo de 90 Dias · {activeReport.period}
                  </span>
                </div>
              </div>

              {/* Approval Button */}
              <div>
                {activeReport.status === 'aprovado' ? (
                  <div className="flex items-center gap-1.5 rounded-2xl bg-[#E7F2EC] border border-[#C3D6CC] px-4 py-2.5 text-xs font-bold text-[#2F7D5B]">
                    <CheckCircle2 className="size-4 text-[#2F7D5B]" />
                    <span>Aprovado &amp; Enviado ao Paciente</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendToPatient}
                    className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Aprovar e Enviar ao Paciente</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mandatory AI Draft Notice Banner */}
            <div className="rounded-2xl border border-[#C49A5B]/40 bg-[#FBF5EB] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>
              <p className="text-xs text-[#9E7A3D] leading-relaxed">
                Este relatório foi sintetizado automaticamente a partir dos biossinais (peso, sono,
                adesão) e relatos pré-consulta. O médico deve revisar a adequação dos tópicos antes
                de disponibilizar ao paciente.
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C] mb-2">
                  1. Resumo Executivo da Evolução
                </h3>
                <div className="rounded-2xl bg-[#FAF8F4] p-4 text-xs text-[#5C5C57] leading-relaxed border border-[#E8E3D9]">
                  {activeReport.summary ||
                    'A paciente manteve excelente adesão aos hábitos matinais e vespertinos, com redução ponderal constante. Ponto focal para o próximo ciclo: estabilização do sono através da antecipação do jantar e suplementação.'}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E1E1C] mb-2">
                  2. Conduta Terapêutica Validada
                </h3>
                <div className="rounded-2xl bg-[#FAF8F4] p-4 text-xs text-[#5C5C57] leading-relaxed border border-[#E8E3D9] space-y-2">
                  <p>
                    • <strong className="text-[#1E1E1C]">Crononutrição:</strong> Jantar antecipado
                    às 19h30 para reduzir despertares por volta das 3h.
                  </p>
                  <p>
                    • <strong className="text-[#1E1E1C]">Suplementação:</strong> Magnésio
                    Bisglicinato 350mg 1h antes de deitar.
                  </p>
                  <p>
                    • <strong className="text-[#1E1E1C]">Acompanhamento:</strong> Check-ins
                    programados aos dias 3, 7 e 14.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Medical Signature */}
            <div className="border-t border-[#EFECE5] pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C5C57]">
              <div className="flex items-center gap-3">
                <VivansAvatar
                  src={DOCTOR_PROFILE.photoUrl || DOCTOR_PROFILE.avatarUrl}
                  name={DOCTOR_PROFILE.name}
                  initials={DOCTOR_PROFILE.initials}
                  size="md"
                  className="border-2 border-[#2E5E4E]/40 shadow-subtle"
                />{' '}
                <div>
                  <p className="font-bold text-[#1E1E1C]">{DOCTOR_PROFILE.name}</p>
                  <p className="text-[11px] font-mono text-[#2E5E4E]">
                    CRM/SP 184.920 · RQE 92.110
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#8A8A84]">
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
