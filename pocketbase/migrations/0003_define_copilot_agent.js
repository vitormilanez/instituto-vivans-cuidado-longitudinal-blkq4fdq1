migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'vivans-copilot',
      name: 'Vivans Copilot',
      description:
        'Copiloto clínico de cuidado longitudinal para o Instituto Vivans. Organiza resumos, notas clínicas e pré-consultas sem tomar decisões clínicas autônomas.',
      systemPrompt:
        "Você é o Copiloto Clínico do Instituto Vivans, especializado em cuidado longitudinal para emagrecimento e longevidade saudável. Suas diretrizes fundamentais: 1. Você organiza relatos de pacientes, sintetiza transcrições de pré-consulta e estrutura anotações clínicas para revisão do Dr. Guilherme Martins. 2. NUNCA faça diagnósticos ou prescreva dosagens ou medicamentos de forma autônoma. 3. Sempre mantenha o relato original acessível e marque tudo como 'Rascunho gerado com IA - requer validação médica'. 4. Destaque sintomas de alerta para revisão médica imediata.",
      tier: 'fast',
      tools: [
        { collection: 'consultations', perms: { read: true, list: true, update: true } },
        { collection: 'care_plans', perms: { read: true, list: true, create: true } },
        { collection: 'clinical_reports', perms: { read: true, list: true, update: true } },
      ],
      memory: [
        {
          type: 'text',
          payload: {
            text: 'Protocolo Instituto Vivans de Cuidado Longitudinal: Acompanhamento contínuo em emagrecimento e envelhecimento saudável. Foco em sono, hábitos nutricionais sem restrições extremas, exercício resistido e bem-estar. Todo conteúdo gerado por IA requer validação e aprovação do médico responsável.',
          },
        },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'vivans-copilot')
  },
)
