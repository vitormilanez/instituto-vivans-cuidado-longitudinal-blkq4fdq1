import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Heart,
  ArrowRight,
  TrendingDown,
  Moon,
  Activity,
  FileText,
  Calendar,
  CheckCircle2,
  Video,
  Radio,
} from 'lucide-react'

export default function Index() {
  const { setRole } = useVivans()

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-12 space-y-12">
      {/* Editorial Hero Header with Near-Black & Gold Aesthetics */}
      <section className="text-center max-w-3xl mx-auto space-y-5 px-4 relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#D6B270]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B270]/30 bg-[#D6B270]/10 px-4 py-1.5 text-xs font-semibold text-[#E8C391] backdrop-blur-md shadow-[0_0_20px_rgba(214,178,112,0.15)]">
          <Sparkles className="size-3.5 text-[#D6B270]" />
          <span>Instituto Vivans · Cuidado Longitudinal &amp; Longevidade</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
          Acompanhamento Clínico, Presencial e Digital
        </h1>

        <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed max-w-2xl mx-auto">
          Uma plataforma estruturada para aproximar médico e paciente no seguimento de 90 dias:
          hábitos, biossinais, adesão, teleconsultas e governança clínica.
        </p>

        {/* Quick Demo Context Badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-[#ADADAD]">
          <span className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="size-3.5 text-[#D6B270]" />
            <span>Validação Médica Mandatória</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
            <Radio className="size-3.5 text-[#D6B270] animate-pulse" />
            <span>Sala Virtual de Teleconsulta Integrada</span>
          </span>
        </div>
      </section>

      {/* Role Selection Interactive Cards */}
      <section className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto w-full px-4">
        {/* Patient Profile Card (Marina Costa) */}
        <Link
          to="/paciente"
          onClick={() => setRole('patient')}
          className="group relative overflow-hidden rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-8 transition-all hover:border-[#D6B270] hover:shadow-[0_16px_40px_rgba(214,178,112,0.15)] flex flex-col justify-between space-y-6 backdrop-blur-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#D6B270]/20 text-[#E8C391] border border-[#D6B270]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Área da Paciente
              </span>
              <span className="text-xs text-[#ADADAD]">Marina Costa · 38 anos</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <VivansAvatar
                src="https://img.usecurling.com/ppl/512?gender=female&seed=88"
                name="Marina Costa"
                initials="MC"
                size="xl"
                className="border-2 border-[#D6B270]/60 group-hover:scale-105 transition-transform shrink-0"
              />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#D6B270] transition-colors">
                  Entrar como Marina Costa
                </h2>
                <p className="text-xs text-[#ADADAD] mt-0.5">
                  Ciclo de Longevidade Metabólica · Dia 29 de 90
                </p>
              </div>
            </div>

            <p className="text-xs text-[#CCCCCC] leading-relaxed">
              Acesse suas ações diárias em 1 toque, diário alimentar com suporte visual,
              pré-consulta guiada, receitas ativas e evolução ponderal e de sono.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Adesão</p>
                <p className="font-bold text-white text-sm mt-0.5">82%</p>
              </div>
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Peso</p>
                <p className="font-bold text-[#D6B270] text-sm mt-0.5">78,2 kg</p>
              </div>
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Sono</p>
                <p className="font-bold text-white text-sm mt-0.5">5h42</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-xs font-bold text-[#D6B270]">
            <span>Acessar aplicativo da paciente</span>
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Doctor Profile Card (Dr. Guilherme Martins) */}
        <Link
          to="/medico"
          onClick={() => setRole('doctor')}
          className="group relative overflow-hidden rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 sm:p-8 transition-all hover:border-[#D6B270] hover:shadow-[0_16px_40px_rgba(214,178,112,0.15)] flex flex-col justify-between space-y-6 backdrop-blur-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-gradient-to-r from-[#D6B270] to-[#B8935A] text-[#0F0F0F] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Área do Médico
              </span>
              <span className="text-xs text-[#ADADAD]">Dr. Guilherme Martins</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <VivansAvatar
                src={DOCTOR_PROFILE.avatarUrl}
                name={DOCTOR_PROFILE.name}
                initials={DOCTOR_PROFILE.initials}
                size="xl"
                className="border-2 border-[#D6B270]/60 group-hover:scale-105 transition-transform shrink-0"
              />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#D6B270] transition-colors">
                  Entrar como Dr. Guilherme
                </h2>
                <p className="text-xs font-mono text-[#D6B270] mt-0.5">
                  CRM/SP 184.920 · RQE 92.110
                </p>
              </div>
            </div>

            <p className="text-xs text-[#CCCCCC] leading-relaxed">
              Acesse o painel de coorte com 22 pacientes, sala de espera virtual, ambiente de
              teleconsulta Google Meet com anotações automáticas e deliberação de condutas.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Coorte</p>
                <p className="font-bold text-white text-sm mt-0.5">22 pacientes</p>
              </div>
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Sala Espera</p>
                <p className="font-bold text-[#D6B270] text-sm mt-0.5">1 online</p>
              </div>
              <div className="rounded-xl bg-[#0F0F0F] p-2.5 border border-[#333333]">
                <p className="text-[10px] uppercase font-bold text-[#888888]">Hoje</p>
                <p className="font-bold text-white text-sm mt-0.5">4 consultas</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-xs font-bold text-[#D6B270]">
            <span>Acessar painel médico</span>
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Pillars Strip Footer */}
      <footer className="text-center text-xs text-[#888888] max-w-xl mx-auto space-y-2 pt-6">
        <p className="font-medium text-[#ADADAD]">
          Instituto Vivans · Sistema de Saúde e Longevidade Ativa
        </p>
        <p className="text-[11px] text-[#666666]">
          Dados fictícios gerados para demonstração de experiência longitudinal, acessibilidade e
          design de alta precisão.
        </p>
      </footer>
    </div>
  )
}
