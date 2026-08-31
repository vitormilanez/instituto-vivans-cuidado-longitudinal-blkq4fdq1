import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, ShieldCheck, AlertCircle, ExternalLink, Info } from 'lucide-react'

export function StatusBadge({
  children,
  tone = 'green',
  className,
}: {
  children: ReactNode
  tone?: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  className?: string
}) {
  const tones = {
    green: 'bg-[#e8f4f0] text-[#0b6a5b] border-[#c2e2d8]',
    amber: 'bg-[#fff4d8] text-[#825b0b] border-[#fde2a4]',
    rose: 'bg-[#fdecea] text-[#9c453f] border-[#f9c7c2]',
    blue: 'bg-[#edf3fb] text-[#456b9c] border-[#cde0f7]',
    gray: 'bg-[#f1f5f3] text-[#526a62] border-[#dfe8e3]',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function AiDraftBadge({
  className,
  status = 'Rascunho gerado com IA - requer validação médica',
}: {
  className?: string
  status?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border border-[#b9d8cf] bg-[#edf7f4] px-3 py-1.5 text-xs font-medium text-[#0b6a5b] shadow-sm',
        className,
      )}
    >
      <Sparkles className="size-3.5 shrink-0 text-[#0b7b68]" />
      <span>{status}</span>
    </div>
  )
}

export function SimulationDisclaimer({
  text = 'Dados e integrações demonstrativas simuladas para fins de prototipagem e validação clínica.',
  className,
}: {
  text?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border border-[#f0d59c] bg-[#fffbf2] px-3.5 py-2 text-xs text-[#805f24]',
        className,
      )}
    >
      <AlertCircle className="size-4 shrink-0 text-[#a37628]" />
      <span>{text}</span>
    </div>
  )
}

export function UrgentCareWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-2xl border border-[#dfe8e3] bg-white p-3.5 text-xs text-[#60766f] shadow-sm',
        className,
      )}
    >
      <Info className="size-4 shrink-0 text-[#0b7b68] mt-0.5" />
      <p className="leading-relaxed">
        <strong>Aviso informativo:</strong> Este aplicativo é para acompanhamento longitudinal e{' '}
        <strong>não substitui atendimento médico de urgência ou emergência</strong>. Em situações
        agudas ou graves, procure imediatamente um pronto-atendimento ou ligue 192.
      </p>
    </div>
  )
}

export function EvidenceModal({
  isOpen,
  onClose,
  evidence,
}: {
  isOpen: boolean
  onClose: () => void
  evidence: {
    title: string
    source: 'PubMed' | 'Cochrane' | 'Conitec'
    year: string
    evidenceType: string
    confidence: 'Alta' | 'Moderada' | 'Limitada'
    url: string
    summary: string
    relevance: string
  } | null
}) {
  if (!isOpen || !evidence) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-[#edf2ef] pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#17372f] px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
              {evidence.source}
            </span>
            <span className="text-xs text-[#698078]">
              {evidence.year} · {evidence.evidenceType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#60766f] hover:bg-[#f4f7f5] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#17372f] leading-snug">
            {evidence.title}
          </h3>

          <div className="rounded-2xl bg-[#f4f7f5] p-4 text-sm text-[#45655c] leading-relaxed">
            <p className="font-semibold text-xs text-[#17372f] uppercase tracking-wider mb-1">
              Síntese do Estudo
            </p>
            {evidence.summary}
          </div>

          <div className="rounded-2xl border border-[#b9d8cf] bg-[#edf7f4] p-3 text-xs text-[#0b6a5b]">
            <strong>Aplicabilidade ao Caso:</strong> {evidence.relevance}
          </div>

          <div className="flex items-center justify-between text-xs text-[#698078] pt-2">
            <span>
              Nível de Confiança: <strong>{evidence.confidence}</strong>
            </span>
            <a
              href={evidence.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#0b7b68] font-bold underline underline-offset-4"
            >
              Ver na fonte (Simulação) <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="border-t border-[#edf2ef] pt-3 text-[11px] text-[#8a9c96] leading-normal">
            Aviso: Referência demonstrativa. Toda e qualquer decisão diagnóstica ou terapêutica
            permanece exclusivamente a cargo do médico responsável.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-10 rounded-xl bg-[#17372f] px-5 text-xs font-bold text-white hover:bg-[#0f2d26] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConsentModal({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-[#edf2ef] pb-4">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#e8f4f0] text-[#0b7b68]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#17372f]">
              Consentimento e Privacidade (LGPD)
            </h3>
            <p className="text-xs text-[#698078]">Pré-consulta Instituto Vivans</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#526a62]">
          <p>
            Para que o <strong>Dr. Guilherme Martins</strong> possa preparar seu atendimento com
            mais qualidade, suas respostas da pré-consulta serão transcritas e organizadas pelo
            Copiloto IA do Instituto Vivans.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3b534b]">
            <li>
              <strong>Descarte de áudio:</strong> O áudio é utilizado unicamente para transcrição e
              descartado por padrão após o processamento.
            </li>
            <li>
              <strong>Revisão prévia:</strong> Você poderá revisar e editar todo o texto antes de
              enviá-lo ao médico.
            </li>
            <li>
              <strong>Não-compartilhamento:</strong> Seus dados de saúde não são utilizados para
              treinamento público de IA e não são transferidos a terceiros.
            </li>
            <li>
              <strong>Separação de papéis:</strong> A IA apenas organiza seu relato; ela não toma
              decisões clínicas.
            </li>
          </ul>
          <div className="rounded-xl border border-[#dfe8e3] bg-[#f8faf9] p-3 text-[11px] text-[#698078]">
            Ambiente de demonstração fictício. Você pode revogar este consentimento a qualquer
            momento nas configurações do seu perfil.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-11 rounded-xl border border-[#dfe8e3] px-5 text-xs font-bold text-[#60766f] hover:bg-[#f4f7f5]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="w-full sm:w-auto min-h-11 rounded-xl bg-[#0b7b68] px-6 text-xs font-bold text-white shadow-md hover:bg-[#086354]"
          >
            Concordo e quero continuar
          </button>
        </div>
      </div>
    </div>
  )
}
