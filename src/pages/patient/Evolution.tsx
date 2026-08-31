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

  // Evolution data for Marina Costa (centralized & coherent with doctor view)
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
      <SimulationDisclaimer text="Acompanhamento Longitudinal de Evolução · Instituto Vivans · Dados de Adesão, Peso e Biossinais" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Evolução Longitudinal
            </span>
            <StatusBadge tone="green">Dr. Guilherme Martins</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#17372f]">
            Sua Trajetória de Saúde
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5a736a] max-w-xl">
            Acompanhamento contínuo de adesão ao plano, variação de peso, ritmo de sono e movimento
            diário.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex rounded-2xl border border-[#dfe8e3] bg-white p-1 shadow-2xs">
          {(['4 semanas', '8 semanas', '12 semanas'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedPeriod === period
                  ? 'bg-[#17372f] text-white shadow-xs'
                  : 'text-[#60766f] hover:text-[#17372f]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Card: Quanto falta para o objetivo & Resumo Textual Acessível */}
      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#17372f] to-[#0d2620] p-6 sm:p-8 text-white shadow-[0_16px_40px_rgba(23,55,47,0.18)]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#9fe0ce] mb-3">
              <Target className="size-3.5" />
              <span>Progresso Ponderal Gradual &amp; Sustentável</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Faltam {remainingToGoal} kg para seu objetivo final
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#c7ddd6] leading-relaxed max-w-lg">
              Você já eliminou <strong>{totalLost} kg</strong> (de {startWeight.toFixed(1)} kg para{' '}
              {currentWeight.toFixed(1)} kg) em 29 dias, com ganho de consistência e estabilização
              de hábitos.
            </p>

            {/* Visual Bar Gauge with Accessible Labels */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#b8d3cb]">
                <span>Início ({startWeight.toFixed(1)} kg)</span>
                <span className="text-white font-bold text-sm">{progressPercent}% do trajeto</span>
                <span>Objetivo ({targetWeight.toFixed(1)} kg)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-white/15 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3da58f] to-[#9fe0ce] transition-all duration-700"
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

          <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
            <div>
              <p className="text-[10px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Adesão ao Plano
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-0.5 text-white">
                {currentAdherence}%
              </p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">+8% desde o início</span>
            </div>
            <div>
              <p className="text-[10px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Peso Atual
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-0.5 text-white">{currentWeight} kg</p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">−1,8 kg no ciclo</span>
            </div>
            <div>
              <p className="text-[10px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Sono Médio
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-0.5 text-white">5h42</p>
              <span className="text-[10px] text-[#f49f85] font-semibold">Despertares às 3h</span>
            </div>
            <div>
              <p className="text-[10px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Passos Diários
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-0.5 text-white">6.420</p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">Meta 6.000 atingida</span>
            </div>
          </div>
        </div>
      </article>

      {/* METRIC TABS SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-[#dfe8e3] bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('adesao')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all ${
              activeTab === 'adesao'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            <Activity className="size-4" />
            <span>Tendência de Adesão (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('peso')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all ${
              activeTab === 'peso'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            <TrendingDown className="size-4" />
            <span>Curva Ponderal (kg)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sono')}
            className={`flex items-center gap-1.5 min-h-[40px] rounded-xl px-4 text-xs font-bold transition-all ${
              activeTab === 'sono'
                ? 'bg-[#17372f] text-white shadow-xs'
                : 'text-[#60766f] hover:text-[#17372f]'
            }`}
          >
            <Moon className="size-4" />
            <span>Sono &amp; Repouso</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAdherenceExplain(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0b7b68] hover:underline underline-offset-4"
        >
          <HelpCircle className="size-4" />
          <span>Como a adesão é explicada?</span>
        </button>
      </div>

      {/* TAB 1: TENDÊNCIA DE ADESÃO COM EIXO, UNIDADE (%) E RESUMO TEXTUAL ACESSÍVEL */}
      {activeTab === 'adesao' && (
        <article
          role="region"
          aria-label="Gráfico de tendência de adesão ao plano em porcentagem"
          className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-[#0b7b68]" />
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Evolução da Adesão ao Plano de Cuidado
                </h2>
              </div>
              <p className="text-xs text-[#698078] mt-0.5">
                Eixo Y: Adesão em porcentagem (%) · Período: Últimas 4 semanas
              </p>
            </div>
            <StatusBadge tone="green">Tendência Positiva (+8 p.p.)</StatusBadge>
          </div>

          {/* Bar chart with explicit axes, labels and screen reader text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#698078] px-1">
              <span>Escala: 0% a 100% (Meta Vivans &ge; 80%)</span>
              <span className="font-semibold text-[#0b7b68]">Média atual: 82%</span>
            </div>

            <div className="flex items-end justify-between h-48 pt-6 px-3 border-b-2 border-[#17372f]/20 bg-[#f8faf9] rounded-2xl p-4 gap-2">
              {history.map((pt) => {
                const heightPct = Math.max(10, Math.min(100, pt.adherence))
                return (
                  <div key={pt.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-bold text-[#17372f]">{pt.adherence}%</span>
                    <div
                      className="w-full max-w-[48px] rounded-t-lg bg-[#0b7b68] hover:bg-[#086555] transition-all shadow-xs"
                      style={{ height: `${heightPct}%` }}
                      title={`${pt.date}: Adesão de ${pt.adherence}%`}
                    />
                    <span className="text-[11px] font-medium text-[#526a62]">{pt.date}</span>
                  </div>
                )
              })}
            </div>

            {/* Text-First Accessible Summary (No reliance on color alone) */}
            <div className="rounded-2xl bg-[#edf7f4] border border-[#b9d8cf] p-4 text-xs text-[#0b6a5b] space-y-1.5">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#075f50]">
                Resumo Acessível de Tendência:
              </p>
              <p className="leading-relaxed text-[#2c4b42]">
                Sua adesão cresceu gradualmente de <strong>74%</strong> em 28 de julho para{' '}
                <strong>82%</strong> na medição mais recente de 25 de agosto (+8 pontos
                percentuais). Você atingiu a faixa recomendada de consistência sustentável (&ge;
                80%).
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
          className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="size-5 text-[#0b7b68]" />
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Curva de Peso Corporal (kg)
                </h2>
              </div>
              <p className="text-xs text-[#698078] mt-0.5">
                Eixo Y: Peso em quilogramas (kg) · Balança conectada
              </p>
            </div>
            <StatusBadge tone="green">−1,8 kg acumulado</StatusBadge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#698078] px-1">
              <span>Início: 80,0 kg &rarr; Atual: 78,2 kg &rarr; Meta: 72,0 kg</span>
              <span className="font-semibold text-[#0b7b68]">Ritmo: ~450g/semana</span>
            </div>

            <div className="flex items-end justify-between h-48 pt-6 px-3 border-b-2 border-[#17372f]/20 bg-[#f8faf9] rounded-2xl p-4 gap-2">
              {history.map((pt) => {
                const heightPct = Math.max(
                  15,
                  Math.min(100, (((pt.weight || 80) - 70) / (82 - 70)) * 100),
                )
                return (
                  <div key={pt.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs font-bold text-[#17372f]">
                      {pt.weight?.toFixed(1)} kg
                    </span>
                    <div
                      className="w-full max-w-[48px] rounded-t-lg bg-[#0b7b68] hover:bg-[#086555] transition-all shadow-xs"
                      style={{ height: `${heightPct}%` }}
                      title={`${pt.date}: ${pt.weight} kg`}
                    />
                    <span className="text-[11px] font-medium text-[#526a62]">{pt.date}</span>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl bg-[#edf7f4] border border-[#b9d8cf] p-4 text-xs text-[#0b6a5b] space-y-1">
              <p className="font-bold text-[11px] uppercase tracking-wider text-[#075f50]">
                Interpretação Médica Alinhada:
              </p>
              <p className="leading-relaxed text-[#2c4b42]">
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
          className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Moon className="size-5 text-[#5e77d9]" />
                <h2 className="font-serif text-xl font-bold text-[#17372f]">
                  Sono &amp; Ritmo Circadiano
                </h2>
              </div>
              <p className="text-xs text-[#698078] mt-0.5">
                Horas totais de descanso por noite · Rastreador wearable
              </p>
            </div>
            <StatusBadge tone="amber">Ponto de Atenção Clínica</StatusBadge>
          </div>

          <div className="rounded-2xl border border-[#f0d59c] bg-[#fffbf2] p-4 text-xs text-[#805f24] leading-relaxed space-y-1">
            <p className="font-bold text-[#70480e]">Padrão observado nos últimos 4 dias:</p>
            <p>
              Média de <strong>5h42 de sono</strong> por noite com episódios repetidos de despertar
              por volta das 3h da manhã. O Dr. Guilherme Martins avaliará a correlação com o horário
              do jantar (antecipando para as 19h30).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#f4f7f5] p-3.5 border border-[#dfe8e3]">
              <p className="text-[10px] uppercase font-bold text-[#698078]">Média 7 Dias</p>
              <p className="text-xl font-bold text-[#17372f] mt-1">5h42</p>
              <span className="text-[10px] text-[#c96a3b] font-medium">Abaixo de 7h</span>
            </div>
            <div className="rounded-2xl bg-[#f4f7f5] p-3.5 border border-[#dfe8e3]">
              <p className="text-[10px] uppercase font-bold text-[#698078]">Eficiência</p>
              <p className="text-xl font-bold text-[#17372f] mt-1">78%</p>
              <span className="text-[10px] text-[#698078]">Fragmentado</span>
            </div>
            <div className="rounded-2xl bg-[#f4f7f5] p-3.5 border border-[#dfe8e3]">
              <p className="text-[10px] uppercase font-bold text-[#698078]">Despertares 3h</p>
              <p className="text-xl font-bold text-[#c96a3b] mt-1">4 noites</p>
              <span className="text-[10px] text-[#c96a3b] font-medium">Em investigação</span>
            </div>
          </div>
        </article>
      )}

      {/* CHECK-INS PROGRAMADOS DE RETORNO (EVOLUÇÃO DOS CHECK-INS) */}
      <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Jornada Pós-Consulta
            </span>
            <h3 className="font-serif text-xl font-bold text-[#17372f]">
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
                  ? 'border-[#bfe4d8] bg-[#ebf6f2]'
                  : 'border-[#dfe8e3] bg-[#fdfdfd]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <strong className="text-[#0b7b68]">Dia {chk.dayOffset}</strong>
                  <span className="text-[#60766f]">{chk.scheduledDate}</span>
                </div>
                <p className="font-semibold text-[#17372f]">{chk.title}</p>
                {chk.value && (
                  <p className="mt-1 text-[11px] text-[#0b6a5b] font-bold">
                    Resultado: {chk.value}
                  </p>
                )}
              </div>
              <div className="mt-2 pt-1.5 border-t border-black/5 text-[10px] text-[#698078]">
                {chk.status === 'concluido' ? `✓ Realizado (${chk.completedAt})` : '• Pendente'}
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* ADHERENCE MODAL */}
      {showAdherenceExplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-[#e8f4f0] text-[#0b7b68]">
                  <Activity className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17372f]">
                  Como a adesão é compreendida no Vivans?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdherenceExplain(false)}
                className="text-[#60766f] hover:text-[#17372f]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#45655c] leading-relaxed">
              <p>
                No Instituto Vivans, <strong>adesão</strong> reflete a consistência da sua rotina,
                sem caráter punitivo ou julgamento.
              </p>
              <div className="rounded-2xl bg-[#f4f7f5] p-3.5 space-y-1.5 text-[#17372f]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-[#0b7b68]">
                  Fórmula do Protótipo:
                </p>
                <p className="text-xs text-[#45655c]">
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
                className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
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
