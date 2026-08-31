import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import { cohortWeeklyAdherence } from '@/data/mockData'
import {
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle2,
  CheckCircle,
  Bell,
  Activity,
  Check,
  UserCheck,
  Stethoscope,
  ExternalLink,
  Info,
  Flame,
  Moon,
  HeartPulse,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react'

interface AlertItem {
  patient: string
  patientId: string
  title: string
  context: string
  tag: string
  tone: 'amber' | 'rose' | 'blue' | 'green'
  category: string
  icon: typeof AlertTriangle
  suggestedAction: string
  timeAgo: string
  keyMetric?: { label: string; val: string }
  symptomSource?: string
}

export default function DoctorOverview() {
  const {
    patients,
    appointments,
    reports,
    nudged,
    attentionNudged,
    nudgeDelayedPatients,
    nudgeAttentionPatients,
    nudgedPatientIds,
  } = useVivans()
  const navigate = useNavigate()

  // Active status filter controlled by quick status cards
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    'all' | 'regulares' | 'atrasados' | 'atencao'
  >('all')

  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)
  const [filterTag, setFilterTag] = useState<'all' | 'priority' | 'symptom' | 'report'>('all')

  // Confirmation modal state for nudges
  const [nudgeConfirmGroup, setNudgeConfirmGroup] = useState<'atrasados' | 'atencao' | null>(null)

  // Derive counts from actual mock data
  const totalCount = patients.length // 22
  const regularesCount = patients.filter((p) => p.tone === 'green').length // 15
  const atrasadosCount = patients.filter((p) => p.tone === 'amber').length // 4
  const atencaoCount = patients.filter((p) => p.tone === 'rose').length // 3
  const relatoriosCount = reports.length // 4

  const alerts: AlertItem[] = [
    {
      patient: 'Marina Costa',
      patientId: 'marina-costa',
      title: 'Pré-consulta: Despertares às 3h e sono curto (5h42)',
      context:
        'Relatado na pré-consulta de hoje: "Nos últimos quatro dias passei a acordar às 3h com sono fragmentado. Jantar às 20h30". Compilado para correlação crononutricional na consulta de retorno.',
      tag: 'Pré-consulta · Sono Fragmentado',
      tone: 'rose',
      category: 'Sintoma Pré-Consulta · Sono',
      icon: Moon,
      suggestedAction: 'Revisar crononutrição e adiantar horário da refeição para 19h30.',
      timeAgo: 'Hoje · 09:18',
      keyMetric: { label: 'Sintoma declarado', val: 'Sono 5h42 (−1h30)' },
      symptomSource: 'Áudio transcrito da pré-consulta',
    },
    {
      patient: 'Paulo Mendes',
      patientId: 'paulo-mendes',
      title: 'Pré-consulta & Check-in: Enjoo matinal pós-suplemento',
      context:
        'Relatado no diário e pré-consulta: "Senti enjoo moderado nas manhãs após tomar a nova suplementação em jejum". Queda de adesão nos registros após o sintoma.',
      tag: 'Pré-consulta · Queixa Gástrica',
      tone: 'rose',
      category: 'Sintoma Agudo · Adaptação',
      icon: HeartPulse,
      suggestedAction: 'Revisar posologia da receita #RX-1051 e indicar tomada pós-refeição.',
      timeAgo: 'Hoje · 08:12',
      keyMetric: { label: 'Sintoma declarado', val: 'Enjoo matinal' },
      symptomSource: 'Check-in e formulário pré-consulta',
    },
    {
      patient: 'Rafael Lima',
      patientId: 'rafael-lima',
      title: 'Pré-consulta: Fadiga vespertina e anamnese 68%',
      context:
        'Relatado na abertura pré-consulta: "Cansaço pesado às 16h, sem energia para treinar". Faltam preencher histórico familiar e uso atual de suplementos.',
      tag: 'Pré-consulta · Fadiga & Anamnese',
      tone: 'rose',
      category: 'Sintoma · Avaliação Inicial',
      icon: AlertTriangle,
      suggestedAction:
        'Aprofundar queixa de fadiga e completar lacunas durante a consulta inicial.',
      timeAgo: 'Ontem · 11:05',
      keyMetric: { label: 'Sintoma declarado', val: 'Fadiga vespertina' },
      symptomSource: 'Formulário inicial da pré-consulta',
    },
    {
      patient: 'Carlos Silva',
      patientId: 'carlos-silva',
      title: 'Sem diário alimentar ou check-in há mais de 48 horas',
      context: 'Último contato em 22 ago (há 3 dias). Pendência de registro alimentar quinzenal.',
      tag: '> 48h sem diário',
      tone: 'amber',
      category: 'Diário & Adesão',
      icon: Clock,
      suggestedAction: 'Enviar lembrete amigável ou abordar na consulta de amanhã.',
      timeAgo: '22 ago · 14:10',
      keyMetric: { label: 'Atraso', val: '> 72h sem registro' },
    },
    {
      patient: 'Felipe Vasconcelos',
      patientId: 'felipe-vasconcelos',
      title: '3 dias consecutivos sem registro de diário de biohacking',
      context: 'Oscilação no registro diário por motivo de viagens frequentes.',
      tag: '> 48h sem diário',
      tone: 'amber',
      category: 'Diário & Adesão',
      icon: Clock,
      suggestedAction: 'Disparar cutucão automático ou alinhar flexibilidade de diário.',
      timeAgo: '3 dias atrás',
      keyMetric: { label: 'Adesão', val: '68% (meta: 80%)' },
    },
    {
      patient: 'Marcelo Tavares',
      patientId: 'marcelo-tavares',
      title: '4 dias sem envio de diário ou confirmação de dose',
      context: 'Adesão à rosuvastatina registrada pela última vez há 4 dias.',
      tag: '> 48h sem diário',
      tone: 'amber',
      category: 'Diário & Adesão',
      icon: Clock,
      suggestedAction: 'Verificar tolerância medicamentosa e renovar engajamento.',
      timeAgo: '4 dias atrás',
      keyMetric: { label: 'Sem registro', val: '4 dias' },
    },
    {
      patient: 'Thiago Carvalho',
      patientId: 'thiago-carvalho',
      title: '2 dias sem sincronização de dados de sono e HRV',
      context: 'Check-in pendente desde 23 de agosto.',
      tag: '> 48h sem diário',
      tone: 'amber',
      category: 'Diário & Adesão',
      icon: Clock,
      suggestedAction: 'Notificar sobre o registro noturno antes da consulta de 05 set.',
      timeAgo: '2 dias atrás',
      keyMetric: { label: 'HRV', val: 'Sem sync' },
    },
    {
      patient: 'Lúcia Barbosa',
      patientId: 'lucia-barbosa',
      title: 'Metas em dia: 91% de adesão e energia 4/5 preservada',
      context:
        'Excelente disposição matinal, estabilidade funcional e 7.280 passos diários médios.',
      tag: 'Metas em dia',
      tone: 'green',
      category: 'Longevidade & Adesão',
      icon: CheckCircle2,
      suggestedAction: 'Manter rotina e reforçar retorno em 60 dias.',
      timeAgo: 'Hoje · 09:30',
      keyMetric: { label: 'Adesão', val: '91%' },
    },
    {
      patient: 'Ana Ribeiro',
      patientId: 'ana-ribeiro',
      title: 'Metas em dia: 88% de adesão e ganho de 12% na força funcional',
      context: 'Adesão consistente após migração dos treinos de força para a manhã.',
      tag: 'Metas em dia',
      tone: 'green',
      category: 'Força & Hábitos',
      icon: CheckCircle2,
      suggestedAction: 'Aprovar relatório mensal na consulta das 14:00.',
      timeAgo: 'Ontem · 18:40',
      keyMetric: { label: 'Adesão / Força', val: '88% · +12%' },
    },
    {
      patient: 'Rodrigo Albuquerque',
      patientId: 'rodrigo-albuquerque',
      title: 'Metas em dia: 94% de adesão e glicemia de jejum 92 mg/dL',
      context: 'Excelente resposta à restrição de ultraprocessados com perda de 3,2 kg.',
      tag: 'Metas em dia',
      tone: 'green',
      category: 'Metabolismo & Glicemia',
      icon: CheckCircle2,
      suggestedAction: 'Manter posologia de metformina de liberação lenta.',
      timeAgo: 'Hoje · 07:45',
      keyMetric: { label: 'HOMA-IR', val: '1.8 (otimizado)' },
    },
  ]

  // Filter alerts according to both the quick cards filter and local filterTag
  const filteredAlerts = alerts.filter((a) => {
    if (activeStatusFilter === 'regulares') {
      return a.tone === 'green'
    }
    if (activeStatusFilter === 'atrasados') {
      return a.tone === 'amber'
    }
    if (activeStatusFilter === 'atencao') {
      return a.tone === 'rose'
    }

    // Default 'all' view shows active exception cases
    if (filterTag === 'priority') return a.tone === 'amber'
    if (filterTag === 'symptom') return a.tone === 'rose'
    if (filterTag === 'report') return a.tone === 'blue' || a.category.includes('Documento')
    return a.tone === 'rose' || a.tone === 'amber'
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header / Greeting Section - Warm, Clean & Editorial */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#112822] via-[#17372f] to-[#1e483e] p-6 sm:p-8 text-white shadow-[0_16px_36px_rgba(17,40,34,0.18)]">
        {/* Subtle background glow circle */}
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-[#206354]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 size-56 rounded-full bg-[#e49d45]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#cbe2da] border border-white/10">
                <Calendar className="size-3.5 text-[#9fe0ce]" />
                Terça-feira, 25 de agosto de 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9fe0ce]/15 px-3 py-1 text-xs font-semibold text-[#a6ecd9] border border-[#9fe0ce]/20">
                <Activity className="size-3 text-[#9fe0ce]" />5 Consultas no dia
              </span>
            </div>

            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-tight">
                Bom dia, Dr. Guilherme
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#b6d3ca] max-w-2xl font-light leading-relaxed">
                Você tem <strong className="font-semibold text-white">5 consultas agendadas</strong>{' '}
                e{' '}
                <strong className="font-semibold text-[#fcd690]">
                  3 pacientes demandando atenção
                </strong>{' '}
                clínica hoje.
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              disabled={nudged}
              onClick={nudgeDelayedPatients}
              className={`group flex items-center gap-2.5 min-h-[46px] rounded-[18px] px-5 text-xs font-bold transition-all shadow-md ${
                nudged
                  ? 'bg-white/15 text-[#b9d5cc] cursor-default border border-white/10'
                  : 'bg-[#9fe0ce] text-[#0d2a23] hover:bg-[#bdf3e5] hover:shadow-[0_8px_20px_rgba(159,224,206,0.35)] active:scale-[0.98]'
              }`}
            >
              {nudged ? (
                <>
                  <Check className="size-4 text-[#9fe0ce]" />
                  <span>Lembrete enviado aos 4 atrasados</span>
                </>
              ) : (
                <>
                  <Send className="size-4 text-[#0d2a23] transition-transform group-hover:translate-x-0.5" />
                  <span>Enviar lembrete aos 4 atrasados</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. 5 Cards de Status Rápido (Design Fiel à Imagem) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: TOTAL CARTEIRA */}
        <button
          type="button"
          onClick={() => navigate('/medico/pacientes')}
          className={`group flex flex-col justify-between rounded-[22px] border bg-white p-5 text-left shadow-[0_2px_12px_rgba(17,40,34,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,40,34,0.08)] ${
            activeStatusFilter === 'all'
              ? 'border-[#DEE7E2] hover:border-[#097260]/50'
              : 'border-[#DEE7E2] opacity-85 hover:opacity-100 hover:border-[#097260]/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#556D66] uppercase">
                TOTAL CARTEIRA
              </span>
              <Users className="size-4 text-[#8C9E97] transition-colors group-hover:text-[#097260]" />
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-[38px] font-bold leading-none text-[#112822]">
                {totalCount}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-transparent pt-1 text-[13px] text-[#556D66]">
            <span>Pacientes em ciclo</span>
            <ChevronRight className="size-4 text-[#8C9E97] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#097260]" />
          </div>
        </button>

        {/* Card 2: REGULARES */}
        <button
          type="button"
          onClick={() => {
            const nextFilter = activeStatusFilter === 'regulares' ? 'all' : 'regulares'
            setActiveStatusFilter(nextFilter)
            document.getElementById('atencao-box')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className={`group flex flex-col justify-between rounded-[22px] border bg-white p-5 text-left shadow-[0_2px_12px_rgba(17,40,34,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(9,114,96,0.1)] ${
            activeStatusFilter === 'regulares'
              ? 'border-[#097260] ring-2 ring-[#097260]/20'
              : 'border-[#DEE7E2] hover:border-[#097260]/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#097260] uppercase">
                REGULARES
              </span>
              <CheckCircle className="size-4 text-[#097260]" />
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-[38px] font-bold leading-none text-[#097260]">
                {regularesCount}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-transparent pt-1 text-[13px] text-[#556D66]">
            <span>Metas em dia</span>
            <ChevronRight className="size-4 text-[#097260] transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </button>

        {/* Card 3: ATRASADOS (com Ação de Cutucão Integrada) */}
        <div
          className={`group relative flex flex-col justify-between rounded-[22px] border bg-white p-5 text-left shadow-[0_2px_12px_rgba(17,40,34,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(197,125,25,0.12)] ${
            activeStatusFilter === 'atrasados'
              ? 'border-[#C57D19] ring-2 ring-[#C57D19]/20'
              : 'border-[#DEE7E2] hover:border-[#C57D19]/50'
          }`}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              const nextFilter = activeStatusFilter === 'atrasados' ? 'all' : 'atrasados'
              setActiveStatusFilter(nextFilter)
              document.getElementById('atencao-box')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#C57D19] uppercase">
                ATRASADOS
              </span>
              <Clock className="size-4 text-[#C57D19]" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="font-serif text-[38px] font-bold leading-none text-[#C57D19]">
                {atrasadosCount}
              </span>
              <span className="text-[11px] font-medium text-[#556D66]">&gt; 48h sem diário</span>
            </div>
          </div>

          {/* Direct Nudge Button in Card */}
          <div className="mt-3.5 pt-3 border-t border-[#F3F7F5]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setNudgeConfirmGroup('atrasados')
              }}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                nudged
                  ? 'bg-[#FEF7E7] text-[#7D5308] border border-[#F8DEB0]'
                  : 'bg-[#C57D19] text-white hover:bg-[#a7660f] shadow-xs active:scale-[0.98]'
              }`}
            >
              {nudged ? (
                <>
                  <Check className="size-3.5 text-[#C57D19]" />
                  <span>Cutucão Enviado (4)</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Cutucar 4 Atrasados</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 4: ATENÇÃO (com Ação de Cutucão / Lembrete Prioritário) */}
        <div
          className={`group relative flex flex-col justify-between rounded-[22px] border bg-white p-5 text-left shadow-[0_2px_12px_rgba(17,40,34,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(179,38,30,0.12)] ${
            activeStatusFilter === 'atencao'
              ? 'border-[#B3261E] ring-2 ring-[#B3261E]/20'
              : 'border-[#DEE7E2] hover:border-[#B3261E]/50'
          }`}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              const nextFilter = activeStatusFilter === 'atencao' ? 'all' : 'atencao'
              setActiveStatusFilter(nextFilter)
              document.getElementById('atencao-box')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#9A221A] uppercase">
                ATENÇÃO
              </span>
              <AlertTriangle className="size-4 text-[#B3261E]" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="font-serif text-[38px] font-bold leading-none text-[#9A221A]">
                {atencaoCount}
              </span>
              <span className="text-[11px] font-medium text-[#556D66]">
                Sintomas na pré-consulta
              </span>
            </div>
          </div>

          {/* Direct Nudge Button in Card */}
          <div className="mt-3.5 pt-3 border-t border-[#F3F7F5]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setNudgeConfirmGroup('atencao')
              }}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                attentionNudged
                  ? 'bg-[#FCF0EE] text-[#8E2E28] border border-[#F5C7C2]'
                  : 'bg-[#B3261E] text-white hover:bg-[#961e17] shadow-xs active:scale-[0.98]'
              }`}
            >
              {attentionNudged ? (
                <>
                  <Check className="size-3.5 text-[#B3261E]" />
                  <span>Contato Prioritário (3)</span>
                </>
              ) : (
                <>
                  <Zap className="size-3.5" />
                  <span>Cutucar 3 em Atenção</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 5: RELATÓRIOS */}
        <button
          type="button"
          onClick={() => navigate('/medico/relatorios')}
          className="group flex flex-col justify-between rounded-[22px] border border-[#DEE7E2] bg-white p-5 text-left shadow-[0_2px_12px_rgba(17,40,34,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#097260]/50 hover:shadow-[0_8px_24px_rgba(9,114,96,0.1)]"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#097260] uppercase">
                RELATÓRIOS
              </span>
              <FileText className="size-4 text-[#097260]" />
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-[38px] font-bold leading-none text-[#112822]">
                {relatoriosCount}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-transparent pt-1 text-[13px] text-[#556D66]">
            <span>Evolução da carteira</span>
            <ChevronRight className="size-4 text-[#097260] transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </button>
      </section>

      {/* 2.5 Gráfico de Tendência Semanal de Adesão da Carteira (Novo Requisito 2) */}
      <section
        role="region"
        aria-label="Tendência semanal de adesão da carteira de pacientes"
        className="rounded-[24px] border border-[#DEE7E2] bg-white p-6 sm:p-7 shadow-[0_2px_14px_rgba(17,40,34,0.04)] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F3F7F5] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#EAF3EF] text-[#097260]">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                  Tendência Semanal de Adesão da Carteira
                </h2>
                <StatusBadge tone="green">87% Adesão Global (+8 p.p.)</StatusBadge>
              </div>
              <p className="text-xs text-[#556D66]">
                Evolução contínua nas últimas 5 semanas · 22 pacientes ativos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#556D66]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-[#097260]" /> Adesão Média (%)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-[#C57D19]" /> Atrasados (&gt;48h)
            </span>
          </div>
        </div>

        {/* Accessible Bar & Curve Visual Representation with clear axes and text summary */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#556D66] px-2">
            <span>Eixo Y: Taxa de Adesão Média (%)</span>
            <span>Eixo X: Período (Últimas 5 semanas)</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-4 bg-[#F8FAF9] p-4 sm:p-6 rounded-2xl border border-[#DEE7E2]">
            {cohortWeeklyAdherence.map((point, idx) => {
              const isCurrent = idx === cohortWeeklyAdherence.length - 1
              // Scaled height: 70% to 100% mapped to height
              const heightPct = Math.max(
                25,
                Math.min(100, ((point.adherence - 65) / (95 - 65)) * 100),
              )

              return (
                <div
                  key={point.week}
                  className="flex flex-col items-center justify-end gap-2 group"
                >
                  <div className="text-center">
                    <span className="font-serif text-sm sm:text-base font-bold text-[#112822] block">
                      {point.adherence}%
                    </span>
                    <span className="text-[10px] text-[#556D66] hidden sm:block">
                      {point.regularCount} em dia · {point.delayedCount} atr.
                    </span>
                  </div>

                  <div className="relative w-full max-w-[56px] h-32 flex items-end justify-center rounded-xl bg-white/70 p-1 border border-[#DEE7E2]/60">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 group-hover:brightness-105 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-[#097260] to-[#25a18a] shadow-sm'
                          : 'bg-[#9FE0CE]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${point.label}: ${point.adherence}% de adesão`}
                    />
                  </div>

                  <div className="text-center">
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent ? 'text-[#097260]' : 'text-[#112822]'
                      }`}
                    >
                      {point.week}
                    </span>
                    <span className="text-[10px] text-[#556D66] block">{point.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Accessible Textual Summary of Principal Trend (Independent of Color) */}
          <div className="rounded-2xl border border-[#DEE7E2] bg-[#FDFCFA] p-4 text-xs text-[#112822] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#097260] flex items-center gap-1">
                <Info className="size-3.5 text-[#097260]" />
                Resumo Textual da Tendência Longitudinal:
              </span>
            </div>
            <p className="text-xs text-[#556D66] leading-relaxed">
              A carteira apresentou{' '}
              <strong className="text-[#112822] font-semibold">
                evolução positiva contínua
              </strong>{' '}
              de{' '}
              <strong className="text-[#112822] font-semibold">
                79% (Semana 1) para 87% (Semana 5 Atual)
              </strong>
              , com redução de 6 para 4 pacientes atrasados após o envio periódico de cutucões e
              maior engajamento nos check-ins pós-consulta.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Two-Column Layout: Attention Box (Primary) & Today's Timeline */}
      <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
        {/* Left Column: Caixa de Atenção Organizada por Exceção */}
        <section id="atencao-box" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-xl bg-[#FEEED1] text-[#C57D19]">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                  Caixa de Atenção
                </h2>
                <p className="text-xs text-[#556D66]">Organizada por exceção clínica</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 rounded-xl bg-[#EAF3EF]/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveStatusFilter('all')
                  setFilterTag('all')
                }}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  activeStatusFilter === 'all' && filterTag === 'all'
                    ? 'bg-white text-[#112822] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveStatusFilter('regulares')
                }}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  activeStatusFilter === 'regulares'
                    ? 'bg-white text-[#097260] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Regulares (15)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveStatusFilter('atrasados')
                }}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  activeStatusFilter === 'atrasados'
                    ? 'bg-white text-[#7D5308] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Atrasados (4)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveStatusFilter('atencao')
                }}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  activeStatusFilter === 'atencao'
                    ? 'bg-white text-[#8E2E28] shadow-2xs'
                    : 'text-[#556D66] hover:text-[#112822]'
                }`}
              >
                Atenção (3)
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {filteredAlerts.map((al) => {
              const IconComponent = al.icon
              const isHighlight = al.patientId === 'marina-costa'
              return (
                <div
                  key={al.patient}
                  onClick={() => setSelectedAlert(al)}
                  className={`group relative cursor-pointer rounded-[20px] border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,40,34,0.06)] ${
                    isHighlight
                      ? 'border-[#C57D19]/40 bg-gradient-to-r from-[#FEFBF5] to-white ring-1 ring-[#C57D19]/20'
                      : 'border-[#DEE7E2] hover:border-[#097260]/40'
                  }`}
                >
                  {/* Top line: Patient + Clinical Reason Tag + Action */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center rounded-xl text-xs font-bold ${
                          al.tone === 'amber'
                            ? 'bg-[#FEEED1] text-[#7D5308]'
                            : al.tone === 'rose'
                              ? 'bg-[#FCF0EE] text-[#8E2E28]'
                              : al.tone === 'green'
                                ? 'bg-[#EAF3EF] text-[#075F50]'
                                : 'bg-[#EFF5FC] text-[#244C77]'
                        }`}
                      >
                        <IconComponent className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#112822]">{al.patient}</h3>
                          <span className="text-[11px] text-[#556D66]">· {al.timeAgo}</span>
                          {nudgedPatientIds.includes(al.patientId) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EF] px-2 py-0.5 text-[10px] font-bold text-[#075f50] border border-[#BFE4D8]">
                              <Check className="size-3" /> Lembrete ativo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#556D66]">
                          {al.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge tone={al.tone}>{al.tag}</StatusBadge>
                    </div>
                  </div>

                  {/* Middle: Clinical observation */}
                  <div className="mt-3.5 pl-12 space-y-1">
                    <p className="font-semibold text-xs sm:text-sm text-[#112822] leading-snug">
                      {al.title}
                    </p>
                    <p className="text-xs text-[#556D66] leading-relaxed line-clamp-2">
                      {al.context}
                    </p>
                  </div>

                  {/* Bottom: Action bar */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F3F7F5] pl-12 pt-3">
                    {al.keyMetric ? (
                      <div className="text-[11px] text-[#556D66] flex items-center gap-1.5">
                        <span>{al.keyMetric.label}:</span>
                        <strong className="font-bold text-[#112822]">{al.keyMetric.val}</strong>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#097260] transition-colors group-hover:text-[#075f50]">
                      <span>Revisar Contexto Completo</span>
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* AI Disclaimer Box - Secondary & Elegant */}
          <div className="rounded-[18px] border border-[#DEE7E2] bg-[#F5F8F6] p-4 text-xs text-[#556D66] transition-colors hover:bg-white">
            <div className="flex items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#EAF3EF] text-[#097260] mt-0.5">
                <Sparkles className="size-3.5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#112822]">
                    Apoio Clínico Estruturado
                  </span>
                  <span className="rounded-full bg-[#EAF3EF] px-2 py-0.5 text-[10px] font-semibold text-[#097260]">
                    IA Auxiliar
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#556D66]">
                  Rascunhos de síntese organizados a partir de biossinais e relatos. Nenhuma
                  conduta, prescrição ou diagnóstico é emitido de forma autônoma.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Timeline of Today's Consultations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-xl bg-[#EAF3EF] text-[#097260]">
                <Clock className="size-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#112822]">
                  Agenda do Dia
                </h2>
                <p className="text-xs text-[#556D66]">Linha do tempo das consultas</p>
              </div>
            </div>
            <Link
              to="/medico/agenda"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#097260] hover:text-[#075f50] hover:underline"
            >
              <span>Ver completa</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Timeline list */}
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#DEE7E2]">
            {appointments.map((apt) => {
              const isNext = apt.status === 'Próxima' || apt.patient === 'Marina Costa'
              const isCompleted = apt.status === 'Concluída'

              return (
                <div key={apt.id} className="relative group">
                  {/* Timeline marker node */}
                  <div
                    className={`absolute -left-6 top-5 size-3 rounded-full border-2 bg-white transition-all ${
                      isNext
                        ? 'border-[#097260] bg-[#097260] ring-4 ring-[#097260]/15'
                        : isCompleted
                          ? 'border-[#556D66] bg-[#556D66]'
                          : 'border-[#DEE7E2] bg-white group-hover:border-[#097260]'
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`rounded-[20px] border p-4.5 sm:p-5 transition-all duration-200 ${
                      isNext
                        ? 'border-[#097260] bg-white ring-2 ring-[#097260]/10 shadow-[0_8px_20px_rgba(9,114,96,0.08)]'
                        : isCompleted
                          ? 'border-[#DEE7E2] bg-[#FDFCFA]/70 opacity-90'
                          : 'border-[#DEE7E2] bg-white hover:border-[#097260]/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#112822] bg-[#F5F8F6] px-2.5 py-1 rounded-lg border border-[#DEE7E2]">
                          {apt.time}
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-[#112822] block">
                            {apt.patient}
                          </strong>
                        </div>
                      </div>
                      <StatusBadge tone={apt.statusTone}>{apt.status}</StatusBadge>
                    </div>

                    <p className="text-xs text-[#556D66] mb-3">
                      {apt.type} · <span className="italic font-medium">{apt.preVisit}</span>
                    </p>

                    <div className="flex items-center justify-between gap-2 border-t border-[#F3F7F5] pt-3">
                      <Link
                        to={`/medico/pacientes/${apt.patient.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-semibold text-[#556D66] hover:text-[#112822] transition-colors"
                      >
                        Prontuário Longitudinal
                      </Link>

                      <Link
                        to={`/medico/consulta/${apt.id}`}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                          isNext
                            ? 'text-[#097260] hover:text-[#075f50] hover:underline'
                            : 'text-[#556D66] hover:text-[#112822]'
                        }`}
                      >
                        <span>Entrar na Consulta</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* 4. Nudge Confirmation Modal (Requisito 3: confirmação prévia e feedback claro) */}
      {nudgeConfirmGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setNudgeConfirmGroup(null)}
        >
          <div
            className="w-full max-w-md rounded-[24px] border border-[#DEE7E2] bg-white p-6 shadow-2xl animate-fade-in-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-[#F3F7F5] pb-3">
              <div
                className={`grid size-10 shrink-0 place-items-center rounded-2xl ${
                  nudgeConfirmGroup === 'atrasados'
                    ? 'bg-[#FEEED1] text-[#7D5308]'
                    : 'bg-[#FCF0EE] text-[#8E2E28]'
                }`}
              >
                <Send className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#112822]">
                  {nudgeConfirmGroup === 'atrasados'
                    ? 'Confirmar Cutucão aos 4 Pacientes Atrasados'
                    : 'Confirmar Contato Prioritário aos 3 Pacientes em Atenção'}
                </h3>
                <p className="text-xs text-[#556D66]">
                  Ação simulada de engajamento do Instituto Vivans
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#556D66] leading-relaxed">
              <p>
                {nudgeConfirmGroup === 'atrasados'
                  ? 'Será enviado um lembrete empático via app para os 4 pacientes sem registro de diário há mais de 48h (Carlos Silva, Felipe Vasconcelos, Marcelo Tavares e Thiago Carvalho).'
                  : 'Será disparada uma notificação prioritária aos 3 pacientes com sintomas ou pontos de atenção (Marina Costa, Paulo Mendes e Rafael Lima) para que revisem suas pré-consultas.'}
              </p>
              <div className="rounded-xl bg-[#F5F8F6] p-3 border border-[#DEE7E2] text-[11px] text-[#112822]">
                <strong>Mensagem modelo:</strong> “Olá! O Dr. Guilherme notou a ausência de
                registros e gostaria de saber como você está se sentindo hoje.”
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F3F7F5]">
              <button
                type="button"
                onClick={() => setNudgeConfirmGroup(null)}
                className="min-h-10 rounded-[14px] border border-[#DEE7E2] px-4 text-xs font-bold text-[#556D66] hover:bg-[#F5F8F6]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (nudgeConfirmGroup === 'atrasados') {
                    nudgeDelayedPatients()
                  } else {
                    nudgeAttentionPatients()
                  }
                  setNudgeConfirmGroup(null)
                }}
                className={`min-h-10 rounded-[14px] px-5 text-xs font-bold text-white shadow-sm transition-colors ${
                  nudgeConfirmGroup === 'atrasados'
                    ? 'bg-[#C57D19] hover:bg-[#a7660f]'
                    : 'bg-[#B3261E] hover:bg-[#961e17]'
                }`}
              >
                Confirmar e Enviar Lembretes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Alert Detail / Clinical Context Drawer Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] border border-[#DEE7E2] bg-white p-6 sm:p-7 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F3F7F5] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`grid size-10 place-items-center rounded-2xl ${
                    selectedAlert.tone === 'amber'
                      ? 'bg-[#FEEED1] text-[#C57D19]'
                      : selectedAlert.tone === 'rose'
                        ? 'bg-[#FCF0EE] text-[#B3261E]'
                        : selectedAlert.tone === 'green'
                          ? 'bg-[#EAF3EF] text-[#097260]'
                          : 'bg-[#EFF5FC] text-[#244C77]'
                  }`}
                >
                  <selectedAlert.icon className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#112822]">
                      {selectedAlert.patient}
                    </h3>
                    <StatusBadge tone={selectedAlert.tone}>{selectedAlert.tag}</StatusBadge>
                  </div>
                  <p className="text-xs text-[#556D66]">
                    {selectedAlert.category} · {selectedAlert.timeAgo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="rounded-full p-1.5 text-[#556D66] hover:bg-[#F5F8F6] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-xs leading-relaxed text-[#556D66]">
              <div className="space-y-1.5">
                <strong className="text-sm font-bold text-[#112822] block">
                  {selectedAlert.title}
                </strong>
                <p className="text-xs text-[#556D66] leading-relaxed">{selectedAlert.context}</p>
              </div>

              {selectedAlert.keyMetric && (
                <div className="flex items-center justify-between rounded-xl border border-[#DEE7E2] bg-[#FDFCFA] px-4 py-2.5">
                  <span className="font-medium text-[#556D66]">
                    {selectedAlert.keyMetric.label}
                  </span>
                  <span className="font-bold text-[#112822]">{selectedAlert.keyMetric.val}</span>
                </div>
              )}

              {/* Recommended Clinical Action */}
              <div className="rounded-[18px] bg-[#EAF3EF]/70 border border-[#DEE7E2] p-4 text-[#112822] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-[#097260]">
                  <Stethoscope className="size-3.5" />
                  <span>Conduta Recomendada para o Médico:</span>
                </div>
                <p className="text-xs font-semibold text-[#112822]">
                  {selectedAlert.suggestedAction}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#556D66]">
                  <li>Cruzar dados históricos no prontuário longitudinal.</li>
                  <li>Avaliar no atendimento clínico sem decisão autônoma prévia do sistema.</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="min-h-10 rounded-[14px] border border-[#DEE7E2] px-4 text-xs font-bold text-[#556D66] hover:bg-[#F5F8F6] transition-colors"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedAlert.patientId
                  setSelectedAlert(null)
                  navigate(`/medico/pacientes/${targetId}`)
                }}
                className="min-h-10 rounded-[14px] bg-[#097260] px-5 text-xs font-bold text-white hover:bg-[#075f50] transition-colors shadow-sm"
              >
                Abrir Prontuário Longitudinal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
