'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Task, TaskStatus } from '@/types/task'
import { useUpdateTask } from '@/hooks/useTasks'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import MarkdownEditor from '@/components/ui/MarkdownEditor'
import { cn } from '@/lib/utils'

interface EditTaskModalProps {
  open: boolean
  task: Task
  onClose: () => void
}

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type FormData = z.infer<typeof schema>

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

const TITLE_MAX = 100

export default function EditTaskModal({ open, task, onClose }: EditTaskModalProps) {
  const updateTask = useUpdateTask()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
      })
    }
  }, [open, task, reset])

  const titleValue = watch('title') ?? ''
  const descriptionValue = watch('description') ?? ''

  async function onSubmit(data: FormData) {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
      })
      onClose()
    } catch {
      // revert handled by mutation onError
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} title="Editar tarefa">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-stone-700">Título</label>
          <Input
            {...register('title')}
            placeholder="Descreva a tarefa em poucas palavras"
            autoFocus
            error={errors.title?.message}
            maxLength={TITLE_MAX}
          />
          <div className="flex justify-end">
            <span className={cn('text-xs tabular-nums', titleValue.length > 90 ? 'text-orange-500' : 'text-stone-400')}>
              {titleValue.length}/{TITLE_MAX}
            </span>
          </div>
        </div>

        {/* Description — markdown editor */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-stone-700">Descrição</label>
          <MarkdownEditor
            value={descriptionValue}
            onChange={v => setValue('description', v, { shouldValidate: true })}
            maxLength={500}
            placeholder="Descrição opicional."
            error={errors.description?.message}
            rows={6}
          />
          <div className="flex justify-end">
            <span className={cn('text-xs tabular-nums', descriptionValue.length > 425 ? 'text-orange-500' : 'text-stone-400')}>
              {descriptionValue.length}/500
            </span>
          </div>
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">Status</label>
            <select
              {...register('status')}
              className="h-9 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:border-transparent transition-shadow"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">Prioridade</label>
            <select
              {...register('priority')}
              className="h-9 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:border-transparent transition-shadow"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" loading={updateTask.isPending}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
