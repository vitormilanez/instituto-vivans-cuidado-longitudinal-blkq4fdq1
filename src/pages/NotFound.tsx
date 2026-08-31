import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#dfe8e3] bg-white p-8 text-center space-y-5 my-12 shadow-sm">
      <div className="grid size-14 place-items-center rounded-2xl bg-[#f4f7f5] text-[#17372f] mx-auto text-xl font-bold">
        404
      </div>
      <h1 className="font-serif text-2xl font-bold text-[#17372f]">Página não encontrada</h1>
      <p className="text-xs text-[#60766f]">
        O link solicitado não existe no protótipo demonstrativo do Instituto Vivans.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 min-h-11 rounded-xl bg-[#0b7b68] px-5 text-xs font-bold text-white hover:bg-[#096656]"
        >
          <Home className="size-3.5" />
          <span>Início</span>
        </Link>
        <Link
          to="/medico"
          className="flex items-center gap-1.5 min-h-11 rounded-xl border border-[#dfe8e3] px-4 text-xs font-bold text-[#17372f] hover:bg-[#f4f7f5]"
        >
          <span>Painel do Médico</span>
        </Link>
      </div>
    </div>
  )
}
