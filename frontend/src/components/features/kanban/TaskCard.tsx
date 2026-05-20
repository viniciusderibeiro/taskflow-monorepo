'use client'

import { useState, useRef } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import { useDeleteTask, useUpdateTaskStatus, useUpdateTask } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  isGhost?: boolean
  onDragStart?: (task: Task, e: React.PointerEvent<HTMLDivElement>) => void
}

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
)

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

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

export default function TaskCard({ task, isDragging, isGhost, onDragStart }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState<'title' | 'description' | null>(null)
  const [titleDraft, setTitleDraft] = useState(task.title)
  const [descDraft, setDescDraft] = useState(task.description ?? '')

  const deleteTask = useDeleteTask()
  const updateStatus = useUpdateTaskStatus()
  const updateTask = useUpdateTask()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descInputRef = useRef<HTMLTextAreaElement>(null)

  const date = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  function saveEdits() {
    const newTitle = titleDraft.trim()
    if (!newTitle) {
      setTitleDraft(task.title)
      setDescDraft(task.description ?? '')
      setEditing(null)
      return
    }
    const newDesc = descDraft.trim() || null
    if (newTitle !== task.title || newDesc !== (task.description ?? null)) {
      updateTask.mutate({
        id: task.id,
        title: newTitle,
        description: newDesc,
        status: task.status,
        priority: task.priority,
      })
    }
    setEditing(null)
  }

  function cancelEditing() {
    setTitleDraft(task.title)
    setDescDraft(task.description ?? '')
    setEditing(null)
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isGhost || editing !== null) return
    if ((e.target as HTMLElement).closest('input, textarea, button, a')) return
    onDragStart?.(task, e)
  }

  if (isGhost) {
    return (
      <div
        className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col gap-2.5"
        style={{ boxShadow: '0 16px 32px -8px rgba(0,0,0,0.18), 0 4px 8px -2px rgba(0,0,0,0.08)' }}
      >
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

  return (
    <div
      onPointerDown={handlePointerDown}
      className={cn(
        'bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col gap-2.5 group select-none',
        'transition-all duration-[120ms]',
        isDragging ? 'opacity-40 scale-[0.98]' : 'cursor-grab hover:cursor-grab active:cursor-grabbing',
        !isDragging && 'hover:shadow-[var(--shadow-card-hover)]'
      )}
      style={{ boxShadow: isDragging ? 'none' : 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Tag status={task.status} />
        <div className="relative">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((p) => !p)
            }}
            aria-label="Opções da tarefa"
            className="w-6 h-6 rounded flex items-center justify-center text-stone-300 hover:text-stone-600 hover:bg-stone-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <DotsIcon />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-7 z-20 bg-white border border-stone-200 rounded-xl py-1 w-44"
                style={{ boxShadow: 'var(--shadow-modal)' }}
              >
                <p className="px-3 pt-1 pb-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  Mover para
                </p>
                {STATUS_OPTIONS.filter((s) => s.value !== task.status).map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      updateStatus.mutate({ id: task.id, status: s.value })
                      setMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
                <hr className="my-1 border-stone-100" />
                <button
                  onClick={() => {
                    deleteTask.mutate(task.id)
                    setMenuOpen(false)
                  }}
                  disabled={deleteTask.isPending}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title — double-click to edit */}
      {editing === 'title' ? (
        <input
          ref={titleInputRef}
          autoFocus
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={saveEdits}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); saveEdits() }
            if (e.key === 'Escape') cancelEditing()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full text-sm font-semibold text-stone-900 bg-transparent border-b-2 border-violet-400 focus:outline-none pb-0.5 select-text"
        />
      ) : (
        <h3
          className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug select-text cursor-text"
          onDoubleClick={() => setEditing('title')}
          title="Clique duplo para editar"
        >
          {task.title}
        </h3>
      )}

      {/* Description — double-click to edit */}
      {editing === 'description' ? (
        <textarea
          ref={descInputRef}
          autoFocus
          value={descDraft}
          onChange={(e) => setDescDraft(e.target.value)}
          onBlur={saveEdits}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancelEditing()
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') saveEdits()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          rows={2}
          className="w-full text-xs text-stone-500 bg-transparent border-b-2 border-violet-400 focus:outline-none resize-none leading-relaxed select-text"
        />
      ) : task.description ? (
        <p
          className="text-xs text-stone-500 line-clamp-2 leading-relaxed select-text cursor-text"
          onDoubleClick={() => setEditing('description')}
          title="Clique duplo para editar"
        >
          {task.description}
        </p>
      ) : (
        <p
          className="text-xs text-stone-400 italic select-text cursor-text"
          onDoubleClick={() => setEditing('description')}
        >
          Adicionar descrição...
        </p>
      )}

      {/* Meta */}
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
