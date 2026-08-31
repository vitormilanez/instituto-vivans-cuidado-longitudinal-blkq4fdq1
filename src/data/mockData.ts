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
    focus: 'Emagrecimento · sono',
    progress: '−1,8 kg',
    attention: 'Sono',
    tone: 'amber',
    reportCount: '2',
    prescriptionCount: '1 ativa',
    cycle: 'Dia 29 de 90',
    lastContact: 'Hoje · 09:18',
    nextConsultation: 'Hoje · 10:30',
    adherence: '82%',
    weightLoss: '−1,8 kg',
    currentWeight: 78.2,
    targetWeight: 72.0,
    startWeight: 80.0,
    report: {
      title: 'Relatório quinzenal',
      period: '11–25 de agosto',
      status: 'Revisado em 24 ago',
      summary:
        'Evolução consistente de peso e boa adesão. O sono permaneceu abaixo do padrão pessoal em quatro noites.',
      metrics: [
        ['Peso', '−1,8 kg'],
        ['Adesão', '82%'],
        ['Sono médio', '6h12'],
      ],
    },
    prescription: {
      title: 'Receita digital #RX-1042',
      status: 'Ativa',
      detail: '1 item prescrito · validade até 26 de setembro',
      note: 'Emitida na última consulta e disponibilizada à paciente.',
    },
    insight: {
      title: 'Priorizar sono antes de ampliar metas',
      detail: 'Quatro noites abaixo de seis horas coincidem com menor energia nos check-ins.',
      basis: 'Baseado em 14 dias de dados demonstrativos.',
    },
    activity: [
      ['Hoje · 09:18', 'Pré-consulta por voz concluída'],
      ['Ontem · 20:08', 'Jantar e saciedade registrados'],
      ['24 ago · 16:42', 'Relatório quinzenal revisado'],
      ['12 ago · 11:14', 'Primeira consulta realizada'],
    ],
    nextSteps: [
      'Investigar despertares noturnos',
      'Confirmar tolerância ao plano atual',
      'Definir meta da próxima quinzena',
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
    objective: '“Quero manter minha energia ao longo do dia e recuperar segurança nos exercícios.”',
    reported: 'Boa disposição pela manhã, uma queda de energia à tarde e nenhum sintoma novo.',
    aiFocus:
      'Revisar distribuição das atividades e percepção de esforço, sem ampliar metas automaticamente.',
    metrics: [
      ['Energia', '4 de 5', '+1 ponto'],
      ['Passos', '7.280', '+6%'],
      ['Sono', '7h04', 'regular'],
    ],
    attentionTitle: 'Sem alerta clínico novo',
    attentionDetail:
      'A variação de energia foi registrada para contextualização médica, sem inferência diagnóstica.',
    checklist: [
      'Validar energia à tarde',
      'Revisar percepção de esforço',
      'Definir próximo acompanhamento',
    ],
  },
  {
    id: 'apt-marina',
    time: '10:30',
    patient: 'Marina Costa',
    initials: 'MC',
    type: 'Retorno · 30 min',
    status: 'Próxima',
    statusTone: 'green',
    preVisit: 'Voz concluída · resumo pronto',
    preVisitTone: 'green',
    objective: '“Quero continuar perdendo peso sem ficar cansada e voltar a dormir melhor.”',
    reported: 'Mais saciedade, sono pior nesta semana e nenhum sintoma novo.',
    aiFocus: 'Priorizar sono e energia antes de ampliar metas.',
    metrics: [
      ['Peso', '78,2 kg', '−1,8 kg'],
      ['Adesão', '82%', '+6 p.p.'],
      ['Sono', '5h42', 'abaixo do padrão'],
    ],
    attentionTitle: 'Sono fora do padrão pessoal',
    attentionDetail:
      'Quatro noites abaixo de seis horas. Dados do relógio são demonstrativos e não equivalem a diagnóstico.',
    checklist: ['Validar sono', 'Confirmar tolerância', 'Decidir próximo passo'],
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

export const initialCarePlans: CarePlanItem[] = [
  {
    id: 'plan-1',
    action: 'Tomar 500ml de água antes do almoço e do jantar',
    category: 'Hábitos alimentares',
    type: 'medical',
    completed: true,
  },
  {
    id: 'plan-2',
    action: 'Registrar uma foto do jantar para avaliar saciedade',
    category: 'Diário · até 21h',
    type: 'medical',
    completed: false,
  },
  {
    id: 'plan-3',
    action: 'Começar a desacelerar às 22h (higiene do sono sem telas)',
    category: 'Sono e recuperação',
    type: 'medical',
    completed: false,
  },
  {
    id: 'plan-4',
    action: 'Caminhada leve de 15 minutos ao ar livre pela manhã',
    category: 'Atividade física',
    type: 'ai_suggestion',
    completed: false,
    notes: 'Sugestão do Copiloto IA para discussão na consulta de hoje.',
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
      'Bom dia, Marina! Vi suas respostas da pré-consulta. Vamos focar nos despertares noturnos na nossa consulta das 10:30.',
    status: 'enviada',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    author: 'Marina Costa',
    time: 'Hoje · 08:45',
    content:
      'Perfeito, Dr. Guilherme! Anotei aqui também o que senti com a mudança de horário do jantar.',
    status: 'enviada',
  },
  {
    id: 'msg-3',
    sender: 'ai_draft',
    author: 'Copiloto Vivans (Rascunho Sugerido)',
    time: 'Hoje · 09:19',
    content:
      'Sugestão de resposta pós-consulta: "Marina, seu plano atualizado de sono já está disponível na aba Plano. Lembre-se de desligar as telas às 22h."',
    isAiDraft: true,
    status: 'aguardando_aprovacao',
  },
]

export const initialReports: ClinicalReport[] = [
  {
    id: 'rep-ana-monthly',
    patientName: 'Ana Ribeiro',
    title: 'Relatório Mensal de Força e Longevidade',
    period: '25 jul – 25 ago 2026',
    status: 'em_revisao',
    summary:
      'Aumento de 12% na força funcional, melhora de 8 p.p. na adesão diária e estabilidade de peso.',
    metrics: [
      ['Adesão', '88%'],
      ['Força', '+12%'],
      ['Passos Médios', '7.140'],
    ],
  },
  {
    id: 'rep-marina-biweekly',
    patientName: 'Marina Costa',
    title: 'Relatório de Evolução Quinzenal',
    period: '11 – 25 de agosto 2026',
    status: 'em_revisao',
    summary:
      'Evolução consistente com perda de 1,8 kg de gordura preservando massa magra. Ponto de atenção: 4 noites com sono < 6h.',
    metrics: [
      ['Peso', '−1,8 kg'],
      ['Adesão', '82%'],
      ['Sono Médio', '5h42'],
    ],
  },
  {
    id: 'rep-marina-first',
    patientName: 'Marina Costa',
    title: 'Síntese da Primeira Consulta',
    period: '12 de agosto 2026',
    status: 'aprovado',
    approvedBy: 'Dr. Guilherme Martins',
    approvedAt: '12 ago 2026 11:30',
    summary:
      'Definição do objetivo longitudinal: perda ponderal sustentável com saúde metabólica e preservação da qualidade de vida.',
    metrics: [
      ['Peso Inicial', '80,0 kg'],
      ['Meta Proposta', '72,0 kg'],
      ['Adesão Inicial', '100%'],
    ],
  },
  {
    id: 'rep-paulo-weekly',
    patientName: 'Paulo Mendes',
    title: 'Relatório Semanal de Adaptação',
    period: '18 – 25 de agosto 2026',
    status: 'rascunho',
    summary: 'Adesão de 72% no período. Registro de enjoo leve matinal aguardando ajuste médico.',
    metrics: [
      ['Adesão', '72%'],
      ['Peso', '−0,6 kg'],
      ['Check-ins', '5 de 7'],
    ],
  },
]

export const initialPreConsultation: PreConsultationData = {
  completed: true,
  consentGiven: true,
  mode: 'voice',
  objective: 'Quero continuar perdendo peso sem ficar cansada e voltar a dormir melhor.',
  energyRating: 3,
  sleepRating: 2,
  digestiveStatus: 'Boa digestão geral, sem queixas gástricas agudas.',
  questionsForDoctor:
    'Quero saber se o horário que janto (por volta de 20h) está atrapalhando meu sono.',
  audioDurationSeconds: 184,
  transcript: `Marina: "Oi Dr. Guilherme! Tudo bem? Na última quinzena eu consegui manter a hidratação e o prato do jantar bem certinho como combinamos. Notei que a minha saciedade melhorou muito e não sinto mais aquela vontade louca de doce de noite. A balança baixou quase dois quilos, o que me deixou muito animada! O problema é que nesta última semana eu comecei a acordar às 3h da manhã sem motivo e demoro pra dormir de novo. Fico com uma média de 5h40 por noite e acordo cansada. Quero ver com o senhor se mudar o horário do jantar ou alguma vitamina pode me ajudar a regular isso."`,
  aiSynthesis: `• Objetivo principal: Perda de peso sustentada com resolução de insônia de manutenção.\n• Evolução positiva: Saciedade controlada, redução de compulsão noturna, perda ponderal de 1,8 kg.\n• Ponto de atenção clínica: Despertares noturnos com média de 5h42 de sono nas últimas 4 noites.\n• Hipótese contextualizada: Não há sinais de refluxo ou sintomas digestivos relatados; avaliar crononutrição e higiene do sono.`,
  suggestedQuestions: [
    'Qual tem sido o intervalo entre o término do jantar e o momento de deitar?',
    'Houve aumento no consumo de cafeína ou estimulantes após as 14h?',
    'Como está a exposição à luz solar matinal e o nível de estresse no trabalho?',
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
      'Estudo demonstra que encerrar o consumo calórico 3 horas antes de dormir melhora em 22% a eficiência do sono REM em adultos sob restrição calórica moderada.',
    relevance: 'Diretamente aplicável à queixa de despertares noturnos de Marina Costa.',
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
      'A distribuição de pelo menos 25g de proteína no jantar diminui episódios de fome noturna e melhora a regulação de grelina matinal.',
    relevance: 'Valida a recomendação atual do plano alimentar implementado pelo Dr. Guilherme.',
  },
  {
    id: 'ev-3',
    title: 'Diretriz de Cuidado Integrado do Envelhecimento Ativo',
    source: 'Conitec',
    year: '2025',
    evidenceType: 'Diretriz Clínica Nacional',
    confidence: 'Moderada',
    url: 'https://conitec.gov.br/example-vivans-3',
    summary:
      'Recomenda monitoramento longitudinal de sono e massa magra como preditores de longevidade e funcionalidade metabólica.',
    relevance: 'Embasamento para o painel de atenção e acompanhamento longitudinal.',
  },
]
