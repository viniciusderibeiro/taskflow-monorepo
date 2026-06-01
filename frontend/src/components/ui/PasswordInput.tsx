'use client'

import { useState, type Ref } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export default function PasswordInput({ label, error, className, id, ref, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700 text-left">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={show ? 'text' : 'password'}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-stone-900 placeholder:text-stone-400',
            'transition-shadow duration-[120ms]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-0',
            error
              ? 'border-red-400 focus-visible:ring-red-500'
              : 'border-stone-200 focus-visible:border-transparent',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          tabIndex={-1}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 text-left">{error}</p>}
    </div>
  )
}
