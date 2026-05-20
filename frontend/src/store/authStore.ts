'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        document.cookie = `taskflow_token=${token}; path=/; SameSite=Strict; max-age=86400`
        set({ token })
      },
      logout: () => {
        document.cookie = 'taskflow_token=; path=/; max-age=0'
        set({ token: null })
      },
    }),
    { name: 'taskflow_auth' }
  )
)
