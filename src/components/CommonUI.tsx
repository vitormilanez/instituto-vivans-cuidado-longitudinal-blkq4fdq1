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
    green: 'bg-[#ebf6f2] text-[#075f50] border-[#bfe4d8]',
    amber: 'bg-[#fef7e7] text-[#7d5308] border-[#f8deb0]',
    rose: 'bg-[#fcf0ee] text-[#8e2e28] border-[#f5c7c2]',
    blue: 'bg-[#eff5fc] text-[#244c77] border-[#cbe0f6]',
    gray: 'bg-[#f2f6f4] text-[#3f5750] border-[#dbe6e0]',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-2xs',
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full shrink-0',
          tone === 'green' && 'bg-[#097260]',
          tone === 'amber' && 'bg-[#c57d19]',
          tone === 'rose' && 'bg-[#cf4b42]',
          tone === 'blue' && 'bg-[#355b88]',
          tone === 'gray' && 'bg-[#708981]',
        )}
      />
      {children}
    </span>
  )
}

export function AiDraftBadge({
  className,
  status = 'Rascunho gerado com IA - requer validação médica',
  variant = 'default',
}: {
  className?: string
  status?: string
  variant?: 'default' | 'compact' | 'highlight'
}) {
  return (
    <div
      role="status"
      aria-label={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border border-[#b8dcce] bg-[#edf7f3] px-3 py-1 text-xs font-semibold text-[#075f50] shadow-2xs',
        variant === 'highlight' && 'border-[#f0d59c] bg-[#fffbf2] text-[#7a540c]',
        variant === 'compact' && 'px-2 py-0.5 text-[11px]',
        className,
      )}
    >
      <Sparkles
        className={cn(
          'size-3.5 shrink-0',
          variant === 'highlight' ? 'text-[#a37628]' : 'text-[#097260]',
        )}
      />
      <span>{status}</span>
    </div>
  )
}

export function ClinicalLayerBadge({
  layer,
  className,
}: {
  layer: 'fato' | 'relato' | 'sintese_ia' | 'decisao_medica'
  className?: string
}) {
  const layerConfigs = {
    fato: {
      label: 'Fato Observado / Biossinal',
      className: 'bg-[#f4f7f5] text-[#29423b] border-[#d8e4df]',
    },
    relato: {
      label: 'Relato da Paciente (Original)',
      className: 'bg-[#eff5fc] text-[#1e4877] border-[#c7ddf4]',
    },
    sintese_ia: {
      label: 'Síntese IA (Rascunho de Apoio)',
      className: 'bg-[#fffbf2] text-[#7d5308] border-[#f8deb0]',
    },
    decisao_medica: {
      label: 'Decisão Médica Aprovada',
      className: 'bg-[#ebf6f2] text-[#075f50] border-[#bfe4d8]',
    },
  }

  const current = layerConfigs[layer]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase',
        current.className,
        className,
      )}
    >
      {current.label}
    </span>
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
            Para que o <strong>Dr. Guilherme Martins</strong> disponha dos dados organizados antes
            da sua consulta, suas respostas da pré-consulta serão compiladas em síntese estruturada
            de apoio.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3b534b]">
            <li>
              <strong>Descarte de áudio:</strong> O áudio demonstrativo é utilizado exclusivamente
              para transcrição no momento da consulta.
            </li>
            <li>
              <strong>Revisão prévia:</strong> Você poderá revisar e editar todas as respostas antes
              do envio ao médico.
            </li>
            <li>
              <strong>Sigilo e governança:</strong> Os dados clínicos não alimentam modelos públicos
              de terceiros.
            </li>
            <li>
              <strong>Separação de papéis:</strong> O sistema atua exclusivamente na compilação de
              dados e não toma decisões clínicas, não prescreve nem define diagnósticos.
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
