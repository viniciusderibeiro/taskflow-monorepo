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
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
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
    <div className="flex flex-col items-center w-full">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-[34px] font-bold text-stone-900 leading-tight tracking-tight">
          Comece<br />sua jornada hoje.
        </h1>
        <p className="text-sm text-stone-400 mt-2.5">Crie sua conta e organize seu time.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 w-full">
        <Input
          {...register('name')}
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          autoComplete="name"
          className="h-11"
          error={errors.name?.message}
        />

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
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          error={errors.password?.message}
        />

        <PasswordInput
          {...register('confirmPassword')}
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {errors.root && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2 h-11">
          Criar conta
        </Button>
      </form>

      {/* Footer */}
      <p className="text-sm text-stone-500 mt-8 text-center">
        Já tem uma conta?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-violet-700 hover:text-violet-800 transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
