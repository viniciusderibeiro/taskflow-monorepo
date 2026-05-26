'use client'

import { Fragment, useMemo } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import TaskCard from './TaskCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  label: string
  color: string
  tasks: Task[]
  draggingTaskId: number | null
  isDragTarget: boolean
  insertIndex: number | null
  onAdd: () => void
  onDragStart: (task: Task, e: React.PointerEvent<HTMLDivElement>) => void
}

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

function InsertLine() {
  return (
    <div className="h-0.5 rounded-full bg-violet-500 mx-0.5 flex-shrink-0 opacity-80" />
  )
}

function DragPlaceholder() {
  return (
    <div className="min-h-[96px] rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 flex-shrink-0" />
  )
}

export default function KanbanColumn({
  status,
  label,
  color,
  tasks,
  draggingTaskId,
  isDragTarget,
  insertIndex,
  onAdd,
  onDragStart,
}: KanbanColumnProps) {
  // Convert insertIndex (computed on ghost-removed array) to the render-array index.
  // The render array includes the dragged card as a placeholder, so we need to
  // shift the line position when the ghost sits before the insertion point.
  const renderInsertIndex = useMemo(() => {
    if (!isDragTarget || insertIndex === null) return -1
    const ghostIdx = tasks.findIndex(t => t.id === draggingTaskId)
    if (ghostIdx === -1) return insertIndex // cross-column drag: no adjustment needed
    // Same-column drag: ghost occupies a slot; shift line forward if ghost is above
    return ghostIdx <= insertIndex ? insertIndex + 1 : insertIndex
  }, [isDragTarget, insertIndex, tasks, draggingTaskId])

  const isEmpty = tasks.length === 0

  return (
    <div
      data-col={status}
      className="flex flex-col min-w-[280px] w-[280px] bg-white rounded-2xl border border-stone-100"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0px rgba(109,40,217,0)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-3.5 h-3.5 rounded', color)} />
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest">
            {label}
          </span>
          <span className="h-5 min-w-[20px] px-1.5 bg-stone-100 text-stone-500 text-[11px] font-semibold rounded-md flex items-center justify-center tabular-nums">
            {tasks.filter(t => t.id !== draggingTaskId).length}
          </span>
        </div>
        <button
          onClick={onAdd}
          aria-label={`Adicionar tarefa em ${label}`}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-violet-700 hover:bg-violet-50 transition-colors"
        >
          <PlusIcon />
        </button>
      </div>

      {/* ── Cards area ── */}
      <div
        className={cn(
          'flex flex-col gap-2 px-3 flex-1 min-h-[80px] transition-colors duration-150',
          isDragTarget && 'bg-violet-50/30'
        )}
      >
        {isEmpty ? (
          isDragTarget ? (
            <div className="flex-1 min-h-[80px] rounded-xl border-2 border-dashed border-violet-200 flex items-center justify-center">
              <span className="text-xs text-violet-400 font-medium select-none">Soltar aqui</span>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-xs text-stone-300 font-medium select-none">Sem tarefas</p>
            </div>
          )
        ) : (
          <>
            {tasks.map((task, i) => {
              const isDragging = task.id === draggingTaskId
              return (
                <Fragment key={task.id}>
                  {renderInsertIndex === i && <InsertLine />}
                  {isDragging ? (
                    <DragPlaceholder />
                  ) : (
                    <TaskCard task={task} onDragStart={onDragStart} />
                  )}
                </Fragment>
              )
            })}
            {renderInsertIndex === tasks.length && <InsertLine />}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-3 pt-2 pb-3">
        <button
          onClick={onAdd}
          className="w-full flex items-center gap-2 text-[11px] text-stone-400 hover:text-stone-600 py-1.5 px-2 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <PlusIcon />
          Adicionar tarefa
        </button>
      </div>
    </div>
  )
}
