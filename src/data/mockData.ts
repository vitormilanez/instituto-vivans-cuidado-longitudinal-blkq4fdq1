/* Centralized Typed Mock Data & Store for Instituto Vivans */

export type Role = 'doctor' | 'patient'

export interface PatientProfile {
  id: string
  initials: string
  name: string
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

export interface Appointment {
  id: string
  time: string
  patient: string
  initials: string
  type: string
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

export interface CarePlanItem {
  id: string
  action: string
  category: string
  type: 'medical' | 'ai_suggestion'
  completed: boolean
  notes?: string
  frequency?: string
  targetDays?: number
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

export interface MessageItem {
  id: string
  sender: 'doctor' | 'patient' | 'system' | 'ai_draft'
  author: string
  time: string
  content: string
  isAiDraft?: boolean
  status?: 'enviada' | 'revisando' | 'aguardando_aprovacao'
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

export const initialPatients: PatientProfile[] = [
  {
    id: 'marina-costa',
    initials: 'MC',
    name: 'Marina Costa',
    focus: 'Emagrecimento longitudinal · sono e ritmo circadiano',
    progress: '−1,8 kg',
    attention: 'Sono fora do padrão',
    tone: 'amber',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 29 de 90 · Plano pós-consulta ativo',
    lastContact: 'Hoje · 09:18',
    nextConsultation: 'Hoje · 10:30 (Retorno agendado)',
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
    focus: 'Longevidade · força',
    progress: '+8% adesão',
    attention: 'Relatório',
    tone: 'blue',
    reportCount: '3',
    prescriptionCount: 'Nenhuma',
    cycle: 'Dia 61 de 90',
    lastContact: 'Ontem · 18:40',
    nextConsultation: 'Hoje · 14:00',
    adherence: '88%',
    weightLoss: '0,0 kg',
    currentWeight: 64.5,
    targetWeight: 64.0,
    startWeight: 65.0,
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
    focus: 'Emagrecimento · rotina',
    progress: '72% plano',
    attention: 'Sintoma',
    tone: 'rose',
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
    focus: 'Avaliação inicial',
    progress: 'Novo',
    attention: 'Anamnese',
    tone: 'gray',
    reportCount: '0',
    prescriptionCount: 'Nenhuma',
    cycle: 'Pré-cuidado',
    lastContact: 'Ontem · 11:05',
    nextConsultation: 'Hoje · 11:30',
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
    focus: 'Retorno longevidade · energia',
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
]

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-lucia',
    time: '09:00',
    patient: 'Lúcia Barbosa',
    initials: 'LB',
    type: 'Retorno longevidade · 30 min',
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
    time: '10:30',
    patient: 'Marina Costa',
    initials: 'MC',
    type: 'Retorno longevidade · 30 min',
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
    time: '11:30',
    patient: 'Rafael Lima',
    initials: 'RL',
    type: 'Primeira consulta · 50 min',
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
    time: '14:00',
    patient: 'Ana Ribeiro',
    initials: 'AR',
    type: 'Retorno força · 30 min',
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
    time: '16:30',
    patient: 'Paulo Mendes',
    initials: 'PM',
    type: 'Acompanhamento · 25 min',
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
    category: 'Hábitos alimentares e hidratação',
    type: 'medical',
    completed: true,
    frequency: 'Diário',
  },
  {
    id: 'plan-2',
    action: 'Antecipar o horário do jantar para as 19h30',
    category: 'Crononutrição · Ajuste pós-consulta',
    type: 'medical',
    completed: false,
    frequency: 'Diário',
  },
  {
    id: 'plan-3',
    action: 'Registrar imagem do prato noturno com notas de saciedade',
    category: 'Diário de acompanhamento · até 21h',
    type: 'medical',
    completed: false,
    frequency: 'Diário',
  },
  {
    id: 'plan-4',
    action: 'Iniciar rotina de higiene do sono sem telas às 22h',
    category: 'Sono e recuperação',
    type: 'medical',
    completed: false,
    frequency: 'Diário',
  },
  {
    id: 'plan-5',
    action: 'Caminhada leve matinal de 15 minutos em luz natural',
    category: 'Atividade física e ritmo circadiano',
    type: 'ai_suggestion',
    completed: false,
    notes: 'Rascunho organizado pelo Copiloto para avaliação médica.',
    frequency: 'Sugestão em análise',
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
    id: 'msg-1',
    sender: 'doctor',
    author: 'Dr. Guilherme Martins',
    time: 'Hoje · 08:30',
    content:
      'Bom dia, Marina. Recebi as informações da sua pré-consulta. Vamos dedicar atenção especial à qualidade do sono e ao horário das refeições na nossa consulta de hoje.',
    status: 'enviada',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    author: 'Marina Costa',
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
