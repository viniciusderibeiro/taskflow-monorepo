'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { token, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace('/auth/login')
  }, [token, router])

  if (!token) return null

  function handleLogout() {
    logout()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="h-11 bg-white border-b border-stone-200 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-sm font-semibold text-stone-900">TaskFlow</span>
        </div>

        <div className="flex items-center gap-3 border-l border-stone-200 pl-3">
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-stone-500 px-2 py-1 rounded-md hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>
      <main
        className="px-4 sm:px-6 py-5 sm:py-6 min-h-[calc(100vh-44px)]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        {children}
      </main>
    </div>
  )
}
