import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Heart,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react'

export default function Index() {
  const { setRole, notify } = useVivans()
  const navigate = useNavigate()

  const handleSelectRole = (selectedRole: 'doctor' | 'patient') => {
    setRole(selectedRole)
    if (selectedRole === 'doctor') {
      navigate('/medico')
    } else {
      navigate('/paciente')
    }
    notify(
      `Bem-vindo ao Instituto Vivans (${selectedRole === 'doctor' ? 'Dr. Guilherme' : 'Marina Costa'})`,
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-4 sm:py-8">
      {/* Simulation Banner */}
      <SimulationDisclaimer text="Instituto Vivans · Cuidado Longitudinal para Emagrecimento e Longevidade · Protótipo de Demonstração Interativo" />

      {/* Hero Presentation */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#b9d8cf] bg-[#edf7f4] px-4 py-1.5 text-xs font-semibold text-[#0b6a5b]">
          <Sparkles className="size-3.5 text-[#0b7b68]" />
          <span>Antes, Durante e Depois da Consulta</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17372f]">
          Cuidado Longitudinal com Presença e Contexto
        </h1>

        <p className="text-base sm:text-lg text-[#60766f] leading-relaxed">
          Uma plataforma que elimina a fragmentação entre agenda, relatos, fotos, documentos e plano
          de cuidado. A tecnologia organiza o contexto clínico para o médico e simplifica a jornada
          do paciente.
        </p>
      </section>

      {/* Profile Selection Gateway Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Patient Experience Gateway */}
        <div
          onClick={() => handleSelectRole('patient')}
          className="cursor-pointer rounded-3xl border-2 border-[#dfe8e3] bg-white p-7 shadow-sm transition-all hover:border-[#0b7b68] hover:shadow-xl group flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#e8f4f0] px-3 py-1 text-xs font-bold text-[#0b6a5b]">
                Mobile-First
              </span>
              <span className="text-xs font-medium text-[#698078]">Marina Costa</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f] group-hover:text-[#0b7b68] transition-colors">
                Entrar como Paciente
              </h2>
              <p className="mt-2 text-xs text-[#60766f] leading-relaxed">
                Acesse o dia a dia simplificado: check-in matinal, diário fotográfico com saciedade,
                evolução longitudinal e pré-consulta inteligente por voz ou texto.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#45655c]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Hoje: Próximas ações e check-in sem complicação</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Diário: Fotos, 3 notas de saciedade e visão assistida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Pré-consulta: Relato original por voz e consentimento LGPD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#edf2ef] text-xs font-bold text-[#0b7b68]">
            <span>Navegar na Área do Paciente</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Doctor Experience Gateway */}
        <div
          onClick={() => handleSelectRole('doctor')}
          className="cursor-pointer rounded-3xl border-2 border-[#dfe8e3] bg-white p-7 shadow-sm transition-all hover:border-[#17372f] hover:shadow-xl group flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#17372f] px-3 py-1 text-xs font-bold text-white">
                Desktop-First
              </span>
              <span className="text-xs font-medium text-[#698078]">Dr. Guilherme Martins</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f] group-hover:text-[#0b7b68] transition-colors">
                Entrar como Médico
              </h2>
              <p className="mt-2 text-xs text-[#60766f] leading-relaxed">
                Gestão da coorte por exceção: caixa de atenção, linha do tempo da agenda, dossiê
                longitudinal assistido por IA e ambiente de teleconsulta integrado.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#45655c]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Visão Geral: 22 pacientes, atrasos e caixa de exceção</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Prontuário: Objetivo nas palavras do paciente e dossiê</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0b7b68]" />
                <span>Consulta: Vídeo simulado, copiloto e aprovação de planos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#edf2ef] text-xs font-bold text-[#17372f]">
            <span>Navegar no Painel Médico</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Safety & Architecture Highlights */}
      <section className="rounded-3xl border border-[#dfe8e3] bg-[#f8faf9] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
          <ShieldCheck className="size-4 text-[#0b7b68]" />
          <span>Diretrizes de Confiabilidade e Governança Clínica</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs text-[#526a62] leading-relaxed">
          <div className="rounded-2xl bg-white p-4 border border-[#dfe8e3]">
            <strong className="text-[#17372f] block mb-1">IA como Copiloto:</strong>
            Organiza resumos, notas estruturadas e transcrições. Nunca prescreve, diagnostica ou
            altera conduta de forma autônoma.
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#dfe8e3]">
            <strong className="text-[#17372f] block mb-1">Privacidade &amp; LGPD:</strong>
            Consentimento contextual na pré-consulta, descarte padrão de áudios após transcrição e
            dados fictícios sem uso para treino de modelos.
          </div>
          <div className="rounded-2xl bg-white p-4 border border-[#dfe8e3]">
            <strong className="text-[#17372f] block mb-1">Evidências Médicas:</strong>
            Camada demonstrativa embasada em padrões conceituais do PubMed, Cochrane e Conitec com
            validação médica mandatória.
          </div>
        </div>
      </section>
    </div>
  )
}
