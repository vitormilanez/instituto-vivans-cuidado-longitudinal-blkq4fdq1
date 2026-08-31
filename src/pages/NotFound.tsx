import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-[#333333] bg-[#1A1A1A] p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="grid size-16 mx-auto place-items-center rounded-2xl bg-[#D6B270]/20 text-[#D6B270] border border-[#D6B270]/40 font-serif text-2xl font-bold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-white">Página Não Encontrada</h1>
          <p className="text-xs text-[#ADADAD] leading-relaxed">
            O endereço solicitado não existe ou foi movido dentro do sistema do Instituto Vivans.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6B270] to-[#B8935A] px-6 text-xs font-bold text-[#0F0F0F] hover:brightness-110 shadow-md transition-all cursor-pointer"
          >
            <Home className="size-4" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
