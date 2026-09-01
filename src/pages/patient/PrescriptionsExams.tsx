import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, UrgentCareWarning } from '@/components/CommonUI'
import {
  Pill,
  FileText,
  Clock,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react'

export default function PatientPrescriptionsExams() {
  const { prescriptions = [], medications = [], exams = [], notify } = useVivans()

  const [activeTab, setActiveTab] = useState<'medicamentos' | 'receitas' | 'exames'>('medicamentos')

  // Filter items specifically for Marina Costa
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === 'marina-costa')
  const patientMedications = medications.filter(
    (m) => m.patientId === 'marina-costa' || !m.patientId,
  )
  const patientExams = exams.filter((e) => e.patientId === 'marina-costa')

  const handleDownload = (title: string) => {
    notify(`Download iniciado: ${title} (Documento assinado digitalmente)`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Documentos Clínicos Oficiais
            </span>
            <StatusBadge tone="green">Assinados com ICP-Brasil</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Receitas, Fórmulas &amp; Exames
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5C57] max-w-2xl">
            Acompanhe suas formulações ativas, orientações posológicas e o histórico de exames
            prescritos pelo Dr. Guilherme Martins.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-1 shadow-subtle">
        {[
          {
            id: 'medicamentos',
            label: `Medicamentos em Uso (${patientMedications.length})`,
            icon: Pill,
          },
          {
            id: 'receitas',
            label: `Receitas Emitidas (${patientPrescriptions.length})`,
            icon: FileText,
          },
          { id: 'exames', label: `Laudos de Exames (${patientExams.length})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 min-h-[40px] rounded-xl px-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C] hover:bg-[#F1EEE7]'
              }`}
            >
              <Icon className="size-4" />
              <span className="truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: MEDICAMENTOS E FÓRMULAS ATIVAS */}
      {activeTab === 'medicamentos' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 text-xs text-[#2E5E4E] flex items-center gap-3">
            <ShieldCheck className="size-5 shrink-0 text-[#2E5E4E]" />
            <p>
              Toda suplementação e medicação foi prescrita após avaliação clínica individual e
              exames laboratoriais. Nunca altere doses sem orientação médica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {patientMedications.map((med) => (
              <article
                key={med.id}
                className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-5 sm:p-6 shadow-card space-y-4 hover:border-[#2E5E4E]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
                    <span className="text-xs font-bold text-[#2E5E4E] uppercase tracking-wider">
                      {med.purpose}
                    </span>
                    <StatusBadge tone={med.status === 'em_uso' ? 'green' : 'gray'}>
                      {med.status === 'em_uso' ? 'Em uso contínuo' : med.status}
                    </StatusBadge>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">{med.name}</h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-xl bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1 font-semibold text-[#1E1E1C]">
                      Dose: {med.dosage}
                    </span>
                    <span className="rounded-xl bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1 font-semibold text-[#1E1E1C]">
                      Horário: {med.frequency}
                    </span>
                  </div>

                  <p className="rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] p-3 text-xs text-[#5C5C57] leading-relaxed">
                    <strong className="text-[#1E1E1C]">Como tomar:</strong> {med.instructions}
                  </p>
                </div>

                <div className="border-t border-[#EFECE5] pt-3 flex items-center justify-between text-xs text-[#8A8A84]">
                  <span>Prescrito por Dr. Guilherme Martins</span>
                  <span className="font-semibold text-[#2E5E4E]">Fórmula Ativa</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: RECEITAS OFICIAIS */}
      {activeTab === 'receitas' && (
        <section className="space-y-4">
          <div className="grid gap-4">
            {patientPrescriptions.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4 hover:border-[#2E5E4E]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE5] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                        Receita Médica Digital
                      </span>
                      <StatusBadge tone="green">Válida</StatusBadge>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">{p.title}</h3>
                    <p className="text-xs text-[#5C5C57]">
                      Emitida em {p.issuedAt} · Dr. Guilherme Martins (CRM/SP 184.920)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(p.title)}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#2E5E4E] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="size-4" />
                    <span>Baixar PDF Assinado</span>
                  </button>
                </div>

                {/* Items in prescription */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#1E1E1C]">Composição da Prescrição:</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {p.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs space-y-1"
                      >
                        <strong className="text-[#1E1E1C] block">{it.medication}</strong>
                        <p className="text-[#2E5E4E] font-semibold">
                          {it.dosage} · {it.posology}
                        </p>
                        {it.notes && <p className="text-[#5C5C57] text-[11px]">{it.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: EXAMES */}
      {activeTab === 'exames' && (
        <section className="space-y-4">
          <div className="grid gap-4">
            {patientExams.map((exam) => (
              <article
                key={exam.id}
                className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE5] pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                      Laudo Integrado
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">{exam.title}</h3>
                    <p className="text-xs text-[#5C5C57]">
                      Realizado em {exam.performedAt} · Laboratório Parceiro Vivans
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(exam.title)}
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 text-xs font-bold text-[#1E1E1C] hover:bg-[#F1EEE7] transition-all cursor-pointer"
                  >
                    <Download className="size-4 text-[#2E5E4E]" />
                    <span>Baixar Laudo Completo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {exam.highlights.map((bm: any, idx: number) => (
                    <div key={idx} className="rounded-2xl bg-[#FAF8F4] p-3 border border-[#E8E3D9]">
                      <span className="text-[10px] text-[#8A8A84] block truncate">
                        {bm.parameter}
                      </span>
                      <p className="font-bold text-sm text-[#1E1E1C] mt-0.5">{bm.value}</p>
                      <span className="text-[10px] text-[#2F7D5B] font-semibold">
                        {bm.reference || 'Faixa Ideal'}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <UrgentCareWarning />
    </div>
  )
}
