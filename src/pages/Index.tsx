import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import { Sparkles, ShieldCheck, ArrowRight, Radio } from 'lucide-react'

export default function Index() {
  const { setRole } = useVivans()

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-6 sm:py-12 space-y-12">
      {/* Editorial Hero Header with Warm Light & Sage Aesthetics */}
      <section className="text-center max-w-3xl mx-auto space-y-5 px-4 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C3D6CC] bg-[#E7EFEA] px-4 py-1.5 text-xs font-semibold text-[#2E5E4E] shadow-subtle">
          <Sparkles className="size-3.5 text-[#2E5E4E]" />
          <span className="font-bold tracking-wider">
            V I N V A N S E · Saúde &amp; Longevidade
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1E1C] leading-[1.15]">
          Acompanhamento Clínico, Presencial e Digital
        </h1>

        <p className="text-sm sm:text-base text-[#5C5C57] leading-relaxed max-w-2xl mx-auto">
          Uma plataforma estruturada para aproximar médico e paciente no seguimento de 90 dias:
          hábitos, biossinais, adesão, consultas online e governança clínica.
        </p>

        {/* Quick Demo Context Badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5C5C57]">
          <span className="flex items-center gap-1.5 rounded-xl bg-[#FFFFFF] border border-[#E8E3D9] px-3 py-1.5 shadow-subtle">
            <ShieldCheck className="size-3.5 text-[#2E5E4E]" />
            <span>Validação Médica Mandatória</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-[#FFFFFF] border border-[#E8E3D9] px-3 py-1.5 shadow-subtle">
            <Radio className="size-3.5 text-[#2E5E4E] animate-pulse" />
            <span>Consulta Online Integrada</span>
          </span>
        </div>
      </section>

      {/* Role Selection Interactive Cards */}
      <section className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto w-full px-4">
        {/* Patient Profile Card (Marina Costa) */}
        <Link
          to="/paciente"
          onClick={() => setRole('patient')}
          className="group relative overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 transition-all hover:border-[#2E5E4E] hover:shadow-card flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Área da Paciente
              </span>
              <span className="text-xs text-[#5C5C57]">Marina Costa · 38 anos</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <VivansAvatar
                src="https://img.usecurling.com/ppl/512?gender=female&seed=88"
                name="Marina Costa"
                initials="MC"
                size="xl"
                className="border-2 border-[#2E5E4E]/40 group-hover:scale-105 transition-transform shrink-0 shadow-subtle"
              />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors">
                  Entrar como Marina Costa
                </h2>
                <p className="text-xs text-[#5C5C57] mt-0.5">
                  Ciclo de Longevidade Metabólica · Dia 29 de 90
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5C5C57] leading-relaxed">
              Acesse suas ações diárias em 1 toque, diário alimentar com suporte visual,
              pré-consulta guiada, receitas ativas e evolução ponderal e de sono.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Adesão</p>
                <p className="font-bold text-[#1E1E1C] text-sm mt-0.5">82%</p>
              </div>
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Peso</p>
                <p className="font-bold text-[#2E5E4E] text-sm mt-0.5">78,2 kg</p>
              </div>
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Sono</p>
                <p className="font-bold text-[#1E1E1C] text-sm mt-0.5">5h42</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-bold text-[#2E5E4E]">
            <span>Acessar aplicativo da paciente</span>
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform text-[#2E5E4E]" />
          </div>
        </Link>

        {/* Doctor Profile Card (Dr. Guilherme Martins) */}
        <Link
          to="/medico"
          onClick={() => setRole('doctor')}
          className="group relative overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 transition-all hover:border-[#2E5E4E] hover:shadow-card flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#2E5E4E] text-[#FFFFFF] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Área do Médico
              </span>
              <span className="text-xs text-[#5C5C57]">Dr. Guilherme Martins</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <VivansAvatar
                src={DOCTOR_PROFILE.photoUrl || DOCTOR_PROFILE.avatarUrl}
                name={DOCTOR_PROFILE.name}
                initials={DOCTOR_PROFILE.initials}
                size="xl"
                className="border-2 border-[#2E5E4E]/40 group-hover:scale-105 transition-transform shrink-0 shadow-subtle"
              />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors">
                  Entrar como Dr. Guilherme
                </h2>
                <p className="text-xs font-mono text-[#2E5E4E] mt-0.5 font-bold">
                  CRM/SP 184.920 · RQE 92.110
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5C5C57] leading-relaxed">
              Acesse o painel de coorte com 22 pacientes, sala de espera virtual, ambiente de
              Consulta Online com anotações automáticas e deliberação de condutas.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Coorte</p>
                <p className="font-bold text-[#1E1E1C] text-sm mt-0.5">22 pacientes</p>
              </div>
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Sala Espera</p>
                <p className="font-bold text-[#2E5E4E] text-sm mt-0.5">1 online</p>
              </div>
              <div className="rounded-xl bg-[#FAF8F4] p-2.5 border border-[#E8E3D9]">
                <p className="text-[10px] uppercase font-bold text-[#8A8A84]">Hoje</p>
                <p className="font-bold text-[#1E1E1C] text-sm mt-0.5">4 consultas</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-bold text-[#2E5E4E]">
            <span>Acessar painel médico</span>
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform text-[#2E5E4E]" />
          </div>
        </Link>
      </section>

      {/* Pillars Strip Footer */}
      <footer className="text-center text-xs text-[#8A8A84] max-w-xl mx-auto space-y-2 pt-6">
        <p className="font-bold tracking-widest text-[#5C5C57]">
          V I N V A N S E · Sistema de Saúde e Longevidade Ativa
        </p>
        <p className="text-[11px] text-[#8A8A84]">
          Dados fictícios gerados para demonstração de experiência longitudinal, acessibilidade e
          design de alta precisão.
        </p>
      </footer>
    </div>
  )
}
