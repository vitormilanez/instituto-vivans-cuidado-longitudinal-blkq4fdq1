import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, ShieldCheck, AlertCircle, ExternalLink, Info, CheckCircle2 } from 'lucide-react'

export function StatusBadge({
  children,
  tone = 'green',
  variant = 'badge',
  className,
}: {
  children: ReactNode
  tone?: 'green' | 'amber' | 'rose' | 'blue' | 'gray'
  variant?: 'badge' | 'subtle'
  className?: string
}) {
  const tones = {
    green: 'bg-[#E7F2EC] text-[#2F7D5B] border-[#C3D6CC]',
    amber: 'bg-[#F7EFDF] text-[#B7832F] border-[#EAD7BA]',
    rose: 'bg-[#F6E7E2] text-[#B4553F] border-[#E8C2B8]',
    blue: 'bg-[#EBF3F8] text-[#2C6E8A] border-[#C8DFE8]',
    gray: 'bg-[#F1EEE7] text-[#5C5C57] border-[#E8E3D9]',
  }

  const subtleTextTones = {
    green: 'text-[#2F7D5B]',
    amber: 'text-[#96671E]',
    rose: 'text-[#A04530]',
    blue: 'text-[#2C6E8A]',
    gray: 'text-[#5C5C57]',
  }

  const dotTones = {
    green: 'bg-[#2F7D5B]',
    amber: 'bg-[#B7832F]',
    rose: 'bg-[#B4553F]',
    blue: 'bg-[#2C6E8A]',
    gray: 'bg-[#8A8A84]',
  }

  if (variant === 'subtle') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium tracking-tight',
          subtleTextTones[tone],
          className,
        )}
      >
        <span aria-hidden="true" className={cn('size-1.5 rounded-full shrink-0', dotTones[tone])} />
        <span>{children}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-subtle',
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full shrink-0', dotTones[tone])} />
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
        'inline-flex items-center gap-1.5 rounded-xl border border-[#C49A5B]/35 bg-[#FBF5EB] px-3 py-1 text-xs font-semibold text-[#9E7A3D] shadow-subtle',
        variant === 'highlight' && 'border-[#2E5E4E]/40 bg-[#E7EFEA] text-[#2E5E4E] shadow-sm',
        variant === 'compact' && 'px-2 py-0.5 text-[11px]',
        className,
      )}
    >
      <Sparkles
        className={cn(
          'size-3.5 shrink-0',
          variant === 'highlight' ? 'text-[#2E5E4E]' : 'text-[#C49A5B]',
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
      className: 'bg-[#F1EEE7] text-[#1E1E1C] border-[#E8E3D9]',
    },
    relato: {
      label: 'Relato da Paciente (Original)',
      className: 'bg-[#EBF3F8] text-[#2C6E8A] border-[#C8DFE8]',
    },
    sintese_ia: {
      label: 'Síntese IA (Rascunho de Apoio)',
      className: 'bg-[#FBF5EB] text-[#9E7A3D] border-[#EAD7BA]',
    },
    decisao_medica: {
      label: 'Decisão Médica Aprovada',
      className: 'bg-[#E7EFEA] text-[#2E5E4E] border-[#C3D6CC]',
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
        'flex items-center gap-2 rounded-xl border border-[#C49A5B]/30 bg-[#FBF5EB] px-3.5 py-2 text-xs text-[#9E7A3D]',
        className,
      )}
    >
      <AlertCircle className="size-4 shrink-0 text-[#C49A5B]" />
      <span>{text}</span>
    </div>
  )
}

export function UrgentCareWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-2xl border border-[#E8E3D9] bg-[#FFFFFF] p-3.5 text-xs text-[#5C5C57] shadow-card',
        className,
      )}
    >
      <Info className="size-4 shrink-0 text-[#2E5E4E] mt-0.5" />
      <p className="leading-relaxed">
        <strong className="text-[#1E1E1C]">Aviso informativo:</strong> Este aplicativo é para
        acompanhamento contínuo de hábitos e{' '}
        <strong className="text-[#1E1E1C]">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-elevation animate-fade-in-up text-[#1E1E1C]">
        <div className="flex items-center justify-between border-b border-[#EFECE5] pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#2E5E4E] px-2.5 py-1 text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
              {evidence.source}
            </span>
            <span className="text-xs text-[#5C5C57]">
              {evidence.year} · {evidence.evidenceType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8A8A84] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#1E1E1C] leading-snug">
            {evidence.title}
          </h3>

          <div className="rounded-2xl bg-[#FAF8F4] border border-[#E8E3D9] p-4 text-sm text-[#5C5C57] leading-relaxed">
            <p className="font-semibold text-xs text-[#2E5E4E] uppercase tracking-wider mb-1">
              Síntese do Estudo
            </p>
            {evidence.summary}
          </div>

          <div className="rounded-2xl border border-[#C3D6CC] bg-[#E7EFEA] p-3 text-xs text-[#2E5E4E]">
            <strong className="text-[#1E1E1C]">Aplicabilidade ao Caso:</strong> {evidence.relevance}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5C5C57] pt-2">
            <span>
              Nível de Confiança: <strong className="text-[#2E5E4E]">{evidence.confidence}</strong>
            </span>
            <a
              href={evidence.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#2E5E4E] font-bold hover:underline underline-offset-4"
            >
              Ver na fonte (Simulação) <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="border-t border-[#EFECE5] pt-3 text-[11px] text-[#8A8A84] leading-normal">
            Aviso: Referência demonstrativa. Toda e qualquer decisão diagnóstica ou terapêutica
            permanece exclusivamente a cargo do médico responsável.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-10 rounded-xl bg-[#2E5E4E] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] transition-all cursor-pointer shadow-sm"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1C]/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-6 shadow-elevation animate-fade-in-up text-[#1E1E1C]">
        <div className="flex items-center gap-3 border-b border-[#EFECE5] pb-4">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#1E1E1C]">
              Consentimento e Privacidade (LGPD)
            </h3>
            <p className="text-xs text-[#5C5C57]">Pré-consulta Instituto Vivans</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#5C5C57]">
          <p>
            Para que o <strong className="text-[#1E1E1C]">Dr. Guilherme Martins</strong> disponha
            dos dados organizados antes da sua consulta, suas respostas da pré-consulta serão
            compiladas em síntese estruturada de apoio.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#5C5C57]">
            <li>
              <strong className="text-[#1E1E1C]">Descarte de áudio:</strong> O áudio demonstrativo é
              utilizado exclusivamente para transcrição no momento da consulta.
            </li>
            <li>
              <strong className="text-[#1E1E1C]">Revisão prévia:</strong> Você poderá revisar e
              editar todas as respostas antes do envio ao médico.
            </li>
            <li>
              <strong className="text-[#1E1E1C]">Sigilo e governança:</strong> Os dados clínicos não
              alimentam modelos públicos de terceiros.
            </li>
            <li>
              <strong className="text-[#1E1E1C]">Separação de papéis:</strong> O sistema atua
              exclusivamente na compilação de dados e não toma decisões clínicas, não prescreve nem
              define diagnósticos.
            </li>
          </ul>
          <div className="rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] p-3 text-[11px] text-[#8A8A84]">
            Ambiente de demonstração fictício. Você pode revogar este consentimento a qualquer
            momento nas configurações do seu perfil.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-11 rounded-xl border border-[#E8E3D9] bg-[#FAF8F4] px-5 text-xs font-bold text-[#5C5C57] hover:bg-[#F1EEE7] hover:text-[#1E1E1C] cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="w-full sm:w-auto min-h-11 rounded-xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] shadow-sm hover:bg-[#24493D] cursor-pointer transition-colors"
          >
            Concordo e quero continuar
          </button>
        </div>
      </div>
    </div>
  )
}
