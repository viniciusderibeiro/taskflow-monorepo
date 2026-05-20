import type { TaskStatus } from '@/types/task'

interface TagProps {
  status: TaskStatus
}

const config: Record<TaskStatus, { dot: string; bg: string; text: string; label: string }> = {
  BACKLOG: { dot: 'bg-stone-400', bg: 'bg-stone-100', text: 'text-stone-600', label: 'Backlog' },
  TODO: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', label: 'To Do' },
  IN_PROGRESS: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: 'In Progress',
  },
  DONE: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    label: 'Done',
  },
}

export default function Tag({ status }: TagProps) {
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  )
}
