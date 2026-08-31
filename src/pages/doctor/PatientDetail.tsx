import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  ClinicalLayerBadge,
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

  const { scheduledCheckins, returnJourney } = useVivans()

  const [activeTab, setActiveTab] = useState<
    'dossie' | 'retorno' | 'preconsulta' | 'plano' | 'refeicoes' | 'linha_tempo' | 'evidencias'
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
          { id: 'retorno', label: 'Jornada de Retorno & Check-ins', icon: Clock },
          { id: 'preconsulta', label: 'Pré-Consulta Recebida', icon: FileText },
          { id: 'plano', label: 'Plano de Cuidado & Prescrições', icon: CheckCircle2 },
          { id: 'refeicoes', label: 'Diário & Fotos', icon: Camera },
          { id: 'linha_tempo', label: 'Linha do Tempo', icon: Layers },
          { id: 'evidencias', label: 'Evidências Médicas', icon: BookOpen },
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

      {/* TAB: JORNADA DE RETORNO & CHECK-INS PROGRAMADOS */}
      {activeTab === 'retorno' && (
        <section className="space-y-5 animate-fade-in">
          <div className="rounded-3xl border border-[#bfe4d8] bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-[#0b7b68]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                    Acompanhamento Pós-Consulta · Plano Ativado
                  </span>
                  <StatusBadge tone="green">Plano Ativo</StatusBadge>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#17372f]">
                  {returnJourney.title}
                </h3>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-[#17372f]">
                  Status da Coorte: 1 Realizado · 5 Pendentes
                </p>
                <p className="text-[#60766f]">Revisão prevista: {returnJourney.nextReviewDate}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8faf9] p-4 text-xs text-[#45655c] leading-relaxed">
              <strong>Síntese médica do retorno:</strong> {returnJourney.summary}
            </div>

            {/* Structured Table of Check-ins */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#17372f]">
                Grade de Check-ins Programados:
              </h4>

              <div className="space-y-2.5">
                {scheduledCheckins.map((chk) => (
                  <div
                    key={chk.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#edf2ef] p-4 text-xs transition-colors hover:bg-[#fbfcfb]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-[#e8f4f0] text-[#0b7b68] px-2.5 py-1 rounded-lg">
                        Dia {chk.dayOffset}
                      </span>
                      <div>
                        <strong className="text-[#17372f] block">{chk.title}</strong>
                        <span className="text-[11px] text-[#698078]">{chk.scheduledDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {chk.value && (
                        <span className="font-semibold text-[#0b7b68] bg-[#edf7f4] px-2.5 py-1 rounded-lg text-xs">
                          {chk.value}
                        </span>
                      )}
                      <StatusBadge tone={chk.status === 'concluido' ? 'green' : 'amber'}>
                        {chk.status === 'concluido'
                          ? `Realizado (${chk.completedAt})`
                          : 'Programado'}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 1: DOSSIÊ LONGITUDINAL (4 CAMADAS CLÍNICAS SEPARADAS) */}
      {activeTab === 'dossie' && (
        <section className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AiDraftBadge status="Dossiê Multicamadas · IA como Copiloto Organizador" />
            </div>
            <StatusBadge tone="green">Atualizado hoje às 09:20</StatusBadge>
          </div>

          {/* 4 Explicit Clinical Layers */}
          <div className="grid gap-5">
            {/* Camada 1: Fatos e Biossinais Observados */}
            <article className="rounded-3xl border border-[#d8e4df] bg-white p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="fato" />
                  <h3 className="font-serif text-base font-bold text-[#17372f]">
                    Biossinais &amp; Registros Objetivos
                  </h3>
                </div>
                <span className="text-xs text-[#698078]">Smartwatch &amp; Balança Conectada</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-2xl bg-[#f8faf9] p-3 border border-[#edf2ef]">
                  <p className="text-[10px] text-[#698078] uppercase font-bold">
                    Variação Ponderal
                  </p>
                  <p className="text-base font-bold text-[#17372f] mt-0.5">80,0 &rarr; 78,2 kg</p>
                  <span className="text-[10px] text-[#0b7b68]">−1,8 kg em 29 dias</span>
                </div>
                <div className="rounded-2xl bg-[#f8faf9] p-3 border border-[#edf2ef]">
                  <p className="text-[10px] text-[#698078] uppercase font-bold">
                    Sono Médio (4 noites)
                  </p>
                  <p className="text-base font-bold text-[#17372f] mt-0.5">5h42 / noite</p>
                  <span className="text-[10px] text-[#c96a3b]">Despertares ~03:00</span>
                </div>
                <div className="rounded-2xl bg-[#f8faf9] p-3 border border-[#edf2ef]">
                  <p className="text-[10px] text-[#698078] uppercase font-bold">Passos Diários</p>
                  <p className="text-base font-bold text-[#17372f] mt-0.5">6.420 passos</p>
                  <span className="text-[10px] text-[#0b7b68]">Meta 6.000 atingida</span>
                </div>
                <div className="rounded-2xl bg-[#f8faf9] p-3 border border-[#edf2ef]">
                  <p className="text-[10px] text-[#698078] uppercase font-bold">Check-ins Feitos</p>
                  <p className="text-base font-bold text-[#17372f] mt-0.5">24 de 29 dias</p>
                  <span className="text-[10px] text-[#0b7b68]">82% de adesão</span>
                </div>
              </div>
            </article>

            {/* Camada 2: Relato Original da Paciente */}
            <article className="rounded-3xl border border-[#c7ddf4] bg-white p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="relato" />
                  <h3 className="font-serif text-base font-bold text-[#17372f]">
                    Relato Direto da Paciente (Pré-Consulta &amp; Diário)
                  </h3>
                </div>
                <span className="text-xs text-[#698078]">Transcrição e Notas 1–5</span>
              </div>
              <div className="rounded-2xl bg-[#eff5fc]/40 p-4 text-xs text-[#1e4877] leading-relaxed space-y-2 border border-[#d3e5f8]">
                <p className="italic">
                  “Nos últimos quatro dias passei a acordar por volta das 3h da manhã. A saciedade
                  no jantar tem sido ótima com a omelete, mas o cansaço à tarde aumentou. Gostaria
                  de entender se jantar às 20h30 pode estar influenciando meu sono.”
                </p>
                <div className="flex flex-wrap gap-3 text-[11px] pt-1">
                  <span>
                    Saciedade média noturna: <strong>4,2/5</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Conforto digestivo: <strong>4,6/5</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Disposição matinal: <strong>3/5</strong>
                  </span>
                </div>
              </div>
            </article>

            {/* Camada 3: Síntese Estruturada da IA */}
            <article className="rounded-3xl border border-[#f8deb0] bg-[#fffbf2] p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#faeccf] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="sintese_ia" />
                  <h3 className="font-serif text-base font-bold text-[#70480e]">
                    Compilação e Hipóteses de Apoio ao Médico
                  </h3>
                </div>
                <AiDraftBadge
                  status="Rascunho gerado com IA - requer validação médica"
                  variant="compact"
                />
              </div>
              <div className="space-y-2 text-xs text-[#70480e] leading-relaxed">
                <p>
                  <strong>Cruzamento automático:</strong> Redução ponderal satisfatória (−1,8 kg)
                  com alta saciedade referida, porém correlacionada com sono curto (5h42) e jantar
                  tardio (20h30).
                </p>
                <p>
                  <strong>Pontos sugeridos para deliberação médica:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Avaliar antecipação do jantar para 19h30 para aumentar intervalo antes do
                    repouso.
                  </li>
                  <li>Avaliar tolerância digestiva e rotina de desaceleração às 22h.</li>
                  <li>Ativar check-ins de retorno de 14 dias para acompanhar resposta.</li>
                </ul>
              </div>
            </article>

            {/* Camada 4: Decisão e Aprovação Médica */}
            <article className="rounded-3xl border border-[#bfe4d8] bg-[#ebf6f2] p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfe6dc] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="decisao_medica" />
                  <h3 className="font-serif text-base font-bold text-[#075f50]">
                    Conduta e Orientações Validadas pelo Médico
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#075f50]">Dr. Guilherme Martins</span>
              </div>
              <div className="rounded-2xl bg-white p-4 text-xs text-[#17372f] leading-relaxed space-y-2 border border-[#bfe4d8]">
                <p>
                  <strong>Conduta acordada em consulta:</strong> Antecipação do horário da refeição
                  noturna para 19h30 e início de higiene do sono sem telas às 22h. Manter hidratação
                  de 500ml pré-refeições.
                </p>
                <p className="text-[11px] text-[#0b7b68] font-bold">
                  ✓ Plano publicado e vinculado ao aplicativo da paciente em 25 ago 2026.
                </p>
              </div>
            </article>
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
                  Síntese de Apoio para a Consulta
                </span>
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>
              <div className="text-xs text-[#3b534b] leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#b9d8cf]">
                {preConsultation.aiSynthesis}
              </div>

              <div>
                <p className="text-xs font-bold text-[#0b7b68] mb-1">
                  Tópicos de contextualização sugeridos para a consulta:
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
