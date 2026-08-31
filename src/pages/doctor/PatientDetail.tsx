import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  ClinicalLayerBadge,
  SimulationDisclaimer,
  EvidenceModal,
} from '@/components/CommonUI'
import { VivansAvatar } from '@/components/VivansAvatar'
import {
  Sparkles,
  Video,
  FileText,
  Clock,
  Pill,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
} from 'lucide-react'

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    patients,
    carePlans,
    preConsultation,
    prescriptions,
    medications,
    exams = [],
    scheduledCheckins,
  } = useVivans()

  const [activeTab, setActiveTab] = useState<
    'resumo' | 'timeline' | 'planos' | 'prescricoes' | 'exames'
  >('resumo')
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null)

  // Find target patient
  const patient = patients.find((p) => p.id === id) || patients[0]

  // Filter clinical data for this patient
  const patientPrescriptions = prescriptions.filter(
    (p) =>
      p.patientId === patient.id ||
      (patient.id === 'marina-costa' && p.patientId === 'marina-costa'),
  )
  const patientExams = exams.filter(
    (e) =>
      e.patientId === patient.id ||
      (patient.id === 'marina-costa' && e.patientId === 'marina-costa'),
  )
  const patientMeds = medications.filter(
    (m) =>
      m.patientId === patient.id ||
      (patient.id === 'marina-costa' && m.patientId === 'marina-costa'),
  )

  const openEvidence = (ev: any) => {
    setSelectedEvidence(ev)
    setEvidenceModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Dossiê Longitudinal do Paciente · Instituto Vivans" />

      {/* Patient Header Summary */}
      <section className="overflow-hidden rounded-3xl border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-xl space-y-5 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <VivansAvatar
              src={patient.avatarUrl}
              name={patient.name}
              initials={patient.initials}
              size="2xl"
              className="border-2 border-[#D6B270]/60 shadow-md shrink-0"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {patient.name}
                </h1>
                <StatusBadge tone={patient.tone}>{patient.attention}</StatusBadge>
                <span className="text-xs text-[#ADADAD]">{patient.cycle}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#CCCCCC]">
                <strong>Foco Clínico:</strong> {patient.focus}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#ADADAD] pt-1">
                <span>
                  Idade: <strong className="text-white">38 anos</strong>
                </span>
                <span>•</span>
                <span>
                  Adesão Geral: <strong className="text-[#D6B270]">{patient.adherence}</strong>
                </span>
                <span>•</span>
                <span>
                  Evolução: <strong className="text-white">{patient.progress}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Teleconsultation */}
          <div className="flex flex-col gap-2 shrink-0">
            <Link
              to={`/medico/consulta/${patient.id}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all shadow-md active:scale-95"
            >
              <Video className="size-4" />
              <span>Iniciar Teleconsulta com {patient.name.split(' ')[0]}</span>
            </Link>

            <span className="text-[11px] text-center text-[#ADADAD]">
              Próxima: {patient.nextConsultation}
            </span>
          </div>
        </div>

        {/* 4 Multi-Layer Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[#333333]">
          <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
            <p className="text-[10px] uppercase font-bold text-[#888888]">Peso Inicial</p>
            <p className="text-lg font-bold text-white mt-0.5">80,0 kg</p>
            <span className="text-[10px] text-[#ADADAD]">28 jul 2024</span>
          </div>
          <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
            <p className="text-[10px] uppercase font-bold text-[#888888]">Peso Atual</p>
            <p className="text-lg font-bold text-[#D6B270] mt-0.5">78,2 kg</p>
            <span className="text-[10px] text-[#D6B270] font-semibold">−1,8 kg acumulado</span>
          </div>
          <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
            <p className="text-[10px] uppercase font-bold text-[#888888]">Sono Médio</p>
            <p className="text-lg font-bold text-white mt-0.5">5h42</p>
            <span className="text-[10px] text-[#F59E0B] font-semibold">Despertar 3h</span>
          </div>
          <div className="rounded-2xl bg-[#0F0F0F] p-3 border border-[#333333]">
            <p className="text-[10px] uppercase font-bold text-[#888888]">Check-ins Feitos</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {scheduledCheckins.filter((c) => c.status === 'concluido').length}/
              {scheduledCheckins.length}
            </p>
            <span className="text-[10px] text-[#E8C391] font-semibold">100% regulares</span>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
        {[
          { id: 'resumo', label: 'Síntese Clínica' },
          { id: 'timeline', label: 'Linha do Tempo' },
          { id: 'planos', label: 'Plano de Cuidado' },
          { id: 'prescricoes', label: 'Receitas & Fórmulas' },
          { id: 'exames', label: 'Exames Laboratoriais' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[36px] flex-1 rounded-xl px-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SÍNTESE CLÍNICA E EVIDÊNCIAS */}
      {activeTab === 'resumo' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Clinical dossier */}
          <div className="space-y-4">
            {/* AI Synthesized Executive Summary */}
            <article className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#D6B270]" />
                  <h2 className="font-serif text-lg font-bold text-white">
                    Síntese Clínica Estruturada (Copiloto)
                  </h2>
                </div>
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>

              <div className="space-y-3 text-xs text-[#CCCCCC] leading-relaxed">
                <p>
                  <strong>Evolução nos primeiros 29 dias:</strong> Paciente Marina Costa, 38 anos,
                  apresenta perda ponderal de 1,8 kg associada à melhora expressiva na saciedade e
                  rotina de hidratação. Relata queixa recorrente de despertar noturno às 3h.
                </p>

                <div className="rounded-2xl bg-[#0F0F0F] p-4 border border-[#333333] space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#D6B270]">
                    Hipótese e Linha Terapêutica Sugerida:
                  </span>
                  <p className="text-xs text-[#CCCCCC]">
                    Ajustar o timing da refeição noturna (antecipar para as 19h30) com redução de
                    carboidratos simples tardios e suporte com Magnésio Bisglicinato 350mg para
                    estabilização da arquitetura do sono.
                  </p>
                </div>
              </div>

              {/* Multi-layer tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#333333]">
                <ClinicalLayerBadge layer="fato" />
                <ClinicalLayerBadge layer="relato" />
                <ClinicalLayerBadge layer="sintese_ia" />
                <ClinicalLayerBadge layer="decisao_medica" />
              </div>
            </article>

            {/* Evidence References Card */}
            <article className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#D6B270]" />
                  <h3 className="font-serif text-base font-bold text-white">
                    Base de Evidências Clínicas Aplicadas
                  </h3>
                </div>
                <span className="text-xs text-[#ADADAD]">PubMed / Cochrane</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title:
                      'Timing of dinner and its impact on nocturnal awakenings and metabolic regulation',
                    source: 'PubMed',
                    year: '2023',
                    evidenceType: 'Ensaio Clínico Randomizado',
                    confidence: 'Alta',
                    url: 'https://pubmed.ncbi.nlm.nih.gov/37128941',
                    summary:
                      'O adiantamento da última refeição para pelo menos 3 horas antes do repouso reduziu em 42% os microdespertares decorrentes de oscilações glicêmicas e atividade gástrica.',
                    relevance:
                      'Aplica-se diretamente à conduta de antecipar o jantar da Marina para as 19h30.',
                  },
                  {
                    title:
                      'Magnesium supplementation and sleep architecture in adults with sleep fragmentation',
                    source: 'Cochrane',
                    year: '2022',
                    evidenceType: 'Revisão Sistemática com Metanálise',
                    confidence: 'Alta',
                    url: 'https://cochranelibrary.com',
                    summary:
                      'A suplementação de bisglicinato de magnésio correlacionou-se com melhora nos escores de eficiência do sono e redução do cortisol matinal.',
                    relevance:
                      'Valida a prescrição noturna de magnésio 350mg para a queixa de despertar às 3h.',
                  },
                ].map((ev, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#333333] bg-[#141414] p-4 space-y-2 hover:border-[#D6B270]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#D6B270] uppercase tracking-wider">
                        {ev.source} · {ev.year}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">
                        {ev.evidenceType}
                      </span>
                    </div>

                    <p className="font-serif font-bold text-sm text-white">{ev.title}</p>
                    <p className="text-xs text-[#CCCCCC] line-clamp-2">{ev.summary}</p>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => openEvidence(ev)}
                        className="text-xs font-bold text-[#D6B270] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver análise completa de evidência</span>
                        <ChevronRight className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Right Column: Pre-consultation summary received */}
          <aside className="space-y-4">
            <article className="rounded-3xl border border-[#D6B270]/30 bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8C391]">
                  Pré-Consulta do Paciente
                </span>
                <StatusBadge tone="green">Recebida</StatusBadge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-[#D6B270] block">Objetivo Declarado:</strong>
                  <p className="text-white mt-0.5">
                    "{preConsultation.objective || 'Avaliar o primeiro mês de perda ponderal.'}"
                  </p>
                </div>

                <div>
                  <strong className="text-[#D6B270] block">Dúvidas Principais:</strong>
                  <p className="text-[#CCCCCC] mt-0.5">
                    "
                    {preConsultation.questionsForDoctor || 'Horário do magnésio e café pós-almoço.'}
                    "
                  </p>
                </div>

                <div>
                  <strong className="text-[#D6B270] block">Mudanças de Rotina:</strong>
                  <p className="text-[#CCCCCC] mt-0.5">
                    "{preConsultation.transcript || 'Água 2,5L/dia e ovos no café.'}"
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/medico/consulta/${patient.id}`}
                  className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-4 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-sm"
                >
                  <Video className="size-3.5" />
                  <span>Iniciar Atendimento Agora</span>
                </Link>
              </div>
            </article>
          </aside>
        </div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'timeline' && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-5 backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-white">Linha do Tempo Longitudinal</h2>

          <div className="space-y-4 border-l-2 border-[#D6B270]/30 pl-4 ml-2">
            {[
              {
                date: 'Hoje · 08:30',
                title: 'Pré-consulta enviada pela paciente',
                desc: 'Marina preencheu o formulário de 4 minutos relatando queixa de despertar às 3h.',
                tone: 'green',
              },
              {
                date: '24 ago 2024',
                title: 'Check-in de 14 dias concluído',
                desc: 'Registro pontual de saciedade e registro de peso (78,2 kg).',
                tone: 'green',
              },
              {
                date: '15 ago 2024',
                title: 'Importação de exames laboratoriais',
                desc: 'Painel lipídico, glicemia e PCR ultrassensível integrados ao prontuário.',
                tone: 'blue',
              },
              {
                date: '28 jul 2024',
                title: 'Consulta de Abertura de Ciclo',
                desc: 'Início do programa de 90 dias com Dr. Guilherme Martins.',
                tone: 'gray',
              },
            ].map((event, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[23px] top-1.5 size-3 rounded-full bg-[#D6B270] border-2 border-[#1A1A1A]" />
                <span className="text-[11px] font-mono text-[#D6B270]">{event.date}</span>
                <h3 className="font-serif text-sm font-bold text-white">{event.title}</h3>
                <p className="text-xs text-[#ADADAD]">{event.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PLANOS */}
      {activeTab === 'planos' && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-white">Ações Ativas do Plano</h2>

          <div className="space-y-3">
            {carePlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#D6B270]">{plan.category}</span>
                    <StatusBadge tone={plan.completed ? 'green' : 'amber'}>
                      {plan.completed ? 'Concluído' : 'Pendente'}
                    </StatusBadge>
                  </div>
                  <h3 className="font-serif text-base font-bold text-white mt-1">{plan.action}</h3>
                  <p className="text-xs text-[#ADADAD] mt-0.5">{plan.doctorRationale}</p>
                </div>
                <span className="text-xs text-[#888888]">{plan.frequency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: PRESCRIÇÕES */}
      {activeTab === 'prescricoes' && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-white">
            Receitas e Medicamentos Ativos
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {patientMeds.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-4 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#D6B270]">{m.purpose}</span>
                  <span className="text-[#ADADAD]">
                    {m.status === 'em_uso' ? 'Em uso' : m.status}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-white">{m.name}</h3>
                <p className="text-xs font-semibold text-[#E8C391]">
                  {m.dosage} · {m.frequency}
                </p>
                <p className="text-xs text-[#CCCCCC] bg-[#0F0F0F] p-2.5 rounded-xl border border-[#333333]">
                  {m.instructions}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: EXAMES */}
      {activeTab === 'exames' && (
        <section className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-white">Exames Laboratoriais</h2>

          <div className="space-y-4">
            {patientExams.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-[#333333] bg-[#141414] p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-base font-bold text-white">{e.title}</h3>
                  <span className="text-xs text-[#ADADAD]">{e.performedAt}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {e.highlights.map((bm, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]"
                    >
                      <p className="text-[10px] text-[#888888]">{bm.parameter}</p>
                      <p className="font-bold text-white text-xs mt-0.5">{bm.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  )
}
