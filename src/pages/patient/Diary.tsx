import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import { StatusBadge, AiDraftBadge, SimulationDisclaimer } from '@/components/CommonUI'
import {
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  UploadCloud,
} from 'lucide-react'

export default function PatientDiary() {
  const { meals, addMealRecord, rateMealRecord, notify } = useVivans()

  const [selectedMealType, setSelectedMealType] = useState('Jantar')
  const [photoSelected, setPhotoSelected] = useState<string>(
    'https://img.usecurling.com/p/600/600?q=salad%20omelette&color=green',
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  // 3 context ratings (1 to 5)
  const [satietyRating, setSatietyRating] = useState<number>(4)
  const [comfortRating, setComfortRating] = useState<number>(4)
  const [easeRating, setEaseRating] = useState<number>(5)
  const [submittedCurrent, setSubmittedCurrent] = useState<boolean>(false)

  const handleSimulatePhoto = (url: string, type: string) => {
    setPhotoSelected(url)
    setSelectedMealType(type)
    setAnalysisResult(null)
    setSubmittedCurrent(false)
  }

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResult(
        'Reconhecimento visual preliminar: Omelete de vegetais (aprox. 2 ovos), porção de brócolis no vapor, folhas verdes e azeite. Composição equilibrada com bom aporte protéico e de fibras.',
      )
      notify('Análise visual assistida por IA concluída.')
    }, 1200)
  }

  const handleSendFeedbackToDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!analysisResult) {
      handleRunAiAnalysis()
    }

    addMealRecord({
      meal: selectedMealType,
      time:
        'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      image: photoSelected,
      alt: `Prato de ${selectedMealType} registrado pela paciente.`,
      status: 'Enviada ao Médico',
      tone: 'green',
      recognized: 'Proteína (ovos), vegetais e fibras.',
      analysis: analysisResult || 'Composição equilibrada.',
      confidence: 'Alta confiança nos itens visíveis',
      ratings: [satietyRating, comfortRating, easeRating],
      feedbackSent: true,
    })

    setSubmittedCurrent(true)
    notify('Refeição e avaliações enviadas ao prontuário do Dr. Guilherme.')
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Diário Alimentar Sem Julgamento · Instituto Vivans" />

      {/* Header */}
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
          Diário Alimentar
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#17372f]">
          Registre o Que Aconteceu
        </h1>
        <p className="mt-1 text-sm text-[#60766f]">
          O objetivo é identificar padrões de saciedade e rotina, não classificar refeições como
          "boas" ou "ruins".
        </p>
      </section>

      {/* Main Journal Layout */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Active Meal Registration & Analysis */}
        <article className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                {selectedMealType} · Registro em Andamento
              </p>
              <h3 className="font-serif text-xl font-bold text-[#17372f]">
                Foto e Análise da Refeição
              </h3>
            </div>
            <StatusBadge tone="gray">Foto Demonstrativa</StatusBadge>
          </div>

          {/* Photo Selector */}
          <div className="mt-5 space-y-3">
            <p className="text-xs font-bold text-[#17372f]">
              Selecione uma foto demonstrativa para simular o upload:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Jantar Leve',
                  type: 'Jantar',
                  url: 'https://img.usecurling.com/p/600/600?q=salad%20omelette&color=green',
                },
                {
                  label: 'Almoço Colorido',
                  type: 'Almoço',
                  url: 'https://img.usecurling.com/p/600/600?q=grilled%20chicken%20salad&color=amber',
                },
                {
                  label: 'Café da Manhã',
                  type: 'Café da manhã',
                  url: 'https://img.usecurling.com/p/600/600?q=yogurt%20berries%20oats&color=red',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSimulatePhoto(item.url, item.type)}
                  className={`overflow-hidden rounded-2xl border text-left transition-all ${
                    photoSelected === item.url
                      ? 'border-[#0b7b68] ring-2 ring-[#0b7b68]/30'
                      : 'border-[#dfe8e3] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="h-20 w-full object-cover" />
                  <div className="p-2 text-[11px] font-bold text-[#17372f] truncate">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current photo preview & AI Trigger */}
          <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr] items-center rounded-2xl bg-[#f8faf9] p-4 border border-[#edf2ef]">
            <img
              src={photoSelected}
              alt="Prato selecionado"
              className="h-36 w-full rounded-2xl object-cover shadow-sm"
            />
            <div className="space-y-3">
              <p className="text-xs text-[#60766f]">
                Você registrou esta refeição como{' '}
                <strong className="text-[#17372f]">{selectedMealType}</strong>. Clique abaixo para
                executar a análise visual assistida.
              </p>
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing || Boolean(analysisResult)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b7b68] px-4 text-xs font-bold text-white hover:bg-[#096656] disabled:bg-[#779a91]"
              >
                <Sparkles className="size-4" />
                <span>
                  {isAnalyzing
                    ? 'Processando visão computacional...'
                    : analysisResult
                      ? 'Análise Concluída'
                      : 'Analisar Prato com IA'}
                </span>
              </button>
            </div>
          </div>

          {/* AI Analysis Result box & Mandatory Medical Disclaimer */}
          {analysisResult && (
            <div className="mt-5 space-y-3 animate-fade-in">
              <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b7b68]">
                    <Sparkles className="size-3.5" />
                    <span>Visão Assistida por IA</span>
                  </div>
                  <StatusBadge tone="green">Compatível com o Plano</StatusBadge>
                </div>
                <p className="text-xs text-[#3b534b] leading-relaxed">{analysisResult}</p>
              </div>

              {/* Explicit Mandatory Warning */}
              <div className="rounded-xl border border-[#f0d59c] bg-[#fffbf2] p-3 text-[11px] text-[#805f24] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#70480e] mb-0.5">
                  <AlertCircle className="size-3.5" />
                  <span>Aviso Importante sobre Reconhecimento Visual</span>
                </div>
                Uma foto não determina com precisão ingredientes ocultos (óleos, açúcar),
                quantidades exatas ou valor nutricional absoluto. A análise serve como contexto
                visual para o Dr. Guilherme.
              </div>
            </div>
          )}

          {/* 3 Context Ratings (1 to 5) */}
          <form
            onSubmit={handleSendFeedbackToDoctor}
            className="mt-6 border-t border-[#edf2ef] pt-5 space-y-5"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0b7b68]">
                Contexto da Refeição (Notas de 1 a 5)
              </p>
              <h4 className="font-serif text-base font-bold text-[#17372f] mt-1">
                Como você se sentiu com esta refeição?
              </h4>
            </div>

            {/* Question 1: Satiety */}
            <div className="rounded-2xl border border-[#dfe8e3] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17372f]">
                <span>1. Nível de Saciedade ao terminar</span>
                <span className="text-[#0b7b68]">{satietyRating} de 5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSatietyRating(val)}
                    className={`flex-1 min-h-10 rounded-xl border text-xs font-bold transition-all ${
                      satietyRating === val
                        ? 'border-[#0b7b68] bg-[#0b7b68] text-white shadow-sm'
                        : 'border-[#dfe8e3] text-[#60766f] hover:bg-[#f4f7f5]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#789087]">
                <span>1 · Pouco saciada</span>
                <span>5 · Plenamente saciada</span>
              </div>
            </div>

            {/* Question 2: Comfort */}
            <div className="rounded-2xl border border-[#dfe8e3] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17372f]">
                <span>2. Conforto Digestivo após comer</span>
                <span className="text-[#0b7b68]">{comfortRating} de 5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setComfortRating(val)}
                    className={`flex-1 min-h-10 rounded-xl border text-xs font-bold transition-all ${
                      comfortRating === val
                        ? 'border-[#0b7b68] bg-[#0b7b68] text-white shadow-sm'
                        : 'border-[#dfe8e3] text-[#60766f] hover:bg-[#f4f7f5]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#789087]">
                <span>1 · Desconfortável/Pesada</span>
                <span>5 · Muito leve e bem</span>
              </div>
            </div>

            {/* Question 3: Ease */}
            <div className="rounded-2xl border border-[#dfe8e3] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17372f]">
                <span>3. Facilidade de seguir o combinado</span>
                <span className="text-[#0b7b68]">{easeRating} de 5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEaseRating(val)}
                    className={`flex-1 min-h-10 rounded-xl border text-xs font-bold transition-all ${
                      easeRating === val
                        ? 'border-[#0b7b68] bg-[#0b7b68] text-white shadow-sm'
                        : 'border-[#dfe8e3] text-[#60766f] hover:bg-[#f4f7f5]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#789087]">
                <span>1 · Muito difícil</span>
                <span>5 · Muito natural e prático</span>
              </div>
            </div>

            {/* Submission button */}
            {submittedCurrent ? (
              <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-4 text-center">
                <CheckCircle2 className="size-6 text-[#0b7b68] mx-auto mb-1" />
                <p className="text-xs font-bold text-[#0b6a5b]">
                  Avaliação enviada com sucesso ao Dr. Guilherme!
                </p>
                <p className="text-[11px] text-[#526a62] mt-0.5">
                  O registro foi compilado no prontuário longitudinal.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="min-h-12 w-full rounded-2xl bg-[#17372f] px-6 text-xs font-bold text-white hover:bg-[#0e2721] transition-all shadow-md"
              >
                Enviar Refeição e Avaliação ao Médico
              </button>
            )}
          </form>
        </article>

        {/* History of meals */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#17372f] mb-4">Refeições Recentes</h3>

            <div className="space-y-4">
              {meals.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-[#edf2ef] p-3.5 space-y-2 hover:bg-[#f8faf9] transition-colors"
                >
                  <div className="flex gap-3">
                    <img
                      src={m.image}
                      alt={m.alt}
                      className="size-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-[#17372f]">{m.meal}</strong>
                        <span className="text-[10px] text-[#789087]">{m.time}</span>
                      </div>
                      <p className="text-[11px] text-[#60766f] line-clamp-2 mt-0.5">
                        {m.recognized}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-[#0b7b68] font-semibold">
                        <CheckCircle2 className="size-3" />
                        <span>Avaliada (3/3)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#17372f] p-5 text-white shadow-sm text-xs space-y-2">
            <p className="font-bold text-[#9cc7ba] uppercase tracking-wider text-[11px]">
              Privacidade no Diário
            </p>
            <p className="text-[#d6e8e2] leading-relaxed">
              Suas fotos são restritas à equipe médica do Instituto Vivans e não são indexadas
              publicamente.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
