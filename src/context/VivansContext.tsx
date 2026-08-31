/* React Context & Provider for Global State synchronization between Doctor and Patient flows */

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Role,
  PatientProfile,
  Appointment,
  CarePlanItem,
  MealRecord,
  MessageItem,
  ClinicalReport,
  PreConsultationData,
  ScheduledCheckin,
  ReturnJourneyPlan,
  initialPatients,
  initialAppointments,
  initialCarePlans,
  initialMeals,
  initialMessages,
  initialReports,
  initialPreConsultation,
  initialScheduledCheckins,
  initialReturnJourney,
} from '@/data/mockData'

interface VivansContextType {
  role: Role
  setRole: (role: Role) => void
  patients: PatientProfile[]
  selectedPatientId: string
  setSelectedPatientId: (id: string) => void
  selectedPatient: PatientProfile
  appointments: Appointment[]
  carePlans: CarePlanItem[]
  toggleCarePlan: (id: string) => void
  addCarePlanItem: (item: Omit<CarePlanItem, 'id'>) => void
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
  activeAttentionCount: number
  nudgeDelayedPatients: () => void
  nudged: boolean
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
  const [nudged, setNudged] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || initialPatients[0]

  const toggleCarePlan = (id: string) => {
    setCarePlans((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    )
  }

  const addCarePlanItem = (newItem: Omit<CarePlanItem, 'id'>) => {
    const item: CarePlanItem = {
      ...newItem,
      id: `plan-${Date.now()}`,
    }
    setCarePlans((prev) => [...prev, item])
    notify('Ação adicionada ao plano de cuidado.')
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

  const nudgeDelayedPatients = () => {
    setNudged(true)
    notify('Lembrete (cutucão) enviado com sucesso para 5 pacientes.')
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
        appointments,
        carePlans,
        toggleCarePlan,
        addCarePlanItem,
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
        activeAttentionCount,
        nudgeDelayedPatients,
        nudged,
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
