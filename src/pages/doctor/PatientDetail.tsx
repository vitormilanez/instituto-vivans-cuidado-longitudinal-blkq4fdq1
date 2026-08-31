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
    appointments,
    preConsultation,
    scheduledCheckins,
    returnJourney,
    carePlans,
    meals,
    messages,
    reports,
    addPatientQuickNote,
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

  // In-page quick note form state
  const [inlineNoteContent, setInlineNoteContent] = useState('')
  const [inlineNoteCategory, setInlineNoteCategory] = useState<
    'observacao' | 'evolucao' | 'medicacao' | 'geral'
  >('observacao')
  const [isSavingInlineNote, setIsSavingInlineNote] = useState(false)
  const [inlineNoteSuccess, setInlineNoteSuccess] = useState(false)

  // Evolution comparison period state
  const [evolutionPeriodA, setEvolutionPeriodA] = useState<
    'ultimos_30' | 'ultimos_14' | 'ultimos_60'
  >('ultimos_30')
  const [evolutionPeriodB, setEvolutionPeriodB] = useState<
    'periodo_anterior' | 'marco_zero' | 'meta_alvo'
  >('periodo_anterior')

  const isNudged = nudgedPatientIds.includes(patient.id)
  const isAttention = patient.tone === 'rose'
  const isDelayed = patient.tone === 'amber'

  // Look for appointment associated with this patient
  const patientAppointment = appointments.find(
    (a) =>
      a.patientId === patient.id ||
      a.patient.toLowerCase() === patient.name.toLowerCase() ||
      a.id.includes(patient.id.split('-')[0]),
  ) || {
    id: `apt-${patient.id}`,
    patientId: patient.id,
    date: 'Hoje, 25 de Agosto de 2026',
    time: patient.nextConsultation.includes('·')
      ? patient.nextConsultation.split('·')[1].trim().split(' ')[0]
      : '10:30',
    patient: patient.name,
    initials: patient.initials,
    type: 'Consulta Longitudinal de Acompanhamento · 30 min',
    modality: 'Teleconsulta (Google Meet)' as const,
    status: patient.nextConsultation.includes('Concluída')
      ? 'Concluída'
      : patient.tone === 'rose'
        ? 'A confirmar'
        : 'Confirmada',
    statusTone: (patient.nextConsultation.includes('Concluída')
      ? 'gray'
      : patient.tone === 'rose'
        ? 'amber'
        : 'green') as any,
    preVisit: patient.preConsultationSymptoms
      ? 'Pré-consulta estruturada · Resumo disponível'
      : 'Pré-consulta enviada',
    preVisitTone: 'green' as const,
    objective:
      patient.preConsultationSymptoms?.patientWords ||
      'Acompanhamento de metas de estilo de vida, saciedade e biossinais.',
    reported:
      patient.preConsultationSymptoms?.symptom ||
      patient.attention ||
      'Sem queixas agudas no ciclo recente.',
    aiFocus: 'Estruturação de dados longitudinais para apoio à decisão médica.',
    metrics: [
      ['Peso atual', `${patient.currentWeight.toFixed(1)} kg`, patient.weightLoss],
      ['Adesão ao plano', patient.adherence, 'Consistente'],
      ['Último contato', patient.lastContact, 'Registrado'],
    ] as Array<[string, string, string]>,
    attentionTitle: patient.attention,
    attentionDetail: patient.insight?.detail || 'Monitoramento contínuo.',
    checklist: patient.nextSteps || ['Revisar adesão', 'Validar plano pós-consulta'],
  }

  const handleSaveInlineNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inlineNoteContent.trim()) return

    setIsSavingInlineNote(true)
    setTimeout(() => {
      addPatientQuickNote(patient.id, inlineNoteContent.trim(), inlineNoteCategory)
      setIsSavingInlineNote(false)
      setInlineNoteSuccess(true)
      setInlineNoteContent('')
      setTimeout(() => {
        setInlineNoteSuccess(false)
      }, 3500)
    }, 350)
  }

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

        {/* PRÓXIMA CONSULTA & ACESSO DIRETO À PRÉ-CONSULTA (Requisito 1) */}
        <div className="mt-6 border-t border-[#DEE7E2] pt-6">
          <div className="rounded-2xl border border-[#BFE4D8] bg-gradient-to-br from-[#FAFDFC] via-[#F4F9F6] to-[#EAF3EF]/80 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#D7E8E0] pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-2 rounded-full bg-[#097260] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#075F50]">
                    Próxima Consulta Agendada
                  </span>
                  <StatusBadge tone={patientAppointment.statusTone || 'green'}>
                    {patientAppointment.status}
                  </StatusBadge>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#112822] border border-[#DEE7E2]">
                    {patientAppointment.modality || 'Teleconsulta (Google Meet)'}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#112822]">
                  {patientAppointment.type}
                </h2>
              </div>

              {/* Action buttons (Direct Pre-consultation & Teleconsultation Room) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('preconsulta')}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#097260] bg-white px-4 text-xs font-bold text-[#097260] hover:bg-[#EAF3EF] transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#097260]/40"
                  title="Abrir pré-consulta enviada pelo paciente"
                >
                  <FileText className="size-4" />
                  <span>Acessar Pré-Consulta</span>
                </button>

                <Link
                  to={`/medico/consulta/${patient.id}`}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#097260] px-5 text-xs font-bold text-white hover:bg-[#075F50] transition-all shadow-sm active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#097260]/40"
                  title="Entrar na sala de atendimento virtual com Google Meet integrado"
                >
                  <Video className="size-4" />
                  <span>Entrar na Sala Virtual</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-xl bg-white p-3.5 border border-[#DEE7E2] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#556D66] block">
                  Data &amp; Horário
                </span>
                <p className="font-serif text-sm font-bold text-[#112822] mt-0.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#097260]" />
                  <span>{patientAppointment.date || 'Hoje, 25 ago'}</span>
                </p>
                <span className="text-[11px] font-mono font-semibold text-[#097260] mt-0.5 block">
                  {patientAppointment.time} · 30 min
                </span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-[#DEE7E2] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#556D66] block">
                  Modalidade &amp; Canal
                </span>
                <p className="font-serif text-sm font-bold text-[#112822] mt-0.5 flex items-center gap-1.5">
                  <Video className="size-3.5 text-[#097260]" />
                  <span>Google Meet Integrado</span>
                </p>
                <span className="text-[11px] text-[#556D66] block">
                  Link ativo com Copiloto Clínico
                </span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-[#DEE7E2] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#556D66] block">
                  Status da Pré-Consulta
                </span>
                <p className="font-serif text-sm font-bold text-[#097260] mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-[#097260]" />
                  <span>{patientAppointment.preVisit}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('preconsulta')}
                  className="text-[11px] font-bold text-[#097260] hover:underline mt-0.5 block cursor-pointer text-left"
                >
                  Ver síntese estruturada &rarr;
                </button>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-[#DEE7E2] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#556D66] block">
                  Foco Clínico da Sessão
                </span>
                <p className="text-xs font-semibold text-[#112822] mt-0.5 line-clamp-2">
                  {patientAppointment.reported}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ANOTAÇÃO RÁPIDA DIRETO DO PERFIL (Requisito 2) */}
        <div className="mt-6 border-t border-[#DEE7E2] pt-6">
          <div className="rounded-2xl border border-[#DEE7E2] bg-[#FDFCFA] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0F4F2] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-[#EAF3EF] text-[#097260]">
                    <PenLine className="size-4 text-[#097260]" />
                  </div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[#112822]">
                    Anotação Rápida no Prontuário
                  </h2>
                </div>
                <p className="text-xs text-[#556D66]">
                  Grave notas pontuais no contexto de <strong>{patient.name}</strong> sem abrir a
                  teleconsulta.
                </p>
              </div>

              {/* Category pills selector */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#DEE7E2]">
                <span className="text-[10px] font-bold uppercase text-[#556D66] px-1.5 hidden sm:inline">
                  Categoria:
                </span>
                {(
                  [
                    { id: 'observacao', label: 'Observação' },
                    { id: 'evolucao', label: 'Evolução' },
                    { id: 'medicacao', label: 'Medicação' },
                    { id: 'geral', label: 'Geral' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setInlineNoteCategory(cat.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      inlineNoteCategory === cat.id
                        ? 'bg-[#112822] text-white shadow-2xs'
                        : 'text-[#556D66] hover:bg-[#F5F8F6] hover:text-[#112822]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Success visual banner */}
            {inlineNoteSuccess && (
              <div className="rounded-xl border border-[#BFE4D8] bg-[#EAF3EF] p-3 text-xs font-bold text-[#075F50] flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#097260]" />
                  <span>
                    Anotação clínica salva com sucesso no prontuário e na linha do tempo de{' '}
                    {patient.name}!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('linha_tempo')}
                  className="text-[11px] underline hover:text-[#112822] cursor-pointer"
                >
                  Ver na Linha do Tempo &rarr;
                </button>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSaveInlineNote} className="space-y-3">
              <div className="relative">
                <textarea
                  id="inline-patient-note-input"
                  rows={2}
                  placeholder={`Ex.: Paciente referiu melhora na adesão ao jantar e boa tolerância. Registrado pelo Dr. Guilherme Martins.`}
                  value={inlineNoteContent}
                  onChange={(e) => setInlineNoteContent(e.target.value)}
                  className="w-full rounded-xl border border-[#DEE7E2] bg-white p-3.5 text-xs text-[#112822] placeholder-[#8C9E97] focus:border-[#097260] focus:ring-1 focus:ring-[#097260] focus:outline-none transition-all shadow-inner leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#556D66]">
                  <ShieldCheck className="size-3.5 text-[#097260]" />
                  <span>
                    Registrado sob a autoria de <strong>Dr. Guilherme Martins</strong> · Carimbo de
                    data e hora automático.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {inlineNoteContent.trim() && (
                    <button
                      type="button"
                      onClick={() => setInlineNoteContent('')}
                      className="min-h-10 px-3 rounded-xl border border-[#DEE7E2] bg-white text-xs font-semibold text-[#556D66] hover:bg-[#F5F8F6] cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingInlineNote || !inlineNoteContent.trim()}
                    className="min-h-10 px-5 rounded-xl bg-[#097260] text-xs font-bold text-white hover:bg-[#075F50] transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#097260]/40"
                  >
                    {isSavingInlineNote ? (
                      <>
                        <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Salvando no Prontuário...</span>
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5 stroke-[2.5]" />
                        <span>Salvar Anotação</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* List of recent notes on this patient */}
            {patient.quickNotes && patient.quickNotes.length > 0 && (
              <div className="border-t border-[#F0F4F2] pt-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#556D66]">
                  <span>Últimas Anotações Gravadas ({patient.quickNotes.length})</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('linha_tempo')}
                    className="text-[#097260] hover:underline normal-case font-semibold cursor-pointer"
                  >
                    Ver histórico completo na linha do tempo &rarr;
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {patient.quickNotes.slice(0, 2).map((qn) => (
                    <div
                      key={qn.id}
                      className="rounded-xl border border-[#DEE7E2] bg-white p-3 text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#556D66]">
                        <span className="font-bold text-[#112822] flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-[#097260]" />
                          {qn.author}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {qn.category && (
                            <span className="rounded bg-[#F5F8F6] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#097260] border border-[#DEE7E2]">
                              {qn.category}
                            </span>
                          )}
                          <span>{qn.createdAt}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#112822] leading-relaxed line-clamp-2">
                        {qn.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
              <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
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
                  <h2 className="font-serif text-base font-bold text-[#112822]">
                    Biossinais &amp; Registros Objetivos
                  </h2>
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
                  <h2 className="font-serif text-base font-bold text-[#112822]">
                    Relato Direto do Paciente (Pré-Consulta &amp; Diário)
                  </h2>
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
                  <h2 className="font-serif text-base font-bold text-[#7D5308]">
                    Compilação e Hipóteses de Apoio ao Médico
                  </h2>
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
                  <h2 className="font-serif text-base font-bold text-[#075F50]">
                    Conduta e Orientações Validadas pelo Médico
                  </h2>
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

      {/* TAB: EVOLUÇÃO LONGITUDINAL (RESUMO COMPARATIVO ENTRE DOIS PERÍODOS - Requisito 3) */}
      {activeTab === 'evolucao' &&
        (() => {
          // Compute comparison metrics based on selected periods
          const history = patient.evolutionHistory || [
            {
              date: '28 jul',
              adherence: 74,
              weight: patient.startWeight,
              sleepHours: 6.3,
              steps: 5600,
            },
            {
              date: '01 ago',
              adherence: 76,
              weight: patient.startWeight - 0.2,
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

          // Period definitions
          const periodLabels: Record<string, string> = {
            ultimos_30: 'Últimos 30 dias (27 Jul – 25 Ago)',
            ultimos_14: 'Últimos 14 dias (11 Ago – 25 Ago)',
            ultimos_60: 'Últimos 60 dias (25 Jun – 25 Ago)',
            periodo_anterior: 'Período anterior equivalente (27 Jun – 26 Jul)',
            marco_zero: 'Marco Zero / Abertura do Protocolo (Início)',
            meta_alvo: 'Meta Clínica Alvo Estabelecida',
          }

          // Metrics derived dynamically for period A and period B
          const metricsA = {
            label: periodLabels[evolutionPeriodA],
            weight: patient.currentWeight,
            adherence: parseInt(patient.adherence) || 82,
            sleepHours:
              patient.id === 'marina-costa' ? 5.7 : patient.id === 'paulo-mendes' ? 6.2 : 7.1,
            steps:
              patient.id === 'marina-costa'
                ? 6420
                : patient.id === 'ana-ribeiro'
                  ? 7140
                  : patient.id === 'paulo-mendes'
                    ? 4500
                    : 6800,
          }

          const metricsB = {
            label: periodLabels[evolutionPeriodB],
            weight:
              evolutionPeriodB === 'marco_zero'
                ? patient.startWeight
                : evolutionPeriodB === 'meta_alvo'
                  ? patient.targetWeight
                  : patient.startWeight,
            adherence:
              evolutionPeriodB === 'marco_zero'
                ? 70
                : evolutionPeriodB === 'meta_alvo'
                  ? 85
                  : Math.max(50, (parseInt(patient.adherence) || 82) - 8),
            sleepHours:
              evolutionPeriodB === 'marco_zero'
                ? 6.4
                : evolutionPeriodB === 'meta_alvo'
                  ? 7.5
                  : 6.3,
            steps:
              evolutionPeriodB === 'marco_zero'
                ? 5400
                : evolutionPeriodB === 'meta_alvo'
                  ? 7000
                  : 5850,
          }

          // Differences (A - B)
          const weightDiff = metricsA.weight - metricsB.weight
          const adherenceDiff = metricsA.adherence - metricsB.adherence
          const sleepDiff = metricsA.sleepHours - metricsB.sleepHours
          const stepsDiff = metricsA.steps - metricsB.steps

          return (
            <section className="space-y-6 animate-fade-in">
              {/* Top Cards: Current snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                    <TrendingDown className="size-3.5 text-[#097260]" />
                    <span>Peso Atual (kg)</span>
                  </div>
                  <p className="text-2xl font-bold text-[#112822] mt-1 font-mono">
                    {patient.currentWeight.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#556D66]">kg</span>
                  </p>
                  <span className="text-[11px] text-[#097260] font-semibold">
                    {patient.weightLoss} no ciclo
                  </span>
                </div>

                <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                    <Activity className="size-3.5 text-[#097260]" />
                    <span>Adesão Média (%)</span>
                  </div>
                  <p className="text-2xl font-bold text-[#112822] mt-1 font-mono">
                    {patient.adherence}
                  </p>
                  <span className="text-[11px] text-[#097260] font-semibold">
                    Meta clínica &ge; 80%
                  </span>
                </div>

                <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                    <Moon className="size-3.5 text-[#244C77]" />
                    <span>Sono Médio (h/noite)</span>
                  </div>
                  <p className="text-2xl font-bold text-[#112822] mt-1 font-mono">
                    {patient.id === 'marina-costa'
                      ? '5h42'
                      : patient.id === 'paulo-mendes'
                        ? '6h12'
                        : '7h04'}
                  </p>
                  <span className="text-[11px] text-[#556D66]">Biossinal conectado</span>
                </div>

                <div className="rounded-2xl border border-[#DEE7E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#556D66]">
                    <Footprints className="size-3.5 text-[#097260]" />
                    <span>Passos Diários (média)</span>
                  </div>
                  <p className="text-2xl font-bold text-[#112822] mt-1 font-mono">
                    {metricsA.steps.toLocaleString('pt-BR')}
                  </p>
                  <span className="text-[11px] text-[#097260] font-semibold">
                    Meta &ge; 6.000 passos
                  </span>
                </div>
              </div>

              {/* COMPARATIVE EVOLUTION MODULE (Requisito 3) */}
              <article className="rounded-[24px] border border-[#BFE4D8] bg-white p-6 sm:p-7 shadow-xs space-y-6">
                {/* Module Header & Period Selectors */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#DEE7E2] pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#EAF3EF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#075F50] border border-[#BFE4D8]">
                        Módulo Longitudinal Comparativo
                      </span>
                      <span className="text-xs text-[#556D66]">Dr. Guilherme Martins</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                      Comparativo de Evolução entre Dois Períodos
                    </h3>
                    <p className="text-xs text-[#556D66]">
                      Selecione dois intervalos temporais para contrastar métricas objetivas de
                      peso, adesão, sono e passos.
                    </p>
                  </div>

                  {/* Period selection dropdowns */}
                  <div className="flex flex-wrap items-center gap-3 bg-[#F8FAF9] p-2.5 rounded-2xl border border-[#DEE7E2]">
                    <div className="space-y-1">
                      <label
                        htmlFor="period-a-select"
                        className="text-[10px] font-bold uppercase text-[#097260] block"
                      >
                        Período A (Atual / Foco):
                      </label>
                      <select
                        id="period-a-select"
                        value={evolutionPeriodA}
                        onChange={(e) => setEvolutionPeriodA(e.target.value as any)}
                        className="rounded-xl border border-[#BFE4D8] bg-white px-3 py-1.5 text-xs font-bold text-[#112822] focus:border-[#097260] focus:outline-none cursor-pointer"
                      >
                        <option value="ultimos_30">Últimos 30 dias (Atual)</option>
                        <option value="ultimos_14">Últimos 14 dias (Recente)</option>
                        <option value="ultimos_60">Últimos 60 dias (Bimestre)</option>
                      </select>
                    </div>

                    <span className="text-xs font-bold text-[#8C9E97] mt-3">vs.</span>

                    <div className="space-y-1">
                      <label
                        htmlFor="period-b-select"
                        className="text-[10px] font-bold uppercase text-[#556D66] block"
                      >
                        Período B (Referência / Comparação):
                      </label>
                      <select
                        id="period-b-select"
                        value={evolutionPeriodB}
                        onChange={(e) => setEvolutionPeriodB(e.target.value as any)}
                        className="rounded-xl border border-[#DEE7E2] bg-white px-3 py-1.5 text-xs font-bold text-[#112822] focus:border-[#097260] focus:outline-none cursor-pointer"
                      >
                        <option value="periodo_anterior">Período anterior equivalente</option>
                        <option value="marco_zero">Marco Zero (Início do Protocolo)</option>
                        <option value="meta_alvo">Meta Clínica Alvo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Comparative 4 Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  {/* 1. Peso Corporal */}
                  <div className="rounded-2xl border border-[#DEE7E2] bg-[#FAFDFC] p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                      <span className="text-[11px] font-bold uppercase text-[#556D66] flex items-center gap-1.5">
                        <TrendingDown className="size-3.5 text-[#097260]" />
                        Peso Corporal (kg)
                      </span>
                      <span className="text-[10px] text-[#8C9E97]">Eixo: Quilogramas</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período A:</span>
                        <strong className="font-mono text-sm font-bold text-[#112822]">
                          {metricsA.weight.toFixed(1)} kg
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período B:</span>
                        <span className="font-mono text-xs text-[#556D66]">
                          {metricsB.weight.toFixed(1)} kg
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#556D66]">Variação:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          weightDiff <= 0
                            ? 'bg-[#EAF3EF] text-[#075F50]'
                            : 'bg-[#FEF7E7] text-[#7D5308]'
                        }`}
                      >
                        {weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1)} kg
                      </span>
                    </div>
                  </div>

                  {/* 2. Adesão ao Plano */}
                  <div className="rounded-2xl border border-[#DEE7E2] bg-[#FAFDFC] p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                      <span className="text-[11px] font-bold uppercase text-[#556D66] flex items-center gap-1.5">
                        <Activity className="size-3.5 text-[#097260]" />
                        Adesão ao Plano (%)
                      </span>
                      <span className="text-[10px] text-[#8C9E97]">Eixo: 0 – 100%</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período A:</span>
                        <strong className="font-mono text-sm font-bold text-[#097260]">
                          {metricsA.adherence}%
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período B:</span>
                        <span className="font-mono text-xs text-[#556D66]">
                          {metricsB.adherence}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#556D66]">Diferença:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          adherenceDiff >= 0
                            ? 'bg-[#EAF3EF] text-[#075F50]'
                            : 'bg-[#FCF0EE] text-[#8E2E28]'
                        }`}
                      >
                        {adherenceDiff > 0 ? `+${adherenceDiff}` : adherenceDiff} p.p.
                      </span>
                    </div>
                  </div>

                  {/* 3. Sono Médio */}
                  <div className="rounded-2xl border border-[#DEE7E2] bg-[#FAFDFC] p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                      <span className="text-[11px] font-bold uppercase text-[#556D66] flex items-center gap-1.5">
                        <Moon className="size-3.5 text-[#244C77]" />
                        Tempo de Sono (h)
                      </span>
                      <span className="text-[10px] text-[#8C9E97]">Eixo: Horas/Noite</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período A:</span>
                        <strong className="font-mono text-sm font-bold text-[#112822]">
                          {Math.floor(metricsA.sleepHours)}h
                          {Math.round((metricsA.sleepHours % 1) * 60)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período B:</span>
                        <span className="font-mono text-xs text-[#556D66]">
                          {Math.floor(metricsB.sleepHours)}h
                          {Math.round((metricsB.sleepHours % 1) * 60)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#556D66]">Variação:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          sleepDiff >= 0
                            ? 'bg-[#EAF3EF] text-[#075F50]'
                            : 'bg-[#FEF7E7] text-[#7D5308]'
                        }`}
                      >
                        {sleepDiff > 0 ? `+${sleepDiff.toFixed(1)}h` : `${sleepDiff.toFixed(1)}h`}
                      </span>
                    </div>
                  </div>

                  {/* 4. Passos Diários */}
                  <div className="rounded-2xl border border-[#DEE7E2] bg-[#FAFDFC] p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                      <span className="text-[11px] font-bold uppercase text-[#556D66] flex items-center gap-1.5">
                        <Footprints className="size-3.5 text-[#097260]" />
                        Passos Diários
                      </span>
                      <span className="text-[10px] text-[#8C9E97]">Eixo: Passos/Dia</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período A:</span>
                        <strong className="font-mono text-sm font-bold text-[#112822]">
                          {metricsA.steps.toLocaleString('pt-BR')}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#556D66]">Período B:</span>
                        <span className="font-mono text-xs text-[#556D66]">
                          {metricsB.steps.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0F4F2] flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#556D66]">Variação:</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          stepsDiff >= 0
                            ? 'bg-[#EAF3EF] text-[#075F50]'
                            : 'bg-[#FEF7E7] text-[#7D5308]'
                        }`}
                      >
                        {stepsDiff > 0
                          ? `+${stepsDiff.toLocaleString('pt-BR')}`
                          : stepsDiff.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Structured Descriptive Summary (Accessible Textual Synthesis) */}
                <div className="rounded-2xl border border-[#DEE7E2] bg-[#F8FAF9] p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E8EEEB] pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-[#097260]" />
                      <h4 className="font-serif text-sm font-bold text-[#112822]">
                        Resumo Textual Acessível da Comparação
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#556D66]">
                      Síntese Descritiva · Apoio Médico
                    </span>
                  </div>

                  <div className="text-xs text-[#112822] leading-relaxed space-y-2">
                    <p>
                      No confronto entre <strong>{metricsA.label}</strong> e{' '}
                      <strong>{metricsB.label}</strong> para o paciente{' '}
                      <strong>{patient.name}</strong>, observam-se os seguintes comportamentos
                      objetivos registrados pelos biossinais:
                    </p>

                    <ul className="list-disc pl-5 space-y-1.5 text-[#556D66]">
                      <li>
                        <strong className="text-[#112822]">Evolução Ponderal:</strong> Variação de{' '}
                        <strong className="text-[#097260]">
                          {weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1)} kg
                        </strong>{' '}
                        (de {metricsB.weight.toFixed(1)} kg para {metricsA.weight.toFixed(1)} kg),
                        mantendo trajetória compatível com o foco longitudinal definido.
                      </li>
                      <li>
                        <strong className="text-[#112822]">Adesão ao Plano de Cuidado:</strong>{' '}
                        Oscilação de{' '}
                        <strong
                          className={adherenceDiff >= 0 ? 'text-[#097260]' : 'text-[#8E2E28]'}
                        >
                          {adherenceDiff > 0 ? `+${adherenceDiff}` : adherenceDiff} pontos
                          percentuais
                        </strong>{' '}
                        (de {metricsB.adherence}% para {metricsA.adherence}%), com registros diários
                        consistentes na rotina estipulada.
                      </li>
                      <li>
                        <strong className="text-[#112822]">Padrão de Repouso (Sono):</strong>{' '}
                        Diferença média de{' '}
                        <strong className="text-[#112822]">
                          {sleepDiff > 0 ? `+${sleepDiff.toFixed(1)}h` : `${sleepDiff.toFixed(1)}h`}
                        </strong>{' '}
                        por noite (de {Math.floor(metricsB.sleepHours)}h
                        {Math.round((metricsB.sleepHours % 1) * 60)} para{' '}
                        {Math.floor(metricsA.sleepHours)}h
                        {Math.round((metricsA.sleepHours % 1) * 60)}).{' '}
                        {patient.id === 'marina-costa' &&
                          'Ponto de atenção: registro de despertares às 3h correlacionado ao jantar tardio para discussão clínica.'}
                      </li>
                      <li>
                        <strong className="text-[#112822]">Atividade Física (Passos):</strong>{' '}
                        Variação de{' '}
                        <strong className="text-[#097260]">
                          {stepsDiff > 0
                            ? `+${stepsDiff.toLocaleString('pt-BR')}`
                            : stepsDiff.toLocaleString('pt-BR')}{' '}
                          passos/dia
                        </strong>{' '}
                        (de {metricsB.steps.toLocaleString('pt-BR')} para{' '}
                        {metricsA.steps.toLocaleString('pt-BR')} passos diários médios).
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[#DEE7E2] bg-white p-3 text-[11px] text-[#556D66] flex items-center gap-2">
                    <Info className="size-3.5 text-[#097260] shrink-0" />
                    <span>
                      <strong>Nota de Governança Vivans:</strong> Este resumo descritivo apresenta a
                      compilação matemática dos registros coletados. Não constitui diagnóstico
                      automático e não promete desfecho clínico futuro sem validação médica.
                    </span>
                  </div>
                </div>
              </article>

              {/* Historical Evolution Table */}
              <div className="rounded-[22px] border border-[#DEE7E2] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#F3F7F5] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#112822]">
                    Histórico Pontual de Registros e Biossinais
                  </h3>
                  <span className="text-xs text-[#556D66]">Smartwatch, Balança &amp; Diário</span>
                </div>

                <div className="overflow-x-auto">
                  <table
                    className="w-full text-xs text-left"
                    aria-label="Histórico de Biossinais do Paciente"
                  >
                    <thead>
                      <tr className="border-b border-[#DEE7E2] text-[#556D66]">
                        <th className="pb-2.5 font-bold">Data</th>
                        <th className="pb-2.5 font-bold">Peso (kg)</th>
                        <th className="pb-2.5 font-bold">Adesão (%)</th>
                        <th className="pb-2.5 font-bold">Sono (h)</th>
                        <th className="pb-2.5 font-bold">Passos (diários)</th>
                        <th className="pb-2.5 font-bold">Consistência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F7F5]">
                      {history.map((h, i) => (
                        <tr key={i} className="hover:bg-[#F8FAF9] transition-colors">
                          <td className="py-3 font-semibold text-[#112822]">{h.date}</td>
                          <td className="py-3 font-mono font-bold text-[#112822]">
                            {h.weight ? `${h.weight.toFixed(1)} kg` : '—'}
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-[#097260] font-mono">
                              {h.adherence}%
                            </span>
                          </td>
                          <td className="py-3 text-[#556D66] font-mono">
                            {h.sleepHours
                              ? `${Math.floor(h.sleepHours)}h${Math.round((h.sleepHours % 1) * 60)}`
                              : '—'}
                          </td>
                          <td className="py-3 text-[#556D66] font-mono">
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
          )
        })()}

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
                    <AiDraftBadge
                      status="Rascunho gerado com IA - requer validação médica"
                      variant="compact"
                    />
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
