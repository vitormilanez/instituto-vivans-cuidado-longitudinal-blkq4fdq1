import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { cn } from '@/lib/utils'
import {
  Video,
  Search,
  UserPlus,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  X,
  Mail,
  User,
  ShieldCheck,
  Stethoscope,
  FileText,
  PenLine,
  Clock,
  CheckCircle2,
  Bookmark,
  Calendar,
  Layers,
} from 'lucide-react'

export type QuickActionType = 'video' | 'history' | 'note'

interface QuickConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  initialAction?: QuickActionType
  initialPatientId?: string
}

export function QuickConsultationModal({
  isOpen,
  onClose,
  initialAction = 'video',
  initialPatientId,
}: QuickConsultationModalProps) {
  const { patients, registerQuickPatient, setSelectedPatientId, addPatientQuickNote, notify } =
    useVivans()
  const navigate = useNavigate()

  const [activeAction, setActiveAction] = useState<QuickActionType>(initialAction)
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatientId, setLocalSelectedPatientId] = useState<string>(
    initialPatientId || 'marina-costa',
  )

  // Quick note specific state
  const [noteContent, setNoteContent] = useState('')
  const [noteCategory, setNoteCategory] = useState<
    'observacao' | 'evolucao' | 'medicacao' | 'geral'
  >('observacao')
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSavedSuccess, setNoteSavedSuccess] = useState(false)

  // New patient form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  // Sync initial action/patient when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveAction(initialAction)
      if (initialPatientId) {
        setLocalSelectedPatientId(initialPatientId)
      }
      setNoteSavedSuccess(false)
      setFormError(null)
    }
  }, [isOpen, initialAction, initialPatientId])

  // Filter existing patients
  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return patients
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.focus.toLowerCase().includes(term) ||
        (p.email && p.email.toLowerCase().includes(term)),
    )
  }, [patients, searchTerm])

  if (!isOpen) return null

  const selectedPatientData = patients.find((p) => p.id === selectedPatientId)

  // 1. INICIAR TELECONSULTA
  const handleStartConsultation = () => {
    if (mode === 'new') {
      if (!newName.trim()) {
        setFormError('Por favor, informe o nome completo do paciente.')
        return
      }
      setFormError(null)
      setIsStarting(true)

      notify('Simulando abertura de link do Google Meet...')

      setTimeout(() => {
        const createdPatient = registerQuickPatient(newName.trim(), newEmail.trim())
        setIsStarting(false)
        onClose()
        navigate(`/medico/consulta/${createdPatient.id}`)
      }, 700)
    } else {
      if (!selectedPatientId) {
        setFormError('Selecione um paciente para iniciar a consulta.')
        return
      }
      setFormError(null)
      setIsStarting(true)

      setSelectedPatientId(selectedPatientId)
      notify('Simulando abertura de link do Google Meet...')

      setTimeout(() => {
        setIsStarting(false)
        onClose()
        navigate(`/medico/consulta/${selectedPatientId}`)
      }, 700)
    }
  }

  // 2. CONSULTAR HISTÓRICO / PRONTUÁRIO
  const handleViewHistory = () => {
    if (mode === 'new') {
      if (!newName.trim()) {
        setFormError('Por favor, informe o nome do paciente para abrir o prontuário.')
        return
      }
      setFormError(null)
      const createdPatient = registerQuickPatient(newName.trim(), newEmail.trim())
      notify(`Prontuário criado e aberto para ${createdPatient.name}.`)
      onClose()
      navigate(`/medico/pacientes/${createdPatient.id}`)
    } else {
      if (!selectedPatientId) {
        setFormError('Selecione um paciente para consultar o histórico.')
        return
      }
      setFormError(null)
      setSelectedPatientId(selectedPatientId)
      notify(`Abrindo prontuário longitudinal de ${selectedPatientData?.name || 'paciente'}...`)
      onClose()
      navigate(`/medico/pacientes/${selectedPatientId}`)
    }
  }

  // 3. ANOTAÇÃO RÁPIDA
  const handleSaveQuickNote = () => {
    if (!noteContent.trim()) {
      setFormError('Por favor, digite o conteúdo da anotação.')
      return
    }

    if (mode === 'new') {
      if (!newName.trim()) {
        setFormError('Por favor, informe o nome do novo paciente para vincular a anotação.')
        return
      }
      setFormError(null)
      setIsSavingNote(true)

      setTimeout(() => {
        const createdPatient = registerQuickPatient(newName.trim(), newEmail.trim())
        addPatientQuickNote(createdPatient.id, noteContent.trim(), noteCategory)
        setIsSavingNote(false)
        setNoteSavedSuccess(true)
        setNoteContent('')

        setTimeout(() => {
          onClose()
          navigate(`/medico/pacientes/${createdPatient.id}`)
        }, 1100)
      }, 500)
    } else {
      if (!selectedPatientId) {
        setFormError('Selecione um paciente para registrar a anotação.')
        return
      }
      setFormError(null)
      setIsSavingNote(true)

      setTimeout(() => {
        addPatientQuickNote(selectedPatientId, noteContent.trim(), noteCategory)
        setIsSavingNote(false)
        setNoteSavedSuccess(true)
        setNoteContent('')

        setTimeout(() => {
          onClose()
        }, 1100)
      }, 500)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-consultation-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-[#d6e2dc] bg-white shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section with high-end editorial styling */}
        <div className="relative bg-gradient-to-br from-[#111827] via-[#172338] to-[#1f2937] p-5 sm:p-6 text-white">
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-[#b59e7f]/20 blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#b59e7f]/20 text-[#d4af37] border border-[#b59e7f]/40 shadow-inner">
                {activeAction === 'video' && <Video className="size-5 text-[#f1dec6]" />}
                {activeAction === 'history' && <FileText className="size-5 text-[#f1dec6]" />}
                {activeAction === 'note' && <PenLine className="size-5 text-[#f1dec6]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b59e7f]">
                    Dr. Guilherme Martins · CRM/SP 184.920
                  </span>
                </div>
                <h2
                  id="quick-consultation-title"
                  className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white"
                >
                  {activeAction === 'video' && 'Iniciar Teleconsulta Rápida'}
                  {activeAction === 'history' && 'Consultar Histórico Clínico'}
                  {activeAction === 'note' && 'Registrar Anotação Rápida'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="grid size-9 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-2.5 text-xs text-[#d1d5db] font-light leading-relaxed">
            {activeAction === 'video' &&
              'Abra uma sessão clínica integrada ao Google Meet com anotações automáticas e suporte do Copiloto Vivans.'}
            {activeAction === 'history' &&
              'Acesse diretamente o dossiê longitudinal, biossinais e linha do tempo do paciente sem iniciar vídeo.'}
            {activeAction === 'note' &&
              'Registre uma nota clínica ou observação pontual no prontuário do paciente com salvamento imediato.'}
          </p>

          {/* Action Selector Pills (Video, History, Quick Note) */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/40 p-1.5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveAction('video')
                setFormError(null)
                setNoteSavedSuccess(false)
              }}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                activeAction === 'video'
                  ? 'bg-[#b59e7f] text-[#111827] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white',
              )}
            >
              <Video className="size-3.5" />
              <span className="hidden sm:inline">Teleconsulta</span>
              <span className="sm:hidden">Meet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAction('history')
                setFormError(null)
                setNoteSavedSuccess(false)
              }}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                activeAction === 'history'
                  ? 'bg-[#b59e7f] text-[#111827] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white',
              )}
            >
              <FileText className="size-3.5" />
              <span>Histórico</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAction('note')
                setFormError(null)
                setNoteSavedSuccess(false)
              }}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                activeAction === 'note'
                  ? 'bg-[#b59e7f] text-[#111827] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white',
              )}
            >
              <PenLine className="size-3.5" />
              <span className="hidden sm:inline">Anotação</span>
              <span className="sm:hidden">Nota</span>
            </button>
          </div>

          {/* Mode Tabs: Paciente Existente vs Novo Paciente */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('existing')
                setFormError(null)
              }}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                mode === 'existing'
                  ? 'bg-white text-[#111827] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                  : 'text-[#9ca3af] hover:text-white',
              )}
            >
              <Users className="size-3.5" />
              <span>Paciente Cadastrado ({patients.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('new')
                setFormError(null)
              }}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                mode === 'new'
                  ? 'bg-white text-[#111827] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                  : 'text-[#9ca3af] hover:text-white',
              )}
            >
              <UserPlus className="size-3.5" />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-240px)] overflow-y-auto">
          {/* Note saved success feedback */}
          {noteSavedSuccess && (
            <div className="rounded-2xl border border-[#bfe4d8] bg-[#ebf6f2] p-4 text-xs font-bold text-[#075f50] flex items-center gap-3 animate-fade-in">
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#0b7b68] text-white">
                <Check className="size-4 stroke-[3]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#075f50]">Anotação gravada com sucesso!</p>
                <p className="font-normal text-[11px] text-[#0b6a5b]">
                  O registro foi vinculado ao histórico de{' '}
                  <strong>{selectedPatientData?.name || newName}</strong>.
                </p>
              </div>
            </div>
          )}

          {mode === 'existing' ? (
            <div className="space-y-3">
              {/* Question label */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="patient-search-input"
                  className="font-serif text-sm font-bold text-[#112822]"
                >
                  {activeAction === 'video' && 'Para quem é esta teleconsulta?'}
                  {activeAction === 'history' && 'Qual prontuário deseja consultar?'}
                  {activeAction === 'note' && 'Para qual paciente é a anotação?'}
                </label>
                <span className="text-[11px] text-[#556d66]">
                  {filteredPatients.length} de {patients.length} pacientes
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8ba29a]" />
                <input
                  id="patient-search-input"
                  type="text"
                  placeholder="Buscar por nome, foco clínico ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe8e3] bg-[#f9faf9] pl-10 pr-16 py-2.5 text-xs text-[#17372f] placeholder-[#8ba29a] focus:border-[#0b7b68] focus:bg-white focus:outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8ba29a] hover:text-[#17372f] cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Scrollable list of patients */}
              <div
                role="radiogroup"
                aria-label="Lista de pacientes da coorte"
                className="space-y-2 max-h-52 overflow-y-auto pr-1"
              >
                {filteredPatients.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dfe8e3] p-8 text-center text-xs text-[#60766f]">
                    <p className="font-semibold text-[#17372f]">Nenhum paciente encontrado.</p>
                    <p className="mt-1 text-[11px] text-[#8ba29a]">
                      Tente outro termo ou cadastre como "Novo Paciente".
                    </p>
                  </div>
                ) : (
                  filteredPatients.map((p) => {
                    const isSelected = selectedPatientId === p.id
                    return (
                      <div
                        key={p.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => {
                          setLocalSelectedPatientId(p.id)
                          setFormError(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            setLocalSelectedPatientId(p.id)
                            setFormError(null)
                          }
                        }}
                        className={cn(
                          'flex items-center justify-between gap-3 p-3 rounded-2xl border cursor-pointer transition-all',
                          isSelected
                            ? 'border-[#0b7b68] bg-[#f0f8f5] shadow-xs'
                            : 'border-[#dfe8e3] bg-white hover:border-[#bfe4d8] hover:bg-[#fafcfb]',
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'grid size-10 shrink-0 place-items-center rounded-xl text-xs font-bold transition-colors',
                              isSelected
                                ? 'bg-[#0b7b68] text-white'
                                : 'bg-[#e8f4f0] text-[#0b6a5b]',
                            )}
                          >
                            {p.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-bold text-xs sm:text-sm text-[#17372f]">
                                {p.name}
                              </h3>
                              {p.isOnlineInWaitingRoom && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#ebf6f2] px-2 py-0.5 text-[10px] font-bold text-[#075f50] border border-[#bfe4d8]">
                                  <span className="size-1.5 rounded-full bg-[#0b7b68] animate-pulse" />
                                  Online na sala
                                </span>
                              )}
                              {p.tone === 'amber' && !p.isOnlineInWaitingRoom && (
                                <span
                                  className="size-2 rounded-full bg-[#e49d45]"
                                  title="Atenção"
                                />
                              )}
                            </div>
                            <p className="truncate text-[11px] text-[#60766f]">{p.focus}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline text-[10px] text-[#8ba29a]">
                            {p.cycle}
                          </span>
                          <div
                            className={cn(
                              'grid size-6 place-items-center rounded-full border transition-all',
                              isSelected
                                ? 'border-[#0b7b68] bg-[#0b7b68] text-white'
                                : 'border-[#dfe8e3] bg-white text-transparent',
                            )}
                          >
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Selection summary */}
              {selectedPatientData && (
                <div className="rounded-2xl border border-[#bfe4d8] bg-[#ebf6f2] p-3 text-xs text-[#075f50] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-4 shrink-0 text-[#0b7b68]" />
                    <span>
                      Paciente: <strong>{selectedPatientData.name}</strong>
                    </span>
                  </div>
                  {selectedPatientData.isOnlineInWaitingRoom ? (
                    <span className="inline-flex items-center gap-1 font-bold text-[#075f50]">
                      <span className="size-1.5 rounded-full bg-[#0b7b68] animate-ping" />
                      Aguardando atendimento ({selectedPatientData.waitingSince})
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#0b7b68]">
                      {selectedPatientData.nextConsultation}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: New Patient Info */
            <div className="space-y-3.5">
              <div className="border-b border-[#edf2ef] pb-2">
                <h3 className="font-serif text-sm font-bold text-[#112822]">
                  Dados do Novo Paciente
                </h3>
                <p className="text-[11px] text-[#60766f]">
                  Cadastre as informações básicas para executar a ação imediatamente.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="new-patient-name"
                    className="block text-xs font-bold text-[#17372f] mb-1"
                  >
                    Nome Completo <span className="text-[#e67e76]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8ba29a]" />
                    <input
                      id="new-patient-name"
                      type="text"
                      placeholder="Ex: Carlos Eduardo de Souza"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value)
                        setFormError(null)
                      }}
                      className="w-full rounded-2xl border border-[#dfe8e3] bg-white pl-10 pr-4 py-2.5 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none transition-all shadow-xs"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-patient-email"
                    className="block text-xs font-bold text-[#17372f] mb-1"
                  >
                    E-mail do Paciente
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8ba29a]" />
                    <input
                      id="new-patient-email"
                      type="email"
                      placeholder="Ex: paciente@email.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-2xl border border-[#dfe8e3] bg-white pl-10 pr-4 py-2.5 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Note Input Field (Only in 'note' action) */}
          {activeAction === 'note' && (
            <div className="space-y-3 pt-2 border-t border-[#edf2ef]">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quick-note-textarea"
                  className="font-serif text-sm font-bold text-[#112822] flex items-center gap-1.5"
                >
                  <PenLine className="size-4 text-[#0b7b68]" />
                  <span>Anotação Clínica / Observação</span>
                </label>
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'observacao', label: 'Observação' },
                      { id: 'evolucao', label: 'Evolução' },
                      { id: 'medicacao', label: 'Medicação' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNoteCategory(cat.id)}
                      className={cn(
                        'rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer',
                        noteCategory === cat.id
                          ? 'bg-[#17372f] text-white'
                          : 'bg-[#f4f7f5] text-[#60766f] hover:text-[#17372f]',
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                id="quick-note-textarea"
                rows={3}
                placeholder="Ex.: Paciente referiu melhora na disposição matinal após ajuste dos horários de refeição. Aguarda retorno para reavaliação de exames."
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value)
                  setFormError(null)
                }}
                className="w-full rounded-2xl border border-[#dfe8e3] bg-white p-3 text-xs leading-relaxed text-[#17372f] placeholder-[#8ba29a] focus:border-[#0b7b68] focus:outline-none transition-all shadow-xs"
              />

              <p className="text-[11px] text-[#60766f]">
                Esta nota será gravada diretamente na linha do tempo e no prontuário longitudinal do
                paciente com data/hora e identificação do médico.
              </p>
            </div>
          )}

          {/* Validation error message */}
          {formError && (
            <div className="rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-3 text-xs font-medium text-[#be123c] animate-fade-in">
              {formError}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-[#edf2ef] bg-[#fafcfb] px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#60766f]">
            <ShieldCheck className="size-4 text-[#0b7b68]" />
            <span>Ambiente seguro · Criptografia de ponta a ponta</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-h-11 rounded-2xl border border-[#dfe8e3] bg-white px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5] transition-all cursor-pointer"
            >
              Fechar
            </button>

            {/* Action 1: Start Video */}
            {activeAction === 'video' && (
              <button
                type="button"
                disabled={isStarting}
                onClick={handleStartConsultation}
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#b59e7f] px-6 text-xs font-bold text-[#111827] hover:bg-[#a68f70] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Video className="size-4 text-[#111827]" />
                <span>{isStarting ? 'Iniciando Meet...' : 'Iniciar Teleconsulta'}</span>
                <ArrowRight className="size-3.5" />
              </button>
            )}

            {/* Action 2: View History */}
            {activeAction === 'history' && (
              <button
                type="button"
                onClick={handleViewHistory}
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#17372f] px-6 text-xs font-bold text-white hover:bg-[#0e2721] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="size-4 text-white" />
                <span>Abrir Prontuário Longitudinal</span>
                <ArrowRight className="size-3.5" />
              </button>
            )}

            {/* Action 3: Save Quick Note */}
            {activeAction === 'note' && (
              <button
                type="button"
                disabled={isSavingNote}
                onClick={handleSaveQuickNote}
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <PenLine className="size-4 text-white" />
                <span>{isSavingNote ? 'Salvando Anotação...' : 'Salvar Anotação Rápida'}</span>
                <CheckCircle2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickConsultationModal
