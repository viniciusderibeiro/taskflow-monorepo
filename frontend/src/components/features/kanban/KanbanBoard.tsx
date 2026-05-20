'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import { useTasks, useUpdateTaskStatus } from '@/hooks/useTasks'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import KanbanColumn from './KanbanColumn'
import CreateTaskModal from './CreateTaskModal'

const CalendarIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

interface ColumnDef {
  status: TaskStatus
  label: string
  dot: string
  borderColor: string
  dragBg: string
}

const COLUMNS: ColumnDef[] = [
  {
    status: 'BACKLOG',
    label: 'Backlog',
    dot: 'bg-violet-400',
    borderColor: 'border-t-violet-400',
    dragBg: 'bg-violet-50/60',
  },
  {
    status: 'TODO',
    label: 'To Do',
    dot: 'bg-amber-500',
    borderColor: 'border-t-amber-400',
    dragBg: 'bg-amber-50/60',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    dot: 'bg-blue-500',
    borderColor: 'border-t-blue-500',
    dragBg: 'bg-blue-50/60',
  },
  {
    status: 'DONE',
    label: 'Done',
    dot: 'bg-emerald-500',
    borderColor: 'border-t-emerald-500',
    dragBg: 'bg-emerald-50/60',
  },
]

interface DragPayload {
  task: Task
  offset: { x: number; y: number }
  initialPos: { x: number; y: number }
  started: boolean
}

interface DragVisual {
  task: Task
  ghostPos: { x: number; y: number }
  overStatus: TaskStatus | null
}

function TaskGhost({ task }: { task: Task }) {
  const date = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col gap-2.5">
      <Tag status={task.status} />
      <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-0.5 border-t border-stone-100">
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <CalendarIcon />
          <span>{date}</span>
        </div>
        <Badge priority={task.priority} />
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const { data: tasks = [], isLoading, isError } = useTasks()
  const updateStatus = useUpdateTaskStatus()

  const [modal, setModal] = useState<{ open: boolean; status: TaskStatus }>({
    open: false,
    status: 'TODO',
  })

  // Drag state split: mutable ref (no re-render) + visual state (triggers re-render)
  const dragRef = useRef<DragPayload | null>(null)
  const dragVisualRef = useRef<DragVisual | null>(null)
  const [drag, setDrag] = useState<DragVisual | null>(null)

  const handlePointerDown = useCallback(
    (task: Task, e: React.PointerEvent<HTMLDivElement>) => {
      // Interactive elements already handled in TaskCard — this is the board-level listener
      const rect = e.currentTarget.getBoundingClientRect()
      dragRef.current = {
        task,
        offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        initialPos: { x: e.clientX, y: e.clientY },
        started: false,
      }
    },
    []
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const ref = dragRef.current
      if (!ref) return

      const dx = e.clientX - ref.initialPos.x
      const dy = e.clientY - ref.initialPos.y

      // 4px threshold before drag is "started"
      if (!ref.started) {
        if (Math.hypot(dx, dy) < 4) return
        ref.started = true
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'grabbing'
      }

      // Ghost has pointer-events:none → elementFromPoint sees through it
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const colEl = el?.closest('[data-col]')
      const overStatus = (colEl?.getAttribute('data-col') as TaskStatus) ?? null

      const visual: DragVisual = {
        task: ref.task,
        ghostPos: { x: e.clientX - ref.offset.x, y: e.clientY - ref.offset.y },
        overStatus,
      }
      dragVisualRef.current = visual
      setDrag(visual)
    }

    const onUp = () => {
      const ref = dragRef.current
      const visual = dragVisualRef.current

      if (ref?.started && visual?.overStatus && visual.overStatus !== ref.task.status) {
        updateStatus.mutate({ id: ref.task.id, status: visual.overStatus })
      }

      dragRef.current = null
      dragVisualRef.current = null
      setDrag(null)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [updateStatus])

  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map((c) => (
          <div key={c.status} className="min-w-[272px] w-[272px] flex flex-col gap-3">
            <div className="h-5 w-28 bg-stone-100 rounded animate-pulse" />
            <div className="h-28 bg-stone-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-stone-100 rounded-xl animate-pulse opacity-60" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        Erro ao carregar tarefas. Verifique sua conexão e tente novamente.
      </p>
    )
  }

  return (
    <>
      <div className="flex gap-5 overflow-x-auto pb-6">
        {COLUMNS.map(({ status, label, dot, borderColor, dragBg }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            dot={dot}
            borderColor={borderColor}
            dragBg={dragBg}
            tasks={tasks.filter((t) => t.status === status)}
            draggingTaskId={drag?.task.id ?? null}
            isDragTarget={drag?.overStatus === status}
            onAdd={() => setModal({ open: true, status })}
            onDragStart={handlePointerDown}
          />
        ))}
      </div>

      {/* Drag ghost — fixed position, pointer-events:none so elementFromPoint sees through it */}
      {drag && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: drag.ghostPos.x,
            top: drag.ghostPos.y,
            width: 272,
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'rotate(2deg)',
            boxShadow: '0 16px 32px -8px rgba(0,0,0,0.18), 0 4px 8px -2px rgba(0,0,0,0.08)',
          }}
        >
          <TaskGhost task={drag.task} />
        </div>
      )}

      <CreateTaskModal
        open={modal.open}
        defaultStatus={modal.status}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}
