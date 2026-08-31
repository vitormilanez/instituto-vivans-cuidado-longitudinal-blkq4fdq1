import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  EvidenceModal,
} from '@/components/CommonUI'
import { medicalEvidences } from '@/data/mockData'
import {
  FileText,
  Clock,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Video,
  Camera,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>()
  const { patients, preConsultation, notify } = useVivans()
  const navigate = useNavigate()

  // Find patient by ID or fallback to Marina Costa
  const patient = patients.find((p) => p.id === id) || patients[0]

  const [activeTab, setActiveTab] = useState<
    'dossie' | 'preconsulta' | 'plano' | 'refeicoes' | 'linha_tempo' | 'evidencias'
  >('dossie')
  const [selectedEvidence, setSelectedEvidence] = useState<(typeof medicalEvidences)[0] | null>(
    null,
  )

  return (
    <div className="space-y-6">
      <SimulationDisclaimer
        text={`Prontuário Longitudinal de ${patient.name} · Instituto Vivans`}
      />

      {/* Back button and profile header */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#698078]">
        <Link to="/medico/pacientes" className="flex items-center gap-1 hover:text-[#17372f]">
          <ArrowLeft className="size-3.5" />
          <span>Voltar para Lista de Pacientes</span>
        </Link>
      </div>

      {/* Patient Header Card */}
      <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="grid size-16 place-items-center rounded-3xl bg-[#17372f] text-xl font-bold text-white shadow-md">
            {patient.initials}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17372f]">
                {patient.name}
              </h1>
              <StatusBadge tone={patient.tone}>{patient.attention}</StatusBadge>
              <StatusBadge tone="green">{patient.cycle}</StatusBadge>
            </div>
            <p className="text-xs text-[#60766f]">
              Foco clínico: <strong>{patient.focus}</strong> · Último contato: {patient.lastContact}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/medico/consulta/apt-marina"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656] shadow-sm transition-colors"
            >
              <Video className="size-4" />
              <span>Entrar na Sala Virtual</span>
            </Link>
          </div>
        </div>

        {/* Patient Words Goal Highlight */}
        <div className="mt-5 rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b] leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-[11px] mb-1">
            Objetivo Declarado nas Palavras do Paciente:
          </p>
          <p className="text-sm font-serif italic text-[#17372f]">
            “Quero continuar perdendo peso sem ficar cansada e voltar a dormir melhor à noite.”
          </p>
        </div>
      </article>

      {/* Longitudinal Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#dfe8e3] pb-2">
        {[
          { id: 'dossie', label: 'Dossiê Longitudinal (IA)', icon: Sparkles },
          { id: 'preconsulta', label: 'Pré-Consulta Recebida', icon: FileText },
          { id: 'plano', label: 'Plano de Cuidado & Prescrições', icon: CheckCircle2 },
          { id: 'refeicoes', label: 'Diário & Fotos de Refeições', icon: Camera },
          { id: 'linha_tempo', label: 'Linha do Tempo', icon: Clock },
          { id: 'evidencias', label: 'Evidências Médicas (Mock)', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:bg-white hover:text-[#17372f]'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: DOSSIÊ LONGITUDINAL (AI ASSISTED) */}
      {activeTab === 'dossie' && (
        <section className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
            </div>
            <StatusBadge tone="green">Atualizado hoje às 09:20</StatusBadge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17372f]">
                Síntese Longitudinal da Evolução
              </h3>

              <div className="rounded-2xl bg-[#f8faf9] p-4 text-xs leading-relaxed text-[#45655c] space-y-2">
                <p>
                  <strong>Progresso Geral:</strong> Marina apresenta perda de peso consistente (−1,8
                  kg em 29 dias) com boa adesão às metas de saciedade no jantar e hidratação diária
                  (82% de conclusão de plano).
                </p>
                <p>
                  <strong>Ponto de Atenção em Destaque:</strong> Identificada queixa recente de
                  despertares noturnos por volta das 3h da manhã, resultando em média de 5h42 de
                  sono nas últimas 4 noites. Não há sintomas gastrointestinais de refluxo relatados.
                </p>
                <p>
                  <strong>Sugestão do Copiloto:</strong> Recomenda-se antecipar o horário do jantar
                  em 1h e incluir protocolo de desaceleração noturna às 22h antes de alterar
                  qualquer recomendação calórica.
                </p>
              </div>

              <div className="border-t border-[#edf2ef] pt-3 flex items-center justify-between text-xs text-[#698078]">
                <span>Baseado em 3 PDFs compilados, 7 conversas e biossinais do relógio.</span>
                <span className="font-bold text-[#0b7b68]">Validação Pendente do Médico</span>
              </div>
            </article>

            {/* Quick Metrics */}
            <aside className="space-y-4">
              <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#17372f]">
                  Indicadores Longitudinal
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#edf2ef]">
                    <span className="text-[#60766f]">Peso Inicial:</span>
                    <strong className="text-[#17372f]">{patient.startWeight} kg</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#edf2ef]">
                    <span className="text-[#60766f]">Peso Atual:</span>
                    <strong className="text-[#0b7b68]">{patient.currentWeight} kg (−1,8 kg)</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#edf2ef]">
                    <span className="text-[#60766f]">Meta Estabelecida:</span>
                    <strong className="text-[#17372f]">{patient.targetWeight} kg</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#60766f]">Adesão ao Cuidado:</span>
                    <strong className="text-[#0b7b68]">{patient.adherence}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* TAB 2: PRÉ-CONSULTA RECEBIDA */}
      {activeTab === 'preconsulta' && (
        <section className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge tone="green">Recebida hoje às 09:18</StatusBadge>
                <StatusBadge tone="blue">Áudio Transcrito</StatusBadge>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17372f]">
                Relato Original da Paciente vs. Síntese da IA
              </h3>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Original Patient Transcript */}
            <div className="rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17372f] uppercase tracking-wider">
                  Transcrição Integral do Relato (Marina Costa)
                </span>
                <span className="text-[11px] text-[#698078]">3 min de fala</span>
              </div>
              <p className="text-xs text-[#45655c] leading-relaxed italic bg-white p-4 rounded-xl border border-[#dfe8e3]">
                "{preConsultation.transcript}"
              </p>
              <p className="text-[11px] text-[#8a9c96]">
                Áudio descartado pós-transcrição de acordo com o consentimento LGPD.
              </p>
            </div>

            {/* Right: AI Synthesis for Doctor */}
            <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0b6a5b] uppercase tracking-wider">
                  Síntese Estruturada para a Consulta
                </span>
                <AiDraftBadge status="Copiloto IA" />
              </div>
              <div className="text-xs text-[#3b534b] leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#b9d8cf]">
                {preConsultation.aiSynthesis}
              </div>

              <div>
                <p className="text-xs font-bold text-[#0b7b68] mb-1">
                  Perguntas Sugeridas para o Dr. Guilherme considerar:
                </p>
                <ul className="list-disc pl-5 text-xs text-[#45655c] space-y-1">
                  {preConsultation.suggestedQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: PLANO & RECEITAS */}
      {activeTab === 'plano' && (
        <section className="space-y-5 animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Plan list */}
            <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17372f]">
                Plano de Cuidado Vigente
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    action: 'Tomar 500ml de água antes do almoço e do jantar',
                    category: 'Hábitos alimentares',
                    status: 'Concluído hoje',
                  },
                  {
                    action: 'Registrar foto do jantar para avaliar saciedade',
                    category: 'Diário',
                    status: 'Pendente',
                  },
                  {
                    action: 'Começar a desacelerar às 22h (higiene do sono)',
                    category: 'Sono',
                    status: 'Pendente',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#edf2ef] p-3.5 text-xs flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#17372f] block">{item.action}</strong>
                      <span className="text-[11px] text-[#698078]">{item.category}</span>
                    </div>
                    <StatusBadge tone={item.status.includes('Concluído') ? 'green' : 'gray'}>
                      {item.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17372f]">
                Documentos e Prescrições
              </h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-[#17372f]">Receita Digital #RX-1042</strong>
                    <StatusBadge tone="green">Ativa (Validade 26 set)</StatusBadge>
                  </div>
                  <p className="text-[#60766f]">
                    1 item prescrito · Emitida na última consulta presencial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: FOTOS E REFEIÇÕES */}
      {activeTab === 'refeicoes' && (
        <section className="space-y-5 animate-fade-in">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                meal: 'Jantar (Hoje, 19:42)',
                image: 'https://img.usecurling.com/p/600/600?q=salad%20omelette&color=green',
                analysis: 'Omelete de vegetais, brócolis no vapor, folhas verdes e azeite.',
                ratings: 'Saciedade: 4/5 · Conforto: 4/5 · Facilidade: 5/5',
              },
              {
                meal: 'Almoço (Ontem, 12:34)',
                image:
                  'https://img.usecurling.com/p/600/600?q=grilled%20chicken%20salad&color=amber',
                analysis: 'Frango grelhado, arroz integral, feijão e legumes cozidos.',
                ratings: 'Saciedade: 5/5 · Conforto: 5/5 · Facilidade: 4/5',
              },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-3xl border border-[#dfe8e3] bg-white overflow-hidden shadow-sm"
              >
                <img src={m.image} alt={m.meal} className="h-44 w-full object-cover" />
                <div className="p-5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-[#17372f] font-serif text-sm">{m.meal}</strong>
                    <StatusBadge tone="green">Confirmada</StatusBadge>
                  </div>
                  <p className="text-[#60766f]">{m.analysis}</p>
                  <div className="rounded-xl bg-[#f4f7f5] p-2.5 text-[11px] font-medium text-[#0b7b68]">
                    {m.ratings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: LINHA DO TEMPO */}
      {activeTab === 'linha_tempo' && (
        <section className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#17372f]">
            Linha do Tempo Longitudinal
          </h3>
          <div className="space-y-4 border-l-2 border-[#b9d8cf] pl-6 ml-2">
            {[
              {
                date: 'Hoje · 09:18',
                title: 'Pré-consulta por voz enviada',
                desc: 'Marina completou as 4 perguntas e revisou a transcrição.',
              },
              {
                date: 'Ontem · 20:08',
                title: 'Refeição registrada com saciedade 4/5',
                desc: 'Foto do jantar enviada com notas de contexto.',
              },
              {
                date: '24 ago · 16:42',
                title: 'Relatório quinzenal revisado pelo Dr. Guilherme',
                desc: 'Identificado padrão de sono curto em 4 noites.',
              },
              {
                date: '12 ago · 11:14',
                title: 'Primeira consulta realizada',
                desc: 'Definição do plano inicial de emagrecimento saudável.',
              },
            ].map((t, idx) => (
              <div key={idx} className="relative space-y-1 text-xs">
                <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#0b7b68]" />
                <span className="font-bold text-[#0b7b68]">{t.date}</span>
                <strong className="block text-sm text-[#17372f]">{t.title}</strong>
                <p className="text-[#60766f]">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 6: EVIDÊNCIAS MÉDICAS (MOCK) */}
      {activeTab === 'evidencias' && (
        <section className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-[#f0d59c] bg-[#fffbf2] p-4 text-xs text-[#805f24] flex items-start gap-2.5">
            <Sparkles className="size-4 shrink-0 text-[#a37628] mt-0.5" />
            <p className="leading-relaxed">
              <strong>Camada Demonstrativa de Evidências Médicas:</strong> Sugestões de estudos
              indexados (PubMed, Cochrane e Conitec) correlacionados ao caso de Marina Costa. A
              decisão terapêutica permanece estritamente com o médico.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {medicalEvidences.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvidence(ev)}
                className="cursor-pointer rounded-3xl border border-[#dfe8e3] bg-white p-5 shadow-sm space-y-3 transition-all hover:border-[#0b7b68] hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="rounded-md bg-[#17372f] text-white px-2 py-0.5 text-[10px] font-bold">
                      {ev.source}
                    </span>
                    <span className="text-[#698078]">{ev.year}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#17372f] leading-snug">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-[#60766f] mt-2 line-clamp-3 leading-relaxed">
                    {ev.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#edf2ef] flex items-center justify-between text-xs font-bold text-[#0b7b68]">
                  <span>Ver Detalhes do Estudo</span>
                  <ExternalLink className="size-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
        evidence={selectedEvidence}
      />
    </div>
  )
}
