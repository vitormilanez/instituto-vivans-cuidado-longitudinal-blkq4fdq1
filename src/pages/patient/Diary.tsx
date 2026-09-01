import React, { useState } from 'react'
import { useVivans } from '@/context/VivansContext'
import {
  StatusBadge,
  AiDraftBadge,
  SimulationDisclaimer,
  UrgentCareWarning,
} from '@/components/CommonUI'
import {
  Camera,
  Plus,
  Sparkles,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  TrendingDown,
  Clock,
  Heart,
} from 'lucide-react'

export default function PatientDiary() {
  const { meals, addMealRecord, notify } = useVivans()

  const [mealType, setMealType] = useState<'cafe' | 'almoco' | 'lanche' | 'jantar'>('almoco')
  const [satietyLevel, setSatietyLevel] = useState<'leve' | 'adequada' | 'pesada'>('adequada')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    const mealNames = {
      cafe: 'Café da Manhã',
      almoco: 'Almoço Balanceado',
      lanche: 'Lanche da Tarde',
      jantar: 'Jantar Crononutrido',
    }

    const defaultImages = {
      cafe: 'https://img.usecurling.com/p/800/600?q=breakfast+eggs+avocado',
      almoco: 'https://img.usecurling.com/p/800/600?q=healthy+lunch+salad+salmon',
      lanche: 'https://img.usecurling.com/p/800/600?q=healthy+snack+nuts+berries',
      jantar: 'https://img.usecurling.com/p/800/600?q=light+dinner+soup+vegetables',
    }

    addMealRecord({
      meal: mealNames[mealType],
      time: 'Agora mesmo',
      image: imageUrl.trim() || defaultImages[mealType],
      alt: description.trim(),
      status: 'Registrada',
      tone: 'green',
      recognized: description.trim(),
      analysis:
        'Refeição registrada e incluída na síntese do diário alimentar para o Dr. Guilherme.',
      confidence: 'Alta confiança no registro',
      ratings: [satietyLevel === 'adequada' ? 5 : satietyLevel === 'leve' ? 3 : 2, 4, 5],
      feedbackSent: true,
    })

    setDescription('')
    setImageUrl('')
    setIsAdding(false)
    notify('Refeição registrada com sucesso no seu Diário!')
  }

  return (
    <div className="space-y-6">
      <SimulationDisclaimer text="Diário Alimentar e Registro de Rotina Sem Julgamento · Instituto Vivans" />

      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E5E4E]">
              Registro Sem Julgamento
            </span>
            <StatusBadge tone="green">Diário Ativo</StatusBadge>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Seu Diário Alimentar e de Rotina
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5C57] max-w-2xl">
            Fotografe ou descreva suas refeições para apoiar o acompanhamento do Dr. Guilherme. O
            objetivo é entender sua rotina real, sem contagem punitiva de calorias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-4 text-[#FFFFFF]" />
          <span>{isAdding ? 'Fechar Registro' : 'Registrar Refeição'}</span>
        </button>
      </section>

      {/* Add New Entry Card */}
      {isAdding && (
        <form
          onSubmit={handleAddMeal}
          className="rounded-3xl border border-[#2E5E4E]/40 bg-[#FFFFFF] p-6 shadow-card space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
            <div className="flex items-center gap-2">
              <Camera className="size-5 text-[#2E5E4E]" />
              <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">
                Novo Registro no Diário
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#8A8A84] hover:text-[#1E1E1C]"
            >
              Cancelar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1.5">
                Qual foi a refeição?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cafe', label: 'Café da manhã' },
                  { id: 'almoco', label: 'Almoço' },
                  { id: 'lanche', label: 'Lanche tarde' },
                  { id: 'jantar', label: 'Jantar' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMealType(m.id as any)}
                    className={`min-h-10 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      mealType === m.id
                        ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                        : 'border border-[#E8E3D9] bg-[#FAF8F4] text-[#5C5C57] hover:bg-[#F1EEE7]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1.5">
                Como foi a sua saciedade?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'leve', label: 'Leve fome', icon: Meh },
                  { id: 'adequada', label: 'Ideal', icon: Smile },
                  { id: 'pesada', label: 'Cheia', icon: Frown },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSatietyLevel(s.id as any)}
                      className={`min-h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center p-1 gap-0.5 transition-all cursor-pointer ${
                        satietyLevel === s.id
                          ? 'bg-[#2E5E4E] text-[#FFFFFF] shadow-sm'
                          : 'border border-[#E8E3D9] bg-[#FAF8F4] text-[#5C5C57] hover:bg-[#F1EEE7]'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-[10px]">{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
              Descreva o que comeu e como se sentiu:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salmão grelhado com legumes no vapor e azeite. Sensação de saciedade boa e sem sono pesado após..."
              className="w-full rounded-2xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-xs text-[#1E1E1C] placeholder-[#8A8A84] focus:border-[#2E5E4E] focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="min-h-11 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm cursor-pointer"
            >
              Gravar no Diário
            </button>
          </div>
        </form>
      )}

      {/* Diary Feed List */}
      <div className="space-y-4">
        {meals.map((entry) => (
          <article
            key={entry.id}
            className="overflow-hidden rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] shadow-card hover:border-[#2E5E4E]/40 transition-all flex flex-col md:flex-row"
          >
            {/* Image Preview */}
            <div className="md:w-64 h-48 md:h-auto shrink-0 relative bg-[#FAF8F4] overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E3D9]">
              <img
                src={entry.image}
                alt={entry.alt || entry.meal}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-xl bg-[#1E1E1C]/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#FFFFFF]">
                {entry.time}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE5] pb-2.5">
                  <h3 className="font-serif text-lg font-bold text-[#1E1E1C]">{entry.meal}</h3>
                  <StatusBadge tone={entry.tone || 'green'}>{entry.status}</StatusBadge>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
                  {entry.recognized}
                </p>
              </div>

              {/* AI Feedback / Medical Context */}
              {entry.analysis && (
                <div className="rounded-2xl border border-[#C49A5B]/30 bg-[#FBF5EB] p-3 text-xs text-[#9E7A3D] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="size-3.5 text-[#C49A5B]" />
                    <span>Síntese de Apoio para a Consulta:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed italic text-[#9E7A3D]">
                    "{entry.analysis}"
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <UrgentCareWarning />
    </div>
  )
}
