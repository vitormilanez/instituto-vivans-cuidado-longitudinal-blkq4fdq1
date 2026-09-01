import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  SimulationDisclaimer,
  ConsentModal,
  UrgentCareWarning,
} from '@/components/CommonUI'
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Lock } from 'lucide-react'

export default function PatientPreConsultation() {
  const { preConsultation, updatePreConsultation, submitPreConsultation, notify } = useVivans()
  const navigate = useNavigate()

  const [step, setStep] = useState<number>(1)
  const [isConsentOpen, setIsConsentOpen] = useState(false)
  const [hasConsented, setHasConsented] = useState(true)

  // Local state for the 4-step wizard
  const [objective, setObjective] = useState(
    preConsultation.objective ||
      'Avaliar a perda de peso no primeiro mês e entender o motivo dos despertares noturnos por volta das 3h da manhã.',
  )
  const [mainQuestions, setMainQuestions] = useState(
    preConsultation.questionsForDoctor ||
      'Devo ajustar o horário do magnésio? Posso manter o café após o almoço sem prejudicar o sono?',
  )
  const [routineChanges, setRoutineChanges] = useState(
    preConsultation.transcript ||
      'Aumentei o consumo de água para 2,5L/dia e incluí ovos no café da manhã. Tenho jantado mais leve por volta das 19h30.',
  )
  const [observedSymptoms, setObservedSymptoms] = useState(
    preConsultation.digestiveStatus ||
      'Disposição melhor pela manhã, mas leve cansaço mental por volta das 16h e despertar pontual às 3h.',
  )

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updatePreConsultation({
      objective,
      questionsForDoctor: mainQuestions,
      transcript: routineChanges,
      digestiveStatus: observedSymptoms,
    })

    submitPreConsultation()
    notify('Pré-consulta enviada com sucesso ao Dr. Guilherme Martins!')
    navigate('/paciente/consultas')
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Pré-Consulta Guiada Estruturada · Instituto Vivans" />

      {/* Header */}
      <section>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
            Preparação Clínica
          </span>
          <StatusBadge tone="green">4 minutos estimados</StatusBadge>
        </div>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Pré-Consulta Guiada
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5C5C57] max-w-2xl">
          Organize seus principais objetivos, dúvidas e relatos antes do atendimento com o Dr.
          Guilherme Martins.
        </p>
      </section>

      {/* Wizard Progress Bar */}
      <div className="rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-4 shadow-card">
        <div className="flex items-center justify-between text-xs font-bold text-[#1E1E1C] mb-2">
          <span>Passo {step} de 4</span>
          <span className="text-[#2E5E4E]">
            {step === 1 && '1. Objetivo Principal'}
            {step === 2 && '2. Principais Dúvidas'}
            {step === 3 && '3. Mudanças na Rotina'}
            {step === 4 && '4. Sintomas & Revisão'}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#FAF8F4] overflow-hidden border border-[#E8E3D9]">
          <div
            className="h-full rounded-full bg-[#2E5E4E] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 sm:p-8 shadow-card space-y-6"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Passo 1
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
                  Qual é o seu objetivo principal para esta consulta?
                </h3>
                <p className="text-xs text-[#5C5C57]">
                  O que você mais gostaria de alinhar ou resolver durante os 45 minutos com o Dr.
                  Guilherme?
                </p>
              </div>

              <textarea
                rows={4}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 text-xs sm:text-sm text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
                placeholder="Ex.: Gostaria de avaliar a perda de peso deste primeiro mês..."
              />

              <div className="rounded-xl border border-[#C49A5B]/30 bg-[#FBF5EB] p-3 text-xs text-[#9E7A3D]">
                💡 <strong className="text-[#1E1E1C]">Dica:</strong> Seja específica. Isso orienta o
                foco inicial da teleconsulta.
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Passo 2
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
                  Quais são suas principais dúvidas para o médico?
                </h3>
                <p className="text-xs text-[#5C5C57]">
                  Perguntas sobre suplementação, horário de refeições, exames ou sintomas pontuais.
                </p>
              </div>

              <textarea
                rows={4}
                value={mainQuestions}
                onChange={(e) => setMainQuestions(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 text-xs sm:text-sm text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
                placeholder="Ex.: Devo mudar o horário do magnésio? Posso tomar café após o almoço?"
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Passo 3
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
                  Quais mudanças você conseguiu implementar na rotina?
                </h3>
                <p className="text-xs text-[#5C5C57]">
                  Conte o que foi fácil e o que ainda está difícil de sustentar no dia a dia.
                </p>
              </div>

              <textarea
                rows={4}
                value={routineChanges}
                onChange={(e) => setRoutineChanges(e.target.value)}
                className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 text-xs sm:text-sm text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
                placeholder="Ex.: Aumentei o consumo de água, jantei mais cedo, mas ainda sinto sono durante a tarde..."
              />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
                  Passo 4 · Revisão Final
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E1E1C]">
                  Sintomas observados e conferência
                </h3>
                <p className="text-xs text-[#5C5C57]">
                  Revise os pontos antes do envio definitivo para o prontuário.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                  Sintomas ou sensações notadas:
                </label>
                <textarea
                  rows={3}
                  value={observedSymptoms}
                  onChange={(e) => setObservedSymptoms(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs sm:text-sm text-[#1E1E1C] focus:border-[#2E5E4E] focus:outline-none"
                />
              </div>

              {/* Review summary cards */}
              <div className="rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-4 space-y-3 text-xs">
                <div className="border-b border-[#EFECE5] pb-2">
                  <strong className="text-[#2E5E4E]">Objetivo:</strong>
                  <p className="text-[#1E1E1C] mt-0.5">{objective}</p>
                </div>
                <div className="border-b border-[#EFECE5] pb-2">
                  <strong className="text-[#2E5E4E]">Dúvidas:</strong>
                  <p className="text-[#1E1E1C] mt-0.5">{mainQuestions}</p>
                </div>
                <div>
                  <strong className="text-[#2E5E4E]">Mudanças de Rotina:</strong>
                  <p className="text-[#1E1E1C] mt-0.5">{routineChanges}</p>
                </div>
              </div>

              {/* Governance & LGPD confirmation */}
              <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E5E4E]">
                  <ShieldCheck className="size-4 text-[#2E5E4E]" />
                  <span>Termo de Consentimento e Governança Clínica</span>
                </div>
                <p className="text-xs text-[#5C5C57] leading-relaxed">
                  Ao enviar, suas respostas serão organizadas em uma síntese para o Dr. Guilherme.
                  Nenhum diagnóstico automatizado é gerado.
                </p>
                <button
                  type="button"
                  onClick={() => setIsConsentOpen(true)}
                  className="text-xs text-[#2E5E4E] font-bold underline underline-offset-4 cursor-pointer"
                >
                  Ver termos detalhados de proteção de dados (LGPD)
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EFECE5]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] px-4 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-all cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all cursor-pointer"
              >
                <span>Avançar</span>
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-7 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Enviar Pré-Consulta ao Médico</span>
              </button>
            )}
          </div>
        </form>

        {/* Sidebar Info */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 font-bold text-[#1E1E1C]">
              <Sparkles className="size-4 text-[#2E5E4E]" />
              <h4 className="font-serif text-base">Por que preencher a pré-consulta?</h4>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5C57] leading-relaxed list-disc pl-4">
              <li>Economiza até 15 minutos na consulta para discussões clínicas mais profundas.</li>
              <li>Garante que nenhuma dúvida importante seja esquecida.</li>
              <li>Permite ao médico revisar exames e evolução antes de abrir o vídeo.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#E8E3D9] bg-[#FAF8F4] p-5 shadow-card space-y-2 text-xs text-[#5C5C57]">
            <div className="flex items-center gap-1.5 font-bold text-[#1E1E1C]">
              <Lock className="size-3.5 text-[#2E5E4E]" />
              <span>Privacidade Absoluta</span>
            </div>
            <p className="leading-relaxed">
              Os dados fornecidos são acessados unicamente pelo Dr. Guilherme Martins e pela equipe
              clínica do Instituto Vivans.
            </p>
          </div>
        </aside>
      </div>

      <ConsentModal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onAccept={() => {
          setHasConsented(true)
          setIsConsentOpen(false)
        }}
      />

      <UrgentCareWarning />
    </div>
  )
}
