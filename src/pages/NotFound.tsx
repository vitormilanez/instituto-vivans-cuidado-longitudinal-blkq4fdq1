import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-[#E8E3D9] bg-[#FFFFFF] p-8 text-center space-y-6 shadow-card">
        <div className="grid size-16 mx-auto place-items-center rounded-2xl bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC] font-serif text-2xl font-bold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#1E1E1C]">Página Não Encontrada</h1>
          <p className="text-xs text-[#5C5C57] leading-relaxed">
            O endereço solicitado não existe ou foi movido dentro do sistema do Instituto Vivans.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#2E5E4E] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#24493D] shadow-sm transition-all cursor-pointer"
          >
            <Home className="size-4" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
