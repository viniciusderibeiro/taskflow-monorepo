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
import PasswordInput from '@/components/ui/PasswordInput'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
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
      const res = await api.post('/auth/login', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch {
      setError('root', { message: 'Email ou senha incorretos.' })
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-[34px] font-bold text-stone-900 leading-tight tracking-tight">
          Olá,<br />Bem-vindo de volta.
        </h1>
        <p className="text-sm text-stone-400 mt-2.5">Entre na sua conta para continuar.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 w-full">
        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          className="h-11"
          error={errors.email?.message}
        />

        <PasswordInput
          {...register('password')}
          label="Senha"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
        />

        {errors.root && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2 h-11">
          Entrar
        </Button>
      </form>

      {/* Footer */}
      <p className="text-sm text-stone-500 mt-8 text-center">
        Não tem uma conta?{' '}
        <Link
          href="/auth/register"
          className="font-semibold text-violet-700 hover:text-violet-800 transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
