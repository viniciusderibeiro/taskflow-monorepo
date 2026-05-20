import type { TaskPriority } from '@/types/task'

interface BadgeProps {
  priority: TaskPriority
}

const config: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  LOW: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Low' },
  MEDIUM: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Medium' },
  HIGH: { bg: 'bg-red-100', text: 'text-red-600', label: 'High' },
}

export default function Badge({ priority }: BadgeProps) {
  const c = config[priority]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
