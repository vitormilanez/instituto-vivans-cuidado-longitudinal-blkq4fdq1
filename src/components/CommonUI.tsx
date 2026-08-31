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
    green: 'bg-[#D6B270]/15 text-[#E8C391] border-[#D6B270]/30',
    amber: 'bg-[#F59E0B]/15 text-[#FCD34D] border-[#F59E0B]/30',
    rose: 'bg-[#EF4444]/15 text-[#FCA5A5] border-[#EF4444]/30',
    blue: 'bg-[#3B82F6]/15 text-[#93C5FD] border-[#3B82F6]/30',
    gray: 'bg-white/10 text-[#D1D5DB] border-white/15',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide backdrop-blur-xs shadow-2xs',
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full shrink-0',
          tone === 'green' && 'bg-[#D6B270] shadow-[0_0_6px_#D6B270]',
          tone === 'amber' && 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]',
          tone === 'rose' && 'bg-[#EF4444] shadow-[0_0_6px_#EF4444]',
          tone === 'blue' && 'bg-[#3B82F6] shadow-[0_0_6px_#3B82F6]',
          tone === 'gray' && 'bg-[#9CA3AF]',
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
        'inline-flex items-center gap-1.5 rounded-xl border border-[#D6B270]/30 bg-[#D6B270]/10 px-3 py-1 text-xs font-semibold text-[#E8C391] backdrop-blur-sm shadow-2xs',
        variant === 'highlight' &&
          'border-[#D6B270]/50 bg-[#D6B270]/20 text-[#FFFFFF] shadow-[0_0_12px_rgba(214,178,112,0.2)]',
        variant === 'compact' && 'px-2 py-0.5 text-[11px]',
        className,
      )}
    >
      <Sparkles
        className={cn(
          'size-3.5 shrink-0',
          variant === 'highlight' ? 'text-[#E8C391]' : 'text-[#D6B270]',
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
      className: 'bg-white/10 text-white border-white/20',
    },
    relato: {
      label: 'Relato da Paciente (Original)',
      className: 'bg-[#3B82F6]/15 text-[#93C5FD] border-[#3B82F6]/30',
    },
    sintese_ia: {
      label: 'Síntese IA (Rascunho de Apoio)',
      className: 'bg-[#D6B270]/15 text-[#E8C391] border-[#D6B270]/30',
    },
    decisao_medica: {
      label: 'Decisão Médica Aprovada',
      className: 'bg-[#D6B270]/25 text-[#FFFFFF] border-[#D6B270]/50',
    },
  }

  const current = layerConfigs[layer]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase backdrop-blur-xs',
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
        'flex items-center gap-2 rounded-xl border border-[#D6B270]/25 bg-[#D6B270]/10 px-3.5 py-2 text-xs text-[#E8C391] backdrop-blur-sm',
        className,
      )}
    >
      <AlertCircle className="size-4 shrink-0 text-[#D6B270]" />
      <span>{text}</span>
    </div>
  )
}

export function UrgentCareWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-2xl border border-[#333333] bg-[#1A1A1A]/80 p-3.5 text-xs text-[#ADADAD] shadow-sm backdrop-blur-md',
        className,
      )}
    >
      <Info className="size-4 shrink-0 text-[#D6B270] mt-0.5" />
      <p className="leading-relaxed">
        <strong className="text-white">Aviso informativo:</strong> Este aplicativo é para
        acompanhamento contínuo de hábitos e{' '}
        <strong className="text-white">
          não substitui atendimento médico de urgência ou emergência
        </strong>
        . Em situações agudas ou graves, procure imediatamente um pronto-atendimento ou ligue 192.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-2xl animate-fade-in-up text-white">
        <div className="flex items-center justify-between border-b border-[#333333] pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-2.5 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
              {evidence.source}
            </span>
            <span className="text-xs text-[#ADADAD]">
              {evidence.year} · {evidence.evidenceType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#ADADAD] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-white leading-snug">
            {evidence.title}
          </h3>

          <div className="rounded-2xl bg-[#0F0F0F] border border-[#333333] p-4 text-sm text-[#CCCCCC] leading-relaxed">
            <p className="font-semibold text-xs text-[#D6B270] uppercase tracking-wider mb-1">
              Síntese do Estudo
            </p>
            {evidence.summary}
          </div>

          <div className="rounded-2xl border border-[#D6B270]/30 bg-[#D6B270]/10 p-3 text-xs text-[#E8C391]">
            <strong className="text-white">Aplicabilidade ao Caso:</strong> {evidence.relevance}
          </div>

          <div className="flex items-center justify-between text-xs text-[#ADADAD] pt-2">
            <span>
              Nível de Confiança: <strong className="text-white">{evidence.confidence}</strong>
            </span>
            <a
              href={evidence.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#D6B270] font-bold hover:underline underline-offset-4"
            >
              Ver na fonte (Simulação) <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="border-t border-[#333333] pt-3 text-[11px] text-[#888888] leading-normal">
            Aviso: Referência demonstrativa. Toda e qualquer decisão diagnóstica ou terapêutica
            permanece exclusivamente a cargo do médico responsável.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-10 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-5 text-xs font-bold text-[#0F0F0F] hover:brightness-110 transition-all cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-[#333333] bg-[#1A1A1A] p-6 shadow-2xl animate-fade-in-up text-white">
        <div className="flex items-center gap-3 border-b border-[#333333] pb-4">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/30">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Consentimento e Privacidade (LGPD)
            </h3>
            <p className="text-xs text-[#ADADAD]">Pré-consulta Instituto Vivans</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#CCCCCC]">
          <p>
            Para que o <strong className="text-white">Dr. Guilherme Martins</strong> disponha dos
            dados organizados antes da sua consulta, suas respostas da pré-consulta serão compiladas
            em síntese estruturada de apoio.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#ADADAD]">
            <li>
              <strong className="text-white">Descarte de áudio:</strong> O áudio demonstrativo é
              utilizado exclusivamente para transcrição no momento da consulta.
            </li>
            <li>
              <strong className="text-white">Revisão prévia:</strong> Você poderá revisar e editar
              todas as respostas antes do envio ao médico.
            </li>
            <li>
              <strong className="text-white">Sigilo e governança:</strong> Os dados clínicos não
              alimentam modelos públicos de terceiros.
            </li>
            <li>
              <strong className="text-white">Separação de papéis:</strong> O sistema atua
              exclusivamente na compilação de dados e não toma decisões clínicas, não prescreve nem
              define diagnósticos.
            </li>
          </ul>
          <div className="rounded-xl border border-[#333333] bg-[#0F0F0F] p-3 text-[11px] text-[#888888]">
            Ambiente de demonstração fictício. Você pode revogar este consentimento a qualquer
            momento nas configurações do seu perfil.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-11 rounded-xl border border-[#333333] px-5 text-xs font-bold text-[#ADADAD] hover:bg-white/5 hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="w-full sm:w-auto min-h-11 rounded-xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs font-bold text-[#0F0F0F] shadow-md hover:brightness-110 cursor-pointer"
          >
            Concordo e quero continuar
          </button>
        </div>
      </div>
    </div>
  )
}
