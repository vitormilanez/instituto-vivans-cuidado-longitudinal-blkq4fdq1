import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, SimulationDisclaimer, UrgentCareWarning } from '@/components/CommonUI'
import { TrendingDown, Moon, Activity, Footprints, Target, ChevronDown } from 'lucide-react'

export default function PatientEvolution() {
  const { selectedPatient, returnJourney, scheduledCheckins } = useVivans()
  const [selectedPeriod, setSelectedPeriod] = useState<'4 semanas' | '8 semanas' | '12 semanas'>(
    '4 semanas',
  )

  // Evolution data for Marina Costa
  const weightData = [
    { date: '01 ago', weight: 80.0, target: 72.0 },
    { date: '08 ago', weight: 79.4, target: 72.0 },
    { date: '15 ago', weight: 78.8, target: 72.0 },
    { date: '22 ago', weight: 78.4, target: 72.0 },
    { date: '25 ago', weight: 78.2, target: 72.0 },
  ]

  const currentWeight = 78.2
  const startWeight = 80.0
  const targetWeight = 72.0
  const totalLost = (startWeight - currentWeight).toFixed(1)
  const remainingToGoal = (currentWeight - targetWeight).toFixed(1)
  const progressPercent = Math.round(
    ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100,
  )

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Acompanhamento Longitudinal de Evolução · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
            Evolução Longitudinal
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
            Sua Trajetória de Saúde
          </h1>
          <p className="mt-1 text-sm text-[#60766f]">
            Tendências graduais de peso, adesão ao plano, sono e atividade física.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex rounded-2xl border border-[#dfe8e3] bg-white p-1">
          {(['4 semanas', '8 semanas', '12 semanas'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedPeriod === period
                  ? 'bg-[#17372f] text-white shadow-sm'
                  : 'text-[#60766f] hover:text-[#17372f]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </section>

      {/* Return Journey Check-in Progress Timeline */}
      <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Acompanhamento Pós-Consulta · Retorno Ativo
            </span>
            <h3 className="font-serif text-xl font-bold text-[#17372f]">
              Evolução dos Check-ins Programados
            </h3>
          </div>
          <StatusBadge tone="green">
            {scheduledCheckins.filter((c) => c.status === 'concluido').length} de{' '}
            {scheduledCheckins.length} Concluídos
          </StatusBadge>
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
                {chk.status === 'concluido'
                  ? `✓ Realizado (${chk.completedAt})`
                  : '• Aguardando data'}
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Goal Progress Hero Gauge: "Quanto falta para meu objetivo?" */}
      <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#17372f] to-[#0e2721] p-6 sm:p-8 text-white shadow-[0_16px_40px_rgba(23,55,47,0.18)]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#9fe0ce] mb-3">
              <Target className="size-3.5" />
              <span>Quanto Falta para o Meu Objetivo?</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Faltam apenas {remainingToGoal} kg para sua meta
            </h2>
            <p className="mt-2 text-sm text-[#c7ddd6] leading-relaxed max-w-lg">
              Você já eliminou <strong>{totalLost} kg</strong> de forma sustentável, preservando
              massa magra e construindo novos hábitos de longevidade.
            </p>

            {/* Visual Bar Gauge */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#b8d3cb]">
                <span>Início (80,0 kg)</span>
                <span className="text-white font-bold text-sm">{progressPercent}% Concluído</span>
                <span>Objetivo (72,0 kg)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-white/15 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3da58f] to-[#9fe0ce] transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
            <div>
              <p className="text-[11px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Peso Atual
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-white">{currentWeight} kg</p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">−1,8 kg no ciclo</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Adesão Média
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-white">82%</p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">+6 p.p. vs. anterior</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Sono Médio
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">5h42</p>
              <span className="text-[10px] text-[#f49f85] font-semibold">Ponto de atenção</span>
            </div>
            <div>
              <p className="text-[11px] text-[#9cc7ba] uppercase tracking-wider font-bold">
                Passos Diários
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">6.420</p>
              <span className="text-[10px] text-[#9fe0ce] font-semibold">Meta 6.000 atingida</span>
            </div>
          </div>
        </div>
      </article>

      {/* Metric Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Weight Evolution Card with explicit axes and text summary */}
        <article
          role="region"
          aria-label="Gráfico de evolução ponderal em quilogramas"
          className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-5 text-[#0b7b68]" />
              <h3 className="font-serif text-lg font-bold text-[#17372f]">
                Curva Ponderal (Eixo Y: Peso em kg)
              </h3>
            </div>
            <StatusBadge tone="green">Tendência Decrescente</StatusBadge>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-[11px] text-[#698078] px-1">
              <span>Unidade: Quilogramas (kg)</span>
              <span>Origem: Balança Conectada</span>
            </div>

            <div className="flex items-end justify-between h-40 pt-4 px-2 border-b border-[#dfe8e3] bg-[#f8faf9] rounded-2xl p-3">
              {weightData.map((d) => {
                // calculate bar height relative to 70kg-82kg range
                const heightPct = Math.max(15, Math.min(100, ((d.weight - 70) / (82 - 70)) * 100))
                return (
                  <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs font-bold text-[#17372f]">{d.weight.toFixed(1)}</span>
                    <div
                      className="w-8 rounded-t-lg bg-[#0b7b68] hover:bg-[#096656] transition-all"
                      style={{ height: `${heightPct}%` }}
                      title={`${d.date}: ${d.weight} kg`}
                    />
                    <span className="text-[11px] text-[#698078]">{d.date}</span>
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl bg-[#edf7f4] p-3 text-xs text-[#0b6a5b] space-y-1">
              <p className="font-bold text-[11px] uppercase tracking-wider">Resumo de Tendência:</p>
              <p>
                Redução contínua de 80,0 kg para 78,2 kg (−1,8 kg) em 25 dias, com perda média
                saudável de ~450g por semana.
              </p>
            </div>
          </div>
        </article>

        {/* Sleep & Recovery Card */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
            <div className="flex items-center gap-2">
              <Moon className="size-5 text-[#5e77d9]" />
              <h3 className="font-serif text-lg font-bold text-[#17372f]">Sono e Recuperação</h3>
            </div>
            <StatusBadge tone="amber">Abaixo do Padrão</StatusBadge>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-[#fffbf2] border border-[#f0d59c] p-4 text-xs text-[#805f24] leading-relaxed">
              <strong>Padrão detectado:</strong> Média de 5h42 de sono nas últimas 4 noites com
              despertares entre 3h e 4h da manhã. O Dr. Guilherme avaliará a relação com o horário
              do jantar.
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <p className="text-[10px] text-[#698078]">Noites &lt; 6h</p>
                <p className="text-lg font-bold text-[#c96a3b]">4 de 7</p>
              </div>
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <p className="text-[10px] text-[#698078]">Eficiência</p>
                <p className="text-lg font-bold text-[#17372f]">78%</p>
              </div>
              <div className="rounded-2xl bg-[#f4f7f5] p-3">
                <p className="text-[10px] text-[#698078]">Recuperação</p>
                <p className="text-lg font-bold text-[#17372f]">Moderada</p>
              </div>
            </div>

            <p className="text-xs text-[#60766f]">
              Dados oriundos do smartwatch demonstrativo. Não configuram diagnóstico médico isolado.
            </p>
          </div>
        </article>
      </section>

      {/* Clinical Disclaimer footer */}
      <UrgentCareWarning />
    </div>
  )
}
