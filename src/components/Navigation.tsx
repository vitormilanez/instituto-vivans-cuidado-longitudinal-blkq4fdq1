import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { cn } from '@/lib/utils'
import { QuickConsultationModal, QuickActionType } from '@/components/QuickConsultationModal'
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Home,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Video,
  AlertTriangle,
  ArrowRightLeft,
  Check,
  PenLine,
  UserCheck,
  Clock,
  Radio,
} from 'lucide-react'

export function NavigationHeader() {
  const { role, setRole, notify } = useVivans()
  const location = useLocation()
  const navigate = useNavigate()

  const handleRoleSwitch = (newRole: 'doctor' | 'patient') => {
    setRole(newRole)
    if (newRole === 'doctor' && !location.pathname.startsWith('/medico')) {
      navigate('/medico')
    } else if (newRole === 'patient' && !location.pathname.startsWith('/paciente')) {
      navigate('/paciente')
    }
    notify(
      `Alternado para o perfil: ${newRole === 'doctor' ? 'Médico (Dr. Guilherme)' : 'Paciente (Marina Costa)'}`,
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe8e3] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex min-w-0 items-center gap-3 group">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#0b7b68] text-sm font-bold text-white shadow-[0_8px_20px_rgba(11,123,104,0.22)] transition-transform group-hover:scale-105">
            IV
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-[-0.03em] text-[#17372f]">
              Instituto Vivans
            </p>
            <p className="hidden text-xs font-medium text-[#698078] sm:block">
              Cuidado Longitudinal e Longevidade
            </p>
          </div>
        </Link>

        {/* Demo Indicator & Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-[#f0d59c] bg-[#fffbf2] px-3 py-1 text-xs font-medium text-[#825b0b]">
            <span className="size-2 rounded-full bg-[#e49d45] animate-pulse" />
            <span>Protótipo Demonstrativo</span>
          </div>

          <div
            className="flex items-center rounded-2xl border border-[#dfe8e3] bg-[#f4f7f5] p-1 shadow-inner"
            aria-label="Alternador de perfil para demonstração"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('doctor')}
              className={cn(
                'flex items-center gap-1.5 min-h-9 rounded-xl px-3 text-xs font-bold transition-all sm:px-4 sm:text-xs',
                role === 'doctor'
                  ? 'bg-white text-[#17372f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#698078] hover:text-[#17372f]',
              )}
            >
              <span>Dr. Guilherme</span>
              <span className="hidden lg:inline text-[10px] text-[#60766f]">(Médico)</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('patient')}
              className={cn(
                'flex items-center gap-1.5 min-h-9 rounded-xl px-3 text-xs font-bold transition-all sm:px-4 sm:text-xs',
                role === 'patient'
                  ? 'bg-white text-[#17372f] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#698078] hover:text-[#17372f]',
              )}
            >
              <span>Marina Costa</span>
              <span className="hidden lg:inline text-[10px] text-[#60766f]">(Paciente)</span>
            </button>
          </div>

          <div className="hidden sm:grid size-10 place-items-center rounded-full bg-[#d9eee8] text-xs font-bold text-[#0b6a5b] border border-[#b9d8cf]">
            {role === 'doctor' ? 'GM' : 'MC'}
          </div>
        </div>
      </div>
    </header>
  )
}

export function DoctorSidebar() {
  const { patients, nudged, nudgeDelayedPatients } = useVivans()
  const location = useLocation()
  const [isQuickConsultationOpen, setIsQuickConsultationOpen] = useState(false)
  const [quickActionType, setQuickActionType] = useState<QuickActionType>('video')
  const [quickTargetPatientId, setQuickTargetPatientId] = useState<string>('marina-costa')

  // Detect patients currently waiting in the virtual waiting room
  const waitingPatients = patients.filter((p) => p.isOnlineInWaitingRoom)
  const primaryWaitingPatient = waitingPatients[0] || patients.find((p) => p.id === 'marina-costa')

  const openQuickAction = (action: QuickActionType, patientId?: string) => {
    setQuickActionType(action)
    if (patientId) {
      setQuickTargetPatientId(patientId)
    } else if (primaryWaitingPatient) {
      setQuickTargetPatientId(primaryWaitingPatient.id)
    }
    setIsQuickConsultationOpen(true)
  }

  const links = [
    { label: 'Visão geral', path: '/medico', icon: LayoutDashboard },
    { label: 'Agenda', path: '/medico/agenda', icon: Calendar },
    { label: 'Pacientes', path: '/medico/pacientes', icon: Users },
    { label: 'Mensagens', path: '/medico/mensagens', icon: MessageSquare },
    { label: 'Relatórios', path: '/medico/relatorios', icon: FileText },
  ]

  const isActive = (path: string) => {
    if (path === '/medico') {
      return location.pathname === '/medico'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <aside className="hidden min-h-[calc(100vh-72px)] border-r border-[#dfe8e3] bg-white px-3.5 py-5 lg:block w-[260px] shrink-0">
        {/* Prominent Doctor Profile & Quick Actions Card */}
        <div className="mb-5 rounded-[24px] bg-gradient-to-b from-[#111827] to-[#16202e] p-4 text-white shadow-[0_12px_28px_rgba(17,24,39,0.22)] border border-[#1f2937]">
          {/* Doctor Info Row */}
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#1f2937] border border-white/10 text-[#b59e7f] shadow-inner">
              <Check className="size-5 stroke-[2.5] text-[#b59e7f]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-serif text-sm font-bold text-white tracking-tight leading-tight">
                Dr. Guilherme Martins
              </h2>
              <p className="mt-0.5 text-[10px] font-mono tracking-wide text-[#b59e7f]">
                CRM/SP 184.920
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#b59e7f]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9ca3af]">
                  LONGEVIDADE & METABOLISMO
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Virtual Waiting Room Status Indicator */}
          <div className="mt-3.5 rounded-xl border border-[#23483f] bg-[#0c2e27]/80 p-2.5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7ae0c8]">
                <Radio className="size-3 text-[#55e0be] animate-pulse" />
                <span>Sala de Espera Virtual</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#13493e] px-2 py-0.5 text-[10px] font-bold text-[#bbf7e8]">
                <span className="size-1.5 rounded-full bg-[#40e0be] animate-ping" />1 online
              </span>
            </div>

            {primaryWaitingPatient && (
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#1a443b] pt-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    {primaryWaitingPatient.name}
                  </p>
                  <p className="truncate text-[10px] text-[#8ea79f]">
                    Aguardando na sala · {primaryWaitingPatient.waitingSince || 'Há 4 min'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openQuickAction('video', primaryWaitingPatient.id)}
                  title={`Atender ${primaryWaitingPatient.name} agora`}
                  className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#b59e7f] text-[#111827] hover:bg-[#c9b293] transition-colors cursor-pointer"
                >
                  <Video className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Primary Quick Meet Action Button */}
          <button
            type="button"
            onClick={() => openQuickAction('video')}
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#b59e7f] px-3 text-xs font-bold text-[#111827] shadow-sm transition-all hover:bg-[#a68f70] active:scale-[0.98] cursor-pointer"
          >
            <Video className="size-4 shrink-0 text-[#111827]" />
            <span>Iniciar Teleconsulta (Meet)</span>
          </button>

          {/* Two Secondary Quick Shortcuts: Consultar Histórico & Anotação Rápida */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => openQuickAction('history')}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-[#d1d5db] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              title="Consultar prontuário ou histórico clínico sem iniciar vídeo"
            >
              <FileText className="size-3.5 text-[#b59e7f]" />
              <span>Histórico</span>
            </button>

            <button
              type="button"
              onClick={() => openQuickAction('note')}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-[#d1d5db] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              title="Registrar nota clínica rápida no prontuário do paciente"
            >
              <PenLine className="size-3.5 text-[#b59e7f]" />
              <span>Anotação</span>
            </button>
          </div>
        </div>
        {/* Section Header: Navegação Principal */}
        <div className="px-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8ba29a]">
            NAVEGAÇÃO PRINCIPAL
          </p>
        </div>
        <nav aria-label="Navegação do médico" className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-colors',
                  active
                    ? 'bg-[#e8f4f0] text-[#075f50] shadow-sm'
                    : 'text-[#60766f] hover:bg-[#f4f7f5] hover:text-[#17372f]',
                )}
              >
                <Icon
                  className={cn('size-4 shrink-0', active ? 'text-[#0b7b68]' : 'text-[#8ba29a]')}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>{' '}
        <div className="mt-8 rounded-[20px] border border-[#DEE7E2] bg-[#FDFCFA] p-4 text-[#112822] shadow-[0_4px_16px_rgba(17,40,34,0.03)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#556D66]">
              Painel de Coorte
            </p>
            <span className="size-2 rounded-full bg-[#097260]" />
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between rounded-[14px] bg-[#F5F8F6] px-3 py-2 text-xs">
              <span className="text-[#556D66]">Ativos</span>
              <strong className="text-sm font-bold text-[#112822]">22</strong>
            </div>
            <div className="flex items-center justify-between rounded-[14px] bg-[#EAF3EF]/60 px-3 py-2 text-xs">
              <span className="text-[#097260] font-medium">Regulares</span>
              <strong className="text-sm font-bold text-[#097260]">17</strong>
            </div>
            <div className="flex items-center justify-between rounded-[14px] bg-[#FEF7E7] px-3 py-2 text-xs text-[#7D5308]">
              <span className="font-semibold">Atrasados</span>
              <strong className="text-sm font-bold text-[#7D5308]">5</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={nudged}
            onClick={nudgeDelayedPatients}
            className={cn(
              'mt-3 min-h-9 w-full rounded-[14px] px-3 text-xs font-bold transition-all',
              nudged
                ? 'bg-[#DEE7E2] text-[#556D66] cursor-default'
                : 'bg-[#112822] text-white hover:bg-[#1e483e] shadow-2xs active:scale-[0.98]',
            )}
          >
            {nudged ? 'Lembrete enviado (5)' : 'Enviar lembrete (5)'}
          </button>
        </div>
        {/* AI Structured Support - Secondary Notice */}
        <div className="mt-4 rounded-[16px] border border-[#DEE7E2] bg-[#F5F8F6]/80 p-3 text-xs text-[#556D66] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#097260]">
            <Sparkles className="size-3.5 shrink-0" />
            <span className="text-[11px]">Apoio Clínico Estruturado</span>
          </div>
          <p className="text-[10px] leading-relaxed text-[#556D66]">
            Rascunhos documentais para validação médica. Sem emissão autônoma de diagnóstico.
          </p>
        </div>
      </aside>

      {/* Quick Consultation Modal with Dynamic Initial Action */}
      <QuickConsultationModal
        isOpen={isQuickConsultationOpen}
        onClose={() => setIsQuickConsultationOpen(false)}
        initialAction={quickActionType}
        initialPatientId={quickTargetPatientId}
      />
    </>
  )
}

export function PatientBottomNav() {
  const location = useLocation()

  const links = [
    { label: 'Hoje', path: '/paciente', icon: Home },
    { label: 'Plano', path: '/paciente/plano', icon: CheckSquare },
    { label: 'Diário', path: '/paciente/diario', icon: BookOpen },
    { label: 'Evolução', path: '/paciente/evolucao', icon: TrendingUp },
    { label: 'Mensagens', path: '/paciente/mensagens', icon: MessageSquare },
    { label: 'Consultas', path: '/paciente/consultas', icon: Calendar },
  ]

  const isActive = (path: string) => {
    if (path === '/paciente') {
      return location.pathname === '/paciente'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      aria-label="Navegação do paciente"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dfe8e3] bg-white px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
        {links.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-bold transition-all',
                active ? 'bg-[#e8f4f0] text-[#0b6a5b]' : 'text-[#789087] hover:text-[#17372f]',
              )}
            >
              <Icon className={cn('size-4', active ? 'text-[#0b7b68]' : 'text-[#8ba29a]')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
