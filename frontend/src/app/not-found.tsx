import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-[112px] font-bold text-stone-900 leading-none select-none tabular-nums">
          404
        </p>
        <h1 className="text-lg font-semibold text-stone-900 -mt-2">Página não encontrada</h1>
        <p className="text-sm text-stone-500 mt-2 mb-7 max-w-xs mx-auto">
          Esta página não existe ou foi movida para outro endereço.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center px-3 rounded-lg bg-violet-700 text-white text-sm font-medium hover:bg-violet-800 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
