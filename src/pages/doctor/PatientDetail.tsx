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
  PenLine,
  Plus,
  Send,
  Check,
  User,
  HeartPulse,
  Activity,
  Footprints,
  Moon,
  AlertTriangle,
  Mail,
  Phone,
  Stethoscope,
  Info,
} from 'lucide-react'
import { QuickConsultationModal } from '@/components/QuickConsultationModal'

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    patients,
    preConsultation,
    scheduledCheckins,
    returnJourney,
    carePlans,
    meals,
    messages,
    reports,
    nudgeSinglePatient,
    nudgedPatientIds,
    notify,
  } = useVivans()
  const navigate = useNavigate()

  // Find patient by ID or fallback to Marina Costa
  const patient = patients.find((p) => p.id === id) || patients[0]

  const [activeTab, setActiveTab] = useState<
    | 'dossie'
    | 'cadastrais'
    | 'evolucao'
    | 'preconsulta'
    | 'plano'
    | 'mensagens'
    | 'refeicoes'
    | 'linha_tempo'
    | 'retorno'
    | 'relatorios'
    | 'evidencias'
  >('dossie')

  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<(typeof medicalEvidences)[0] | null>(
    null,
  )

  const isNudged = nudgedPatientIds.includes(patient.id)
  const isAttention = patient.tone === 'rose'
  const isDelayed = patient.tone === 'amber'

  return (
    <div className="space-y-6">
      <SimulationDisclaimer
        text={`Prontuário Longitudinal de ${patient.name} · Instituto Vivans`}
      />

      {/* Back button and profile header */}
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#556D66]">
        <Link
          to="/medico/pacientes"
          className="flex items-center gap-1.5 hover:text-[#112822] transition-colors rounded-lg px-2 py-1 -ml-2 hover:bg-white"
        >
          <ArrowLeft className="size-4 text-[#097260]" />
          <span>&larr; Voltar para a Lista de Pacientes</span>
        </Link>

        <span className="text-[11px] text-[#8C9E97]">
          ID Prontuário: <strong className="font-mono text-[#112822]">#{patient.id}</strong>
        </span>
      </div>

      {/* Patient Header Card with Full Identity Summary */}
      <article className="rounded-[24px] border border-[#DEE7E2] bg-white p-6 sm:p-7 shadow-[0_2px_14px_rgba(17,40,34,0.04)]">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div
            className={`grid size-16 shrink-0 place-items-center rounded-3xl text-2xl font-bold shadow-sm ${
              isAttention
                ? 'bg-[#FCF0EE] text-[#8E2E28] border border-[#F5C7C2]'
                : isDelayed
                  ? 'bg-[#FEF7E7] text-[#7D5308] border border-[#F8DEB0]'
                  : 'bg-[#112822] text-white'
            }`}
          >
            {patient.initials}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#112822]">
                {patient.name}
              </h1>
              <StatusBadge tone={patient.tone}>{patient.attention}</StatusBadge>
              <StatusBadge tone="green">{patient.cycle}</StatusBadge>
              {isNudged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EF] px-2.5 py-0.5 text-xs font-bold text-[#075F50] border border-[#BFE4D8]">
                  <Check className="size-3" /> Cutucão Ativo
                </span>
              )}
            </div>

            <p className="text-xs text-[#556D66]">
              Foco clínico: <strong className="text-[#112822]">{patient.focus}</strong> · Último
              contato: {patient.lastContact} · Próxima consulta:{' '}
              <strong>{patient.nextConsultation}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(isDelayed || isAttention) && (
              <button
                type="button"
                onClick={() => nudgeSinglePatient(patient.id, patient.name)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-all border ${
                  isNudged
                    ? 'border-[#BFE4D8] bg-[#EAF3EF] text-[#075F50]'
                    : 'border-[#C57D19] bg-[#FEF7E7] text-[#7D5308] hover:bg-[#FDF0D5]'
                }`}
              >
                {isNudged ? (
                  <>
                    <Check className="size-3.5 text-[#097260]" />
                    <span>Cutucão Enviado</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Cutucar / Enviar Lembrete</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsQuickNoteModalOpen(true)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DEE7E2] bg-white px-4 text-xs font-bold text-[#112822] hover:bg-[#F5F8F6] transition-colors cursor-pointer"
            >
              <PenLine className="size-3.5 text-[#097260]" />
              <span>+ Anotação Rápida</span>
            </button>

            <Link
              to={`/medico/consulta/${patient.id}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#097260] px-5 text-xs font-bold text-white hover:bg-[#075f50] shadow-sm transition-colors"
            >
              <Video className="size-4" />
              <span>Entrar na Sala Virtual</span>
            </Link>
          </div>
        </div>

        {/* Patient Words Goal Highlight */}
        <div className="mt-5 rounded-2xl border border-[#BFE4D8] bg-[#EAF3EF]/70 p-4 text-xs text-[#075F50] leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
            <HeartPulse className="size-3.5 text-[#097260]" />
            Objetivo Declarado nas Palavras do Paciente:
          </p>
          <p className="text-sm font-serif italic text-[#112822]">
            “
            {patient.preConsultationSymptoms?.patientWords ||
              'Quero continuar perdendo peso com preservação de disposição, energia e retorno da qualidade do sono.'}
            ”
          </p>
        </div>
      </article>

      {/* Longitudinal Tabs Navigation - Clean & Comprehensive */}
      <div className="flex overflow-x-auto gap-1.5 border-b border-[#DEE7E2] pb-2 text-xs scrollbar-thin">
        {[
          { id: 'dossie', label: 'Dossiê Multicamadas', icon: Sparkles },
          { id: 'cadastrais', label: 'Dados Pessoais & Clínicos', icon: User },
          { id: 'evolucao', label: 'Evolução & Biossinais', icon: TrendingDown },
          { id: 'preconsulta', label: 'Pré-Consulta Recebida', icon: FileText },
          { id: 'plano', label: 'Plano & Prescrições', icon: CheckCircle2 },
          { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
          { id: 'refeicoes', label: 'Diário & Refeições', icon: Camera },
          { id: 'linha_tempo', label: 'Linha do Tempo', icon: Layers },
          { id: 'retorno', label: 'Jornada de Retorno', icon: Clock },
          { id: 'relatorios', label: 'Relatórios Clínicos', icon: Stethoscope },
          { id: 'evidencias', label: 'Evidências Médicas', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 font-bold transition-all ${
                isActive
                  ? 'bg-[#112822] text-white shadow-xs'
                  : 'text-[#556D66] hover:bg-white hover:text-[#112822]'
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AiDraftBadge status="Dossiê Multicamadas · IA como Copiloto Organizador (Rascunho Revisável)" />
            </div>
            <StatusBadge tone="green">Atualizado hoje às 09:20</StatusBadge>
          </div>

          {/* 4 Explicit Clinical Layers */}
          <div className="grid gap-5">
            {/* Camada 1: Fatos e Biossinais Observados */}
            <article className="rounded-[22px] border border-[#DEE7E2] bg-white p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F7F5] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="fato" />
                  <h3 className="font-serif text-base font-bold text-[#112822]">
                    Biossinais &amp; Registros Objetivos
                  </h3>
                </div>
                <span className="text-xs text-[#556D66]">Smartwatch &amp; Balança Conectada</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-2xl bg-[#F8FAF9] p-3.5 border border-[#DEE7E2]">
                  <p className="text-[10px] text-[#556D66] uppercase font-bold">
                    Variação Ponderal
                  </p>
                  <p className="text-base font-bold text-[#112822] mt-0.5">
                    {patient.startWeight.toFixed(1)} &rarr; {patient.currentWeight.toFixed(1)} kg
                  </p>
                  <span className="text-[10px] text-[#097260] font-semibold">
                    {patient.weightLoss} no ciclo
                  </span>
                </div>
                <div className="rounded-2xl bg-[#F8FAF9] p-3.5 border border-[#DEE7E2]">
                  <p className="text-[10px] text-[#556D66] uppercase font-bold">Adesão Global</p>
                  <p className="text-base font-bold text-[#112822] mt-0.5">{patient.adherence}</p>
                  <span className="text-[10px] text-[#097260] font-semibold">Meta de rotina</span>
                </div>
                <div className="rounded-2xl bg-[#F8FAF9] p-3.5 border border-[#DEE7E2]">
                  <p className="text-[10px] text-[#556D66] uppercase font-bold">Ponto de Atenção</p>
                  <p className="text-xs font-bold text-[#112822] mt-0.5 truncate">
                    {patient.attention}
                  </p>
                  <span className="text-[10px] text-[#556D66]">
                    Último log: {patient.lastContact}
                  </span>
                </div>
                <div className="rounded-2xl bg-[#F8FAF9] p-3.5 border border-[#DEE7E2]">
                  <p className="text-[10px] text-[#556D66] uppercase font-bold">Relatórios / Rx</p>
                  <p className="text-xs font-bold text-[#112822] mt-0.5">
                    {patient.reportCount} relatórios · {patient.prescriptionCount}
                  </p>
                  <span className="text-[10px] text-[#097260]">Prontuário ativo</span>
                </div>
              </div>
            </article>

            {/* Camada 2: Relato Original do Paciente */}
            <article className="rounded-[22px] border border-[#CBE0F6] bg-white p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F7F5] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="relato" />
                  <h3 className="font-serif text-base font-bold text-[#112822]">
                    Relato Direto do Paciente (Pré-Consulta &amp; Diário)
                  </h3>
                </div>
                <span className="text-xs text-[#244C77]">Voz Transcrita e Notas 1–5</span>
              </div>
              <div className="rounded-2xl bg-[#EFF5FC]/60 p-4 text-xs text-[#1E4877] leading-relaxed space-y-2 border border-[#CBE0F6]">
                <p className="italic font-serif text-sm">
                  “
                  {patient.preConsultationSymptoms?.patientWords ||
                    'Paciente relatou boa adesão às metas e solicitou acompanhamento contínuo dos marcos estipulados.'}
                  ”
                </p>
                <div className="flex flex-wrap gap-3 text-[11px] pt-1 text-[#244C77]">
                  <span>
                    Sintoma informado:{' '}
                    <strong>{patient.preConsultationSymptoms?.symptom || patient.attention}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Registrado em:{' '}
                    <strong>
                      {patient.preConsultationSymptoms?.reportedAt || patient.lastContact}
                    </strong>
                  </span>
                </div>
              </div>
            </article>

            {/* Camada 3: Síntese Estruturada da IA (Rascunho) */}
            <article className="rounded-[22px] border border-[#F8DEB0] bg-[#FFFBF2] p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAECCF] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="sintese_ia" />
                  <h3 className="font-serif text-base font-bold text-[#7D5308]">
                    Compilação e Hipóteses de Apoio ao Médico
                  </h3>
                </div>
                <AiDraftBadge
                  status="Rascunho gerado com IA - requer validação médica"
                  variant="compact"
                />
              </div>
              <div className="space-y-2 text-xs text-[#7D5308] leading-relaxed">
                <p>
                  <strong>Cruzamento automático de dados:</strong> {patient.insight.detail}
                </p>
                <p>
                  <strong>Base de compilação:</strong> {patient.insight.basis}
                </p>
                <p className="font-bold text-[#7D5308] pt-1">
                  Pontos sugeridos pelo Copiloto para deliberação médica:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {patient.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Camada 4: Decisão e Aprovação Médica */}
            <article className="rounded-[22px] border border-[#BFE4D8] bg-[#EBF6F2] p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CFE6DC] pb-3">
                <div className="flex items-center gap-2">
                  <ClinicalLayerBadge layer="decisao_medica" />
                  <h3 className="font-serif text-base font-bold text-[#075F50]">
                    Conduta e Orientações Validadas pelo Médico
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#075F50]">Dr. Guilherme Martins</span>
              </div>
              <div className="rounded-2xl bg-white p-4 text-xs text-[#112822] leading-relaxed space-y-2 border border-[#BFE4D8]">
                <p>
                  <strong>Conduta acordada em consulta:</strong> {patient.report.summary}
                </p>
                <p className="text-[11px] text-[#097260] font-bold">
                  ✓ Prescrição e plano ativos vinculados ao aplicativo do paciente.
                </p>
              </div>

              {/* Patient Quick Notes Sub-section */}
              {patient.quickNotes && patient.quickNotes.length > 0 && (
                <div className="mt-3 rounded-2xl bg-[#FAFDFC] p-4 border border-[#BFE4D8]/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#075F50] flex items-center gap-1.5">
                      <PenLine className="size-3.5 text-[#097260]" />
                      Anotações Clínicas Registradas ({patient.quickNotes.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsQuickNoteModalOpen(true)}
                      className="text-[11px] font-bold text-[#097260] hover:underline cursor-pointer"
                    >
                      + Nova anotação
                    </button>
                  </div>

                  <div className="space-y-2">
                    {patient.quickNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-[#DEE7E2] bg-white p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#556D66]">
                          <span className="font-bold text-[#112822]">{note.author}</span>
                          <span>{note.createdAt}</span>
                        </div>
                        <p className="text-xs text-[#112822] leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </section>
      )}

      {/* TAB: DADOS PESSOAIS & CADASTRAIS (Requisito 1) */}
      {activeTab === 'cadastrais' && (
        <section className="rounded-[22px] border border-[#DEE7E2] bg-white p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-[#F3F7F5] pb-4">
            <h3 className="font-serif text-xl font-bold text-[#112822]">
              Ficha Cadastral e Dados Pessoais
            </h3>
            <p className="text-xs text-[#556D66]">
              Informações do paciente, contatos e sumário clínico de abertura
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">Nome Completo</span>
              <p className="text-sm font-bold text-[#112822]">{patient.name}</p>
            </div>
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">E-mail</span>
              <p className="text-sm font-bold text-[#112822]">
                {patient.email || `${patient.id}@instituto.vivans.med.br`}
              </p>
            </div>
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">Telefone</span>
              <p className="text-sm font-bold text-[#112822]">
                {patient.phone || '(11) 98765-4321'}
              </p>
            </div>
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">
                Nascimento / Idade
              </span>
              <p className="text-sm font-bold text-[#112822]">
                {patient.birthDate || '14/05/1988 (38 anos)'}
              </p>
            </div>
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">Gênero</span>
              <p className="text-sm font-bold text-[#112822]">{patient.gender || 'Feminino'}</p>
            </div>
            <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#556D66]">CPF</span>
              <p className="text-sm font-bold text-[#112822]">{patient.cpf || '321.***.***-09'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DEE7E2] bg-[#FDFCFA] p-5 space-y-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#097260]">
              Sumário Clínico Longitudinal
            </span>
            <p className="text-sm text-[#112822] leading-relaxed">
              {patient.clinicalSummary || patient.report.summary}
            </p>
          </div>
        </section>
      )}

      {/* TAB: EVOLUÇÃO LONGITUDINAL (Peso, Adesão, Sono, Passos) (Requisito 1) */}
      {activeTab === 'evolucao' && (
        <section className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                <TrendingDown className="size-3.5 text-[#097260]" />
                <span>Peso Atual</span>
              </div>
              <p className="text-2xl font-bold text-[#112822] mt-1">
                {patient.currentWeight.toFixed(1)} kg
              </p>
              <span className="text-[11px] text-[#097260] font-semibold">
                {patient.weightLoss} no ciclo
              </span>
            </div>

            <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                <Activity className="size-3.5 text-[#097260]" />
                <span>Adesão Média</span>
              </div>
              <p className="text-2xl font-bold text-[#112822] mt-1">{patient.adherence}</p>
              <span className="text-[11px] text-[#097260] font-semibold">Meta &gt; 80%</span>
            </div>

            <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                <Moon className="size-3.5 text-[#244C77]" />
                <span>Sono Médio</span>
              </div>
              <p className="text-2xl font-bold text-[#112822] mt-1">
                {patient.id === 'marina-costa' ? '5h42' : '6h45'}
              </p>
              <span className="text-[11px] text-[#556D66]">4 noites registradas</span>
            </div>

            <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                <Footprints className="size-3.5 text-[#097260]" />
                <span>Passos Diários</span>
              </div>
              <p className="text-2xl font-bold text-[#112822] mt-1">6.420</p>
              <span className="text-[11px] text-[#097260] font-semibold">Meta 6.000 atingida</span>
            </div>
          </div>

          {/* Historical Evolution Table */}
          <div className="rounded-[22px] border border-[#DEE7E2] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3F7F5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#112822]">
                Histórico Longitudinal de Biossinais
              </h3>
              <span className="text-xs text-[#556D66]">Smartwatch &amp; Diário</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#DEE7E2] text-[#556D66]">
                    <th className="pb-2.5 font-bold">Data</th>
                    <th className="pb-2.5 font-bold">Peso (kg)</th>
                    <th className="pb-2.5 font-bold">Adesão (%)</th>
                    <th className="pb-2.5 font-bold">Sono (h)</th>
                    <th className="pb-2.5 font-bold">Passos</th>
                    <th className="pb-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F7F5]">
                  {(
                    patient.evolutionHistory || [
                      {
                        date: '01 ago',
                        adherence: 76,
                        weight: patient.startWeight,
                        sleepHours: 6.2,
                        steps: 5800,
                      },
                      {
                        date: '08 ago',
                        adherence: 79,
                        weight: patient.startWeight - 0.6,
                        sleepHours: 6.0,
                        steps: 6100,
                      },
                      {
                        date: '15 ago',
                        adherence: 82,
                        weight: patient.startWeight - 1.2,
                        sleepHours: 6.1,
                        steps: 6350,
                      },
                      {
                        date: '22 ago',
                        adherence: 80,
                        weight: patient.currentWeight + 0.2,
                        sleepHours: 5.7,
                        steps: 6400,
                      },
                      {
                        date: '25 ago',
                        adherence: 82,
                        weight: patient.currentWeight,
                        sleepHours: 5.7,
                        steps: 6420,
                      },
                    ]
                  ).map((h, i) => (
                    <tr key={i} className="hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-3 font-semibold text-[#112822]">{h.date}</td>
                      <td className="py-3 font-mono font-bold text-[#112822]">
                        {h.weight?.toFixed(1) || '—'} kg
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-[#097260]">{h.adherence}%</span>
                      </td>
                      <td className="py-3 text-[#556D66]">
                        {h.sleepHours
                          ? `${Math.floor(h.sleepHours)}h${Math.round((h.sleepHours % 1) * 60)}`
                          : '—'}
                      </td>
                      <td className="py-3 text-[#556D66]">
                        {h.steps ? h.steps.toLocaleString('pt-BR') : '—'}
                      </td>
                      <td className="py-3">
                        <StatusBadge tone={h.adherence >= 80 ? 'green' : 'amber'}>
                          {h.adherence >= 80 ? 'Consistente' : 'Abaixo da meta'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB: MENSAGENS (Requisito 1) */}
      {activeTab === 'mensagens' && (
        <section className="rounded-[22px] border border-[#DEE7E2] bg-white p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#F3F7F5] pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#112822]">
                Histórico de Mensagens com {patient.name}
              </h3>
              <p className="text-xs text-[#556D66]">Comunicação segura e assistida por IA</p>
            </div>
            <Link
              to="/medico/mensagens"
              className="text-xs font-bold text-[#097260] hover:underline"
            >
              Abrir Central de Mensagens &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl text-xs space-y-1.5 border ${
                  msg.sender === 'doctor'
                    ? 'bg-[#EAF3EF] border-[#BFE4D8] text-[#112822]'
                    : msg.sender === 'ai_draft'
                      ? 'bg-[#FFFBF2] border-[#F8DEB0] text-[#7D5308]'
                      : 'bg-[#F8FAF9] border-[#DEE7E2] text-[#112822]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="font-bold">{msg.author}</strong>
                  <span className="text-[11px] text-[#556D66]">{msg.time}</span>
                </div>
                <p className="leading-relaxed">{msg.content}</p>
                {msg.isAiDraft && (
                  <div className="pt-2">
                    <AiDraftBadge status="Rascunho aguardando validação médica" variant="compact" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB: RELATÓRIOS CLÍNICOS (Requisito 1) */}
      {activeTab === 'relatorios' && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#112822]">
              Relatórios e Dossiês Clínicos
            </h3>
            <Link
              to="/medico/relatorios"
              className="text-xs font-bold text-[#097260] hover:underline"
            >
              Ver todos os relatórios &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl border border-[#DEE7E2] bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#556D66]">{rep.period}</span>
                  <StatusBadge tone={rep.status === 'aprovado' ? 'green' : 'amber'}>
                    {rep.status === 'aprovado' ? 'Aprovado' : 'Em Revisão'}
                  </StatusBadge>
                </div>
                <h4 className="font-serif text-base font-bold text-[#112822]">{rep.title}</h4>
                <p className="text-xs text-[#556D66] leading-relaxed line-clamp-3">{rep.summary}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F3F7F5] text-[11px]">
                  {rep.metrics.map(([k, v], i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#F8FAF9] px-2 py-1 text-[#112822] font-medium border border-[#DEE7E2]"
                    >
                      {k}: <strong>{v}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#17372f]">
              Linha do Tempo Longitudinal
            </h3>
            <button
              type="button"
              onClick={() => setIsQuickNoteModalOpen(true)}
              className="text-xs font-bold text-[#0b7b68] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PenLine className="size-3.5" />
              <span>Registrar evento / anotação</span>
            </button>
          </div>
          <div className="space-y-4 border-l-2 border-[#b9d8cf] pl-6 ml-2">
            {patient.activity && patient.activity.length > 0
              ? patient.activity.map(([date, desc], idx) => (
                  <div key={idx} className="relative space-y-0.5 text-xs">
                    <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#0b7b68]" />
                    <span className="font-bold text-[#0b7b68]">{date}</span>
                    <p className="text-xs text-[#17372f] font-medium leading-relaxed">{desc}</p>
                  </div>
                ))
              : [
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

      {/* Quick Note Modal */}
      <QuickConsultationModal
        isOpen={isQuickNoteModalOpen}
        onClose={() => setIsQuickNoteModalOpen(false)}
        initialAction="note"
        initialPatientId={patient.id}
      />
    </div>
  )
}
