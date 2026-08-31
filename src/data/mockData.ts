/* Centralized Typed Mock Data & Store for Instituto Vivans */

export type Role = 'doctor' | 'patient'

export interface QuickNote {
  id: string
  patientId: string
  content: string
  createdAt: string
  author: string
  category?: 'evolucao' | 'observacao' | 'medicacao' | 'geral'
}

export interface PatientEvolutionMetric {
  date: string
  adherence: number // 0-100%
  weight?: number // kg
  sleepHours?: number // hours, e.g. 5.7
  steps?: number // e.g. 6420
}

export interface DoctorProfile {
  id: string
  name: string
  crm: string
  specialty: string
  avatarUrl: string
  initials: string
}

export interface MedicationItem {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  timeSlots: string[]
  instructions: string
  purpose: string
  prescribedBy: string
  prescribedAt: string
  status: 'em_uso' | 'pausado' | 'concluido'
  prescriptionId?: string
}

export interface PrescriptionRecord {
  id: string
  patientId: string
  code: string
  title: string
  doctorName: string
  doctorCrm: string
  issuedAt: string
  validUntil: string
  status: 'ativa' | 'vencida' | 'renovada'
  items: Array<{
    medication: string
    dosage: string
    posology: string
    quantity: string
    notes?: string
  }>
  instructions: string
  digitalSignatureId: string
  isSimulated: boolean
}

export interface ExamRecord {
  id: string
  patientId: string
  title: string
  category: 'Laboratorial' | 'Imagem' | 'Cardiológico' | 'Metabólico' | 'Funcional'
  performedAt: string
  laboratory: string
  doctorRequester: string
  status: 'concluido' | 'aguardando_resultado'
  summary: string
  highlights: Array<{
    parameter: string
    value: string
    reference: string
    status: 'normal' | 'otimizado' | 'atencao'
  }>
  doctorObservations?: string
  fileUrl?: string
}

export interface SuggestedProcedure {
  id: string
  patientId: string
  title: string
  category:
    | 'Exame de Controle'
    | 'Procedimento Clínico'
    | 'Avaliação Especializada'
    | 'Bioimpedância'
  suggestedBy: string
  suggestedAt: string
  status: 'sugerido' | 'agendado' | 'realizado'
  scheduledFor?: string
  priority: 'alta' | 'media' | 'preventiva'
  clinicalRationale: string
  patientExplanation: string
  nextStepPrompt: string
}

export interface PatientProfile {
  id: string
  initials: string
  name: string
  avatarUrl: string
  email?: string
  phone?: string
  birthDate?: string
  cpf?: string
  clinicalSummary?: string
  gender?: 'Feminino' | 'Masculino' | 'Outro'
  focus: string
  progress: string
  attention: string
  tone: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  reportCount: string
  prescriptionCount: string
  cycle: string
  lastContact: string
  nextConsultation: string
  adherence: string
  weightLoss: string
  currentWeight: number
  targetWeight: number
  startWeight: number
  isTemporary?: boolean
  isOnlineInWaitingRoom?: boolean
  waitingSince?: string
  preConsultationSymptoms?: {
    symptom: string
    reportedAt: string
    severity: 'leve' | 'moderada' | 'alta'
    patientWords: string
    aiSummary: string
  }
  evolutionHistory?: PatientEvolutionMetric[]
  quickNotes?: QuickNote[]
  report: {
    title: string
    period: string
    status: string
    summary: string
    metrics: Array<[string, string]>
  }
  prescription: {
    title: string
    status: string
    detail: string
    note: string
  }
  insight: {
    title: string
    detail: string
    basis: string
  }
  activity: Array<[string, string]>
  nextSteps: string[]
}

export interface WeeklyAdherenceTrendPoint {
  week: string
  label: string
  adherence: number // %
  regularCount: number
  delayedCount: number
  attentionCount: number
}

export const cohortWeeklyAdherence: WeeklyAdherenceTrendPoint[] = [
  {
    week: 'Sem 1',
    label: '28 Jul–03 Ago',
    adherence: 79,
    regularCount: 13,
    delayedCount: 6,
    attentionCount: 3,
  },
  {
    week: 'Sem 2',
    label: '04–10 Ago',
    adherence: 81,
    regularCount: 14,
    delayedCount: 5,
    attentionCount: 3,
  },
  {
    week: 'Sem 3',
    label: '11–17 Ago',
    adherence: 84,
    regularCount: 15,
    delayedCount: 4,
    attentionCount: 3,
  },
  {
    week: 'Sem 4',
    label: '18–24 Ago',
    adherence: 86,
    regularCount: 15,
    delayedCount: 4,
    attentionCount: 3,
  },
  {
    week: 'Sem 5',
    label: 'Atual (25 Ago)',
    adherence: 87,
    regularCount: 15,
    delayedCount: 4,
    attentionCount: 3,
  },
]

export interface Appointment {
  id: string
  patientId?: string
  date?: string
  time: string
  patient: string
  patientAvatarUrl?: string
  initials: string
  type: string
  modality?: 'Teleconsulta (Google Meet)' | 'Presencial (Instituto Vivans)' | 'Híbrida'
  status: string
  statusTone: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  preVisit: string
  preVisitTone: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  objective: string
  reported: string
  aiFocus: string
  metrics: Array<[string, string, string]>
  attentionTitle: string
  attentionDetail: string
  checklist: string[]
}

export type ActionPeriod = 'manha' | 'tarde' | 'noite' | 'livre'
export type ActionTimingStatus = 'em_dia' | 'pendente_hoje' | 'atrasado' | 'concluido'

export interface CarePlanItem {
  id: string
  action: string
  category: string
  type: 'medical' | 'ai_suggestion'
  completed: boolean
  isPrimaryToday?: boolean // High priority focus for the patient
  period?: ActionPeriod
  timingStatus?: ActionTimingStatus
  frequency?: string // ex: "Diário", "3x por semana", "Antes de deitar"
  targetDays?: number
  notes?: string
  lastCompletedAt?: string
  doctorRationale?: string // Explicação médica acolhedora
  aiDraftNote?: string // Se gerado por IA
}

export type CheckinType = 'peso' | 'humor' | 'adesao' | 'diario'
export type CheckinStatus = 'concluido' | 'pendente' | 'atrasado'

export interface ScheduledCheckin {
  id: string
  patientId: string
  title: string
  type: CheckinType
  scheduledDate: string
  scheduledTime?: string
  dayOffset: number // ex: Dia 1, Dia 3, Dia 7, Dia 14
  status: CheckinStatus
  completedAt?: string
  value?: string | number
  notes?: string
}

export interface ReturnJourneyPlan {
  id: string
  patientId: string
  title: string
  status: 'ativo' | 'concluido' | 'em_revisao'
  activatedAt: string
  approvedBy: string
  nextReviewDate: string
  summary: string
  checkins: ScheduledCheckin[]
}

export interface MealRecord {
  id: string
  meal: string
  time: string
  image: string
  alt: string
  status: string
  tone: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  recognized: string
  analysis: string
  confidence: string
  ratings?: [number, number, number] // Satiety, Comfort, Ease
  feedbackSent?: boolean
}

export interface WeeklyAdherenceSummaryData {
  completedActions: number
  totalActions: number
  adherencePct: number
  trendPct: number
  nextFriendlyStep: string
  periodLabel: string
  aiDraftNote?: string
}

export interface MessageItem {
  id: string
  sender: 'doctor' | 'patient' | 'system' | 'ai_draft' | 'team_summary'
  author: string
  authorAvatarUrl?: string
  time: string
  content: string
  isAiDraft?: boolean
  status?: 'enviada' | 'revisando' | 'aguardando_aprovacao'
  weeklySummary?: WeeklyAdherenceSummaryData
}

export interface ClinicalReport {
  id: string
  patientName: string
  title: string
  period: string
  status: 'rascunho' | 'em_revisao' | 'aprovado' | 'compartilhado'
  summary: string
  approvedBy?: string
  approvedAt?: string
  metrics: Array<[string, string]>
}

export interface PreConsultationData {
  completed: boolean
  consentGiven: boolean
  mode: 'voice' | 'text'
  objective: string
  energyRating: number
  sleepRating: number
  digestiveStatus: string
  questionsForDoctor: string
  audioDurationSeconds?: number
  transcript: string
  aiSynthesis: string
  suggestedQuestions: string[]
  submittedAt?: string
}

export interface MedicalEvidence {
  id: string
  title: string
  source: 'PubMed' | 'Cochrane' | 'Conitec'
  year: string
  evidenceType: string
  confidence: 'Alta' | 'Moderada' | 'Limitada'
  url: string
  summary: string
  relevance: string
}

export const DOCTOR_PROFILE: DoctorProfile = {
  id: 'dr-guilherme-martins',
  name: 'Dr. Guilherme Martins',
  crm: 'CRM/SP 184.920',
  specialty: 'Medicina Preventiva, Longevidade & Metabolismo',
  avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=15',
  initials: 'GM',
}

export const initialPatients: PatientProfile[] = [
  {
    id: 'marina-costa',
    initials: 'MC',
    name: 'Marina Costa',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=88',
    email: 'marina.costa@email.com',
    phone: '(11) 98765-4321',
    birthDate: '14/05/1988 (38 anos)',
    cpf: '321.***.***-09',
    gender: 'Feminino',
    clinicalSummary:
      'Emagrecimento sustentável com foco em preservação de massa magra, crononutrição e readequação do sono.',
    focus: 'Emagrecimento longitudinal · sono e ritmo circadiano',
    progress: '−1,8 kg',
    attention: 'Sono curto (5h42) · Despertares 3h',
    tone: 'amber',
    preConsultationSymptoms: {
      symptom: 'Despertares noturnos às 3h e sono curto (5h42)',
      reportedAt: 'Hoje · 09:18',
      severity: 'moderada',
      patientWords:
        'Nos últimos quatro dias passei a acordar às 3h da manhã com sono fragmentado. Quero avaliar o horário do jantar.',
      aiSummary:
        'Média de 5h42 de sono em 4 noites consecutivas, correlacionada a jantar tardio às 20h30.',
    },
    evolutionHistory: [
      { date: '28 jul', adherence: 74, weight: 80.5, sleepHours: 6.3, steps: 5600 },
      { date: '01 ago', adherence: 76, weight: 80.0, sleepHours: 6.2, steps: 5800 },
      { date: '08 ago', adherence: 79, weight: 79.4, sleepHours: 6.0, steps: 6100 },
      { date: '15 ago', adherence: 82, weight: 78.8, sleepHours: 6.1, steps: 6350 },
      { date: '22 ago', adherence: 80, weight: 78.4, sleepHours: 5.7, steps: 6400 },
      { date: '25 ago', adherence: 82, weight: 78.2, sleepHours: 5.7, steps: 6420 },
    ],
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 29 de 90 · Plano pós-consulta ativo',
    lastContact: 'Hoje · 09:18',
    nextConsultation: 'Hoje · 10:30 (Retorno agendado)',
    isOnlineInWaitingRoom: true,
    waitingSince: 'Há 4 min',
    quickNotes: [
      {
        id: 'qn-init-1',
        patientId: 'marina-costa',
        content:
          'Paciente solicitou revisão sobre horário de jantar x despertares noturnos. Relatou excelente saciedade com omelete.',
        createdAt: 'Hoje · 09:20',
        author: 'Dr. Guilherme Martins',
        category: 'observacao',
      },
    ],
    adherence: '82%',
    weightLoss: '−1,8 kg',
    currentWeight: 78.2,
    targetWeight: 72.0,
    startWeight: 80.0,
    report: {
      title: 'Relatório clínico quinzenal',
      period: '11–25 de agosto',
      status: 'Revisado em 24 ago',
      summary:
        'Evolução ponderal progressiva com redução de 1,8 kg e adesão de 82%. Ponto de observação: média de 5h42 de sono em quatro noites consecutivas.',
      metrics: [
        ['Variação ponderal', '−1,8 kg'],
        ['Adesão média', '82%'],
        ['Sono médio', '5h42'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1042',
      status: 'Ativa',
      detail: '1 item prescrito · validade até 26 de setembro',
      note: 'Emitida em consulta anterior e disponibilizada à paciente.',
    },
    insight: {
      title: 'Observação de ritmo circadiano',
      detail:
        'Média de descanso abaixo de seis horas correlacionada a queixa de menor energia vespertina.',
      basis: 'Compilação de registros de 14 dias para apreciação médica.',
    },
    activity: [
      ['Hoje · 09:18', 'Pré-consulta concluída e vinculada'],
      ['Ontem · 20:08', 'Registro noturno com notas de saciedade'],
      ['24 ago · 16:42', 'Relatório quinzenal revisado pelo médico'],
      ['12 ago · 11:14', 'Primeira consulta realizada'],
    ],
    nextSteps: [
      'Avaliar intervalo do jantar e repouso',
      'Confirmar tolerância ao plano aprovado',
      'Acompanhar check-ins programados de retorno',
    ],
  },
  {
    id: 'ana-ribeiro',
    initials: 'AR',
    name: 'Ana Ribeiro',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=42',
    email: 'ana.ribeiro@email.com',
    phone: '(11) 98111-2233',
    birthDate: '03/11/1979 (46 anos)',
    cpf: '123.***.***-45',
    gender: 'Feminino',
    clinicalSummary:
      'Protocolo de longevidade, preservação de força funcional e manutenção de densidade muscular e óssea.',
    focus: 'Longevidade · força',
    progress: '+8% adesão',
    attention: 'Metas em dia',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 61 de 90',
    lastContact: 'Ontem · 18:40',
    nextConsultation: 'Hoje · 14:00 (Retorno de força)',
    adherence: '88%',
    weightLoss: '−0,5 kg',
    currentWeight: 64.5,
    targetWeight: 64.0,
    startWeight: 65.0,
    preConsultationSymptoms: {
      symptom: 'Estabilidade física e boa resposta ao treino matinal',
      reportedAt: 'Ontem · 18:40',
      severity: 'leve',
      patientWords:
        'Treinar às 7h facilitou muito a minha semana. Não sinto mais aquela quebra de disposição às 16h.',
      aiSummary:
        'Relato de excelente adaptação aos exercícios matinais com adesão de 88% e melhora subjetiva de energia.',
    },
    evolutionHistory: [
      { date: '01 ago', adherence: 80, weight: 65.0, sleepHours: 6.8, steps: 6600 },
      { date: '08 ago', adherence: 83, weight: 64.8, sleepHours: 7.0, steps: 6850 },
      { date: '15 ago', adherence: 85, weight: 64.6, sleepHours: 7.1, steps: 7000 },
      { date: '22 ago', adherence: 87, weight: 64.5, sleepHours: 7.2, steps: 7100 },
      { date: '25 ago', adherence: 88, weight: 64.5, sleepHours: 7.2, steps: 7140 },
    ],
    quickNotes: [
      {
        id: 'qn-ar-1',
        patientId: 'ana-ribeiro',
        content:
          'Paciente mantendo rotina de treinos de força às terças e quintas sem desconfortos.',
        createdAt: 'Ontem · 18:45',
        author: 'Dr. Guilherme Martins',
        category: 'evolucao',
      },
    ],
    report: {
      title: 'Relatório mensal',
      period: '25 jul–25 ago',
      status: 'Pronto para aprovação',
      summary:
        'Aumento de consistência nos exercícios de força, com melhora de energia e manutenção do peso.',
      metrics: [
        ['Adesão', '88%'],
        ['Força', '+12%'],
        ['Passos', '7.140'],
      ],
    },
    prescription: {
      title: 'Nenhuma receita ativa',
      status: 'Sem pendências',
      detail: 'Não há documentos de prescrição vigentes neste ciclo.',
      note: 'O histórico permanece disponível no prontuário demonstrativo.',
    },
    insight: {
      title: 'Boa resposta à rotina de força',
      detail: 'A adesão aumentou após a troca dos treinos para o período da manhã.',
      basis: 'Padrão observado em quatro semanas demonstrativas.',
    },
    activity: [
      ['Ontem · 18:40', 'Check-in semanal concluído'],
      ['23 ago · 07:32', 'Meta de força registrada'],
      ['20 ago · 15:10', 'Relatório mensal preparado'],
    ],
    nextSteps: [
      'Aprovar relatório mensal',
      'Revisar progressão de força',
      'Manter acompanhamento de energia',
    ],
  },
  {
    id: 'paulo-mendes',
    initials: 'PM',
    name: 'Paulo Mendes',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=33',
    email: 'paulo.mendes@email.com',
    phone: '(11) 97654-3210',
    birthDate: '22/09/1982 (43 anos)',
    cpf: '456.***.***-18',
    gender: 'Masculino',
    clinicalSummary:
      'Emagrecimento e controle de hábitos. Em adaptação à nova posologia com relato de desconforto gástrico recente.',
    focus: 'Emagrecimento · rotina',
    progress: '72% plano',
    attention: 'Enjoo matinal após novo plano',
    tone: 'rose',
    preConsultationSymptoms: {
      symptom: 'Desconforto gástrico e enjoo matinal',
      reportedAt: 'Hoje · 08:12',
      severity: 'moderada',
      patientWords:
        'Senti enjoo moderado nas manhãs após tomar a nova suplementação em jejum. Reduzi os registros por desânimo.',
      aiSummary:
        'Relato de queixa gástrica matinal após atualização da prescrição #RX-1051. Sugerido avaliar tomada pós-prandial.',
    },
    evolutionHistory: [
      { date: '28 jul', adherence: 88, weight: 93.4, sleepHours: 7.0, steps: 5600 },
      { date: '01 ago', adherence: 85, weight: 93.0, sleepHours: 6.8, steps: 5400 },
      { date: '08 ago', adherence: 82, weight: 92.8, sleepHours: 6.6, steps: 5200 },
      { date: '15 ago', adherence: 78, weight: 92.6, sleepHours: 6.5, steps: 4900 },
      { date: '22 ago', adherence: 74, weight: 92.4, sleepHours: 6.3, steps: 4600 },
      { date: '25 ago', adherence: 72, weight: 92.4, sleepHours: 6.2, steps: 4500 },
    ],
    reportCount: '1',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 18 de 60',
    lastContact: 'Hoje · 08:12',
    nextConsultation: 'Hoje · 16:30',
    adherence: '72%',
    weightLoss: '−0,6 kg',
    currentWeight: 92.4,
    targetWeight: 84.0,
    startWeight: 93.0,
    report: {
      title: 'Relatório semanal',
      period: '18–25 de agosto',
      status: 'Processando',
      summary: 'Adesão moderada, com queda nos registros após relato de enjoo no check-in de hoje.',
      metrics: [
        ['Adesão', '72%'],
        ['Peso', '−0,6 kg'],
        ['Check-ins', '5 de 7'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1051',
      status: 'Requer revisão',
      detail: '1 item prescrito · emitida em 18 de agosto',
      note: 'Novo sintoma relatado após a emissão; documento sinalizado ao médico.',
    },
    insight: {
      title: 'Revisar enjoo antes de manter o plano',
      detail: 'O relato de hoje deve ser avaliado pelo médico antes de qualquer ajuste.',
      basis: 'Alerta criado a partir do relato do paciente, sem diagnóstico.',
    },
    activity: [
      ['Hoje · 08:12', 'Novo sintoma relatado'],
      ['Ontem · 19:26', 'Check-in não concluído'],
      ['22 ago · 12:18', 'Receita acessada pelo paciente'],
    ],
    nextSteps: [
      'Responder ao relato de enjoo',
      'Revisar receita vigente',
      'Decidir continuidade do plano',
    ],
  },
  {
    id: 'rafael-lima',
    initials: 'RL',
    name: 'Rafael Lima',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=54',
    email: 'rafael.lima@email.com',
    phone: '(11) 99123-4567',
    birthDate: '10/03/1990 (36 anos)',
    cpf: '789.***.***-22',
    gender: 'Masculino',
    clinicalSummary:
      'Primeira consulta de longevidade. Queixa de fadiga vespertina crônica e sobrecarga de trabalho.',
    focus: 'Avaliação inicial',
    progress: 'Novo',
    attention: 'Fadiga crônica · Anamnese 68%',
    tone: 'rose',
    preConsultationSymptoms: {
      symptom: 'Fadiga ao fim do dia e sono irregular',
      reportedAt: 'Ontem · 11:05',
      severity: 'moderada',
      patientWords:
        'Sinto um cansaço muito pesado às 16h, sem energia para treinar. Faltou preencher parte do histórico familiar.',
      aiSummary:
        'Anamnese 68% preenchida com queixa de fadiga vespertina e sono não restaurador. 2 exames prévios anexados.',
    },
    evolutionHistory: [
      { date: '01 ago', adherence: 45, weight: 89.2, sleepHours: 5.8, steps: 3600 },
      { date: '08 ago', adherence: 50, weight: 88.9, sleepHours: 6.0, steps: 3900 },
      { date: '15 ago', adherence: 55, weight: 88.5, sleepHours: 6.1, steps: 4050 },
      { date: '22 ago', adherence: 58, weight: 88.2, sleepHours: 6.2, steps: 4100 },
      { date: '25 ago', adherence: 60, weight: 88.0, sleepHours: 6.3, steps: 4200 },
    ],
    reportCount: '0',
    prescriptionCount: 'Nenhuma',
    cycle: 'Pré-cuidado',
    lastContact: 'Ontem · 11:05',
    nextConsultation: 'Hoje · 11:30',
    isOnlineInWaitingRoom: false,
    quickNotes: [],
    adherence: '0%',
    weightLoss: '0,0 kg',
    currentWeight: 88.0,
    targetWeight: 79.0,
    startWeight: 88.0,
    report: {
      title: 'Sem relatório disponível',
      period: 'Primeira consulta',
      status: 'Aguardando dados',
      summary:
        'Os primeiros relatórios serão criados após a avaliação inicial e a definição do plano.',
      metrics: [
        ['Anamnese', '68%'],
        ['Exames', '2 anexos'],
        ['Check-ins', 'Ainda não'],
      ],
    },
    prescription: {
      title: 'Nenhuma receita emitida',
      status: 'Avaliação inicial',
      detail: 'Prescrições somente poderão ser registradas após avaliação médica.',
      note: 'Nenhuma ação necessária neste momento.',
    },
    insight: {
      title: 'Dados insuficientes para gerar insight',
      detail: 'Concluir anamnese e consulta inicial antes de identificar padrões.',
      basis: 'A IA não deve inferir recomendações sem contexto suficiente.',
    },
    activity: [
      ['Ontem · 11:05', 'Link de anamnese aberto'],
      ['24 ago · 17:20', 'Consulta inicial confirmada'],
      ['24 ago · 17:18', 'Cadastro demonstrativo criado'],
    ],
    nextSteps: ['Concluir anamnese', 'Revisar exames anexados', 'Realizar avaliação inicial'],
  },
  {
    id: 'lucia-barbosa',
    initials: 'LB',
    name: 'Lúcia Barbosa',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=12',
    email: 'lucia.barbosa@email.com',
    phone: '(11) 97234-5678',
    birthDate: '19/08/1965 (61 anos)',
    cpf: '654.***.***-31',
    gender: 'Feminino',
    clinicalSummary:
      'Programa de longevidade ativa, mobilidade articular e prevenção cardiovascular integrada.',
    focus: 'Retorno longevidade · energia e mobilidade',
    progress: '+6% passos',
    attention: 'Estável',
    tone: 'green',
    reportCount: '4',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 74 de 90',
    lastContact: 'Hoje · 09:30',
    nextConsultation: 'Hoje · 09:00 (Concluída)',
    adherence: '91%',
    weightLoss: '−1,2 kg',
    currentWeight: 59.8,
    targetWeight: 58.0,
    startWeight: 61.0,
    preConsultationSymptoms: {
      symptom: 'Mobilidade preservada e disposição satisfatória',
      reportedAt: 'Ontem · 17:40',
      severity: 'leve',
      patientWords:
        'Caminhadas diárias mantidas pela manhã. Pequeno cansaço apenas no fim da tarde em dias de calor.',
      aiSummary:
        'Adesão consistente de 91%, média de 7.280 passos e sono de 7h04. Sem novos relatos agudos.',
    },
    evolutionHistory: [
      { date: '01 ago', adherence: 88, weight: 61.0, sleepHours: 6.9, steps: 6800 },
      { date: '08 ago', adherence: 89, weight: 60.6, sleepHours: 7.0, steps: 6950 },
      { date: '15 ago', adherence: 90, weight: 60.2, sleepHours: 7.0, steps: 7100 },
      { date: '22 ago', adherence: 91, weight: 60.0, sleepHours: 7.1, steps: 7220 },
      { date: '25 ago', adherence: 91, weight: 59.8, sleepHours: 7.1, steps: 7280 },
    ],
    quickNotes: [
      {
        id: 'qn-lb-1',
        patientId: 'lucia-barbosa',
        content:
          'Consulta de retorno concluída às 09:30. Paciente orientada a manter hidratação vespertina.',
        createdAt: 'Hoje · 09:35',
        author: 'Dr. Guilherme Martins',
        category: 'evolucao',
      },
    ],
    report: {
      title: 'Resumo de retorno',
      period: 'Jul–Ago 2026',
      status: 'Concluído',
      summary:
        'Excelente disposição matinal, estabilidade funcional e bom engajamento na rotina preventiva.',
      metrics: [
        ['Adesão', '91%'],
        ['Energia', '4 de 5'],
        ['Passos', '7.280'],
      ],
    },
    prescription: {
      title: 'Sem receita farmacológica ativa',
      status: 'Estável',
      detail: 'Foco exclusivo em suplementação preventiva e estilo de vida.',
      note: 'Revisada na consulta de hoje.',
    },
    insight: {
      title: 'Estabilidade alcançada com caminhadas diárias',
      detail: 'Rotina matinal reduziu queixas de cansaço no meio do dia.',
      basis: 'Baseado em 60 dias de registros contínuos.',
    },
    activity: [
      ['Hoje · 09:30', 'Consulta de retorno concluída'],
      ['Ontem · 17:40', 'Pré-consulta revisada pelo médico'],
      ['22 ago · 08:15', 'Meta de passos atingida'],
    ],
    nextSteps: [
      'Manter caminhadas diárias',
      'Hidratação no período vespertino',
      'Retorno em 60 dias',
    ],
  },
  {
    id: 'carlos-silva',
    initials: 'CS',
    name: 'Carlos Silva',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=71',
    email: 'carlos.silva@email.com',
    phone: '(11) 98765-1122',
    birthDate: '11/04/1980 (46 anos)',
    cpf: '876.***.***-54',
    gender: 'Masculino',
    clinicalSummary:
      'Acompanhamento de metabolismo lipídico, triglicérides e esteatose. Requer incentivo ao diário contínuo.',
    focus: 'Metabolismo e perfil lipídico',
    progress: '−2,4 kg',
    attention: '> 48h sem diário',
    tone: 'amber',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 42 de 90',
    lastContact: '22 ago · 14:10',
    nextConsultation: 'Amanhã · 09:30 (Retorno semestral)',
    adherence: '74%',
    weightLoss: '−2,4 kg',
    currentWeight: 84.6,
    targetWeight: 78.0,
    startWeight: 87.0,
    evolutionHistory: [
      { date: '01 ago', adherence: 80, weight: 87.0, sleepHours: 6.5, steps: 5600 },
      { date: '08 ago', adherence: 78, weight: 86.2, sleepHours: 6.3, steps: 5300 },
      { date: '15 ago', adherence: 76, weight: 85.4, sleepHours: 6.2, steps: 5100 },
      { date: '22 ago', adherence: 74, weight: 84.8, sleepHours: 6.0, steps: 4800 },
      { date: '25 ago', adherence: 74, weight: 84.6, sleepHours: 6.0, steps: 4750 },
    ],
    quickNotes: [
      {
        id: 'qn-cs-1',
        patientId: 'carlos-silva',
        content:
          'Paciente solicitou reagendamento e foi lembrado da importância do envio do diário prévio.',
        createdAt: '22 ago · 14:15',
        author: 'Dr. Guilherme Martins',
        category: 'observacao',
      },
    ],
    report: {
      title: 'Relatório quinzenal',
      period: '01–15 de agosto',
      status: 'Revisado',
      summary: 'Evolução favorável nos níveis lipídicos.',
      metrics: [
        ['Adesão', '74%'],
        ['Perda', '−2,4 kg'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1019',
      status: 'Ativa',
      detail: 'Suplementação antioxidante',
      note: 'Vigente.',
    },
    insight: {
      title: 'Necessidade de retorno ao diário',
      detail: 'Dois check-ins sem registro na última semana.',
      basis: 'Monitoramento semanal.',
    },
    activity: [
      ['22 ago · 14:10', 'Mensagem enviada'],
      ['18 ago · 08:30', 'Check-in concluído'],
    ],
    nextSteps: ['Retomar check-ins diários', 'Revisar exames amanhã'],
  },
  {
    id: 'beatriz-melo',
    initials: 'BM',
    name: 'Beatriz Melo',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=64',
    email: 'beatriz.melo@email.com',
    focus: 'Reeducação e saúde intestinal',
    progress: '−1,1 kg',
    attention: 'Estável',
    tone: 'green',
    reportCount: '1',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 14 de 60',
    lastContact: 'Ontem · 19:15',
    nextConsultation: '26 ago · 11:00',
    adherence: '89%',
    weightLoss: '−1,1 kg',
    currentWeight: 68.9,
    targetWeight: 63.0,
    startWeight: 70.0,
    report: {
      title: 'Relatório inicial',
      period: '10–24 de agosto',
      status: 'Aprovado',
      summary: 'Boa adaptação com aumento no consumo de fibras e saciedade.',
      metrics: [
        ['Adesão', '89%'],
        ['Saciedade', '4,5 de 5'],
      ],
    },
    prescription: {
      title: 'Sem receitas ativas',
      status: 'Estável',
      detail: 'Apenas orientações nutricionais.',
      note: 'Vigente.',
    },
    insight: {
      title: 'Excelente adesão inicial',
      detail: 'Diário preenchido com consistência.',
      basis: '14 dias contínuos.',
    },
    activity: [
      ['Ontem · 19:15', 'Foto do jantar enviada'],
      ['23 ago · 08:00', 'Check-in realizado'],
    ],
    nextSteps: ['Manter hidratação', 'Consulta em 26 ago'],
  },
  {
    id: 'rodrigo-albuquerque',
    initials: 'RA',
    name: 'Rodrigo Albuquerque',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=48',
    email: 'rodrigo.alb@email.com',
    focus: 'Otimização metabólica · Resistência insulínica',
    progress: '−3,2 kg',
    attention: 'Estável',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 52 de 90',
    lastContact: 'Hoje · 07:45',
    nextConsultation: '27 ago · 10:00',
    adherence: '94%',
    weightLoss: '−3,2 kg',
    currentWeight: 82.3,
    targetWeight: 76.0,
    startWeight: 85.5,
    report: {
      title: 'Relatório de Sensibilidade à Insulina',
      period: '01–20 de agosto',
      status: 'Revisado',
      summary: 'Excelente resposta à restrição de ultraprocessados.',
      metrics: [
        ['HOMA-IR', '1.8'],
        ['Adesão', '94%'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1090',
      status: 'Ativa',
      detail: 'Metformina 500mg de liberação lenta',
      note: 'Ajuste posológico noturno.',
    },
    insight: {
      title: 'Curva glicêmica estabilizada',
      detail: 'Menor flutuação glicêmica após caminhadas pós-prandiais.',
      basis: 'Monitoramento contínuo.',
    },
    activity: [['Hoje · 07:45', 'Glicemia de jejum registrada: 92 mg/dL']],
    nextSteps: ['Acompanhar glicemia pós-prandial'],
  },
  {
    id: 'juliana-martins',
    initials: 'JM',
    name: 'Juliana Martins',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=39',
    email: 'juliana.martins@email.com',
    focus: 'Longevidade feminina · Terapia hormonal',
    progress: 'Estável',
    attention: 'Estável',
    tone: 'green',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 38 de 90',
    lastContact: 'Ontem · 14:20',
    nextConsultation: '28 ago · 15:30',
    adherence: '91%',
    weightLoss: '−0,8 kg',
    currentWeight: 61.2,
    targetWeight: 60.0,
    startWeight: 62.0,
    report: {
      title: 'Acompanhamento de Modulação Hormonal',
      period: 'Julho–Agosto',
      status: 'Aprovado',
      summary: 'Alívio completo de fogachos e restauração do sono REM.',
      metrics: [
        ['Sono profundo', '+22%'],
        ['Adesão', '91%'],
      ],
    },
    prescription: {
      title: 'Receita de Reposição Hormonal',
      status: 'Ativa',
      detail: 'Estradiol bioidêntico gel + Progesterona micronizada',
      note: 'Vigente por 6 meses.',
    },
    insight: {
      title: 'Excelente adaptação ao estradiol',
      detail: 'Nenhum efeito adverso relatado no primeiro mês.',
      basis: 'Check-in quinzenal.',
    },
    activity: [['Ontem · 14:20', 'Check-in de bem-estar 5/5']],
    nextSteps: ['Exames laboratoriais em 60 dias'],
  },
  {
    id: 'felipe-vasconcelos',
    initials: 'FV',
    name: 'Felipe Vasconcelos',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=82',
    email: 'felipe.vasc@email.com',
    focus: 'Performance cognitiva · Foco e sono',
    progress: '+15% energia',
    attention: '> 48h sem diário',
    tone: 'amber',
    reportCount: '1',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 21 de 60',
    lastContact: '3 dias atrás',
    nextConsultation: '29 ago · 09:00',
    adherence: '68%',
    weightLoss: '−1,0 kg',
    currentWeight: 75.0,
    targetWeight: 72.0,
    startWeight: 76.0,
    report: {
      title: 'Relatório de Biohacking & Sono',
      period: 'Agosto 2026',
      status: 'Processando',
      summary: 'Uso de luz vermelha e suplementação nootrópica.',
      metrics: [
        ['Adesão', '68%'],
        ['Latência sono', '18 min'],
      ],
    },
    prescription: {
      title: 'Sem prescrição alopática',
      status: 'Estável',
      detail: 'Foco em nootrópicos e fitoterápicos.',
      note: 'Uso matinal.',
    },
    insight: {
      title: 'Oscilação no registro diário',
      detail: 'Paciente esquece check-in em viagens.',
      basis: 'Log de uso.',
    },
    activity: [['3 dias atrás', 'Registro de sono curto']],
    nextSteps: ['Enviar lembrete amigável'],
  },
  {
    id: 'camila-duarte',
    initials: 'CD',
    name: 'Camila Duarte',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=91',
    email: 'camila.duarte@email.com',
    focus: 'Emagrecimento pós-parto · Composição corporal',
    progress: '−4,1 kg',
    attention: 'Estável',
    tone: 'green',
    reportCount: '4',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 70 de 90',
    lastContact: 'Hoje · 08:30',
    nextConsultation: '30 ago · 11:30',
    adherence: '96%',
    weightLoss: '−4,1 kg',
    currentWeight: 66.4,
    targetWeight: 62.0,
    startWeight: 70.5,
    report: {
      title: 'Evolução Ponderal e Muscular',
      period: 'Junho–Agosto',
      status: 'Revisado',
      summary: 'Perda de gordura com manutenção total de massa magra.',
      metrics: [
        ['Massa Magra', '44.8 kg'],
        ['Gordura', '−4,1 kg'],
      ],
    },
    prescription: {
      title: 'Nenhuma receita ativa',
      status: 'Estável',
      detail: 'Plano nutricional hiperproteico.',
      note: 'Vigente.',
    },
    insight: {
      title: 'Constância exemplar',
      detail: 'Maior taxa de engajamento da coorte.',
      basis: '70 dias ininterruptos.',
    },
    activity: [['Hoje · 08:30', 'Foto da pesagem semanal']],
    nextSteps: ['Transição para fase de consolidação'],
  },
  {
    id: 'marcelo-tavares',
    initials: 'MT',
    name: 'Marcelo Tavares',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=23',
    email: 'marcelo.tavares@email.com',
    focus: 'Cardioproteção · Lipoproteínas e inflamação',
    progress: '−15% ApoB',
    attention: '> 48h sem diário',
    tone: 'amber',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 45 de 90',
    lastContact: '4 dias atrás',
    nextConsultation: '01 set · 14:00',
    adherence: '70%',
    weightLoss: '−1,5 kg',
    currentWeight: 89.0,
    targetWeight: 82.0,
    startWeight: 90.5,
    report: {
      title: 'Painel Lipídico Avançado',
      period: 'Julho–Agosto',
      status: 'Revisado',
      summary: 'Queda expressiva de ApoB e PCR ultrassensível.',
      metrics: [
        ['ApoB', '78 mg/dL'],
        ['PCR-us', '0.6 mg/L'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1077',
      status: 'Ativa',
      detail: 'Rosuvastatina 5mg + Ezetimiba 10mg',
      note: 'Uso contínuo.',
    },
    insight: {
      title: 'Excelente redução aterogênica',
      detail: 'Estratégia combinada reduziu ApoB abaixo de 80.',
      basis: 'Exames laboratoriais.',
    },
    activity: [['4 dias atrás', 'Check-in de adesão à medicação']],
    nextSteps: ['Retomar check-ins de rotina'],
  },
  {
    id: 'gabriela-souza',
    initials: 'GS',
    name: 'Gabriela Souza',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=57',
    email: 'gabriela.souza@email.com',
    focus: 'Saúde tireoidiana e disposição matinal',
    progress: 'TSH otimizado',
    attention: 'Estável',
    tone: 'green',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 35 de 90',
    lastContact: 'Ontem · 11:10',
    nextConsultation: '02 set · 16:00',
    adherence: '92%',
    weightLoss: '−1,2 kg',
    currentWeight: 58.4,
    targetWeight: 56.0,
    startWeight: 59.6,
    report: {
      title: 'Controle Tireoidiano & Energia',
      period: 'Julho–Agosto',
      status: 'Aprovado',
      summary: 'TSH em 1.4 mUI/L com T3 livre no terço superior da faixa.',
      metrics: [
        ['TSH', '1.4'],
        ['T3 livre', '3.6'],
      ],
    },
    prescription: {
      title: 'Receita de Levotiroxina',
      status: 'Ativa',
      detail: 'Levotiroxina 50mcg em jejum estrito',
      note: 'Vigente.',
    },
    insight: {
      title: 'Absorção plena em jejum',
      detail: 'Intervalo de 45 min para o café mantido rigorosamente.',
      basis: 'Diário matinal.',
    },
    activity: [['Ontem · 11:10', 'Dose tomada pontualmente']],
    nextSteps: ['Manter dosagem atual'],
  },
  {
    id: 'lucas-ferreira',
    initials: 'LF',
    name: 'Lucas Ferreira',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=67',
    email: 'lucas.ferreira@email.com',
    focus: 'Hipertrofia e longevidade muscular',
    progress: '+2,1 kg massa magra',
    attention: 'Estável',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 60 de 90',
    lastContact: 'Hoje · 06:50',
    nextConsultation: '03 set · 10:30',
    adherence: '95%',
    weightLoss: '+1,8 kg',
    currentWeight: 81.2,
    targetWeight: 83.0,
    startWeight: 79.4,
    report: {
      title: 'Balanço Nitrogenado e Força',
      period: 'Agosto 2026',
      status: 'Revisado',
      summary: 'Ganhos consistentes de carga no agachamento e supino.',
      metrics: [
        ['Creatina diária', '5g'],
        ['Adesão', '95%'],
      ],
    },
    prescription: {
      title: 'Plano Suplementar de Performance',
      status: 'Ativa',
      detail: 'Creatina monohidratada + Whey isolado + Ômega 3 IFOS',
      note: 'Suplementação nutricional.',
    },
    insight: {
      title: 'Boa resposta à creatina',
      detail: 'Hidratação de 3.5L diários mantida.',
      basis: 'Log de hidratação.',
    },
    activity: [['Hoje · 06:50', 'Treino matinal registrado']],
    nextSteps: ['Periodização do próximo mesociclo'],
  },
  {
    id: 'patricia-araujo',
    initials: 'PA',
    name: 'Patrícia Araújo',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=73',
    email: 'patricia.araujo@email.com',
    focus: 'Controle de esteatose hepática grau II',
    progress: '−5,4 kg',
    attention: 'Estável',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 77 de 90',
    lastContact: 'Ontem · 20:00',
    nextConsultation: '04 set · 14:30',
    adherence: '93%',
    weightLoss: '−5,4 kg',
    currentWeight: 76.2,
    targetWeight: 70.0,
    startWeight: 81.6,
    report: {
      title: 'Marcadores Hepáticos & TGO/TGP',
      period: 'Junho–Agosto',
      status: 'Revisado',
      summary: 'Normalização completa das transaminases e GGT.',
      metrics: [
        ['TGP', '24 U/L (−38 U/L)'],
        ['GGT', '19 U/L'],
      ],
    },
    prescription: {
      title: 'Receita Digital Antioxidante',
      status: 'Ativa',
      detail: 'Vitamina E 400UI + Silimarina 200mg',
      note: 'Protetores hepáticos.',
    },
    insight: {
      title: 'Regressão de gordura hepática',
      detail: 'Redução de frutose líquida foi o fator chave.',
      basis: 'Histórico alimentar.',
    },
    activity: [['Ontem · 20:00', 'Foto do jantar sem carboidratos refinados']],
    nextSteps: ['Ultrassom de abdome no 90º dia'],
  },
  {
    id: 'thiago-carvalho',
    initials: 'TC',
    name: 'Thiago Carvalho',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=89',
    email: 'thiago.carvalho@email.com',
    focus: 'Qualidade do sono profundo e recuperação HRV',
    progress: 'HRV +20ms',
    attention: '> 48h sem diário',
    tone: 'amber',
    reportCount: '1',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 25 de 60',
    lastContact: '2 dias atrás',
    nextConsultation: '05 set · 09:30',
    adherence: '72%',
    weightLoss: '−0,5 kg',
    currentWeight: 77.8,
    targetWeight: 75.0,
    startWeight: 78.3,
    report: {
      title: 'Mapeamento de Ritmo Circadiano',
      period: 'Agosto 2026',
      status: 'Processando',
      summary: 'Melhora de HRV noturno com magnésio treonato.',
      metrics: [
        ['HRV médio', '64 ms'],
        ['Adesão', '72%'],
      ],
    },
    prescription: {
      title: 'Composto Calmante Noturno',
      status: 'Ativa',
      detail: 'Magnésio Treonato 250mg + Apigenina 50mg',
      note: 'Tomar 1h antes de deitar.',
    },
    insight: {
      title: 'Impacto da cafeína tardia',
      detail: 'HRV cai 15% nos dias com café após 15h.',
      basis: 'Cruzamento de dados.',
    },
    activity: [['2 dias atrás', 'Registro de sono']],
    nextSteps: ['Cortar cafeína após 14h'],
  },
  {
    id: 'renata-bastos',
    initials: 'RB',
    name: 'Renata Bastos',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=45',
    email: 'renata.bastos@email.com',
    focus: 'Saúde articular e anti-inflamação sistêmica',
    progress: 'Sem dor articular',
    attention: 'Estável',
    tone: 'green',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 40 de 90',
    lastContact: 'Hoje · 09:00',
    nextConsultation: '08 set · 11:00',
    adherence: '90%',
    weightLoss: '−2,0 kg',
    currentWeight: 63.5,
    targetWeight: 60.0,
    startWeight: 65.5,
    report: {
      title: 'Escore de Rigidez Matinal',
      period: 'Julho–Agosto',
      status: 'Aprovado',
      summary: 'Redução de dor no joelho e melhora na mobilidade de quadril.',
      metrics: [
        ['Escore EVA', '1/10 (−6)'],
        ['Adesão', '90%'],
      ],
    },
    prescription: {
      title: 'Receita Digital Condroprotetora',
      status: 'Ativa',
      detail: 'Colágeno tipo II não desnaturado (UC-II) 40mg + Curcumina',
      note: 'Uso contínuo.',
    },
    insight: {
      title: 'Melhora funcional em esteira',
      detail: 'Paciente voltou a caminhar 30 min sem incômodo.',
      basis: 'Relato semanal.',
    },
    activity: [['Hoje · 09:00', 'Check-in: dor zero no treino']],
    nextSteps: ['Incluir fortalecimento de quadríceps'],
  },
  {
    id: 'eduardo-pinheiro',
    initials: 'EP',
    name: 'Eduardo Pinheiro',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=31',
    email: 'eduardo.pinheiro@email.com',
    focus: 'Pressão arterial e rigidez vascular (PWV)',
    progress: 'PA 122/78 mmHg',
    attention: 'Estável',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 65 de 90',
    lastContact: 'Ontem · 17:30',
    nextConsultation: '09 set · 15:00',
    adherence: '96%',
    weightLoss: '−3,8 kg',
    currentWeight: 83.1,
    targetWeight: 79.0,
    startWeight: 86.9,
    report: {
      title: 'MAPA 24h Demonstrativo',
      period: 'Julho–Agosto',
      status: 'Revisado',
      summary: 'Excelente controle da pressão arterial com descenso noturno preservado.',
      metrics: [
        ['PA Média', '122/78'],
        ['Sódio urinário', 'Controlado'],
      ],
    },
    prescription: {
      title: 'Receita Anti-hipertensiva',
      status: 'Ativa',
      detail: 'Telmisartana 40mg matinal',
      note: 'Uso contínuo.',
    },
    insight: {
      title: 'Potássio dietético adequado',
      detail: 'Consumo de vegetais escuros favoreceu controle pressórico.',
      basis: 'Diário nutricional.',
    },
    activity: [['Ontem · 17:30', 'Aferição de PA: 121/76 mmHg']],
    nextSteps: ['Manter monitoramento semanal'],
  },
  {
    id: 'larissa-nunes',
    initials: 'LN',
    name: 'Larissa Nunes',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=29',
    email: 'larissa.nunes@email.com',
    focus: 'Controle de compulsão alimentar e saciedade',
    progress: '0 episódios no ciclo',
    attention: 'Estável',
    tone: 'green',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 30 de 60',
    lastContact: 'Hoje · 08:15',
    nextConsultation: '10 set · 10:00',
    adherence: '89%',
    weightLoss: '−2,2 kg',
    currentWeight: 71.3,
    targetWeight: 66.0,
    startWeight: 73.5,
    report: {
      title: 'Escala de Compulsão e Ansiedade',
      period: 'Agosto 2026',
      status: 'Aprovado',
      summary: 'Estabilidade emocional e ausência de episódios noturnos.',
      metrics: [
        ['Escore BES', '8 (Normal)'],
        ['Adesão', '89%'],
      ],
    },
    prescription: {
      title: 'Modulador de Humor e Apetite',
      status: 'Ativa',
      detail: '5-HTP 100mg + L-Teanina 200mg',
      note: 'Tomar às 17h.',
    },
    insight: {
      title: 'Gatilho do fim de tarde controlado',
      detail: 'Lanche proteico às 16h preveniu fome descompensada.',
      basis: 'Diário alimentar.',
    },
    activity: [['Hoje · 08:15', 'Check-in de humor matinal']],
    nextSteps: ['Consolidar hábito vespertino'],
  },
  {
    id: 'bruno-castro',
    initials: 'BC',
    name: 'Bruno Castro',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=94',
    email: 'bruno.castro@email.com',
    focus: 'Ácido úrico e prevenção de gota',
    progress: 'Ácido úrico 5.2 mg/dL',
    attention: 'Estável',
    tone: 'green',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 48 de 90',
    lastContact: 'Ontem · 12:40',
    nextConsultation: '11 set · 14:00',
    adherence: '92%',
    weightLoss: '−2,7 kg',
    currentWeight: 86.4,
    targetWeight: 80.0,
    startWeight: 89.1,
    report: {
      title: 'Painel Metabólico e Renal',
      period: 'Julho–Agosto',
      status: 'Revisado',
      summary: 'Queda de ácido úrico de 8.4 para 5.2 mg/dL.',
      metrics: [
        ['Ácido Úrico', '5.2 mg/dL'],
        ['eGFR', '98 mL/min'],
      ],
    },
    prescription: {
      title: 'Receita Digital #RX-1049',
      status: 'Ativa',
      detail: 'Alopurinol 100mg',
      note: 'Uso contínuo.',
    },
    insight: {
      title: 'Zero crises no período',
      detail: 'Cessação de álcool e frutos do mar nos fins de semana.',
      basis: 'Log de hábitos.',
    },
    activity: [['Ontem · 12:40', 'Hidratação de 3L concluída']],
    nextSteps: ['Exame de controle em 45 dias'],
  },
  {
    id: 'vanessa-moraes',
    initials: 'VM',
    name: 'Vanessa Moraes',
    avatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=84',
    email: 'vanessa.moraes@email.com',
    focus: 'Saúde mitocondrial e fadiga crônica',
    progress: '+30% disposição',
    attention: 'Estável',
    tone: 'green',
    reportCount: '3',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 55 de 90',
    lastContact: 'Hoje · 07:15',
    nextConsultation: '12 set · 09:00',
    adherence: '94%',
    weightLoss: '−1,4 kg',
    currentWeight: 57.2,
    targetWeight: 55.0,
    startWeight: 58.6,
    report: {
      title: 'Escore de Fadiga e Energia Mitocondrial',
      period: 'Julho–Agosto',
      status: 'Aprovado',
      summary: 'Recuperação notável de vitalidade matinal e vespertina.',
      metrics: [
        ['Energia', '4.8/5'],
        ['CoQ10 sérica', 'Adequada'],
      ],
    },
    prescription: {
      title: 'Complexo Mitocondrial Avançado',
      status: 'Ativa',
      detail: 'Ubiquinol 100mg + PQQ 10mg + Ácido Alfa Lipóico 200mg',
      note: 'Tomar pela manhã com gordura saudável.',
    },
    insight: {
      title: 'Excelente resposta ao Ubiquinol',
      detail: 'Fadiga pós-almoço completamente eliminada.',
      basis: 'Diário diário.',
    },
    activity: [['Hoje · 07:15', 'Check-in de energia: 5/5']],
    nextSteps: ['Manter suporte mitocondrial'],
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-lucia',
    patientId: 'lucia-barbosa',
    date: 'Hoje, 25 de Agosto de 2026',
    time: '09:00',
    patient: 'Lúcia Barbosa',
    patientAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=12',
    initials: 'LB',
    type: 'Retorno longevidade · 30 min',
    modality: 'Teleconsulta (Google Meet)',
    status: 'Concluída',
    statusTone: 'gray',
    preVisit: 'Pré-consulta revisada',
    preVisitTone: 'green',
    objective: '“Manutenção da disposição ao longo do dia e consolidação da rotina de exercícios.”',
    reported:
      'Disposição preservada pela manhã, leve declínio de energia às 16h; sem intercorrências agudas.',
    aiFocus: 'Contextualização de rotina de esforço e repouso, sem inferência de conduta.',
    metrics: [
      ['Disposição matinal', '4 de 5', 'Estável'],
      ['Passos diários', '7.280', '+6%'],
      ['Sono médio', '7h04', 'Regular'],
    ],
    attentionTitle: 'Sem intercorrências registradas',
    attentionDetail: 'Variações registradas para contextualização médica no prontuário.',
    checklist: [
      'Avaliar disposição vespertina',
      'Revisar percepção de esforço',
      'Definir acompanhamento pós-consulta',
    ],
  },
  {
    id: 'apt-marina',
    patientId: 'marina-costa',
    date: 'Hoje, 25 de Agosto de 2026',
    time: '10:30',
    patient: 'Marina Costa',
    patientAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=88',
    initials: 'MC',
    type: 'Retorno longevidade · 30 min',
    modality: 'Teleconsulta (Google Meet)',
    status: 'Próxima',
    statusTone: 'green',
    preVisit: 'Pré-consulta estruturada · Resumo pronto',
    preVisitTone: 'green',
    objective:
      '“Manter a perda ponderal gradual com preservação de energia e recuperação do sono.”',
    reported:
      'Adesão estável ao plano alimentar, melhora de saciedade noturna e queixa de despertares por volta das 3h.',
    aiFocus: 'Estruturação de dados de sono e intervalo de refeições para análise médica.',
    metrics: [
      ['Peso atual', '78,2 kg', '−1,8 kg'],
      ['Adesão ao plano', '82%', '+6 p.p.'],
      ['Sono médio', '5h42', 'Abaixo do padrão'],
    ],
    attentionTitle: 'Padrão de repouso para avaliação médica',
    attentionDetail:
      'Média de 5h42 de descanso em quatro noites consecutivas compilada para contextualização.',
    checklist: [
      'Avaliar crononutrição',
      'Confirmar tolerância digestiva',
      'Ativar plano de check-ins de retorno',
    ],
  },
  {
    id: 'apt-rafael',
    patientId: 'rafael-lima',
    date: 'Hoje, 25 de Agosto de 2026',
    time: '11:30',
    patient: 'Rafael Lima',
    patientAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=54',
    initials: 'RL',
    type: 'Primeira consulta · 50 min',
    modality: 'Teleconsulta (Google Meet)',
    status: 'Confirmada',
    statusTone: 'green',
    preVisit: 'Anamnese 68% concluída',
    preVisitTone: 'amber',
    objective: '“Quero entender por que estou cansado e começar uma rotina que eu consiga manter.”',
    reported: 'Cansaço ao fim do dia, rotina irregular e dois exames anexados para revisão.',
    aiFocus: 'Completar lacunas da anamnese e organizar perguntas para a avaliação inicial.',
    metrics: [
      ['Anamnese', '68%', '3 lacunas'],
      ['Exames', '2', 'anexados'],
      ['Sono', '6h18', 'relatado'],
    ],
    attentionTitle: 'Anamnese ainda incompleta',
    attentionDetail:
      'Faltam histórico familiar, uso atual de suplementos e contexto do cansaço relatado.',
    checklist: ['Completar histórico', 'Revisar exames anexados', 'Definir objetivo inicial'],
  },
  {
    id: 'apt-ana',
    patientId: 'ana-ribeiro',
    date: 'Hoje, 25 de Agosto de 2026',
    time: '14:00',
    patient: 'Ana Ribeiro',
    patientAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=42',
    initials: 'AR',
    type: 'Retorno força · 30 min',
    modality: 'Teleconsulta (Google Meet)',
    status: 'Confirmada',
    statusTone: 'green',
    preVisit: 'Voz concluída · relatório pronto',
    preVisitTone: 'blue',
    objective: '“Quero continuar ganhando força sem perder energia para o restante da semana.”',
    reported: 'Treinos pela manhã facilitaram a rotina e a energia permaneceu estável.',
    aiFocus: 'Validar progressão de força e revisar o relatório mensal antes de qualquer ajuste.',
    metrics: [
      ['Adesão', '88%', '+8 p.p.'],
      ['Força', '+12%', '4 semanas'],
      ['Passos', '7.140', 'estável'],
    ],
    attentionTitle: 'Relatório mensal aguarda aprovação',
    attentionDetail:
      'A síntese foi organizada pela IA e ainda requer interpretação e aprovação médica.',
    checklist: ['Aprovar relatório', 'Revisar progressão de força', 'Confirmar energia semanal'],
  },
  {
    id: 'apt-paulo',
    patientId: 'paulo-mendes',
    date: 'Hoje, 25 de Agosto de 2026',
    time: '16:30',
    patient: 'Paulo Mendes',
    patientAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=33',
    initials: 'PM',
    type: 'Acompanhamento · 25 min',
    modality: 'Teleconsulta (Google Meet)',
    status: 'A confirmar',
    statusTone: 'amber',
    preVisit: 'Novo sintoma no check-in',
    preVisitTone: 'rose',
    objective: '“Quero ajustar minha rotina sem continuar sentindo enjoo.”',
    reported: 'Enjoo após atualização do plano e redução dos registros desde ontem.',
    aiFocus: 'Levar o novo relato ao médico antes de manter ou alterar qualquer orientação.',
    metrics: [
      ['Sintoma', 'Enjoo', 'novo relato'],
      ['Adesão', '72%', '−8 p.p.'],
      ['Check-ins', '5 de 7', '2 ausentes'],
    ],
    attentionTitle: 'Novo sintoma requer avaliação médica',
    attentionDetail:
      'O app apenas destacou o relato. Nenhum diagnóstico ou ajuste de conduta foi realizado.',
    checklist: [
      'Ouvir relato do enjoo',
      'Revisar receita vigente',
      'Decidir continuidade do plano',
    ],
  },
]

export const initialScheduledCheckins: ScheduledCheckin[] = [
  {
    id: 'chk-1',
    patientId: 'marina-costa',
    title: 'Check-in de Peso e Saciedade Matinal',
    type: 'peso',
    scheduledDate: 'Hoje · 08:00',
    dayOffset: 1,
    status: 'concluido',
    completedAt: 'Hoje · 08:14',
    value: '78,2 kg',
    notes: 'Registrado em jejum, sem queixas digestivas.',
  },
  {
    id: 'chk-2',
    patientId: 'marina-costa',
    title: 'Registro de Saciedade e Conforto no Jantar',
    type: 'diario',
    scheduledDate: 'Hoje · 20:30',
    dayOffset: 1,
    status: 'pendente',
    notes: 'Foto com notas de saciedade (1 a 5).',
  },
  {
    id: 'chk-3',
    patientId: 'marina-costa',
    title: 'Check-in de Humor, Energia e Despertares',
    type: 'humor',
    scheduledDate: 'Amanhã · 08:30',
    dayOffset: 2,
    status: 'pendente',
    notes: 'Avaliação da percepção de descanso e fadiga vespertina.',
  },
  {
    id: 'chk-4',
    patientId: 'marina-costa',
    title: 'Aferição de Peso e Balanço Hídrico',
    type: 'peso',
    scheduledDate: '28 de agosto · 08:00',
    dayOffset: 4,
    status: 'pendente',
  },
  {
    id: 'chk-5',
    patientId: 'marina-costa',
    title: 'Revisão Semanal de Adesão e Higiene do Sono',
    type: 'adesao',
    scheduledDate: '01 de setembro · 19:00',
    dayOffset: 7,
    status: 'pendente',
  },
  {
    id: 'chk-6',
    patientId: 'marina-costa',
    title: 'Síntese Quinzenal de Evolução Pós-Consulta',
    type: 'adesao',
    scheduledDate: '08 de setembro · 10:00',
    dayOffset: 14,
    status: 'pendente',
  },
]

export const initialReturnJourney: ReturnJourneyPlan = {
  id: 'journey-marina-retorno',
  patientId: 'marina-costa',
  title: 'Plano Pós-Consulta de Retorno e Adaptação do Sono',
  status: 'ativo',
  activatedAt: '25 ago 2026 · Aprovado em consulta',
  approvedBy: 'Dr. Guilherme Martins',
  nextReviewDate: '08 de setembro de 2026 (14 dias)',
  summary:
    'Foco no reajuste crononutricional do jantar para as 19h30 e monitoramento longitudinal de sono e saciedade.',
  checkins: initialScheduledCheckins,
}

export const initialCarePlans: CarePlanItem[] = [
  {
    id: 'plan-1',
    action: 'Ingerir 500 ml de água antes do almoço e do jantar',
    category: 'Hidratação & Saciedade',
    type: 'medical',
    completed: true,
    isPrimaryToday: false,
    period: 'manha',
    timingStatus: 'concluido',
    frequency: 'Diário (antes das principais refeições)',
    lastCompletedAt: 'Hoje · 12:10',
    doctorRationale:
      'Melhora a percepção de saciedade gástrica e otimiza a absorção de nutrientes.',
  },
  {
    id: 'plan-2',
    action: 'Antecipar o horário do jantar para as 19h30',
    category: 'Crononutrição & Ritmo Circadiano',
    type: 'medical',
    completed: false,
    isPrimaryToday: true,
    period: 'noite',
    timingStatus: 'pendente_hoje',
    frequency: 'Diário (até 19h30)',
    doctorRationale:
      'Garante intervalo digestivo de 2h30 a 3h antes de deitar para evitar os despertares noturnos das 3h.',
  },
  {
    id: 'plan-3',
    action: 'Registrar foto do jantar no Diário com notas de saciedade',
    category: 'Diário & Acompanhamento',
    type: 'medical',
    completed: false,
    isPrimaryToday: false,
    period: 'noite',
    timingStatus: 'pendente_hoje',
    frequency: 'Diário (após o jantar)',
    doctorRationale:
      'Permite ao Dr. Guilherme acompanhar o impacto da saciedade na qualidade do sono sem contagem de calorias.',
  },
  {
    id: 'plan-4',
    action: 'Rotina de desaceleração sem telas a partir das 22h',
    category: 'Higiene do Sono',
    type: 'medical',
    completed: false,
    isPrimaryToday: false,
    period: 'noite',
    timingStatus: 'pendente_hoje',
    frequency: 'Diário (22h00)',
    doctorRationale:
      'Estimula a liberação natural de melatonina para reduzir a latência do sono profundo.',
  },
  {
    id: 'plan-5',
    action: 'Ajuste de lanche vespertino proteico às 16h30',
    category: 'Estabilidade de Energia',
    type: 'medical',
    completed: false,
    isPrimaryToday: false,
    period: 'tarde',
    timingStatus: 'atrasado',
    frequency: 'Dias úteis (16h30)',
    doctorRationale:
      'Evita picos de fome ao chegar em casa e estabiliza a glicemia no final da tarde.',
  },
  {
    id: 'plan-6',
    action: 'Caminhada leve de 15 minutos em luz natural pela manhã',
    category: 'Ritmo Circadiano & Movimento',
    type: 'ai_suggestion',
    completed: false,
    isPrimaryToday: false,
    period: 'manha',
    timingStatus: 'pendente_hoje',
    frequency: 'Sugestão do Copiloto (aguarda validação médica)',
    notes: 'Rascunho organizado pelo Copiloto para avaliação do Dr. Guilherme.',
    aiDraftNote:
      'Baseado no seu relato de sono fragmentado, a exposição à luz solar matinal auxilia na sincronização do ritmo circadiano.',
  },
  {
    id: 'plan-7',
    action: 'Infusão morna de camomila ou erva-doce às 21h30',
    category: 'Sono & Relaxamento',
    type: 'ai_suggestion',
    completed: false,
    isPrimaryToday: false,
    period: 'noite',
    timingStatus: 'pendente_hoje',
    frequency: 'Sugestão do Copiloto (aguarda validação médica)',
    notes: 'Rascunho gerado pelo Copiloto para discussão em consulta.',
    aiDraftNote: 'Auxilia no relaxamento pré-sono. Sujeito à concordância do médico responsável.',
  },
]

export const initialMeals: MealRecord[] = [
  {
    id: 'meal-1',
    meal: 'Jantar',
    time: 'Hoje, 19:42',
    image: 'https://img.usecurling.com/p/600/600?q=salad%20omelette&color=green',
    alt: 'Prato demonstrativo com omelete de legumes, brócolis e salada fresca.',
    status: 'Registrada',
    tone: 'green',
    recognized: 'Omelete de vegetais, brócolis no vapor, folhas verdes e azeite.',
    analysis:
      'Boa densidade de micronutrientes e aporte proteico visual. A IA não estima precisão calórica sem validação de ingredientes e porções.',
    confidence: 'Alta confiança no reconhecimento de grupos',
    ratings: [4, 4, 5],
    feedbackSent: true,
  },
  {
    id: 'meal-2',
    meal: 'Almoço',
    time: 'Ontem, 12:34',
    image: 'https://img.usecurling.com/p/600/600?q=grilled%20chicken%20salad&color=amber',
    alt: 'Prato com frango grelhado, arroz integral, feijão e salada colorida.',
    status: 'Confirmada pela paciente',
    tone: 'green',
    recognized: 'Frango grelhado, arroz integral, feijão, folhas e legumes cozidos.',
    analysis: 'Prato equilibrado alinhado às diretrizes do Instituto Vivans.',
    confidence: 'Alta confiança nos itens visíveis',
    ratings: [5, 5, 4],
    feedbackSent: true,
  },
  {
    id: 'meal-3',
    meal: 'Café da manhã',
    time: '24 ago, 07:52',
    image: 'https://img.usecurling.com/p/600/600?q=yogurt%20berries%20oats&color=red',
    alt: 'Tigela com iogurte natural, mamão, aveia e sementes.',
    status: 'Registrada',
    tone: 'blue',
    recognized: 'Iogurte natural, mamão picado, aveia em flocos e sementes de chia.',
    analysis: 'Composição rica em fibras e probióticos.',
    confidence: 'Confiança moderada nas quantidades',
    ratings: [4, 4, 5],
    feedbackSent: true,
  },
]

export const initialMessages: MessageItem[] = [
  {
    id: 'msg-team-summary',
    sender: 'team_summary',
    author: 'Equipe Instituto Vivans',
    authorAvatarUrl: 'https://img.usecurling.com/i?q=hospital&color=0b7b68',
    time: 'Hoje · 08:00',
    content:
      'Olá, Marina! Preparamos o seu resumo semanal de adesão com muito carinho. Você concluiu 4 de 5 ações desta semana, mantendo uma excelente consistência de 82% (+6% vs. início). Nesta semana, que tal focar no lanche vespertino e na caminhada leve matinal? Seguimos juntos!',
    status: 'enviada',
    weeklySummary: {
      completedActions: 4,
      totalActions: 5,
      adherencePct: 82,
      trendPct: 6,
      nextFriendlyStep:
        'Nesta semana, que tal focar no ajuste do lanche vespertino às 16h30 e na caminhada leve matinal?',
      periodLabel: 'Semana 4 · 18 a 25 de Agosto',
      aiDraftNote: 'Rascunho de métricas estruturado com IA e revisado pela equipe médica.',
    },
  },
  {
    id: 'msg-1',
    sender: 'doctor',
    author: 'Dr. Guilherme Martins',
    authorAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=male&seed=15',
    time: 'Hoje · 08:30',
    content:
      'Bom dia, Marina. Recebi as informações da sua pré-consulta. Vamos dedicar atenção especial à qualidade do sono e ao horário das refeições na nossa consulta de hoje.',
    status: 'enviada',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    author: 'Marina Costa',
    authorAvatarUrl: 'https://img.usecurling.com/ppl/512?gender=female&seed=88',
    time: 'Hoje · 08:45',
    content:
      'Perfeito, Dr. Guilherme. Registrei também a percepção de saciedade após a alteração do jantar.',
    status: 'enviada',
  },
  {
    id: 'msg-3',
    sender: 'ai_draft',
    author: 'Copiloto Clínico (Rascunho para validação)',
    time: 'Hoje · 09:19',
    content:
      'Marina, seu plano de acompanhamento pós-consulta está ativo na aba Plano, com os check-ins programados para os próximos 14 dias. Mantenha os registros de saciedade e o repouso conforme alinhado.',
    isAiDraft: true,
    status: 'aguardando_aprovacao',
  },
]

export const initialReports: ClinicalReport[] = [
  {
    id: 'rep-ana-monthly',
    patientName: 'Ana Ribeiro',
    title: 'Relatório Mensal de Funcionalidade e Longevidade',
    period: '25 jul – 25 ago 2026',
    status: 'em_revisao',
    summary:
      'Evolução favorável com incremento de 12% nos registros de força funcional, estabilidade de peso e adesão global de 88% no período.',
    metrics: [
      ['Adesão global', '88%'],
      ['Força funcional', '+12%'],
      ['Média de passos', '7.140/dia'],
    ],
  },
  {
    id: 'rep-marina-biweekly',
    patientName: 'Marina Costa',
    title: 'Relatório Clínico de Evolução Quinzenal',
    period: '11 – 25 de agosto 2026',
    status: 'em_revisao',
    summary:
      'Redução ponderal de 1,8 kg com boa tolerância geral e 82% de adesão ao plano de cuidado. Registrada redução no tempo total de sono (média de 5h42 em 4 noites consecutivas) aguardando correlação clínica com crononutrição.',
    metrics: [
      ['Variação de peso', '−1,8 kg'],
      ['Adesão ao plano', '82%'],
      ['Sono médio', '5h42'],
    ],
  },
  {
    id: 'rep-marina-first',
    patientName: 'Marina Costa',
    title: 'Síntese Clínica da Primeira Consulta',
    period: '12 de agosto 2026',
    status: 'aprovado',
    approvedBy: 'Dr. Guilherme Martins',
    approvedAt: '12 ago 2026 11:30',
    summary:
      'Definição de acompanhamento longitudinal com metas graduais de estilo de vida, saciedade noturna e rastreio de biossinais.',
    metrics: [
      ['Peso inicial', '80,0 kg'],
      ['Meta inicial', '72,0 kg'],
      ['Adesão inicial', '100%'],
    ],
  },
  {
    id: 'rep-paulo-weekly',
    patientName: 'Paulo Mendes',
    title: 'Relatório Semanal de Adaptação Clínica',
    period: '18 – 25 de agosto 2026',
    status: 'rascunho',
    summary:
      'Adesão de 72% no período. Registro de queixa de enjoo leve matinal compilado para avaliação médica na consulta.',
    metrics: [
      ['Adesão média', '72%'],
      ['Variação ponderal', '−0,6 kg'],
      ['Check-ins realizados', '5 de 7'],
    ],
  },
]

export const initialPreConsultation: PreConsultationData = {
  completed: true,
  consentGiven: true,
  mode: 'voice',
  objective:
    'Manter a redução ponderal gradual com preservação de disposição e regularização do sono.',
  energyRating: 3,
  sleepRating: 2,
  digestiveStatus: 'Tolerância digestiva preservada, sem queixas gástricas agudas relatadas.',
  questionsForDoctor:
    'Avaliar se o horário do jantar habitual (20h30) pode ter correlação com os despertares noturnos.',
  audioDurationSeconds: 184,
  transcript: `Marina: "Bom dia, Dr. Guilherme. Ao longo dos últimos 14 dias mantive a hidratação e a composição do jantar conforme combinado. Observei melhora evidente na saciedade noturna e redução de 1,8 kg na pesagem. Contudo, nos últimos quatro dias passei a acordar por volta das 3h da manhã, demorando a retomar o sono e registrando cerca de 5h40 de descanso por noite. Gostaria de avaliar se o intervalo entre o jantar e o repouso precisa de adequação."`,
  aiSynthesis: `• Relato principal: Continuidade do plano com redução ponderal de 1,8 kg e saciedade referida adequada.\n• Ponto de atenção: Despertares noturnos (média de 5h42 de sono em 4 noites consecutivas).\n• Sintomas associados: Sem relato de pirose, refluxo ou desconforto epigástrico.\n• Tópicos para avaliação médica: Intervalo entre refeição noturna e repouso, rotina de desaceleração e exposição à luz.`,
  suggestedQuestions: [
    'Qual tem sido o intervalo médio entre o término do jantar e o repouso?',
    'Houve consumo de bebidas estimulantes ou cafeína no período vespertino?',
    'Como tem sido a exposição à luz natural pela manhã e a rotina de desaceleração?',
  ],
  submittedAt: 'Hoje · 09:18',
}

export const medicalEvidences: MedicalEvidence[] = [
  {
    id: 'ev-1',
    title: 'Time-Restricted Eating and Sleep Architecture in Overweight Adults',
    source: 'PubMed',
    year: '2025',
    evidenceType: 'Ensaio Clínico Randomizado (RCT)',
    confidence: 'Alta',
    url: 'https://pubmed.ncbi.nlm.nih.gov/example-vivans-1',
    summary:
      'Evidência indicando que o encerramento do consumo calórico cerca de 3 horas antes do repouso noturno associa-se a menor fragmentação do sono em adultos em acompanhamento ponderal.',
    relevance:
      'Contextualização demonstrativa para avaliação do intervalo entre jantar e repouso de Marina Costa.',
  },
  {
    id: 'ev-2',
    title: 'Protein Intake Timing and Satiety Signaling During Caloric Deficit',
    source: 'Cochrane',
    year: '2024',
    evidenceType: 'Revisão Sistemática',
    confidence: 'Alta',
    url: 'https://cochranelibrary.com/example-vivans-2',
    summary:
      'Aporte proteico adequado distribuído na última refeição favorece a estabilidade dos índices de saciedade e a redução da ingestão alimentar noturna.',
    relevance: 'Embasamento conceitual para a composição nutricional alinhada pelo médico.',
  },
  {
    id: 'ev-3',
    title: 'Diretriz de Cuidado Integrado do Envelhecimento Ativo e Longevidade',
    source: 'Conitec',
    year: '2025',
    evidenceType: 'Diretriz Clínica Nacional',
    confidence: 'Moderada',
    url: 'https://conitec.gov.br/example-vivans-3',
    summary:
      'Recomenda o acompanhamento longitudinal periódico de parâmetros de descanso, adesão a hábitos e funcionalidade física.',
    relevance: 'Alinhamento metodológico com o painel de acompanhamento longitudinal.',
  },
]

/* Centralized Mock Datasets for Prescriptions, Medications, Previous Exams, and Suggested Procedures */

export const initialPrescriptions: PrescriptionRecord[] = [
  {
    id: 'rx-marina-1042',
    patientId: 'marina-costa',
    code: 'RX-1042',
    title: 'Prescrição de Suporte Metabólico & Sono',
    doctorName: 'Dr. Guilherme Martins',
    doctorCrm: 'CRM/SP 184.920',
    issuedAt: '12 de agosto de 2026',
    validUntil: '26 de setembro de 2026 (45 dias)',
    status: 'ativa',
    items: [
      {
        medication: 'Bisglicinato de Magnésio + Inositol',
        dosage: 'Magnésio 250mg + Inositol 2g',
        posology:
          'Tomar 1 sachê diluído em 150ml de água morna às 21h30 (30-45 min antes de deitar)',
        quantity: '45 sachês',
        notes:
          'Favorece o relaxamento muscular e aprofundamento do sono de ondas lentas sem sonolência residual matinal.',
      },
      {
        medication: 'Complexo de Coenzima Q10 com Vitamina E',
        dosage: 'CoQ10 100mg + D-Alfa-Tocoferol 100UI',
        posology: 'Tomar 1 cápsula junto ao almoço',
        quantity: '60 cápsulas',
        notes: 'Suporte bioenergético mitocondrial para disposição vespertina.',
      },
    ],
    instructions:
      'Manter a hidratação diária de pelo menos 2,2 litros. Em caso de dúvidas sobre tolerância gástrica, registrar no diário do paciente.',
    digitalSignatureId: 'VIVANS-SIG-84920-20260812-MC',
    isSimulated: true,
  },
  {
    id: 'rx-marina-1021',
    patientId: 'marina-costa',
    code: 'RX-1021',
    title: 'Prescrição Inicial de Adequação Metabólica',
    doctorName: 'Dr. Guilherme Martins',
    doctorCrm: 'CRM/SP 184.920',
    issuedAt: '14 de junho de 2026',
    validUntil: '30 de julho de 2026',
    status: 'renovada',
    items: [
      {
        medication: 'Vitamina D3 + K2 (MK-7)',
        dosage: 'Vitamina D3 2.000 UI + K2 50mcg',
        posology: 'Tomar 1 cápsula pela manhã com o café',
        quantity: '60 cápsulas',
        notes: 'Otimização dos níveis séricos de 25-hidroxivitamina D.',
      },
      {
        medication: 'Ômega 3 TG Ultra Puro (IFOS)',
        dosage: 'EPA 500mg / DHA 400mg',
        posology: 'Tomar 1 cápsula após o almoço',
        quantity: '60 cápsulas',
        notes: 'Ação anti-inflamatória endotelial e controle lipídico.',
      },
    ],
    instructions: 'Receita renovada e substituída pela formulação RX-1042.',
    digitalSignatureId: 'VIVANS-SIG-84920-20260614-MC',
    isSimulated: true,
  },
  {
    id: 'rx-paulo-1051',
    patientId: 'paulo-mendes',
    code: 'RX-1051',
    title: 'Prescrição Metabólica com Suporte Gástrico',
    doctorName: 'Dr. Guilherme Martins',
    doctorCrm: 'CRM/SP 184.920',
    issuedAt: '18 de agosto de 2026',
    validUntil: '18 de outubro de 2026',
    status: 'ativa',
    items: [
      {
        medication: 'Berberina Fitossomal',
        dosage: '500mg',
        posology: '1 cápsula 15 minutos antes do almoço',
        quantity: '60 cápsulas',
        notes: 'Avaliar tolerância gástrica após relato recente.',
      },
    ],
    instructions:
      'Caso persista o desconforto matinal, suspender a tomada em jejum e aguardar retorno.',
    digitalSignatureId: 'VIVANS-SIG-84920-20260818-PM',
    isSimulated: true,
  },
]

export const initialMedications: MedicationItem[] = [
  {
    id: 'med-marina-1',
    patientId: 'marina-costa',
    name: 'Bisglicinato de Magnésio + Inositol',
    dosage: '250mg + 2g',
    frequency: '1x ao dia (Noite)',
    timeSlots: ['21:30'],
    instructions:
      'Diluir em 150ml de água morna cerca de 30 a 45 minutos antes de dormir. Não tomar com café ou estimulantes.',
    purpose: 'Indução de relaxamento neuromuscular e estabilização dos ciclos de sono.',
    prescribedBy: 'Dr. Guilherme Martins',
    prescribedAt: '12 ago 2026',
    status: 'em_uso',
    prescriptionId: 'rx-marina-1042',
  },
  {
    id: 'med-marina-2',
    patientId: 'marina-costa',
    name: 'Complexo CoQ10 + Vitamina E',
    dosage: '100mg + 100UI',
    frequency: '1x ao dia (Almoço)',
    timeSlots: ['12:30'],
    instructions:
      'Ingerir com refeição contendo gorduras boas (azeite, abacate) para máxima biodisponibilidade.',
    purpose: 'Suporte à função mitocondrial e energia celular vespertina.',
    prescribedBy: 'Dr. Guilherme Martins',
    prescribedAt: '12 ago 2026',
    status: 'em_uso',
    prescriptionId: 'rx-marina-1042',
  },
  {
    id: 'med-marina-3',
    patientId: 'marina-costa',
    name: 'Ômega 3 TG Concentrado (IFOS)',
    dosage: '1.000mg (EPA 500 / DHA 400)',
    frequency: '1x ao dia (Almoço)',
    timeSlots: ['12:30'],
    instructions: 'Tomar junto ao almoço. Manter o frasco ao abrigo de calor e umidade.',
    purpose: 'Modulação inflamatória basal e suporte cardiovascular.',
    prescribedBy: 'Dr. Guilherme Martins',
    prescribedAt: '14 jun 2026',
    status: 'em_uso',
    prescriptionId: 'rx-marina-1021',
  },
  {
    id: 'med-paulo-1',
    patientId: 'paulo-mendes',
    name: 'Berberina Fitossomal',
    dosage: '500mg',
    frequency: '1x ao dia (Antes do almoço)',
    timeSlots: ['12:00'],
    instructions:
      'Tomar com água antes da principal refeição. Se houver desconforto, transferir para após o almoço.',
    purpose: 'Sensibilização insulínica e controle glicêmico.',
    prescribedBy: 'Dr. Guilherme Martins',
    prescribedAt: '18 ago 2026',
    status: 'em_uso',
    prescriptionId: 'rx-paulo-1051',
  },
]

export const initialExams: ExamRecord[] = [
  {
    id: 'exam-marina-1',
    patientId: 'marina-costa',
    title: 'Painel Metabólico & Perfil Lipídico Avançado',
    category: 'Laboratorial',
    performedAt: '05 de agosto de 2026',
    laboratory: 'Laboratório Fleury / Vivans Integrado',
    doctorRequester: 'Dr. Guilherme Martins',
    status: 'concluido',
    summary:
      'Excelente perfil de segurança. Glicemia de jejum e hemoglobina glicada dentro do alvo otimizado de longevidade. PCR ultrassensível indica baixo risco inflamatório.',
    highlights: [
      {
        parameter: 'Glicemia de Jejum',
        value: '88 mg/dL',
        reference: '70 a 99 mg/dL',
        status: 'otimizado',
      },
      {
        parameter: 'Hemoglobina Glicada (HbA1c)',
        value: '5.2%',
        reference: '< 5.7%',
        status: 'otimizado',
      },
      {
        parameter: 'Insulina Basal',
        value: '6.4 uUI/mL',
        reference: '2.0 a 10.0 uUI/mL (otimizado)',
        status: 'otimizado',
      },
      { parameter: 'HOMA-IR', value: '1.39', reference: '< 1.80', status: 'otimizado' },
      {
        parameter: 'Colesterol Total',
        value: '182 mg/dL',
        reference: '< 190 mg/dL',
        status: 'normal',
      },
      {
        parameter: 'HDL-Colesterol',
        value: '58 mg/dL',
        reference: '> 50 mg/dL',
        status: 'otimizado',
      },
      {
        parameter: 'Triglicérides',
        value: '96 mg/dL',
        reference: '< 150 mg/dL',
        status: 'otimizado',
      },
      {
        parameter: 'PCR Ultrassensível',
        value: '0.4 mg/L',
        reference: '< 1.0 mg/L',
        status: 'otimizado',
      },
    ],
    doctorObservations:
      'Parâmetros basais de inflamação e metabolismo glicídico excelentes. Continuar o protocolo nutricional sem necessidade de medicação alopática.',
  },
  {
    id: 'exam-marina-2',
    patientId: 'marina-costa',
    title: 'Painel Hormonal, Tireoidiano & Micronutrientes',
    category: 'Metabólico',
    performedAt: '05 de agosto de 2026',
    laboratory: 'Laboratório Fleury / Vivans Integrado',
    doctorRequester: 'Dr. Guilherme Martins',
    status: 'concluido',
    summary:
      'Função tireoidiana preservada (TSH 1.82). 25-OH Vitamina D em nível satisfatório (46 ng/mL) e Ferritina adequada (78 ng/mL). Cortisol salivar noturno sugere leve ativação simpática tardia.',
    highlights: [
      {
        parameter: 'TSH Ultrassensível',
        value: '1.82 mUI/L',
        reference: '0.4 a 4.0 mUI/L (alvo: 1.0-2.5)',
        status: 'otimizado',
      },
      {
        parameter: 'T4 Livre',
        value: '1.24 ng/dL',
        reference: '0.8 a 1.8 ng/dL',
        status: 'normal',
      },
      {
        parameter: '25-OH Vitamina D',
        value: '46 ng/mL',
        reference: '30 a 60 ng/mL (longevidade)',
        status: 'otimizado',
      },
      {
        parameter: 'Vitamina B12',
        value: '620 pg/mL',
        reference: '400 a 900 pg/mL',
        status: 'otimizado',
      },
      {
        parameter: 'Ferritina Sérica',
        value: '78 ng/mL',
        reference: '50 a 150 ng/mL',
        status: 'normal',
      },
      {
        parameter: 'Cortisol Noturno (Salivar)',
        value: '0.28 mcg/dL',
        reference: '< 0.15 mcg/dL',
        status: 'atencao',
      },
    ],
    doctorObservations:
      'A discreta elevação do cortisol noturno corrobora o relato de despertares às 3h. A antecipação do jantar e a higiene do sono foram priorizadas.',
  },
  {
    id: 'exam-marina-3',
    patientId: 'marina-costa',
    title: 'Bioimpedância Segmentar InBody 770',
    category: 'Funcional',
    performedAt: '12 de agosto de 2026',
    laboratory: 'Instituto Vivans · Avaliação Clínica',
    doctorRequester: 'Dr. Guilherme Martins',
    status: 'concluido',
    summary:
      'Massa muscular esquelética altamente preservada durante o déficit calórico gradual. Percentual de gordura em 28.4% com regressão favorável.',
    highlights: [
      {
        parameter: 'Peso Corporal Total',
        value: '79.6 kg',
        reference: 'Início: 80.0 kg',
        status: 'normal',
      },
      {
        parameter: 'Massa Muscular Esquelética',
        value: '26.8 kg',
        reference: 'Alvo: > 25.0 kg',
        status: 'otimizado',
      },
      {
        parameter: 'Percentual de Gordura Corporal',
        value: '28.4%',
        reference: 'Alvo: 22 - 25%',
        status: 'normal',
      },
      {
        parameter: 'Água Corporal Total',
        value: '38.2 L',
        reference: 'Adequada',
        status: 'otimizado',
      },
      {
        parameter: 'Nível de Gordura Visceral',
        value: 'Grau 6',
        reference: '< 9 (Seguro)',
        status: 'otimizado',
      },
    ],
    doctorObservations:
      'Excelente preservação de massa magra. Demonstra eficácia do aporte proteico no jantar e nos lanches.',
  },
  {
    id: 'exam-paulo-1',
    patientId: 'paulo-mendes',
    title: 'Painel Glicêmico & Perfil Hepático',
    category: 'Laboratorial',
    performedAt: '15 de agosto de 2026',
    laboratory: 'Laboratório Dasa / Vivans',
    doctorRequester: 'Dr. Guilherme Martins',
    status: 'concluido',
    summary: 'Curva glicêmica em acompanhamento. TGO/TGP discretamente limítrofes.',
    highlights: [
      {
        parameter: 'Glicemia de Jejum',
        value: '104 mg/dL',
        reference: '< 100 mg/dL',
        status: 'atencao',
      },
      { parameter: 'HbA1c', value: '5.8%', reference: '< 5.7%', status: 'atencao' },
      { parameter: 'TGP (ALT)', value: '36 U/L', reference: '< 35 U/L', status: 'normal' },
    ],
  },
]

export const initialSuggestedProcedures: SuggestedProcedure[] = [
  {
    id: 'proc-marina-1',
    patientId: 'marina-costa',
    title: 'Reavaliação de Composição Corporal por Bioimpedância (InBody 770)',
    category: 'Bioimpedância',
    suggestedBy: 'Dr. Guilherme Martins',
    suggestedAt: '12 de agosto de 2026',
    status: 'agendado',
    scheduledFor: '26 de setembro de 2026 · 10:00',
    priority: 'alta',
    clinicalRationale:
      'Monitorar a taxa de preservação de massa muscular esquelética após 45 dias de crononutrição e readequação do sono.',
    patientExplanation:
      'Exame rápido e indolor feito no próprio Instituto Vivans para conferir como seu corpo está trocando gordura por saúde e firmeza muscular.',
    nextStepPrompt: 'Agendamento já programado para o retorno de 45 dias no Instituto.',
  },
  {
    id: 'proc-marina-2',
    patientId: 'marina-costa',
    title: 'Mapeamento de Actimetria / Sono Longitudinal (Wearable)',
    category: 'Avaliação Especializada',
    suggestedBy: 'Dr. Guilherme Martins',
    suggestedAt: '25 de agosto de 2026',
    status: 'sugerido',
    priority: 'media',
    clinicalRationale:
      'Caso os despertares noturnos persistam por mais 14 dias após a troca do jantar para as 19h30, mapear a arquitetura do sono e microdespertares.',
    patientExplanation:
      'Sugestão médica para avaliação de sono com sensor leve no pulso, a ser decidida na próxima consulta se o sono ainda estiver fragmentado.',
    nextStepPrompt:
      'Sugestão médica em estudo. Será confirmada na consulta de retorno com o Dr. Guilherme.',
  },
  {
    id: 'proc-marina-3',
    patientId: 'marina-costa',
    title: 'Painel Laboratorial de Controle Metabólico Trimestral',
    category: 'Exame de Controle',
    suggestedBy: 'Dr. Guilherme Martins',
    suggestedAt: '12 de agosto de 2026',
    status: 'sugerido',
    priority: 'preventiva',
    clinicalRationale:
      'Acompanhar a evolução de HbA1c, HOMA-IR, perfil lipídico e cortisol salivar após o ciclo completo de 90 dias.',
    patientExplanation:
      'Exames de sangue simples para comparar seus resultados e celebrar sua evolução trimestral de saúde.',
    nextStepPrompt: 'Recomendado para novembro de 2026 (fim do ciclo de 90 dias).',
  },
  {
    id: 'proc-paulo-1',
    patientId: 'paulo-mendes',
    title: 'Ultrassonografia de Abdome Total com Doppler',
    category: 'Exame de Controle',
    suggestedBy: 'Dr. Guilherme Martins',
    suggestedAt: '18 de agosto de 2026',
    status: 'sugerido',
    priority: 'alta',
    clinicalRationale: 'Avaliação da esteatose hepática e vesícula biliar.',
    patientExplanation: 'Exame de imagem simples para verificar a saúde do fígado.',
    nextStepPrompt: 'Aguardando validação na consulta de hoje.',
  },
]
