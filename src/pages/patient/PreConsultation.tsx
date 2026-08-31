import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  ConsentModal,
} from '@/components/CommonUI'
import {
  Mic,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Edit3,
  RotateCcw,
} from 'lucide-react'

type Step =
  | 'intro'
  | 'mode_select'
  | 'conversation'
  | 'transcription_review'
  | 'ai_summary'
  | 'completed'

export default function PatientPreConsultation() {
  const { preConsultation, updatePreConsultation, submitPreConsultation, notify } = useVivans()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('intro')
  const [consentModalOpen, setConsentModalOpen] = useState(false)
  const [mode, setMode] = useState<'voice' | 'text'>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Form states
  const [patientGoal, setPatientGoal] = useState(preConsultation.objective)
  const [patientTranscript, setPatientTranscript] = useState(preConsultation.transcript)
  const [editableTranscript, setEditableTranscript] = useState(false)

  const questions = [
    {
      q: 'Qual é o seu principal objetivo para a consulta com o Dr. Guilherme hoje?',
      hint: 'Ex: perder peso sem cansaço, entender despertares noturnos...',
    },
    {
      q: 'Como tem sido seu nível de energia e disposição nas últimas duas semanas?',
      hint: 'Ex: boa pela manhã, queda no final da tarde...',
    },
    {
      q: 'Você teve algum novo sintoma ou incômodo (náusea, azia, dor) desde o último retorno?',
      hint: 'Ex: boa digestão, sem desconforto digestivo...',
    },
    {
      q: 'Tem alguma pergunta específica que você não quer esquecer de fazer ao médico?',
      hint: 'Ex: horário ideal do jantar, suplementação...',
    },
  ]

  const handleStartConsent = () => {
    setConsentModalOpen(true)
  }

  const handleAcceptConsent = () => {
    setConsentModalOpen(false)
    updatePreConsultation({ consentGiven: true })
    setStep('mode_select')
  }

  const handleSelectMode = (selectedMode: 'voice' | 'text') => {
    setMode(selectedMode)
    updatePreConsultation({ mode: selectedMode })
    setStep('conversation')
  }

  const handleSimulateVoiceInput = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      notify('Áudio recebido e transcrito com sucesso pelo Copiloto Vivans.')
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setStep('transcription_review')
      }
    }, 1500)
  }

  const handleNextQuestionText = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setStep('transcription_review')
    }
  }

  const handleFinalSubmit = () => {
    updatePreConsultation({
      objective: patientGoal,
      transcript: patientTranscript,
    })
    submitPreConsultation()
    setStep('completed')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SimulationDisclaimer text="Fluxo Completo de Pré-Consulta · Instituto Vivans" />

      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-[#dfe8e3] pb-3 text-xs text-[#698078]">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#0b7b68]" />
          <span className="font-bold text-[#17372f]">Pré-Consulta Inteligente</span>
        </div>
        <span>
          Etapa:{' '}
          {step === 'intro'
            ? '1/5 Início'
            : step === 'mode_select'
              ? '2/5 Formato'
              : step === 'conversation'
                ? `3/5 Perguntas (${currentQuestionIndex + 1}/${questions.length})`
                : step === 'transcription_review'
                  ? '4/5 Revisão'
                  : step === 'ai_summary'
                    ? '5/5 Síntese'
                    : 'Concluída'}
        </span>
      </div>

      {/* STEP 1: INTRO & NEXT APPOINTMENT */}
      {step === 'intro' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68]">
              <Sparkles className="size-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                Prepare sua Consulta com o Dr. Guilherme
              </h2>
              <p className="text-xs text-[#698078]">Consulta de hoje, 10:30 (Retorno de 30 min)</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f4f7f5] p-4 text-xs text-[#45655c] leading-relaxed space-y-2">
            <p>
              A pré-consulta do <strong>Instituto Vivans</strong> ajuda você a organizar seus
              pensamentos com calma antes de entrar na sala de vídeo.
            </p>
            <p>
              Você responderá a 4 perguntas curtas por <strong>voz simulada</strong> ou{' '}
              <strong>texto</strong>. A IA transcreverá suas falas e montará um resumo prévio para o
              médico, economizando tempo clínico para conversas mais profundas.
            </p>
          </div>

          <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b] flex items-center gap-3">
            <ShieldCheck className="size-5 shrink-0" />
            <span>
              <strong>Privacidade Garantida:</strong> O áudio é descartado logo após a transcrição
              por padrão. Você poderá ler e editar tudo antes de enviar.
            </span>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleStartConsent}
              className="min-h-12 rounded-2xl bg-[#0b7b68] px-8 text-xs font-bold text-white shadow-md hover:bg-[#096656] transition-all"
            >
              Iniciar com Consentimento &rarr;
            </button>
          </div>
        </article>
      )}

      {/* STEP 2: MODE SELECT (VOICE OR TEXT) */}
      {step === 'mode_select' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Escolha seu formato preferido
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#17372f] mt-1">
              Como você prefere responder?
            </h2>
            <p className="text-xs text-[#698078] mt-1">
              Ambos os formatos geram transcrição completa e resumo para validação médica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSelectMode('voice')}
              className="flex flex-col items-start rounded-3xl border-2 border-[#dfe8e3] p-5 text-left transition-all hover:border-[#0b7b68] hover:bg-[#edf7f4] group"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#17372f] text-white group-hover:scale-105 transition-transform mb-4">
                <Mic className="size-6 text-[#9fe0ce]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#17372f]">Voz Conversacional</h3>
              <p className="text-xs text-[#60766f] mt-1 leading-relaxed">
                Fale naturalmente. A assistente do Instituto Vivans ouve, transcreve e organiza seus
                pontos principais.
              </p>
              <span className="mt-4 text-xs font-bold text-[#0b7b68]">
                Recomendado (5 min) &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('text')}
              className="flex flex-col items-start rounded-3xl border-2 border-[#dfe8e3] p-5 text-left transition-all hover:border-[#0b7b68] hover:bg-[#edf7f4] group"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68] group-hover:scale-105 transition-transform mb-4">
                <FileText className="size-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#17372f]">Digitar por Texto</h3>
              <p className="text-xs text-[#60766f] mt-1 leading-relaxed">
                Prefere silêncio? Digite suas respostas em um formulário guiado passo a passo no seu
                ritmo.
              </p>
              <span className="mt-4 text-xs font-bold text-[#0b7b68]">
                Formulário Guiado &rarr;
              </span>
            </button>
          </div>
        </article>
      )}

      {/* STEP 3: CONVERSATIONAL QUESTIONS */}
      {step === 'conversation' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <StatusBadge tone="green">
              {mode === 'voice' ? 'Modo Voz Ativo' : 'Modo Texto Ativo'}
            </StatusBadge>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17372f]">
              {questions[currentQuestionIndex]?.q}
            </h3>
            <p className="text-xs text-[#698078]">{questions[currentQuestionIndex]?.hint}</p>
          </div>

          {mode === 'voice' ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-[#f8faf9] border border-[#dfe8e3] p-8 text-center space-y-4">
              <button
                type="button"
                onClick={handleSimulateVoiceInput}
                disabled={isRecording}
                className={`grid size-24 place-items-center rounded-full shadow-lg transition-all ${
                  isRecording
                    ? 'bg-[#e67e76] text-white animate-pulse'
                    : 'bg-[#0b7b68] text-white hover:scale-105 active:scale-95'
                }`}
              >
                <Mic className="size-10" />
              </button>
              <div>
                <p className="text-xs font-bold text-[#17372f]">
                  {isRecording
                    ? 'Ouvindo e transcrevendo com IA...'
                    : 'Clique no microfone para falar seu relato'}
                </p>
                <p className="text-[11px] text-[#698078] mt-1">
                  (Simulação com áudio demonstrativo pré-estruturado)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={4}
                defaultValue={
                  currentQuestionIndex === 0
                    ? patientGoal
                    : currentQuestionIndex === 1
                      ? 'Minha energia tem ficado um pouco mais baixa no fim da tarde por volta das 16h.'
                      : currentQuestionIndex === 2
                        ? 'Digestão excelente, não tive nenhuma queixa gástrica.'
                        : 'Quero saber se o horário do jantar às 20h pode estar influenciando no meu sono.'
                }
                className="w-full rounded-2xl border border-[#dfe8e3] p-4 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestionText}
                  className="min-h-11 rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656]"
                >
                  Avançar Pergunta &rarr;
                </button>
              </div>
            </div>
          )}
        </article>
      )}

      {/* STEP 4: TRANSCRIPTION & EDITING */}
      {step === 'transcription_review' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Etapa de Revisão do Paciente
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#17372f] mt-1">
                Revise sua Transcrição
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditableTranscript(!editableTranscript)}
              className="flex items-center gap-1.5 rounded-xl border border-[#dfe8e3] px-3.5 py-1.5 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
            >
              <Edit3 className="size-3.5 text-[#0b7b68]" />
              <span>{editableTranscript ? 'Concluir Edição' : 'Editar Texto'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17372f] mb-1">
                Objetivo Central Declarado:
              </label>
              <input
                type="text"
                value={patientGoal}
                onChange={(e) => setPatientGoal(e.target.value)}
                className="w-full rounded-xl border border-[#dfe8e3] px-3.5 py-2.5 text-xs font-semibold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17372f] mb-1">
                Transcrição Completa das suas Respostas:
              </label>
              {editableTranscript ? (
                <textarea
                  rows={6}
                  value={patientTranscript}
                  onChange={(e) => setPatientTranscript(e.target.value)}
                  className="w-full rounded-2xl border border-[#0b7b68] p-4 text-xs leading-relaxed text-[#17372f] focus:outline-none"
                />
              ) : (
                <div className="rounded-2xl bg-[#f8faf9] border border-[#dfe8e3] p-4 text-xs leading-relaxed text-[#45655c]">
                  {patientTranscript}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b]">
              <strong>Conferência da Paciente:</strong> Você pode alterar qualquer palavra antes de
              gerar a síntese que será entregue ao Dr. Guilherme.
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#edf2ef]">
            <button
              type="button"
              onClick={() => setStep('conversation')}
              className="min-h-11 rounded-xl border border-[#dfe8e3] px-5 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => setStep('ai_summary')}
              className="min-h-11 rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656]"
            >
              Gerar Síntese para o Médico &rarr;
            </button>
          </div>
        </article>
      )}

      {/* STEP 5: AI SYNTHESIS PREVIEW & FINAL SUBMIT */}
      {step === 'ai_summary' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ef] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                Síntese da Pré-Consulta
              </h2>
            </div>
            <StatusBadge tone="blue">Pronto para Envio</StatusBadge>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-[#3b534b]">
            <div className="rounded-2xl bg-[#f4f7f5] p-4 space-y-2 border border-[#edf2ef]">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Resumo Estruturado para o Dr. Guilherme:
              </p>
              <p className="whitespace-pre-line text-[#45655c]">{preConsultation.aiSynthesis}</p>
            </div>

            <div className="rounded-2xl border border-[#dfe8e3] p-4 space-y-2">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Perguntas Sugeridas para a Consulta:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#60766f]">
                {preConsultation.suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#edf2ef]">
            <button
              type="button"
              onClick={() => setStep('transcription_review')}
              className="min-h-11 rounded-xl border border-[#dfe8e3] px-5 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
            >
              Corrigir meu relato
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="min-h-12 rounded-2xl bg-[#0b7b68] px-8 text-xs font-bold text-white shadow-md hover:bg-[#096656]"
            >
              Enviar ao Dr. Guilherme Martins &rarr;
            </button>
          </div>
        </article>
      )}

      {/* STEP 6: COMPLETED CONFIRMATION */}
      {step === 'completed' && (
        <article className="rounded-3xl border border-[#9fc9bd] bg-white p-8 text-center space-y-5 shadow-lg animate-fade-in">
          <div className="grid size-16 place-items-center rounded-full bg-[#e8f4f0] text-[#0b7b68] mx-auto">
            <CheckCircle2 className="size-8" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#17372f]">
            Pré-Consulta Enviada com Sucesso!
          </h2>
          <p className="text-xs sm:text-sm text-[#60766f] max-w-md mx-auto leading-relaxed">
            O Dr. Guilherme Martins já pode visualizar seu relato e sua síntese estruturada no
            prontuário para a consulta de hoje às 10:30.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/paciente')}
              className="min-h-11 rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#096656]"
            >
              Voltar ao Início
            </button>
            <button
              type="button"
              onClick={() => navigate('/medico/consulta/apt-marina')}
              className="min-h-11 rounded-xl border border-[#dfe8e3] px-6 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
            >
              Entrar na Sala de Consulta
            </button>
          </div>
        </article>
      )}

      {/* LGPD Consent Modal */}
      <ConsentModal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        onAccept={handleAcceptConsent}
      />
    </div>
  )
}
