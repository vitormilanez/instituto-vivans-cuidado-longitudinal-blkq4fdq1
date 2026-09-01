/* React Context & Provider for Global State synchronization between Doctor and Patient flows */

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Role,
  PatientProfile,
  QuickNote,
  Appointment,
  CarePlanItem,
  MealRecord,
  MessageItem,
  ClinicalReport,
  PreConsultationData,
  ScheduledCheckin,
  ReturnJourneyPlan,
  PrescriptionRecord,
  MedicationItem,
  ExamRecord,
  SuggestedProcedure,
  initialPatients,
  initialAppointments,
  initialCarePlans,
  initialMeals,
  initialMessages,
  initialReports,
  initialPreConsultation,
  initialScheduledCheckins,
  initialReturnJourney,
  initialPrescriptions,
  initialMedications,
  initialExams,
  initialSuggestedProcedures,
} from '@/data/mockData'

interface VivansContextType {
  role: Role
  setRole: (role: Role) => void
  patients: PatientProfile[]
  selectedPatientId: string
  setSelectedPatientId: (id: string) => void
  selectedPatient: PatientProfile
  registerQuickPatient: (name: string, email: string) => PatientProfile
  addPatientQuickNote: (
    patientId: string,
    noteContent: string,
    category?: QuickNote['category'],
  ) => void
  appointments: Appointment[]
  carePlans: CarePlanItem[]
  toggleCarePlan: (id: string) => void
  addCarePlanItem: (item: Omit<CarePlanItem, 'id'>) => void
  updateCarePlanPeriod: (id: string, period: 'manha' | 'tarde' | 'noite') => void
  reorderCarePlans: (reordered: CarePlanItem[]) => void
  meals: MealRecord[]
  addMealRecord: (meal: Omit<MealRecord, 'id'>) => void
  rateMealRecord: (id: string, ratings: [number, number, number]) => void
  messages: MessageItem[]
  sendMessage: (content: string, sender?: 'doctor' | 'patient') => void
  approveAiDraft: (id: string) => void
  reports: ClinicalReport[]
  approveReport: (id: string, approverName: string) => void
  preConsultation: PreConsultationData
  updatePreConsultation: (data: Partial<PreConsultationData>) => void
  submitPreConsultation: () => void
  returnJourney: ReturnJourneyPlan
  scheduledCheckins: ScheduledCheckin[]
  completeScheduledCheckin: (id: string, value?: string | number, notes?: string) => void
  prescriptions: PrescriptionRecord[]
  medications: MedicationItem[]
  exams: ExamRecord[]
  suggestedProcedures: SuggestedProcedure[]
  requestPrescriptionRenewal: (prescriptionId: string) => void
  confirmProcedureInterest: (procedureId: string) => void
  activeAttentionCount: number
  nudgeDelayedPatients: () => void
  nudgeAttentionPatients: () => void
  nudgeSinglePatient: (patientId: string, patientName: string) => void
  nudged: boolean
  attentionNudged: boolean
  nudgedPatientIds: string[]
  toastMessage: string | null
  notify: (msg: string) => void
}

const VivansContext = createContext<VivansContextType | undefined>(undefined)

export function VivansProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('doctor')
  const [patients, setPatients] = useState<PatientProfile[]>(initialPatients)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('marina-costa')
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [carePlans, setCarePlans] = useState<CarePlanItem[]>(initialCarePlans)
  const [meals, setMeals] = useState<MealRecord[]>(initialMeals)
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages)
  const [reports, setReports] = useState<ClinicalReport[]>(initialReports)
  const [preConsultation, setPreConsultation] =
    useState<PreConsultationData>(initialPreConsultation)
  const [returnJourney, setReturnJourney] = useState<ReturnJourneyPlan>(initialReturnJourney)
  const [scheduledCheckins, setScheduledCheckins] =
    useState<ScheduledCheckin[]>(initialScheduledCheckins)
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(initialPrescriptions)
  const [medications, setMedications] = useState<MedicationItem[]>(initialMedications)
  const [exams, setExams] = useState<ExamRecord[]>(initialExams)
  const [suggestedProcedures, setSuggestedProcedures] = useState<SuggestedProcedure[]>(
    initialSuggestedProcedures,
  )
  const [nudged, setNudged] = useState<boolean>(false)
  const [attentionNudged, setAttentionNudged] = useState<boolean>(false)
  const [nudgedPatientIds, setNudgedPatientIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || initialPatients[0]

  const toggleCarePlan = (id: string) => {
    const nowTime =
      'Hoje · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setCarePlans((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed
          return {
            ...item,
            completed: nextCompleted,
            timingStatus: nextCompleted ? 'concluido' : 'pendente_hoje',
            lastCompletedAt: nextCompleted ? nowTime : undefined,
          }
        }
        return item
      }),
    )
    const target = carePlans.find((p) => p.id === id)
    if (target && !target.completed) {
      notify(`Parabéns! "${target.action.slice(0, 38)}..." marcado como concluído.`)
    } else {
      notify('Ação desmarcada.')
    }
  }

  const addCarePlanItem = (newItem: Omit<CarePlanItem, 'id'>) => {
    const item: CarePlanItem = {
      ...newItem,
      id: `plan-${Date.now()}`,
      timingStatus: newItem.completed ? 'concluido' : 'pendente_hoje',
    }
    setCarePlans((prev) => [...prev, item])
    notify('Ação adicionada ao plano de cuidado com sucesso.')
  }

  const updateCarePlanPeriod = (id: string, newPeriod: 'manha' | 'tarde' | 'noite') => {
    const periodLabels = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' }
    setCarePlans((prev) =>
      prev.map((item) => (item.id === id ? { ...item, period: newPeriod } : item)),
    )
    notify(`Ação movida para o período da ${periodLabels[newPeriod]}.`)
  }

  const reorderCarePlans = (reordered: CarePlanItem[]) => {
    setCarePlans(reordered)
  }

  const addMealRecord = (newMeal: Omit<MealRecord, 'id'>) => {
    const meal: MealRecord = {
      ...newMeal,
      id: `meal-${Date.now()}`,
    }
    setMeals((prev) => [meal, ...prev])
  }

  const rateMealRecord = (id: string, ratings: [number, number, number]) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ratings, feedbackSent: true } : m)))
    notify('Avaliação da refeição enviada ao Dr. Guilherme.')
  }

  const sendMessage = (content: string, sender: 'doctor' | 'patient' = role) => {
    if (!content.trim()) return
    const msg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender,
      author: sender === 'doctor' ? 'Dr. Guilherme Martins' : 'Marina Costa',
      time: 'Agora',
      content,
      status: 'enviada',
    }
    setMessages((prev) => [...prev, msg])
    notify(
      sender === 'doctor' ? 'Mensagem enviada ao paciente.' : 'Mensagem enviada à equipe médica.',
    )
  }

  const approveAiDraft = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              sender: 'doctor',
              author: 'Dr. Guilherme Martins',
              isAiDraft: false,
              status: 'enviada',
            }
          : m,
      ),
    )
    notify('Rascunho revisado e enviado como mensagem do médico.')
  }

  const approveReport = (id: string, approverName: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'aprovado',
              approvedBy: approverName,
              approvedAt: new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : r,
      ),
    )
    notify('Relatório aprovado e compartilhado com o paciente.')
  }

  const updatePreConsultation = (data: Partial<PreConsultationData>) => {
    setPreConsultation((prev) => ({ ...prev, ...data }))
  }

  const submitPreConsultation = () => {
    setPreConsultation((prev) => ({
      ...prev,
      completed: true,
      submittedAt:
        'Hoje · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }))
    notify('Pré-consulta revisada e enviada ao Dr. Guilherme.')
  }

  const completeScheduledCheckin = (id: string, value?: string | number, notes?: string) => {
    const timeStr =
      'Hoje · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setScheduledCheckins((prev) =>
      prev.map((chk) =>
        chk.id === id
          ? {
              ...chk,
              status: 'concluido',
              completedAt: timeStr,
              value: value ?? chk.value ?? 'Concluído',
              notes: notes ?? chk.notes,
            }
          : chk,
      ),
    )
    notify('Check-in programado de retorno registrado com sucesso!')
  }

  const registerQuickPatient = (name: string, email: string): PatientProfile => {
    const slug =
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `paciente-${Date.now()}`

    const initials =
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('') || 'NP'

    const avatarUrl = `https://img.usecurling.com/ppl/512?gender=female&seed=${Date.now() % 100}`
    const newPatient: PatientProfile = {
      id: slug,
      initials,
      name,
      avatarUrl,
      photoUrl: avatarUrl,
      avatar: avatarUrl,
      email,
      focus: 'Avaliação inicial · Consulta Online rápida',
      progress: 'Novo',
      attention: 'Primeira Consulta',
      tone: 'green',
      reportCount: '0',
      prescriptionCount: 'Nenhuma',
      cycle: 'Dia 1 · Primeira Consulta',
      lastContact: 'Agora · Consulta Online',
      nextConsultation: 'Hoje · Em andamento',
      adherence: '100%',
      weightLoss: '0,0 kg',
      currentWeight: 70.0,
      targetWeight: 70.0,
      startWeight: 70.0,
      isTemporary: true,
      report: {
        title: 'Síntese de Primeira Consulta',
        period: 'Consulta de Abertura',
        status: 'Em andamento',
        summary: `Atendimento inicial iniciado via Consulta Online para o paciente ${name}.`,
        metrics: [
          ['Status', 'Novo cadastro'],
          ['Canal', 'Consulta Online'],
        ],
      },
      prescription: {
        title: 'Nenhuma receita emitida',
        status: 'Em atendimento',
        detail: 'Documentos clínicos serão emitidos após a avaliação médica.',
        note: 'Sessão temporária iniciada.',
      },
      insight: {
        title: 'Primeira consulta em andamento',
        detail: 'Coletando histórico clínico e alinhando os objetivos longitudinais.',
        basis: 'Consulta Online ao vivo.',
      },
      activity: [
        ['Hoje · Agora', 'Consulta online rápida iniciada'],
        ['Hoje · Agora', `Cadastro gerado para ${name} (${email || 'Sem e-mail informado'})`],
      ],
      nextSteps: [
        'Concluir anamnese inicial',
        'Definir metas longitudinais',
        'Elaborar plano pós-consulta',
      ],
    }

    // Add to patient list and select
    setPatients((prev) => [newPatient, ...prev])
    setSelectedPatientId(newPatient.id)

    console.log('[Vivans Quick Consultation] Simulated creation of new patient record:', {
      name,
      email,
      patientId: newPatient.id,
      timestamp: new Date().toISOString(),
    })

    return newPatient
  }

  const addPatientQuickNote = (
    patientId: string,
    noteContent: string,
    category: QuickNote['category'] = 'observacao',
  ) => {
    if (!noteContent.trim()) return
    const nowTime =
      'Hoje · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const newNote: QuickNote = {
      id: `qn-${Date.now()}`,
      patientId,
      content: noteContent.trim(),
      createdAt: nowTime,
      author: 'Dr. Guilherme Martins',
      category,
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updatedNotes = [newNote, ...(p.quickNotes || [])]
          const updatedActivity: Array<[string, string]> = [
            [
              nowTime,
              `Anotação rápida registrada: "${noteContent.trim().slice(0, 45)}${noteContent.trim().length > 45 ? '...' : ''}"`,
            ],
            ...p.activity,
          ]
          return {
            ...p,
            quickNotes: updatedNotes,
            activity: updatedActivity,
            lastContact: nowTime,
          }
        }
        return p
      }),
    )

    const targetPatient = patients.find((p) => p.id === patientId)
    notify(`Anotação rápida salva com sucesso para ${targetPatient?.name || 'o paciente'}.`)
  }

  const nudgeDelayedPatients = () => {
    setNudged(true)
    const delayedIds = patients.filter((p) => p.tone === 'amber').map((p) => p.id)
    setNudgedPatientIds((prev) => Array.from(new Set([...prev, ...delayedIds])))
    notify(
      'Simulação: Cutucão/Lembrete enviado com sucesso para os 4 pacientes atrasados (> 48h sem diário).',
    )
  }

  const nudgeAttentionPatients = () => {
    setAttentionNudged(true)
    const attentionIds = patients.filter((p) => p.tone === 'rose').map((p) => p.id)
    setNudgedPatientIds((prev) => Array.from(new Set([...prev, ...attentionIds])))
    notify('Simulação: Cutucão/Contato prioritário enviado aos 3 pacientes em atenção clínica.')
  }

  const nudgeSinglePatient = (patientId: string, patientName: string) => {
    setNudgedPatientIds((prev) => Array.from(new Set([...prev, patientId])))
    notify(`Simulação: Lembrete individual enviado com sucesso para ${patientName}.`)
  }

  const requestPrescriptionRenewal = (prescriptionId: string) => {
    const target = prescriptions.find((p) => p.id === prescriptionId)
    notify(
      `Solicitação de renovação simulada para "${target?.title || 'receita'}" enviada ao Dr. Guilherme Martins.`,
    )
  }

  const confirmProcedureInterest = (procedureId: string) => {
    setSuggestedProcedures((prev) =>
      prev.map((proc) => (proc.id === procedureId ? { ...proc, status: 'agendado' } : proc)),
    )
    notify(
      'Interesse registrado! A equipe da V I N V A N S E entrará em contato para alinhar o agendamento.',
    )
  }

  const activeAttentionCount = 3

  return (
    <VivansContext.Provider
      value={{
        role,
        setRole,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        registerQuickPatient,
        addPatientQuickNote,
        appointments,
        carePlans,
        toggleCarePlan,
        addCarePlanItem,
        updateCarePlanPeriod,
        reorderCarePlans,
        meals,
        addMealRecord,
        rateMealRecord,
        messages,
        sendMessage,
        approveAiDraft,
        reports,
        approveReport,
        preConsultation,
        updatePreConsultation,
        submitPreConsultation,
        returnJourney,
        scheduledCheckins,
        completeScheduledCheckin,
        prescriptions,
        medications,
        exams,
        suggestedProcedures,
        requestPrescriptionRenewal,
        confirmProcedureInterest,
        activeAttentionCount,
        nudgeDelayedPatients,
        nudgeAttentionPatients,
        nudgeSinglePatient,
        nudged,
        attentionNudged,
        nudgedPatientIds,
        toastMessage,
        notify,
      }}
    >
      {children}
    </VivansContext.Provider>
  )
}

export function useVivans() {
  const context = useContext(VivansContext)
  if (!context) {
    throw new Error('useVivans must be used within a VivansProvider')
  }
  return context
}
