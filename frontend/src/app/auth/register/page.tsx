'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { AuthState } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const setToken = useAuthStore((state: AuthState) => state.setToken)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post('/auth/register', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch {
      setError('root', { message: 'Email já cadastrado ou erro no servidor.' })
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-9 h-9 bg-violet-700 rounded-xl flex items-center justify-center mb-5">
          <span className="text-white text-sm font-bold tracking-tight">T</span>
        </div>
        <h1 className="text-xl font-semibold text-stone-900">Criar sua conta</h1>
        <p className="text-sm text-stone-500 mt-1">Comece a gerenciar seu trabalho hoje.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          {...register('name')}
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          autoComplete="name"
          error={errors.name?.message}
        />

        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          error={errors.email?.message}
        />

        <Input
          {...register('password')}
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          error={errors.password?.message}
        />

        {errors.root && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-1">
          Criar conta
        </Button>
      </form>

      <p className="text-center text-xs text-stone-500 mt-6">
        Já tem uma conta?{' '}
        <Link
          href="/auth/login"
          className="font-medium text-violet-700 hover:text-violet-800 transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
