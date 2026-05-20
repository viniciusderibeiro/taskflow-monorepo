import type { Task, TaskStatus } from '@/types/task'
import TaskCard from './TaskCard'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  label: string
  dot: string
  borderColor: string
  dragBg: string
  tasks: Task[]
  draggingTaskId: number | null
  isDragTarget: boolean
  onAdd: () => void
  onDragStart: (task: Task, e: React.PointerEvent<HTMLDivElement>) => void
}

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export default function KanbanColumn({
  status,
  label,
  dot,
  borderColor,
  dragBg,
  tasks,
  draggingTaskId,
  isDragTarget,
  onAdd,
  onDragStart,
}: KanbanColumnProps) {
  return (
    <div
      data-col={status}
      className={cn(
        'flex flex-col min-w-[272px] w-[272px] rounded-xl border-t-2 pt-3 pb-2 px-3 transition-colors duration-[120ms]',
        borderColor,
        isDragTarget ? dragBg : 'bg-transparent'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
          <span className="text-sm font-semibold text-stone-800">{label}</span>
          <span className="h-5 px-1.5 bg-stone-100 text-stone-500 text-xs font-medium rounded flex items-center tabular-nums">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          aria-label={`Adicionar tarefa em ${label}`}
          className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-violet-700 hover:bg-violet-50 transition-colors"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200">
            <EmptyState
              title="Sem tarefas"
              description="Clique em + para adicionar uma tarefa aqui."
              action={{ label: 'Adicionar tarefa', onClick: onAdd }}
            />
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggingTaskId === task.id}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <button
          onClick={onAdd}
          className="mt-2 flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 py-1.5 px-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <PlusIcon />
          Adicionar tarefa
        </button>
      )}
    </div>
  )
}
