import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  ConsentModal,
  UrgentCareWarning,
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
  Calendar,
  Lock,
  Trash2,
  Check,
  Info,
} from 'lucide-react'

// Steps 1 to 9 of pre-consultation flow:
// 1. Ver próxima consulta
// 2. Consentimento LGPD
// 3. Escolher texto ou voz simulada
// 4. Perguntas conversacionais
// 5. Visualizar transcrição
// 6. Corrigir o próprio relato
// 7. Revisar objetivo / respostas / resumo
// 8. Enviar ao médico
// 9. Confirmação + histórico
type Step =
  | 'step1_view_appointment'
  | 'step2_lgpd_consent'
  | 'step3_choose_mode'
  | 'step4_questions'
  | 'step5_transcription_view'
  | 'step6_edit_transcript'
  | 'step7_review_summary'
  | 'step8_sending'
  | 'step9_confirmed'

export default function PatientPreConsultation() {
  const { preConsultation, updatePreConsultation, submitPreConsultation, notify } = useVivans()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('step1_view_appointment')
  const [consentModalOpen, setConsentModalOpen] = useState(false)
  const [mode, setMode] = useState<'voice' | 'text'>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Form states for editing
  const [patientGoal, setPatientGoal] = useState(preConsultation.objective)
  const [patientTranscript, setPatientTranscript] = useState(preConsultation.transcript)
  const [patientEnergy, setPatientEnergy] = useState<number>(3)
  const [patientSleep, setPatientSleep] = useState<number>(2)
  const [patientSpecificQuestion, setPatientSpecificQuestion] = useState(
    'Avaliar se o horário do jantar habitual (20h30) pode ter correlação com os despertares noturnos.',
  )

  const questions = [
    {
      q: '1. Qual é o seu principal objetivo para a consulta de hoje com o Dr. Guilherme?',
      hint: 'Ex: perda gradual de peso sem cansaço, investigar sono, tirar dúvidas...',
      sampleReply:
        'Quero manter o emagrecimento gradual com preservação de disposição e entender o motivo dos despertares às 3h.',
    },
    {
      q: '2. Como esteve seu nível de energia e vitalidade nas últimas duas semanas?',
      hint: 'Ex: boa pela manhã, queda no meio da tarde, sonolência após almoço...',
      sampleReply:
        'Disposição muito boa pela manhã, mas com leve queda de energia no final da tarde por volta das 16h.',
    },
    {
      q: '3. Houve algum sintoma novo ou alteração digestiva (náusea, azia, desconforto)?',
      hint: 'Ex: ótima digestão com mais fibras, sem queixas gástricas...',
      sampleReply:
        'Digestão excelente com o omelete e salada, sem nenhum sintoma gastrointestinal agudo.',
    },
    {
      q: '4. Tem alguma pergunta ou dúvida crucial para fazermos durante os 30 minutos de consulta?',
      hint: 'Ex: horário do jantar, suplementação, exames complementares...',
      sampleReply:
        'Gostaria de saber se adiantar o jantar para as 19h30 pode ajudar a evitar acordar de madrugada.',
    },
  ]

  const handleStartConsentFlow = () => {
    setConsentModalOpen(true)
  }

  const handleConsentAccepted = () => {
    setConsentModalOpen(false)
    updatePreConsultation({ consentGiven: true })
    setStep('step3_choose_mode')
    notify('Consentimento LGPD registrado. Escolha o formato de resposta.')
  }

  const handleSelectMode = (selectedMode: 'voice' | 'text') => {
    setMode(selectedMode)
    updatePreConsultation({ mode: selectedMode })
    setCurrentQuestionIndex(0)
    setStep('step4_questions')
  }

  const handleSimulateVoiceInput = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      notify('Áudio gravado e transcrito temporariamente com sucesso.')
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setStep('step5_transcription_view')
      }
    }, 1400)
  }

  const handleNextTextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setStep('step5_transcription_view')
    }
  }

  const handleConfirmReviewAndSend = () => {
    setStep('step8_sending')
    setTimeout(() => {
      updatePreConsultation({
        objective: patientGoal,
        transcript: patientTranscript,
        energyRating: patientEnergy,
        sleepRating: patientSleep,
        questionsForDoctor: patientSpecificQuestion,
      })
      submitPreConsultation()
      setStep('step9_confirmed')
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SimulationDisclaimer text="Pré-Consulta Longitudinal Guiada · Instituto Vivans" />

      {/* 9-Step Progress Header Indicator */}
      <div className="flex items-center justify-between border-b border-[#dfe8e3] pb-3 text-xs text-[#698078]">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#0b7b68]" />
          <span className="font-bold text-[#17372f]">Pré-Consulta Estruturada</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-[#0b7b68]">
          <span>
            {step === 'step1_view_appointment' && 'Etapa 1/9 · Próxima Consulta'}
            {step === 'step2_lgpd_consent' && 'Etapa 2/9 · Consentimento LGPD'}
            {step === 'step3_choose_mode' && 'Etapa 3/9 · Escolher Formato'}
            {step === 'step4_questions' &&
              `Etapa 4/9 · Pergunta ${currentQuestionIndex + 1} de ${questions.length}`}
            {step === 'step5_transcription_view' && 'Etapa 5/9 · Visualizar Transcrição'}
            {step === 'step6_edit_transcript' && 'Etapa 6/9 · Corrigir Relato'}
            {step === 'step7_review_summary' && 'Etapa 7/9 · Revisão Completa'}
            {step === 'step8_sending' && 'Etapa 8/9 · Enviando ao Médico...'}
            {step === 'step9_confirmed' && 'Etapa 9/9 · Confirmação & Histórico'}
          </span>
        </div>
      </div>

      {/* STEP 1: VER PRÓXIMA CONSULTA */}
      {step === 'step1_view_appointment' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-start justify-between gap-3 border-b border-[#edf2ef] pb-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68]">
                <Calendar className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0b7b68]">
                  Consulta Vinculada
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                  Hoje, 25 de agosto às 10:30
                </h2>
              </div>
            </div>
            <StatusBadge tone="green">Confirmada</StatusBadge>
          </div>

          <div className="space-y-3 text-xs text-[#526b63] leading-relaxed">
            <p>
              Você tem um retorno agendado com o <strong>Dr. Guilherme Martins</strong> (30 min por
              teleconsulta).
            </p>
            <p>
              A pré-consulta leva cerca de <strong>4 minutos</strong> e permite que você organize
              seus pontos principais com calma. Assim, o Dr. Guilherme já entra na chamada
              conhecendo suas dúvidas e sintomas recentes.
            </p>
          </div>

          <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b] flex items-start gap-3">
            <ShieldCheck className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-[#17372f]">Segurança e Governança LGPD:</strong>
              <p className="text-[#3b534b]">
                Por padrão, qualquer áudio de voz gravado é{' '}
                <strong>descartado imediatamente após a transcrição</strong>. Você sempre revisa e
                aprova o texto antes de enviar.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleStartConsentFlow}
              className="min-h-[48px] rounded-2xl bg-[#0b7b68] px-7 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#086555] transition-all flex items-center gap-2 active:scale-98"
            >
              <span>Avançar para Consentimento (LGPD)</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </article>
      )}

      {/* STEP 3: ESCOLHER TEXTO OU VOZ SIMULADA */}
      {step === 'step3_choose_mode' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b7b68]">
              Formato de Resposta
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#17372f] mt-1">
              Como você prefere relatar suas informações?
            </h2>
            <p className="text-xs text-[#60766f] mt-1">
              Ambos os formatos geram o mesmo resumo estruturado e são revisados por você antes do
              envio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSelectMode('voice')}
              className="flex flex-col items-start rounded-3xl border-2 border-[#dfe8e3] p-5 text-left transition-all hover:border-[#0b7b68] hover:bg-[#edf7f4] group shadow-2xs cursor-pointer"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#17372f] text-white group-hover:scale-105 transition-transform mb-3">
                <Mic className="size-6 text-[#9fe0ce]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#17372f]">Voz Simulada</h3>
              <p className="text-xs text-[#526b63] mt-1 leading-relaxed">
                Fale naturalmente. O sistema transcreve suas respostas e descarta o áudio por padrão
                logo em seguida.
              </p>
              <span className="mt-4 text-xs font-bold text-[#0b7b68]">
                Recomendado (Prático) &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('text')}
              className="flex flex-col items-start rounded-3xl border-2 border-[#dfe8e3] p-5 text-left transition-all hover:border-[#0b7b68] hover:bg-[#edf7f4] group shadow-2xs cursor-pointer"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68] group-hover:scale-105 transition-transform mb-3">
                <FileText className="size-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#17372f]">Digitar por Texto</h3>
              <p className="text-xs text-[#526b63] mt-1 leading-relaxed">
                Prefere silêncio? Digite suas respostas em campos guiados no seu próprio ritmo.
              </p>
              <span className="mt-4 text-xs font-bold text-[#0b7b68]">
                Formulário Guiado &rarr;
              </span>
            </button>
          </div>
        </article>
      )}

      {/* STEP 4: PERGUNTAS CONVERSACIONAIS */}
      {step === 'step4_questions' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#edf2ef] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <StatusBadge tone="green">
              {mode === 'voice' ? 'Modo Voz Ativo' : 'Modo Texto Ativo'}
            </StatusBadge>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17372f] leading-snug">
              {questions[currentQuestionIndex]?.q}
            </h2>
            <p className="text-xs text-[#60766f]">{questions[currentQuestionIndex]?.hint}</p>
          </div>

          {mode === 'voice' ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-[#f8faf9] border border-[#dfe8e3] p-8 text-center space-y-4">
              <button
                type="button"
                onClick={handleSimulateVoiceInput}
                disabled={isRecording}
                className={`grid size-22 place-items-center rounded-full shadow-lg transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#d95d52] text-white animate-pulse'
                    : 'bg-[#0b7b68] text-white hover:scale-105 active:scale-95'
                }`}
              >
                <Mic className="size-9" />
              </button>
              <div>
                <p className="text-xs font-bold text-[#17372f]">
                  {isRecording
                    ? 'Gravando e gerando transcrição temporária...'
                    : 'Toque no microfone para falar seu relato'}
                </p>
                <p className="text-[11px] text-[#60766f] mt-1">
                  (Simulação com áudio demonstrativo)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={4}
                defaultValue={questions[currentQuestionIndex]?.sampleReply}
                className="w-full rounded-2xl border border-[#dfe8e3] p-4 text-xs text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextTextQuestion}
                  className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
                >
                  Próxima Pergunta &rarr;
                </button>
              </div>
            </div>
          )}
        </article>
      )}

      {/* STEP 5: VISUALIZAR TRANSCRIÇÃO */}
      {step === 'step5_transcription_view' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b7b68]">
                Etapa 5 · Visualização da Transcrição
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#17372f] mt-0.5">
                Veja como seu relato foi transcrito
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5e776e]">
              <Trash2 className="size-3.5 text-[#0b7b68]" />
              <span>Áudio original descartado</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f8faf9] border border-[#dfe8e3] p-5 text-xs sm:text-sm text-[#2c473e] leading-relaxed whitespace-pre-line">
            {patientTranscript}
          </div>

          <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-xs text-[#0b6a5b]">
            <strong>Tudo certo?</strong> Na próxima etapa você pode alterar ou acrescentar qualquer
            detalhe caso queira corrigir suas palavras.
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep('step4_questions')}
              className="min-h-[44px] rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
            >
              Gravar Novamente
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('step6_edit_transcript')}
                className="min-h-[44px] rounded-xl border border-[#0b7b68] px-4 text-xs font-bold text-[#0b7b68] hover:bg-[#edf7f4]"
              >
                Corrigir Texto
              </button>
              <button
                type="button"
                onClick={() => setStep('step7_review_summary')}
                className="min-h-[44px] rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#086555]"
              >
                Avançar para Resumo &rarr;
              </button>
            </div>
          </div>
        </article>
      )}

      {/* STEP 6: CORRIGIR O PRÓPRIO RELATO */}
      {step === 'step6_edit_transcript' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-[#edf2ef] pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b7b68]">
              Etapa 6 · Edição do Paciente
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#17372f] mt-0.5">
              Edite suas palavras livremente
            </h2>
            <p className="text-xs text-[#60766f]">
              O texto final que o médico receberá será exatamente o que você salvar aqui.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#17372f] mb-1">
                Objetivo principal para a consulta:
              </label>
              <input
                type="text"
                value={patientGoal}
                onChange={(e) => setPatientGoal(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-[#dfe8e3] px-3.5 py-2 text-xs font-semibold text-[#17372f] focus:border-[#0b7b68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17372f] mb-1">
                Relato completo transcrito:
              </label>
              <textarea
                rows={6}
                value={patientTranscript}
                onChange={(e) => setPatientTranscript(e.target.value)}
                className="w-full rounded-2xl border border-[#0b7b68] p-4 text-xs leading-relaxed text-[#17372f] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep('step5_transcription_view')}
              className="min-h-[44px] rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
            >
              Cancelar Edição
            </button>
            <button
              type="button"
              onClick={() => setStep('step7_review_summary')}
              className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
            >
              Salvar e Gerar Síntese &rarr;
            </button>
          </div>
        </article>
      )}

      {/* STEP 7: REVISAR OBJETIVO / RESPOSTAS / RESUMO */}
      {step === 'step7_review_summary' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2ef] pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AiDraftBadge status="Rascunho gerado com IA - requer validação médica" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#17372f]">
                Revisão da Síntese de Pré-Consulta
              </h2>
            </div>
            <StatusBadge tone="blue">Pronto para Enviar</StatusBadge>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-[#2c473e]">
            <div className="rounded-2xl bg-[#f5f8f6] p-4.5 border border-[#edf2ef] space-y-2">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Objetivo Declarado por Você:
              </p>
              <p className="font-semibold text-[#0b7b68]">“{patientGoal}”</p>
            </div>

            <div className="rounded-2xl bg-[#f5f8f6] p-4.5 border border-[#edf2ef] space-y-2">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Síntese Estruturada do Copiloto para o Dr. Guilherme:
              </p>
              <p className="whitespace-pre-line text-[#45655c]">{preConsultation.aiSynthesis}</p>
            </div>

            <div className="rounded-2xl border border-[#dfe8e3] p-4.5 space-y-2">
              <p className="font-bold text-[#17372f] uppercase tracking-wider text-[11px]">
                Perguntas Organizadas para a Consulta:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#526b63]">
                {preConsultation.suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#edf2ef]">
            <button
              type="button"
              onClick={() => setStep('step6_edit_transcript')}
              className="min-h-[44px] rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
            >
              Corrigir meu relato
            </button>
            <button
              type="button"
              onClick={handleConfirmReviewAndSend}
              className="min-h-[48px] rounded-2xl bg-[#0b7b68] px-7 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#086555]"
            >
              Enviar ao Dr. Guilherme Martins &rarr;
            </button>
          </div>
        </article>
      )}

      {/* STEP 8: ENVIANDO AO MÉDICO */}
      {step === 'step8_sending' && (
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-12 text-center space-y-4 shadow-sm animate-fade-in">
          <div className="size-12 border-4 border-[#0b7b68] border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="font-serif text-xl font-bold text-[#17372f]">
            Enviando pré-consulta ao prontuário...
          </h2>
          <p className="text-xs text-[#60766f]">
            Compilando relato, estruturando síntese e descartando áudio original por segurança.
          </p>
        </article>
      )}

      {/* STEP 9: CONFIRMAÇÃO + HISTÓRICO */}
      {step === 'step9_confirmed' && (
        <article className="rounded-3xl border border-[#9fc9bd] bg-white p-8 text-center space-y-6 shadow-md animate-fade-in">
          <div className="grid size-16 place-items-center rounded-full bg-[#e8f4f0] text-[#0b7b68] mx-auto">
            <CheckCircle2 className="size-9" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#17372f]">
              Pré-Consulta Enviada com Sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-[#526b63] max-w-md mx-auto mt-1 leading-relaxed">
              O Dr. Guilherme Martins já recebeu a síntese do seu sono e saciedade para a consulta
              das 10:30.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dfe8e3] bg-[#f8faf9] p-4 text-xs text-[#0b6a5b] max-w-md mx-auto flex items-center justify-center gap-2">
            <Check className="size-4 text-[#0b7b68]" />
            <span>Áudio descartado · Relato salvo no prontuário protegido</span>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/paciente')}
              className="min-h-[44px] rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white hover:bg-[#086555]"
            >
              Voltar ao Início
            </button>
            <button
              type="button"
              onClick={() => navigate('/medico/consulta/apt-marina')}
              className="min-h-[44px] rounded-xl border border-[#dfe8e3] px-6 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
            >
              Entrar na Sala Virtual
            </button>
          </div>
        </article>
      )}

      {/* LGPD Consent Modal */}
      <ConsentModal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        onAccept={handleConsentAccepted}
      />

      <UrgentCareWarning />
    </div>
  )
}
