import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { cn } from '@/lib/utils'
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
  const { nudged, nudgeDelayedPatients } = useVivans()
  const location = useLocation()

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
    <aside className="hidden min-h-[calc(100vh-72px)] border-r border-[#dfe8e3] bg-white px-4 py-6 lg:block w-[240px] shrink-0">
      <nav aria-label="Navegação do médico" className="space-y-1.5">
        {links.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold transition-colors',
                active
                  ? 'bg-[#e8f4f0] text-[#075f52] shadow-sm'
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
      </nav>
      {/* Cohort status box - Light, Clean & Modern */}
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
