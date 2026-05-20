'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { TaskStatus } from '@/types/task'
import { useCreateTask } from '@/hooks/useTasks'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface CreateTaskModalProps {
  open: boolean
  defaultStatus: TaskStatus
  onClose: () => void
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type FormData = z.infer<typeof schema>

export default function CreateTaskModal({ open, defaultStatus, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'MEDIUM' },
  })

  async function onSubmit(data: FormData) {
    await createTask.mutateAsync({
      title: data.title,
      description: data.description,
      status: defaultStatus,
      priority: data.priority,
    })
    reset()
    onClose()
  }

  return (
    <Modal isOpen={open} onClose={onClose} title={`Nova tarefa · ${STATUS_LABELS[defaultStatus]}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          {...register('title')}
          label="Título"
          placeholder="Descreva a tarefa em poucas palavras"
          autoFocus
          error={errors.title?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-stone-700">Descrição</label>
          <textarea
            {...register('description')}
            placeholder="Detalhes opcionais sobre esta tarefa"
            rows={3}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:border-transparent transition-shadow"
          />
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

        <div className="flex gap-2.5 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" loading={createTask.isPending}>
            Criar tarefa
          </Button>
        </div>
      </form>
    </Modal>
  )
}
