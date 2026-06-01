'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Task, TaskPriority } from '@/types/task'
import Modal from '@/components/ui/Modal'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TaskViewModalProps {
  open: boolean
  task: Task
  onClose: () => void
  onEdit: () => void
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string }> = {
  HIGH:   { label: 'Alta',  bg: 'bg-red-50',   text: 'text-red-600'   },
  MEDIUM: { label: 'Média', bg: 'bg-amber-50',  text: 'text-amber-500' },
  LOW:    { label: 'Baixa', bg: 'bg-blue-50',   text: 'text-blue-600'  },
}

const FlagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

export default function TaskViewModal({ open, task, onClose, onEdit }: TaskViewModalProps) {
  const p = PRIORITY_CONFIG[task.priority]

  const date = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={task.title}
      titleClassName="text-xl font-bold text-stone-900 leading-snug pr-4 line-clamp-2"
      size="lg"
    >
      {/* ── Status + Priority badges (below the title/X row) ── */}
      <div className="flex items-center gap-2 mb-4">
        <Tag status={task.status} />
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', p.bg, p.text)}>
          {p.label}
        </span>
      </div>

      {/* ── Description ── */}
      {task.description ? (
        <div
          className={cn(
            'text-sm bg-stone-50 rounded-xl px-4 py-3 mb-5 overflow-y-auto max-h-72',
            '[&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-1 [&_h1]:text-stone-900',
            '[&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:mt-1 [&_h2]:text-stone-800',
            '[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:text-stone-700',
            '[&_strong]:font-semibold [&_strong]:text-stone-800',
            '[&_em]:italic [&_em]:text-stone-600',
            '[&_p]:mb-2 [&_p]:text-stone-700 [&_p]:leading-relaxed',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_blockquote]:text-stone-500 [&_blockquote]:my-2 [&_blockquote]:italic',
            '[&_code]:bg-stone-200 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-stone-700',
            '[&_pre]:bg-stone-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:my-2',
            '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5',
            '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5',
            '[&_li]:mb-1 [&_li]:text-stone-700',
            '[&_a]:text-violet-700 [&_a]:underline',
            '[&_input]:mr-1.5 [&_input]:accent-violet-700',
            '[&_hr]:border-stone-200 [&_hr]:my-2'
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.description}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-stone-400 italic mb-5">Sem descrição.</p>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <FlagIcon />
          <span>{date}</span>
        </div>
        <Button size="sm" onClick={onEdit} className="flex items-center gap-1.5">
          <PencilIcon />
          Editar
        </Button>
      </div>
    </Modal>
  )
}
