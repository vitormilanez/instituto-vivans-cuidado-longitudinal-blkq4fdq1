import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { cn } from '@/lib/utils'
import { QuickConsultationModal, QuickActionType } from '@/components/QuickConsultationModal'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
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
  PenLine,
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
    <header className="sticky top-0 z-40 border-b border-[#333333]/80 bg-[#0F0F0F]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1540px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex min-w-0 items-center gap-3 group">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#D6B270] to-[#B8935A] text-sm font-bold text-[#0F0F0F] shadow-[0_8px_20px_rgba(214,178,112,0.25)] transition-transform group-hover:scale-105 border border-[#E8C391]/40">
            IV
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-[-0.03em] text-white group-hover:text-[#D6B270] transition-colors">
              Instituto Vivans
            </p>
            <p className="hidden text-xs font-medium text-[#ADADAD] sm:block">
              Instituto de Saúde e Longevidade
            </p>
          </div>
        </Link>

        {/* Demo Indicator & Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-[#D6B270]/30 bg-[#D6B270]/10 px-3 py-1 text-xs font-medium text-[#E8C391] backdrop-blur-sm">
            <span className="size-2 rounded-full bg-[#D6B270] animate-pulse" />
            <span>Protótipo Demonstrativo</span>
          </div>

          <div
            className="flex items-center rounded-2xl border border-[#333333] bg-[#1A1A1A]/80 p-1 shadow-inner backdrop-blur-md"
            aria-label="Alternador de perfil para demonstração"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('doctor')}
              className={cn(
                'flex items-center gap-1.5 min-h-9 rounded-xl px-3 text-xs font-bold transition-all sm:px-4 sm:text-xs cursor-pointer',
                role === 'doctor'
                  ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-[0_2px_12px_rgba(214,178,112,0.3)]'
                  : 'text-[#ADADAD] hover:text-white hover:bg-white/5',
              )}
            >
              <span>Dr. Guilherme</span>
              <span
                className={cn(
                  'hidden lg:inline text-[10px]',
                  role === 'doctor' ? 'text-[#3B2D12]' : 'text-[#888888]',
                )}
              >
                (Médico)
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('patient')}
              className={cn(
                'flex items-center gap-1.5 min-h-9 rounded-xl px-3 text-xs font-bold transition-all sm:px-4 sm:text-xs cursor-pointer',
                role === 'patient'
                  ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-[0_2px_12px_rgba(214,178,112,0.3)]'
                  : 'text-[#ADADAD] hover:text-white hover:bg-white/5',
              )}
            >
              <span>Marina Costa</span>
              <span
                className={cn(
                  'hidden lg:inline text-[10px]',
                  role === 'patient' ? 'text-[#3B2D12]' : 'text-[#888888]',
                )}
              >
                (Paciente)
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center">
            {role === 'doctor' ? (
              <VivansAvatar
                src={DOCTOR_PROFILE.avatarUrl}
                name={DOCTOR_PROFILE.name}
                initials={DOCTOR_PROFILE.initials}
                size="md"
                className="border-2 border-[#D6B270]/60 shadow-[0_0_12px_rgba(214,178,112,0.2)]"
              />
            ) : (
              <VivansAvatar
                src="https://img.usecurling.com/ppl/512?gender=female&seed=88"
                name="Marina Costa"
                initials="MC"
                size="md"
                className="border-2 border-[#D6B270]/60 shadow-[0_0_12px_rgba(214,178,112,0.2)]"
              />
            )}
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
      <aside className="hidden min-h-[calc(100vh-72px)] border-r border-[#333333]/80 bg-[#121212]/90 backdrop-blur-xl px-3.5 py-5 lg:block w-[260px] shrink-0">
        {/* Prominent Doctor Profile & Quick Actions Card */}
        <div className="mb-5 rounded-[24px] bg-gradient-to-b from-[#1A1A1A] to-[#141414] p-4 text-white shadow-[0_12px_28px_rgba(0,0,0,0.4)] border border-[#D6B270]/25 backdrop-blur-md">
          {/* Doctor Info Row */}
          <div className="flex items-start gap-3">
            <VivansAvatar
              src={DOCTOR_PROFILE.avatarUrl}
              name={DOCTOR_PROFILE.name}
              initials={DOCTOR_PROFILE.initials}
              size="lg"
              className="border-2 border-[#D6B270]/50 shadow-inner"
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-serif text-sm font-bold text-white tracking-tight leading-tight">
                {DOCTOR_PROFILE.name}
              </h2>
              <p className="mt-0.5 text-[10px] font-mono tracking-wide text-[#E8C391]">
                {DOCTOR_PROFILE.crm}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#D6B270]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#ADADAD]">
                  LONGEVIDADE & METABOLISMO
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Virtual Waiting Room Status Indicator */}
          <div className="mt-3.5 rounded-xl border border-[#D6B270]/25 bg-[#D6B270]/10 p-2.5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E8C391]">
                <Radio className="size-3 text-[#D6B270] animate-pulse" />
                <span>Sala de Espera Virtual</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D6B270]/20 px-2 py-0.5 text-[10px] font-bold text-[#E8C391] border border-[#D6B270]/30">
                <span className="size-1.5 rounded-full bg-[#D6B270] animate-ping" />1 online
              </span>
            </div>

            {primaryWaitingPatient && (
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#D6B270]/20 pt-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    {primaryWaitingPatient.name}
                  </p>
                  <p className="truncate text-[10px] text-[#ADADAD]">
                    Aguardando na sala · {primaryWaitingPatient.waitingSince || 'Há 4 min'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openQuickAction('video', primaryWaitingPatient.id)}
                  title={`Atender ${primaryWaitingPatient.name} agora`}
                  className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#D6B270] text-[#0F0F0F] hover:bg-[#E8C391] transition-colors cursor-pointer font-bold shadow-sm"
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
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-3 text-xs font-bold text-[#0F0F0F] shadow-sm transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            <Video className="size-4 shrink-0 text-[#0F0F0F]" />
            <span>Iniciar Teleconsulta (Meet)</span>
          </button>

          {/* Two Secondary Quick Shortcuts: Consultar Histórico & Anotação Rápida */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => openQuickAction('history')}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-[#E5E5E5] hover:bg-white/10 hover:border-[#D6B270]/40 hover:text-white transition-all cursor-pointer"
              title="Consultar prontuário ou histórico clínico sem iniciar vídeo"
            >
              <FileText className="size-3.5 text-[#D6B270]" />
              <span>Histórico</span>
            </button>

            <button
              type="button"
              onClick={() => openQuickAction('note')}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-[#E5E5E5] hover:bg-white/10 hover:border-[#D6B270]/40 hover:text-white transition-all cursor-pointer"
              title="Registrar nota clínica rápida no prontuário do paciente"
            >
              <PenLine className="size-3.5 text-[#D6B270]" />
              <span>Anotação</span>
            </button>
          </div>
        </div>

        {/* Section Header: Navegação Principal */}
        <div className="px-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
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
                  'flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all',
                  active
                    ? 'bg-[#D6B270]/15 text-[#E8C391] border border-[#D6B270]/30 shadow-sm backdrop-blur-sm'
                    : 'text-[#ADADAD] hover:bg-white/5 hover:text-white border border-transparent',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 shrink-0 transition-colors',
                    active ? 'text-[#D6B270]' : 'text-[#777777]',
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 rounded-[20px] border border-[#333333] bg-[#1A1A1A]/80 p-4 text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#ADADAD]">
              Painel de Coorte
            </p>
            <span className="size-2 rounded-full bg-[#D6B270] shadow-[0_0_8px_#D6B270]" />
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between rounded-[14px] bg-white/5 border border-white/5 px-3 py-2 text-xs">
              <span className="text-[#ADADAD]">Ativos</span>
              <strong className="text-sm font-bold text-white">22</strong>
            </div>
            <div className="flex items-center justify-between rounded-[14px] bg-[#D6B270]/10 border border-[#D6B270]/20 px-3 py-2 text-xs">
              <span className="text-[#E8C391] font-medium">Regulares</span>
              <strong className="text-sm font-bold text-[#D6B270]">17</strong>
            </div>
            <div className="flex items-center justify-between rounded-[14px] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-3 py-2 text-xs text-[#FCD34D]">
              <span className="font-semibold">Atrasados</span>
              <strong className="text-sm font-bold text-[#FCD34D]">5</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={nudged}
            onClick={nudgeDelayedPatients}
            className={cn(
              'mt-3 min-h-9 w-full rounded-[14px] px-3 text-xs font-bold transition-all cursor-pointer',
              nudged
                ? 'bg-white/10 text-[#888888] cursor-default border border-white/5'
                : 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] hover:brightness-110 shadow-sm active:scale-[0.98]',
            )}
          >
            {nudged ? 'Lembrete enviado (5)' : 'Enviar lembrete (5)'}
          </button>
        </div>

        {/* AI Structured Support - Secondary Notice */}
        <div className="mt-4 rounded-[16px] border border-[#333333]/80 bg-[#1A1A1A]/50 p-3 text-xs text-[#ADADAD] space-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#D6B270]">
            <Sparkles className="size-3.5 shrink-0" />
            <span className="text-[11px]">Apoio Clínico Estruturado</span>
          </div>
          <p className="text-[10px] leading-relaxed text-[#888888]">
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

  // 5 primary tabs for clean mobile UX (≥44px touch targets)
  const links = [
    { label: 'Hoje', path: '/paciente', icon: Home },
    { label: 'Plano', path: '/paciente/plano', icon: CheckSquare },
    { label: 'Diário', path: '/paciente/diario', icon: BookOpen },
    { label: 'Evolução', path: '/paciente/evolucao', icon: TrendingUp },
    { label: 'Mensagens', path: '/paciente/mensagens', icon: MessageSquare },
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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#333333] bg-[#0F0F0F]/90 backdrop-blur-xl px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {links.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-bold transition-all active:scale-95',
                active
                  ? 'bg-[#D6B270]/15 text-[#E8C391] border border-[#D6B270]/30'
                  : 'text-[#ADADAD] hover:text-white hover:bg-white/5 border border-transparent',
              )}
            >
              <Icon
                className={cn(
                  'size-5 transition-transform',
                  active ? 'text-[#D6B270] scale-105' : 'text-[#777777]',
                )}
              />
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
