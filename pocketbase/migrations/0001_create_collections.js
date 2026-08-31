migrate(
  (app) => {
    // 1. checkins collection
    const checkins = new Collection({
      name: 'checkins',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'weight', type: 'number' },
        { name: 'mood', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'sleep_hours', type: 'number' },
        { name: 'steps', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(checkins)

    // 2. meals collection
    const meals = new Collection({
      name: 'meals',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'meal_type', type: 'text', required: true },
        { name: 'photo_url', type: 'text' },
        { name: 'analysis', type: 'text' },
        { name: 'hunger_rating', type: 'number' },
        { name: 'comfort_rating', type: 'number' },
        { name: 'adherence_rating', type: 'number' },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(meals)

    // 3. care_plans collection
    const carePlans = new Collection({
      name: 'care_plans',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'action', type: 'text', required: true },
        { name: 'category', type: 'text' },
        { name: 'type', type: 'text' }, // "medical" | "ai_suggestion"
        { name: 'completed', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(carePlans)

    // 4. consultations collection
    const consultations = new Collection({
      name: 'consultations',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'doctor_name', type: 'text', required: true },
        { name: 'date_time', type: 'text', required: true },
        { name: 'type', type: 'text' },
        { name: 'status', type: 'text' }, // "Confirmada" | "Concluída" | "A confirmar"
        { name: 'objective', type: 'text' },
        { name: 'pre_visit_status', type: 'text' },
        { name: 'pre_visit_summary', type: 'text' },
        { name: 'pre_visit_transcript', type: 'text' },
        { name: 'structured_notes', type: 'text' },
        { name: 'clinical_plan', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(consultations)

    // 5. messages collection
    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'sender', type: 'text', required: true }, // "doctor" | "patient" | "system" | "ai_draft"
        { name: 'content', type: 'text', required: true },
        { name: 'is_ai_draft', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(messages)

    // 6. clinical_reports collection
    const clinicalReports = new Collection({
      name: 'clinical_reports',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'patient_name', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'period', type: 'text' },
        { name: 'status', type: 'text' }, // "rascunho" | "em_revisao" | "aprovado" | "compartilhado"
        { name: 'summary', type: 'text' },
        { name: 'approved_by', type: 'text' },
        { name: 'approved_at', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(clinicalReports)
  },
  (app) => {
    ;['clinical_reports', 'messages', 'consultations', 'care_plans', 'meals', 'checkins'].forEach(
      (name) => {
        try {
          const col = app.findCollectionByNameOrId(name)
          app.delete(col)
        } catch (_) {}
      },
    )
  },
)
