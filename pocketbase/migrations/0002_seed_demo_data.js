migrate(
  (app) => {
    // Seed initial auth users
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Seed Dr. Guilherme Martins
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'guilhe.martins@gmail.com')
    } catch (_) {
      const doc = new Record(users)
      doc.setEmail('guilhe.martins@gmail.com')
      doc.setPassword('Skip@Pass')
      doc.setVerified(true)
      doc.set('name', 'Dr. Guilherme Martins')
      app.save(doc)
    }

    // Seed Marina Costa
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'marina.costa@example.com')
    } catch (_) {
      const pat = new Record(users)
      pat.setEmail('marina.costa@example.com')
      pat.setPassword('Skip@Pass')
      pat.setVerified(true)
      pat.set('name', 'Marina Costa')
      app.save(pat)
    }

    // Seed care plans
    const carePlansCol = app.findCollectionByNameOrId('care_plans')
    const initialPlans = [
      {
        patient: 'Marina Costa',
        action: 'Tomar 500ml de água antes do almoço e do jantar',
        category: 'Hábitos alimentares',
        type: 'medical',
        completed: true,
      },
      {
        patient: 'Marina Costa',
        action: 'Registrar foto do prato no jantar para avaliação de saciedade',
        category: 'Diário · até 21h',
        type: 'medical',
        completed: false,
      },
      {
        patient: 'Marina Costa',
        action: 'Começar higiene do sono às 22h (luz baixa, sem telas)',
        category: 'Sono e recuperação',
        type: 'medical',
        completed: false,
      },
      {
        patient: 'Marina Costa',
        action: 'Caminhada leve de 15 minutos após almoço',
        category: 'Atividade física',
        type: 'ai_suggestion',
        completed: false,
      },
    ]

    initialPlans.forEach((item) => {
      try {
        const rec = new Record(carePlansCol)
        rec.set('patient_name', item.patient)
        rec.set('action', item.action)
        rec.set('category', item.category)
        rec.set('type', item.type)
        rec.set('completed', item.completed)
        app.save(rec)
      } catch (_) {}
    })

    // Seed consultations
    const consultationsCol = app.findCollectionByNameOrId('consultations')
    const initialConsultations = [
      {
        patient: 'Lúcia Barbosa',
        doctor: 'Dr. Guilherme Martins',
        date_time: 'Hoje · 09:00',
        type: 'Retorno longevidade · 30 min',
        status: 'Concluída',
        objective:
          'Quero manter minha energia ao longo do dia e recuperar segurança nos exercícios.',
        pre_visit_status: 'Pré-consulta revisada',
        pre_visit_summary:
          'Boa disposição pela manhã, queda de energia à tarde e nenhum sintoma novo.',
        pre_visit_transcript:
          'Lúcia relatou melhora na rotina matinal com caminhadas, porém cansaço por volta das 16h. Nega queixas gastrointestinais.',
        structured_notes:
          'Paciente em bom estado geral. Ajustado horário de hidratação e sugerido fracionamento leve no lanche da tarde.',
        clinical_plan: 'Manter exercícios resistidos 3x/semana e reavaliar em 60 dias.',
      },
      {
        patient: 'Marina Costa',
        doctor: 'Dr. Guilherme Martins',
        date_time: 'Hoje · 10:30',
        type: 'Retorno · 30 min',
        status: 'Confirmada',
        objective: 'Quero continuar perdendo peso sem ficar cansada e voltar a dormir melhor.',
        pre_visit_status: 'Voz concluída · resumo pronto',
        pre_visit_summary:
          'Mais saciedade com a meta alimentar, sono irregular nesta semana (4 noites < 6h) e peso -1,8 kg.',
        pre_visit_transcript:
          'Marina: Oi Dr. Guilherme! Na última quinzena eu consegui manter a proteína no almoço e no jantar. Não sinto tanta fome à noite. Mas tive noites muito curtas, dormindo por volta de 5h40, acordando no meio da noite. Quero entender se o horário do jantar interfere.',
        structured_notes:
          'Avaliação longitudinal: Perda de 1,8kg consistente com balanço calórico. Queixa de sono não associada a refluxo noturno.',
        clinical_plan:
          'Investigar despertares noturnos. Recomendar anteceder o jantar em 1h e iniciar desaceleração às 22h.',
      },
      {
        patient: 'Rafael Lima',
        doctor: 'Dr. Guilherme Martins',
        date_time: 'Hoje · 11:30',
        type: 'Primeira consulta · 50 min',
        status: 'Confirmada',
        objective:
          'Quero entender por que estou cansado e começar uma rotina que eu consiga manter.',
        pre_visit_status: 'Anamnese 68% concluída',
        pre_visit_summary:
          'Cansaço ao fim do dia, rotina irregular de sono e 2 exames prévios anexados.',
        pre_visit_transcript:
          'Rafael preencheu o formulário de anamnese indicando cansaço vespertino e dificuldade em manter rotina de exercícios.',
        structured_notes: 'Anamnese inicial em andamento.',
        clinical_plan: 'Definir metas de base para os primeiros 30 dias.',
      },
      {
        patient: 'Ana Ribeiro',
        doctor: 'Dr. Guilherme Martins',
        date_time: 'Hoje · 14:00',
        type: 'Retorno força · 30 min',
        status: 'Confirmada',
        objective: 'Quero continuar ganhando força sem perder energia para o restante da semana.',
        pre_visit_status: 'Voz concluída · relatório pronto',
        pre_visit_summary:
          'Treinos pela manhã facilitaram a rotina e a energia permaneceu estável.',
        pre_visit_transcript:
          'Ana confirmou excelente adaptação aos treinos matinais e ausência de dores articulares.',
        structured_notes: 'Progresso muscular de +12% nas cargas em 4 semanas.',
        clinical_plan: 'Aprovar relatório mensal e manter progressão gradual de força.',
      },
      {
        patient: 'Paulo Mendes',
        doctor: 'Dr. Guilherme Martins',
        date_time: 'Hoje · 16:30',
        type: 'Acompanhamento · 25 min',
        status: 'A confirmar',
        objective: 'Quero ajustar minha rotina sem continuar sentindo enjoo.',
        pre_visit_status: 'Novo sintoma no check-in',
        pre_visit_summary:
          'Relatou enjoo matinal após atualização da medicação e menor adesão aos registros.',
        pre_visit_transcript:
          'Paulo enviou áudio informando náusea leve 30 minutos após a tomada da medicação matinal.',
        structured_notes: 'Alerta clínico de intolerância digestiva leve.',
        clinical_plan:
          'Orientar ingestão junto a alimento sólido ou fracionamento sob supervisão médica.',
      },
    ]

    initialConsultations.forEach((item) => {
      try {
        const rec = new Record(consultationsCol)
        rec.set('patient_name', item.patient)
        rec.set('doctor_name', item.doctor)
        rec.set('date_time', item.date_time)
        rec.set('type', item.type)
        rec.set('status', item.status)
        rec.set('objective', item.objective)
        rec.set('pre_visit_status', item.pre_visit_status)
        rec.set('pre_visit_summary', item.pre_visit_summary)
        rec.set('pre_visit_transcript', item.pre_visit_transcript)
        rec.set('structured_notes', item.structured_notes)
        rec.set('clinical_plan', item.clinical_plan)
        app.save(rec)
      } catch (_) {}
    })

    // Seed clinical reports
    const reportsCol = app.findCollectionByNameOrId('clinical_reports')
    const initialReports = [
      {
        patient: 'Ana Ribeiro',
        title: 'Relatório mensal de adesão e força',
        period: '25 jul – 25 ago',
        status: 'em_revisao',
        summary:
          'Aumento de consistência nos exercícios de força com melhora de energia subjetiva e manutenção de peso corporal.',
        approved_by: '',
        approved_at: '',
      },
      {
        patient: 'Marina Costa',
        title: 'Relatório de evolução quinzenal',
        period: '11 – 25 de agosto',
        status: 'em_revisao',
        summary:
          'Evolução consistente de peso (−1,8 kg) e boa adesão (82%). O sono permaneceu abaixo do padrão pessoal em 4 noites.',
        approved_by: '',
        approved_at: '',
      },
      {
        patient: 'Marina Costa',
        title: 'Síntese da primeira consulta',
        period: '12 de agosto',
        status: 'aprovado',
        summary:
          'Definição de meta de emagrecimento saudável com foco em preservação de massa magra e qualidade de sono.',
        approved_by: 'Dr. Guilherme Martins',
        approved_at: '12 ago 2026 11:30',
      },
      {
        patient: 'Paulo Mendes',
        title: 'Relatório semanal de adaptação',
        period: '18 – 25 de agosto',
        status: 'rascunho',
        summary:
          'Adesão moderada (72%) com registro de novo sintoma de náusea matinal pendente de decisão médica.',
        approved_by: '',
        approved_at: '',
      },
    ]

    initialReports.forEach((item) => {
      try {
        const rec = new Record(reportsCol)
        rec.set('patient_name', item.patient)
        rec.set('title', item.title)
        rec.set('period', item.period)
        rec.set('status', item.status)
        rec.set('summary', item.summary)
        rec.set('approved_by', item.approved_by)
        rec.set('approved_at', item.approved_at)
        app.save(rec)
      } catch (_) {}
    })
  },
  (app) => {
    // down logic
  },
)
