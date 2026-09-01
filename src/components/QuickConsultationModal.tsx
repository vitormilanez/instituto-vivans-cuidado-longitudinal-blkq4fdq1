import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { VivansAvatar } from '@/components/VivansAvatar'
import { cn } from '@/lib/utils'
import {
  Video,
  Search,
  UserPlus,
  Users,
  Check,
  ArrowRight,
  X,
  Mail,
  User,
  ShieldCheck,
  Stethoscope,
  FileText,
  PenLine,
  CheckCircle2,
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

      notify('Iniciando Consulta Online...')

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
      notify('Iniciando Consulta Online...')

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/40 backdrop-blur-sm p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-[#E8E3D9] bg-[#FFFFFF] shadow-elevation animate-fade-in-up text-[#1E1E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section with warm clean light editorial styling */}
        <div className="relative bg-[#FAF8F4] p-5 sm:p-6 border-b border-[#E8E3D9]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] shadow-subtle">
                {activeAction === 'video' && <Video className="size-5 text-[#2E5E4E]" />}
                {activeAction === 'history' && <FileText className="size-5 text-[#2E5E4E]" />}
                {activeAction === 'note' && <PenLine className="size-5 text-[#2E5E4E]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2E5E4E]">
                    Dr. Guilherme Martins · CRM/SP 184.920
                  </span>
                </div>
                <h2
                  id="quick-consultation-title"
                  className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1C]"
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
              className="grid size-9 place-items-center rounded-full bg-[#F1EEE7] text-[#5C5C57] hover:bg-[#E8E3D9] hover:text-[#1E1E1C] transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-2.5 text-xs text-[#5C5C57] leading-relaxed">
            {activeAction === 'video' &&
              'Abra uma sessão de Consulta Online com anotações automáticas e suporte do Copiloto V I N V A N S E.'}
            {activeAction === 'history' &&
              'Acesse diretamente o dossiê longitudinal, biossinais e linha do tempo do paciente sem iniciar vídeo.'}
            {activeAction === 'note' &&
              'Registre uma nota clínica ou observação pontual no prontuário do paciente com salvamento imediato.'}
          </p>

          {/* Action Selector Pills (Video, History, Quick Note) */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-[#F1EEE7] p-1.5 border border-[#E8E3D9]">
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
                  ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]',
              )}
            >
              <Video className="size-3.5" />
              <span className="hidden sm:inline">Consulta Online</span>
              <span className="sm:hidden">Online</span>
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
                  ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]',
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
                  ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]',
              )}
            >
              <PenLine className="size-3.5" />
              <span className="hidden sm:inline">Anotação</span>
              <span className="sm:hidden">Nota</span>
            </button>
          </div>

          {/* Mode Tabs: Paciente Existente vs Novo Paciente */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-[#FFFFFF] p-1 border border-[#E8E3D9]">
            <button
              type="button"
              onClick={() => {
                setMode('existing')
                setFormError(null)
              }}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                mode === 'existing'
                  ? 'bg-[#E7EFEA] text-[#2E5E4E] shadow-sm border border-[#C3D6CC]'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]',
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
                  ? 'bg-[#E7EFEA] text-[#2E5E4E] shadow-sm border border-[#C3D6CC]'
                  : 'text-[#5C5C57] hover:text-[#1E1E1C]',
              )}
            >
              <UserPlus className="size-3.5" />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-240px)] overflow-y-auto bg-[#FFFFFF]">
          {/* Note saved success feedback */}
          {noteSavedSuccess && (
            <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 text-xs font-bold text-[#2E5E4E] flex items-center gap-3 animate-fade-in">
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#2E5E4E] text-[#FFFFFF]">
                <Check className="size-4 stroke-[3]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1E1E1C]">Anotação gravada com sucesso!</p>
                <p className="font-normal text-[11px] text-[#2E5E4E]">
                  O registro foi vinculado ao histórico de{' '}
                  <strong className="text-[#1E1E1C]">{selectedPatientData?.name || newName}</strong>
                  .
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
                  className="font-serif text-sm font-bold text-[#1E1E1C]"
                >
                  {activeAction === 'video' && 'Para quem é esta teleconsulta?'}
                  {activeAction === 'history' && 'Qual prontuário deseja consultar?'}
                  {activeAction === 'note' && 'Para qual paciente é a anotação?'}
                </label>
                <span className="text-[11px] text-[#8A8A84]">
                  {filteredPatients.length} de {patients.length} pacientes
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8A84]" />
                <input
                  id="patient-search-input"
                  type="text"
                  placeholder="Buscar por nome, foco clínico ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] pl-10 pr-16 py-2.5 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5C57] hover:text-[#1E1E1C] cursor-pointer"
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
                  <div className="rounded-2xl border border-dashed border-[#E8E3D9] p-8 text-center text-xs text-[#5C5C57]">
                    <p className="font-semibold text-[#1E1E1C]">Nenhum paciente encontrado.</p>
                    <p className="mt-1 text-[11px] text-[#8A8A84]">
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
                            ? 'border-[#2E5E4E] bg-[#E7EFEA] shadow-subtle'
                            : 'border-[#E8E3D9] bg-[#FAF8F4] hover:border-[#2E5E4E]/40 hover:bg-[#F1EEE7]',
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <VivansAvatar
                            src={p.avatarUrl}
                            name={p.name}
                            initials={p.initials}
                            size="md"
                            className="border border-[#E8E3D9] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xs sm:text-sm text-[#1E1E1C]">
                                {p.name}
                              </h3>
                              {p.isOnlineInWaitingRoom && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7EFEA] px-2 py-0.5 text-[10px] font-bold text-[#2E5E4E] border border-[#C3D6CC]">
                                  <span className="size-1.5 rounded-full bg-[#2E5E4E] animate-pulse" />
                                  Online na sala
                                </span>
                              )}
                              {p.tone === 'amber' && !p.isOnlineInWaitingRoom && (
                                <span
                                  className="size-2 rounded-full bg-[#B7832F]"
                                  title="Atenção"
                                />
                              )}
                            </div>
                            <p className="truncate text-[11px] text-[#5C5C57]">{p.focus}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline text-[10px] text-[#8A8A84]">
                            {p.cycle}
                          </span>
                          <div
                            className={cn(
                              'grid size-6 place-items-center rounded-full border transition-all',
                              isSelected
                                ? 'border-[#2E5E4E] bg-[#2E5E4E] text-[#FFFFFF]'
                                : 'border-[#E8E3D9] bg-transparent text-transparent',
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
                <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-3 text-xs text-[#2E5E4E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-4 shrink-0 text-[#2E5E4E]" />
                    <span>
                      Paciente:{' '}
                      <strong className="text-[#1E1E1C]">{selectedPatientData.name}</strong>
                    </span>
                  </div>
                  {selectedPatientData.isOnlineInWaitingRoom ? (
                    <span className="inline-flex items-center gap-1 font-bold text-[#2E5E4E]">
                      <span className="size-1.5 rounded-full bg-[#2E5E4E] animate-ping" />
                      Aguardando atendimento ({selectedPatientData.waitingSince})
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#2E5E4E]">
                      {selectedPatientData.nextConsultation}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: New Patient Info */
            <div className="space-y-3.5">
              <div className="border-b border-[#E8E3D9] pb-2">
                <h3 className="font-serif text-sm font-bold text-[#1E1E1C]">
                  Dados do Novo Paciente
                </h3>
                <p className="text-[11px] text-[#5C5C57]">
                  Cadastre as informações básicas para executar a ação imediatamente.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="new-patient-name"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    Nome Completo <span className="text-[#B4553F]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8A84]" />
                    <input
                      id="new-patient-name"
                      type="text"
                      placeholder="Ex: Carlos Eduardo de Souza"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value)
                        setFormError(null)
                      }}
                      className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] pl-10 pr-4 py-2.5 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none transition-all shadow-subtle"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-patient-email"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    E-mail do Paciente
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8A84]" />
                    <input
                      id="new-patient-email"
                      type="email"
                      placeholder="Ex: paciente@email.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] pl-10 pr-4 py-2.5 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none transition-all shadow-subtle"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Note Input Field (Only in 'note' action) */}
          {activeAction === 'note' && (
            <div className="space-y-3 pt-2 border-t border-[#E8E3D9]">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quick-note-textarea"
                  className="font-serif text-sm font-bold text-[#1E1E1C] flex items-center gap-1.5"
                >
                  <PenLine className="size-4 text-[#2E5E4E]" />
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
                          ? 'bg-[#2E5E4E] text-[#FFFFFF]'
                          : 'bg-[#F1EEE7] text-[#5C5C57] hover:text-[#1E1E1C]',
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
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs leading-relaxed text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none transition-all shadow-subtle"
              />

              <p className="text-[11px] text-[#5C5C57]">
                Esta nota será gravada diretamente na linha do tempo e no prontuário longitudinal do
                paciente com data/hora e identificação do médico.
              </p>
            </div>
          )}

          {/* Validation error message */}
          {formError && (
            <div className="rounded-xl border border-[#B4553F]/40 bg-[#F6E7E2] p-3 text-xs font-medium text-[#B4553F] animate-fade-in">
              {formError}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-[#E8E3D9] bg-[#FAF8F4] px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#5C5C57]">
            <ShieldCheck className="size-4 text-[#2E5E4E]" />
            <span>Ambiente seguro · Criptografia de ponta a ponta</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-h-11 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] px-4 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-all cursor-pointer"
            >
              Fechar
            </button>

            {/* Action 1: Start Video */}
            {activeAction === 'video' && (
              <button
                type="button"
                disabled={isStarting}
                onClick={handleStartConsultation}
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Video className="size-4 text-[#FFFFFF]" />
                <span>
                  {isStarting ? 'Iniciando Consulta Online...' : 'Iniciar Consulta Online'}
                </span>
                <ArrowRight className="size-3.5" />
              </button>
            )}

            {/* Action 2: View History */}
            {activeAction === 'history' && (
              <button
                type="button"
                onClick={handleViewHistory}
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="size-4 text-[#FFFFFF]" />
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
                className="flex-1 sm:flex-initial min-h-11 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <PenLine className="size-4 text-[#FFFFFF]" />
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
