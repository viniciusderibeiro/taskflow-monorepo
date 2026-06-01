'use client'

import { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'
import { useTasks, useUpdateTaskStatus } from '@/hooks/useTasks'
import KanbanColumn from './KanbanColumn'
import CreateTaskModal from './CreateTaskModal'

interface KanbanBoardProps {
  search?: string
  priorityFilter?: 'ALL' | TaskPriority
}

// ─── Column definitions ───────────────────────────────────────────────────────

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE']

const COLUMNS: Array<{ status: TaskStatus; label: string; color: string }> = [
  { status: 'BACKLOG',     label: 'Backlog',      color: 'bg-violet-500' },
  { status: 'TODO',        label: 'To Do',        color: 'bg-amber-400'  },
  { status: 'IN_PROGRESS', label: 'In Progress',  color: 'bg-blue-500'   },
  { status: 'DONE',        label: 'Done',         color: 'bg-emerald-500' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type ColumnOrder = Record<TaskStatus, number[]>

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
  insertIndex: number
}

// ─── Ghost card (shown while dragging) ───────────────────────────────────────

const PRIO_STYLES: Record<TaskPriority, { dot: string; text: string; label: string }> = {
  HIGH:   { dot: 'bg-red-500',    text: 'text-red-600',    label: 'Alta' },
  MEDIUM: { dot: 'bg-amber-400',  text: 'text-amber-500',  label: 'Média' },
  LOW:    { dot: 'bg-blue-400',   text: 'text-blue-500',   label: 'Baixa' },
}

function DragGhost({ task }: { task: Task }) {
  const p = PRIO_STYLES[task.priority]
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 flex flex-col gap-3">
      <span className={`flex items-center gap-1.5 text-xs font-semibold ${p.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
        {p.label}
      </span>
      <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}
    </div>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────

export default function KanbanBoard({ search = '', priorityFilter = 'ALL' }: KanbanBoardProps) {
  const { data: tasks = [], isLoading, isError } = useTasks()
  const updateStatus = useUpdateTaskStatus()

  // Per-column task ordering (client-side). Preserves reorder across refetches.
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>({
    BACKLOG: [], TODO: [], IN_PROGRESS: [], DONE: [],
  })

  const [modal, setModal] = useState<{ open: boolean; status: TaskStatus }>({
    open: false,
    status: 'TODO',
  })

  const dragRef = useRef<DragPayload | null>(null)
  const dragVisualRef = useRef<DragVisual | null>(null)
  const [drag, setDrag] = useState<DragVisual | null>(null)

  // ── Sync server data into local order ─────────────────────────────────────
  // New tasks from server are appended; deleted tasks are removed; existing
  // order is preserved so in-session reordering survives refetches.
  useEffect(() => {
    if (isLoading) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumnOrder(prev => {
      const next = { ...prev }
      for (const status of STATUSES) {
        const serverIds = tasks.filter(t => t.status === status).map(t => t.id)
        const kept = prev[status].filter(id => serverIds.includes(id))
        const added = serverIds.filter(id => !kept.includes(id))
        next[status] = [...kept, ...added]
      }
      return next
    })
  }, [tasks, isLoading])

  // ── Derived task lookup ───────────────────────────────────────────────────
  const taskMap = useMemo(() => new Map(tasks.map(t => [t.id, t])), [tasks])

  function getColumnTasks(status: TaskStatus): Task[] {
    let result = columnOrder[status].map(id => taskMap.get(id)).filter(Boolean) as Task[]

    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
      )
    }

    if (priorityFilter !== 'ALL') {
      result = result.filter(t => t.priority === priorityFilter)
    }

    return result
  }

  // ── Insertion index helpers ───────────────────────────────────────────────
  // Queries [data-card] elements in a column and finds where the cursor falls,
  // skipping the dragged card itself so the index targets the ghost-removed list.
  function computeInsertIndex(status: TaskStatus, clientY: number, draggedId: number): number {
    const colEl = document.querySelector<HTMLElement>(`[data-col="${status}"]`)
    if (!colEl) return 0
    const cardEls = colEl.querySelectorAll<HTMLElement>('[data-card]')
    let index = 0
    for (const cardEl of cardEls) {
      if (Number(cardEl.getAttribute('data-card')) === draggedId) continue
      const rect = cardEl.getBoundingClientRect()
      if (clientY > rect.top + rect.height / 2) index++
      else break
    }
    return index
  }

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (task: Task, e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return
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

      if (!ref.started) {
        if (Math.hypot(dx, dy) < 4) return
        ref.started = true
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'grabbing'
      }

      // Find target column by bounding rect (full column area, not just cards)
      let overStatus: TaskStatus | null = null
      const colEls = document.querySelectorAll<HTMLElement>('[data-col]')
      for (const colEl of colEls) {
        const rect = colEl.getBoundingClientRect()
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom
        ) {
          overStatus = colEl.getAttribute('data-col') as TaskStatus
          break
        }
      }

      const insertIndex = overStatus
        ? computeInsertIndex(overStatus, e.clientY, ref.task.id)
        : 0

      const visual: DragVisual = {
        task: ref.task,
        ghostPos: { x: e.clientX - ref.offset.x, y: e.clientY - ref.offset.y },
        overStatus,
        insertIndex,
      }
      dragVisualRef.current = visual
      setDrag(visual)
    }

    const onUp = () => {
      const ref = dragRef.current
      const visual = dragVisualRef.current

      if (ref?.started && visual?.overStatus) {
        const { task } = ref
        const { overStatus, insertIndex } = visual

        // Cross-column move: update status on server (optimistic handled in hook)
        if (overStatus !== task.status) {
          updateStatus.mutate({ id: task.id, status: overStatus })
        }

        // Apply reorder in local state
        setColumnOrder(prev => {
          const next = { ...prev }

          if (overStatus !== task.status) {
            // Remove from source column
            next[task.status] = prev[task.status].filter(id => id !== task.id)
            // Insert into target column
            const col = [...prev[overStatus]]
            col.splice(Math.min(insertIndex, col.length), 0, task.id)
            next[overStatus] = col
          } else {
            // Same-column reorder
            const col = prev[task.status].filter(id => id !== task.id)
            col.splice(Math.min(insertIndex, col.length), 0, task.id)
            next[task.status] = col
          }

          return next
        })
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

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(c => (
          <div key={c.status} className="min-w-[280px] w-[280px] bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-3">
            <div className="h-4 w-24 bg-stone-100 rounded animate-pulse" />
            <div className="h-28 bg-stone-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-stone-100 rounded-xl animate-pulse opacity-50" />
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
    <div>
      <div
        className="flex gap-4 pb-6 items-start overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
      >
        {COLUMNS.map(({ status, label, color }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            color={color}
            tasks={getColumnTasks(status)}
            draggingTaskId={drag?.task.id ?? null}
            isDragTarget={drag?.overStatus === status}
            insertIndex={drag?.overStatus === status ? drag.insertIndex : null}
            onAdd={() => setModal({ open: true, status })}
            onDragStart={handlePointerDown}
          />
        ))}
      </div>

      {/* Floating ghost card while dragging */}
      {drag && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: drag.ghostPos.x,
            top: drag.ghostPos.y,
            width: 280,
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'rotate(1.5deg) scale(1.02)',
            boxShadow: '0 20px 40px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.1)',
            borderRadius: 12,
          }}
        >
          <DragGhost task={drag.task} />
        </div>
      )}

      <CreateTaskModal
        open={modal.open}
        defaultStatus={modal.status}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  )
}
