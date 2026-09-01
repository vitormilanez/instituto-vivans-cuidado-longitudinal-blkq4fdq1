import React from 'react'
import { Link } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { VivansAvatar } from '@/components/VivansAvatar'
import { DOCTOR_PROFILE } from '@/data/mockData'
import {
  ArrowRight,
  ShieldCheck,
  Radio,
  Activity,
  Scale,
  Moon,
  Users,
  Video,
  CalendarCheck2,
  Sparkles,
} from 'lucide-react'

export default function Index() {
  const { setRole, patients } = useVivans()

  // Grab Marina's dynamic profile or fallback
  const marina = patients.find((p) => p.id === 'marina-costa')
  const marinaPhoto =
    marina?.photoUrl ||
    marina?.avatarUrl ||
    'https://img.usecurling.com/ppl/512?gender=female&seed=88'
  const doctorPhoto =
    DOCTOR_PROFILE.photoUrl ||
    DOCTOR_PROFILE.avatarUrl ||
    'https://img.usecurling.com/ppl/512?gender=male&seed=15'

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between py-6 sm:py-10 md:py-14 max-w-5xl mx-auto w-full px-4 sm:px-6">
      {/* Decorative Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10 flex justify-center items-start opacity-70"
      >
        <div className="w-[680px] h-[340px] bg-gradient-to-br from-[#E7EFEA]/80 via-[#F7EFE3]/50 to-transparent blur-3xl rounded-full translate-y-[-40px]" />
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-2 pb-4 sm:pb-8">
        {/* Brand Kicker / Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C3D6CC]/80 bg-white/70 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-[#2E5E4E] shadow-xs">
          <Sparkles className="size-3.5 text-[#C49A5B]" />
          <span className="font-serif tracking-[0.24em] uppercase text-[11px] text-[#2E5E4E]">
            V I N V A N S E · Saúde &amp; Longevidade
          </span>
        </div>

        {/* Hero Title with Lora Typography */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.4rem] font-medium tracking-tight text-[#1E1E1C] leading-[1.12]">
            Acompanhamento Clínico, <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#2E5E4E]">Presencial e Digital</span>
          </h1>

          {/* Subtitle that breathes and balances whitespace */}
          <p className="text-sm sm:text-base md:text-lg text-[#5C5C57] font-normal leading-relaxed max-w-2xl mx-auto px-2">
            Uma plataforma de alta precisão desenhada para integrar médico e paciente na jornada de
            90 dias: biossinais, rotina metabólica, consultas online e governança clínica.
          </p>
        </div>

        {/* Subtle Trust Indicators */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-[#5C5C57]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-[#E8E3D9] px-3 py-1 shadow-xs font-medium">
            <ShieldCheck className="size-3.5 text-[#2E5E4E]" />
            <span>Validação Médica Mandatória</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-[#E8E3D9] px-3 py-1 shadow-xs font-medium">
            <Radio className="size-3.5 text-[#C49A5B] animate-pulse" />
            <span>Consulta Online Integrada</span>
          </span>
        </div>
      </section>

      {/* Role Selection Interactive Cards: Editorial Premium & Glassmorphic */}
      <section className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto w-full my-auto py-4">
        {/* Patient Profile Card (Marina Costa) */}
        <Link
          to="/paciente"
          onClick={() => setRole('patient')}
          className="group relative flex flex-col justify-between rounded-3xl border border-[#E8E3D9]/90 bg-white/80 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 hover:border-[#2E5E4E]/50 hover:bg-white/95 hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#2E5E4E] focus-visible:outline-none"
        >
          {/* Subtle Top Accent line on hover */}
          <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#2E5E4E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />

          <div className="space-y-5">
            {/* Tag & Age Header */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-[#2E5E4E]" />
                Área da Paciente
              </span>
              <span className="text-xs text-[#8A8A84] font-medium">Marina Costa · 38 anos</span>
            </div>

            {/* Profile Avatar & Header Info */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative shrink-0">
                <VivansAvatar
                  src={marinaPhoto}
                  name="Marina Costa"
                  initials="MC"
                  size="xl"
                  className="ring-2 ring-[#C3D6CC] ring-offset-2 ring-offset-white group-hover:ring-[#2E5E4E] transition-all duration-300 shadow-sm"
                />
                <span
                  className="absolute bottom-0 right-0 size-3.5 rounded-full bg-[#2E5E4E] border-2 border-white shadow-xs"
                  title="Acompanhamento ativo"
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors leading-snug">
                  Entrar como Marina Costa
                </h2>
                <p className="text-xs text-[#8A8A84] mt-0.5 flex items-center gap-1.5 font-medium">
                  <span className="size-1.5 rounded-full bg-[#C49A5B]" />
                  Ciclo de Longevidade · Dia 29 de 90
                </p>
              </div>
            </div>

            {/* Concise inviting description */}
            <p className="text-xs sm:text-[13px] text-[#5C5C57] leading-relaxed font-normal">
              Acesse suas ações diárias em 1 toque, diário alimentar com suporte visual,
              pré-consulta guiada e evolução contínua de bem-estar.
            </p>

            {/* Luxury Status Dashboard Indicators */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <Activity className="size-3 text-[#2E5E4E]" />
                  <span>Adesão</span>
                </div>
                <p className="font-serif font-bold text-[#1E1E1C] text-base mt-1 tracking-tight">
                  82%
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <Scale className="size-3 text-[#2E5E4E]" />
                  <span>Peso</span>
                </div>
                <p className="font-serif font-bold text-[#2E5E4E] text-base mt-1 tracking-tight">
                  78,2 <span className="text-xs font-sans font-normal text-[#5C5C57]">kg</span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <Moon className="size-3 text-[#C49A5B]" />
                  <span>Sono</span>
                </div>
                <p className="font-serif font-bold text-[#1E1E1C] text-base mt-1 tracking-tight">
                  5h42
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA Footer */}
          <div className="mt-6 pt-4 border-t border-[#E8E3D9]/60 flex items-center justify-between text-xs font-bold text-[#2E5E4E] group-hover:text-[#24493D]">
            <span className="tracking-wide">Acessar aplicativo da paciente</span>
            <div className="grid size-7 place-items-center rounded-full bg-[#E7EFEA] text-[#2E5E4E] group-hover:bg-[#2E5E4E] group-hover:text-white transition-all duration-200 shadow-xs">
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Doctor Profile Card (Dr. Guilherme Martins) */}
        <Link
          to="/medico"
          onClick={() => setRole('doctor')}
          className="group relative flex flex-col justify-between rounded-3xl border border-[#E8E3D9]/90 bg-white/80 backdrop-blur-md p-6 sm:p-7 transition-all duration-300 hover:border-[#2E5E4E]/50 hover:bg-white/95 hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#2E5E4E] focus-visible:outline-none"
        >
          {/* Subtle Top Accent line on hover */}
          <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C49A5B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />

          <div className="space-y-5">
            {/* Tag & Identity Header */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2E5E4E] text-white px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="size-1.5 rounded-full bg-[#C49A5B]" />
                Área do Médico
              </span>
              <span className="text-xs text-[#8A8A84] font-medium">Dr. Guilherme Martins</span>
            </div>

            {/* Profile Avatar & Header Info */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative shrink-0">
                <VivansAvatar
                  src={doctorPhoto}
                  name={DOCTOR_PROFILE.name}
                  initials={DOCTOR_PROFILE.initials}
                  size="xl"
                  className="ring-2 ring-[#C3D6CC] ring-offset-2 ring-offset-white group-hover:ring-[#2E5E4E] transition-all duration-300 shadow-sm"
                />
                <span
                  className="absolute bottom-0 right-0 size-3.5 rounded-full bg-[#C49A5B] border-2 border-white shadow-xs"
                  title="Médico Responsável"
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1C] group-hover:text-[#2E5E4E] transition-colors leading-snug">
                  Entrar como Dr. Guilherme
                </h2>
                <p className="text-xs font-mono text-[#2E5E4E] mt-0.5 font-bold tracking-tight">
                  CRM/SP 184.920 · RQE 92.110
                </p>
              </div>
            </div>

            {/* Concise inviting description */}
            <p className="text-xs sm:text-[13px] text-[#5C5C57] leading-relaxed font-normal">
              Acesse o painel de coorte com 22 pacientes, telemedicina integrada com notas clínicas
              automáticas e deliberação rápida de condutas.
            </p>

            {/* Luxury Status Dashboard Indicators */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <Users className="size-3 text-[#2E5E4E]" />
                  <span>Coorte</span>
                </div>
                <p className="font-serif font-bold text-[#1E1E1C] text-base mt-1 tracking-tight">
                  22{' '}
                  <span className="text-[11px] font-sans font-normal text-[#5C5C57]">
                    pacientes
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <Video className="size-3 text-[#2E5E4E] animate-pulse" />
                  <span>Sala Espera</span>
                </div>
                <p className="font-serif font-bold text-[#2E5E4E] text-base mt-1 tracking-tight">
                  1 <span className="text-[11px] font-sans font-normal text-[#2E5E4E]">online</span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF8F4]/90 border border-[#E8E3D9]/80 p-2.5 transition-colors group-hover:border-[#C3D6CC]">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8A84]">
                  <CalendarCheck2 className="size-3 text-[#C49A5B]" />
                  <span>Hoje</span>
                </div>
                <p className="font-serif font-bold text-[#1E1E1C] text-base mt-1 tracking-tight">
                  4{' '}
                  <span className="text-[11px] font-sans font-normal text-[#5C5C57]">
                    consultas
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA Footer */}
          <div className="mt-6 pt-4 border-t border-[#E8E3D9]/60 flex items-center justify-between text-xs font-bold text-[#2E5E4E] group-hover:text-[#24493D]">
            <span className="tracking-wide">Acessar painel médico</span>
            <div className="grid size-7 place-items-center rounded-full bg-[#E7EFEA] text-[#2E5E4E] group-hover:bg-[#2E5E4E] group-hover:text-white transition-all duration-200 shadow-xs">
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </section>

      {/* Pillars Strip Footer with Editorial Tone */}
      <footer className="text-center text-xs text-[#8A8A84] max-w-xl mx-auto space-y-2 pt-6 sm:pt-8 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#E8E3D9]" />
          <p className="font-serif tracking-[0.2em] text-[11px] uppercase font-semibold text-[#5C5C57]">
            V I N V A N S E · Medicina &amp; Longevidade
          </p>
          <span className="h-px w-8 bg-[#E8E3D9]" />
        </div>
        <p className="text-[11px] text-[#8A8A84] leading-relaxed">
          Ambiente estruturado para demonstração de jornada clínica longitudinal, telemedicina e
          governança de condutas.
        </p>
      </footer>
    </div>
  )
}
