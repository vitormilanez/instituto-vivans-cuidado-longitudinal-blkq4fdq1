import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { StatusBadge, AiDraftBadge, UrgentCareWarning } from '@/components/CommonUI'
import { TrendingDown, Moon, Footprints, Activity, Sparkles, Calendar } from 'lucide-react'

export default function PatientEvolution() {
  const [selectedMetric, setSelectedMetric] = useState<'peso' | 'sono' | 'passos' | 'adesao'>(
    'peso',
  )

  // Light warm theme mock datasets
  const weightData = [
    { date: '28 Jul', peso: 80.0, meta: 76.0 },
    { date: '04 Ago', peso: 79.6, meta: 76.0 },
    { date: '11 Ago', peso: 79.1, meta: 76.0 },
    { date: '18 Ago', peso: 78.5, meta: 76.0 },
    { date: '25 Ago', peso: 78.2, meta: 76.0 },
  ]

  const sleepData = [
    { date: 'Seg', horas: 6.2, acordar: '03:10' },
    { date: 'Ter', horas: 5.5, acordar: '03:00' },
    { date: 'Qua', horas: 5.8, acordar: '03:15' },
    { date: 'Qui', horas: 6.0, acordar: '03:05' },
    { date: 'Sex', horas: 5.4, acordar: '02:50' },
    { date: 'Sáb', horas: 6.5, acordar: '03:30' },
    { date: 'Dom', horas: 5.7, acordar: '03:00' },
  ]

  const adherenceData = [
    { week: 'Semana 1', taxa: 74 },
    { week: 'Semana 2', taxa: 78 },
    { week: 'Semana 3', taxa: 85 },
    { week: 'Semana 4', taxa: 82 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Evolução e Biossinais
            </span>
            <StatusBadge tone="green">Dia 29 de 90</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Sua Linha de Evolução
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5C57] max-w-2xl">
            Acompanhe suas curvas de peso, sono e constância nos hábitos. Os dados são integrados ao
            prontuário do Dr. Guilherme.
          </p>
        </div>
      </section>

      {/* Metric Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedMetric('peso')}
          className={`rounded-3xl border p-4.5 text-left transition-all cursor-pointer shadow-subtle ${
            selectedMetric === 'peso'
              ? 'border-[#2E5E4E] bg-[#E7EFEA] ring-2 ring-[#2E5E4E]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2E5E4E]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C5C57]">Peso</span>
            <TrendingDown className="size-4 text-[#2E5E4E]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1E1E1C] mt-2">78,2 kg</p>
          <span className="text-[11px] text-[#2F7D5B] font-semibold">−1,8 kg no ciclo</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('sono')}
          className={`rounded-3xl border p-4.5 text-left transition-all cursor-pointer shadow-subtle ${
            selectedMetric === 'sono'
              ? 'border-[#C49A5B] bg-[#FBF5EB] ring-2 ring-[#C49A5B]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#C49A5B]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7A3D]">Sono</span>
            <Moon className="size-4 text-[#C49A5B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1E1E1C] mt-2">5h42 média</p>
          <span className="text-[11px] text-[#B7832F] font-semibold">Despertar pontual 3h</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('adesao')}
          className={`rounded-3xl border p-4.5 text-left transition-all cursor-pointer shadow-subtle ${
            selectedMetric === 'adesao'
              ? 'border-[#2E5E4E] bg-[#E7EFEA] ring-2 ring-[#2E5E4E]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2E5E4E]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C5C57]">
              Adesão
            </span>
            <Activity className="size-4 text-[#2E5E4E]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1E1E1C] mt-2">82%</p>
          <span className="text-[11px] text-[#2E5E4E] font-semibold">+8% de constância</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('passos')}
          className={`rounded-3xl border p-4.5 text-left transition-all cursor-pointer shadow-subtle ${
            selectedMetric === 'passos'
              ? 'border-[#2E5E4E] bg-[#E7EFEA] ring-2 ring-[#2E5E4E]/30'
              : 'border-[#E8E3D9] bg-[#FFFFFF] hover:border-[#2E5E4E]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C5C57]">
              Passos
            </span>
            <Footprints className="size-4 text-[#2E5E4E]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1E1E1C] mt-2">6.420</p>
          <span className="text-[11px] text-[#2F7D5B] font-semibold">Meta de 6.000 atingida</span>
        </button>
      </div>

      {/* Main Chart Card */}
      <section className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE5] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Visualização Gráfica
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1E1E1C]">
              {selectedMetric === 'peso' && 'Curva de Peso Corporal (kg)'}
              {selectedMetric === 'sono' && 'Duração e Fragmentação do Sono (horas)'}
              {selectedMetric === 'adesao' && 'Evolução da Adesão aos Hábitos (%)'}
              {selectedMetric === 'passos' && 'Média Diária de Movimento (passos)'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F4] border border-[#E8E3D9] px-3 py-1 text-xs text-[#5C5C57]">
              <Calendar className="size-3.5 text-[#2E5E4E]" />
              <span>Últimos 30 dias</span>
            </span>
          </div>
        </div>

        {/* Charts rendered on pure clean light canvas */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'peso' ? (
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFECE5" vertical={false} />
                <XAxis dataKey="date" stroke="#8A8A84" fontSize={12} tickLine={false} />
                <YAxis
                  domain={[75, 81]}
                  stroke="#8A8A84"
                  fontSize={12}
                  tickLine={false}
                  unit=" kg"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E3D9',
                    borderRadius: '16px',
                    color: '#1E1E1C',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px -2px rgba(30, 30, 28, 0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="peso"
                  name="Peso Atual"
                  stroke="#2E5E4E"
                  strokeWidth={3}
                  dot={{ fill: '#2E5E4E', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  name="Meta de Ciclo"
                  stroke="#C49A5B"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </LineChart>
            ) : selectedMetric === 'sono' ? (
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFECE5" vertical={false} />
                <XAxis dataKey="date" stroke="#8A8A84" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 8]} stroke="#8A8A84" fontSize={12} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E3D9',
                    borderRadius: '16px',
                    color: '#1E1E1C',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px -2px rgba(30, 30, 28, 0.08)',
                  }}
                />
                <Bar dataKey="horas" name="Horas Dormidas" fill="#C49A5B" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFECE5" vertical={false} />
                <XAxis dataKey="week" stroke="#8A8A84" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#8A8A84" fontSize={12} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E3D9',
                    borderRadius: '16px',
                    color: '#1E1E1C',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px -2px rgba(30, 30, 28, 0.08)',
                  }}
                />
                <Bar dataKey="taxa" name="Taxa de Adesão" fill="#2E5E4E" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* AI Interpretation Box */}
        <div className="rounded-2xl border border-[#C49A5B]/30 bg-[#FBF5EB] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#C49A5B]" />
              <strong className="text-xs text-[#9E7A3D]">Síntese de Tendência (Copiloto)</strong>
            </div>
            <AiDraftBadge
              status="Rascunho gerado com IA - requer validação médica"
              variant="compact"
            />
          </div>
          <p className="text-xs text-[#5C5C57] leading-relaxed">
            A relação identificada entre o estresse vespertino, o pico de cortisol após a última
            refeição e os despertares às 3h será aprofundada na Consulta Online com o Dr. Guilherme.
          </p>{' '}
        </div>
      </section>

      <UrgentCareWarning />
    </div>
  )
}
