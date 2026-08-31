import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer, UrgentCareWarning } from '@/components/CommonUI'
import {
  TrendingDown,
  TrendingUp,
  Moon,
  Activity,
  Footprints,
  Target,
  ChevronDown,
  Info,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export default function PatientEvolution() {
  const { selectedPatient, returnJourney, scheduledCheckins = [] } = useVivans()
  const [selectedPeriod, setSelectedPeriod] = useState<'4 semanas' | '8 semanas' | '12 semanas'>(
    '4 semanas',
  )
  const [activeTab, setActiveTab] = useState<'adesao' | 'peso' | 'sono' | 'atividade'>('adesao')
  const [showAdherenceExplain, setShowAdherenceExplain] = useState(false)

  // Evolution data for Marina Costa
  const history = selectedPatient?.evolutionHistory || [
    { date: '28 jul', adherence: 74, weight: 80.5, sleepHours: 6.3, steps: 5600 },
    { date: '01 ago', adherence: 76, weight: 80.0, sleepHours: 6.2, steps: 5800 },
    { date: '08 ago', adherence: 79, weight: 79.4, sleepHours: 6.0, steps: 6100 },
    { date: '15 ago', adherence: 82, weight: 78.8, sleepHours: 6.1, steps: 6350 },
    { date: '22 ago', adherence: 80, weight: 78.4, sleepHours: 5.7, steps: 6400 },
    { date: '25 ago', adherence: 82, weight: 78.2, sleepHours: 5.7, steps: 6420 },
  ]

  const currentWeight = selectedPatient?.currentWeight ?? 78.2
  const startWeight = selectedPatient?.startWeight ?? 80.0
  const targetWeight = selectedPatient?.targetWeight ?? 72.0
  const currentAdherence = 82
  const startAdherence = 74

  const totalLost = (startWeight - currentWeight).toFixed(1)
  const remainingToGoal = (currentWeight - targetWeight).toFixed(1)
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)),
  )

  const completedCheckins = scheduledCheckins.filter((c) => c.status === 'concluido').length
  const totalCheckins = scheduledCheckins.length

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Evolução e Indicadores de Saúde · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
              Evolução
            </span>
            <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sua Trajetória de Saúde
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#ADADAD] max-w-xl">
            Acompanhamento de adesão ao plano, variação de peso, ritmo de sono e movimento diário.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
          {(['4 semanas', '8 semanas', '12 semanas'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                  : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Card: Quanto falta para o objetivo & Resumo Textual Acessível */}
      <article className="overflow-hidden rounded-3xl border border-[#D6B270]/30 bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] p-6 sm:p-8 text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D6B270]/20 border border-[#D6B270]/30 px-3 py-1 text-xs font-bold text-[#E8C391] mb-3">
              <Target className="size-3.5 text-[#D6B270]" />
              <span>Progresso Ponderal Gradual &amp; Sustentável</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Faltam {remainingToGoal} kg para seu objetivo final
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-lg">
              Você já eliminou <strong className="text-white">{totalLost} kg</strong> (de{' '}
              {startWeight.toFixed(1)} kg para {currentWeight.toFixed(1)} kg) em 29 dias, com ganho
              de consistência e estabilização de hábitos.
            </p>

            {/* Visual Bar Gauge with Accessible Labels */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#ADADAD]">
                <span>Início ({startWeight.toFixed(1)} kg)</span>
                <span className="text-[#D6B270] font-bold text-sm">
                  {progressPercent}% do trajeto
                </span>
                <span>Objetivo ({targetWeight.toFixed(1)} kg)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#B8935A] via-[#D6B270] to-[#E8C391] transition-all duration-700 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso ponderal de ${progressPercent}%`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div>
              <p className="text-[10px] text-[#ADADAD] uppercase tracking-wider font-bold">
                Adesão ao Plano
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-0.5 text-white">
                {currentAdherence}%
              </p>
              <span className="text-[10px] text-[#D6B270] font-semibold">+8% desde o início</span>
            </div>
            <div>
              <p className="text-[10px] text-[#ADADAD] uppercase tracking-wider font-bold">
                Peso Atual
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-0.5 text-white">{currentWeight} kg</p>
              <span className="text-[10px] text-[#D6B270] font-semibold">−1,8 kg no ciclo</span>
            </div>
            <div>
              <p className="text-[10px] text-[#ADADAD] uppercase tracking-wider font-bold">
                Sono Médio
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-0.5 text-white">5h42</p>
              <span className="text-[10px] text-[#F59E0B] font-semibold">Despertares às 3h</span>
            </div>
            <div>
              <p className="text-[10px] text-[#ADADAD] uppercase tracking-wider font-bold">
                Passos Diários
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-0.5 text-white">6.420</p>
              <span className="text-[10px] text-[#D6B270] font-semibold">Meta 6.000 atingida</span>
            </div>
          </div>
        </div>
      </article>

      {/* METRIC TABS SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-[#333333] bg-[#141414] p-1 shadow-inner backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('adesao')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'adesao'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="size-4" />
            <span>Tendência de Adesão (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('peso')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'peso'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingDown className="size-4" />
            <span>Curva Ponderal (kg)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sono')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sono'
                ? 'bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] shadow-sm'
                : 'text-[#ADADAD] hover:text-white hover:bg-white/5'
            }`}
          >
            <Moon className="size-4" />
            <span>Sono &amp; Repouso</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAdherenceExplain(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#D6B270] hover:underline underline-offset-4 cursor-pointer"
        >
          <HelpCircle className="size-4" />
          <span>Como a adesão é explicada?</span>
        </button>
      </div>

      {/* TAB 1: TENDÊNCIA DE ADESÃO */}
      {activeTab === 'adesao' && (
        <article
          role="region"
          aria-label="Gráfico de tendência de adesão ao plano em porcentagem"
          className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-[#D6B270]" />
                <h2 className="font-serif text-xl font-bold text-white">
                  Evolução da Adesão ao Plano de Cuidado
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Eixo Y: Adesão em porcentagem (%) · Período: Últimas 4 semanas
              </p>
            </div>
            <StatusBadge tone="green">Tendência Positiva (+8 p.p.)</StatusBadge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#ADADAD] px-1">
              <span>Escala: 0% a 100% (Meta Vivans &ge; 80%)</span>
              <span className="font-semibold text-[#D6B270]">Média atual: 82%</span>
            </div>

            <div className="flex items-end justify-between h-48 pt-6 px-3 border-b border-[#333333] bg-[#0F0F0F] rounded-2xl p-4 gap-2">
              {history.map((pt) => {
                const heightPct = Math.max(10, Math.min(100, pt.adherence))
                return (
                  <div key={pt.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-bold text-white">{pt.adherence}%</span>
                    <div
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-[#B8935A] to-[#D6B270] hover:brightness-110 transition-all shadow-sm"
                      style={{ height: `${heightPct}%` }}
                      title={`${pt.date}: Adesão de ${pt.adherence}%`}
                    />
                    <span className="text-[11px] font-medium text-[#ADADAD]">{pt.date}</span>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl bg-[#D6B270]/10 border border-[#D6B270]/30 p-4 text-xs text-[#E8C391] space-y-1.5 backdrop-blur-sm">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#D6B270]">
                Resumo Acessível de Tendência:
              </p>
              <p className="leading-relaxed text-[#CCCCCC]">
                Sua adesão cresceu gradualmente de <strong className="text-white">74%</strong> em 28
                de julho para <strong className="text-white">82%</strong> na medição mais recente de
                25 de agosto (+8 pontos percentuais). Você atingiu a faixa recomendada de
                consistência sustentável (&ge; 80%).
              </p>
            </div>
          </div>
        </article>
      )}

      {/* TAB 2: CURVA PONDERAL EM KG */}
      {activeTab === 'peso' && (
        <article
          role="region"
          aria-label="Gráfico de evolução ponderal em quilogramas"
          className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="size-5 text-[#D6B270]" />
                <h2 className="font-serif text-xl font-bold text-white">
                  Curva de Peso Corporal (kg)
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Eixo Y: Peso em quilogramas (kg) · Balança conectada
              </p>
            </div>
            <StatusBadge tone="green">−1,8 kg acumulado</StatusBadge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#ADADAD] px-1">
              <span>Início: 80,0 kg &rarr; Atual: 78,2 kg &rarr; Meta: 72,0 kg</span>
              <span className="font-semibold text-[#D6B270]">Ritmo: ~450g/semana</span>
            </div>

            <div className="flex items-end justify-between h-48 pt-6 px-3 border-b border-[#333333] bg-[#0F0F0F] rounded-2xl p-4 gap-2">
              {history.map((pt) => {
                const heightPct = Math.max(
                  15,
                  Math.min(100, (((pt.weight || 80) - 70) / (82 - 70)) * 100),
                )
                return (
                  <div key={pt.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-bold text-white">{pt.weight?.toFixed(1)} kg</span>
                    <div
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-[#B8935A] to-[#D6B270] hover:brightness-110 transition-all shadow-sm"
                      style={{ height: `${heightPct}%` }}
                      title={`${pt.date}: ${pt.weight} kg`}
                    />
                    <span className="text-[11px] font-medium text-[#ADADAD]">{pt.date}</span>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl bg-[#D6B270]/10 border border-[#D6B270]/30 p-4 text-xs text-[#E8C391] space-y-1 backdrop-blur-sm">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#D6B270]">
                Interpretação Médica Alinhada:
              </p>
              <p className="leading-relaxed text-[#CCCCCC]">
                Perda de peso consistente e sustentável de 1,8 kg em 4 semanas sem relatos de
                fraqueza, mantendo aporte proteico e saciedade.
              </p>
            </div>
          </div>
        </article>
      )}

      {/* TAB 3: SONO & RITMO CIRCADIANO */}
      {activeTab === 'sono' && (
        <article
          role="region"
          aria-label="Dados de sono e recuperação circadiana"
          className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Moon className="size-5 text-[#E8C391]" />
                <h2 className="font-serif text-xl font-bold text-white">
                  Sono &amp; Ritmo Circadiano
                </h2>
              </div>
              <p className="text-xs text-[#ADADAD] mt-0.5">
                Horas totais de descanso por noite · Rastreador wearable
              </p>
            </div>
            <StatusBadge tone="amber">Ponto de Atenção Clínica</StatusBadge>
          </div>

          <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-xs text-[#FCD34D] leading-relaxed space-y-1">
            <p className="font-bold text-[#FCD34D]">Padrão observado nos últimos 4 dias:</p>
            <p>
              Média de <strong>5h42 de sono</strong> por noite com episódios repetidos de despertar
              por volta das 3h da manhã. O Dr. Guilherme Martins avaliará a correlação com o horário
              do jantar (antecipando para as 19h30).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#0F0F0F] p-3.5 border border-[#333333]">
              <p className="text-[10px] uppercase font-bold text-[#888888]">Média 7 Dias</p>
              <p className="text-xl font-bold text-white mt-1">5h42</p>
              <span className="text-[10px] text-[#F59E0B] font-medium">Abaixo de 7h</span>
            </div>
            <div className="rounded-2xl bg-[#0F0F0F] p-3.5 border border-[#333333]">
              <p className="text-[10px] uppercase font-bold text-[#888888]">Eficiência</p>
              <p className="text-xl font-bold text-white mt-1">78%</p>
              <span className="text-[10px] text-[#ADADAD]">Fragmentado</span>
            </div>
            <div className="rounded-2xl bg-[#0F0F0F] p-3.5 border border-[#333333]">
              <p className="text-[10px] uppercase font-bold text-[#888888]">Despertares 3h</p>
              <p className="text-xl font-bold text-[#F59E0B] mt-1">4 noites</p>
              <span className="text-[10px] text-[#F59E0B] font-medium">Em investigação</span>
            </div>
          </div>
        </article>
      )}

      {/* CHECK-INS PROGRAMADOS DE RETORNO */}
      <article className="rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-sm space-y-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6B270]">
              Jornada Pós-Consulta
            </span>
            <h3 className="font-serif text-xl font-bold text-white">
              Progresso dos Check-ins de Retorno ({completedCheckins}/{totalCheckins})
            </h3>
          </div>
          <StatusBadge tone="green">Plano Ativo</StatusBadge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scheduledCheckins.map((chk) => (
            <div
              key={chk.id}
              className={`rounded-2xl border p-3.5 text-xs flex flex-col justify-between ${
                chk.status === 'concluido'
                  ? 'border-[#D6B270]/30 bg-[#D6B270]/10'
                  : 'border-[#333333] bg-[#141414]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <strong className="text-[#D6B270]">Dia {chk.dayOffset}</strong>
                  <span className="text-[#ADADAD]">{chk.scheduledDate}</span>
                </div>
                <p className="font-semibold text-white">{chk.title}</p>
                {chk.value && (
                  <p className="mt-1 text-[11px] text-[#E8C391] font-bold">
                    Resultado: {chk.value}
                  </p>
                )}
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] text-[#ADADAD]">
                {chk.status === 'concluido' ? `✓ Realizado (${chk.completedAt})` : '• Pendente'}
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* ADHERENCE MODAL */}
      {showAdherenceExplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-2xl space-y-4 animate-fade-in-up text-white">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/30">
                  <Activity className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Como a adesão é compreendida no Vivans?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdherenceExplain(false)}
                className="text-[#ADADAD] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#CCCCCC] leading-relaxed">
              <p>
                No Instituto Vivans, <strong className="text-white">adesão</strong> reflete a
                consistência da sua rotina, sem caráter punitivo ou julgamento.
              </p>
              <div className="rounded-2xl bg-[#0F0F0F] border border-[#333333] p-3.5 space-y-1.5 text-white">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#D6B270]">
                  Fórmula do Protótipo:
                </p>
                <p className="text-xs text-[#ADADAD]">
                  Combinação das orientações médicas cumpridas, check-ins de retorno preenchidos e
                  refeições registradas ao longo do ciclo de 90 dias.
                </p>
              </div>
              <p>
                O Dr. Guilherme utiliza esses dados para entender como o tratamento se adapta à sua
                vida, permitindo ajustes acolhedores e sustentáveis.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAdherenceExplain(false)}
                className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs font-bold text-[#0F0F0F] hover:brightness-110 cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      <UrgentCareWarning />
    </div>
  )
}
