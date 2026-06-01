'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'
import Tag from '@/components/ui/Tag'
import { useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks'
import EditTaskModal from './EditTaskModal'
import TaskViewModal from './TaskViewModal'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onDragStart?: (task: Task, e: React.PointerEvent<HTMLDivElement>) => void
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const DotsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
)

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const MoveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const FlagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

// ─── Priority badge ───────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; text: string }> = {
  HIGH:   { label: 'Alta',  bg: 'bg-red-50',   text: 'text-red-600'   },
  MEDIUM: { label: 'Média', bg: 'bg-amber-50',  text: 'text-amber-500' },
  LOW:    { label: 'Baixa', bg: 'bg-blue-50',   text: 'text-blue-600'  },
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const c = PRIORITY_CONFIG[priority]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', c.bg, c.text)}>
      {c.label}
    </span>
  )
}

// ─── Inline markdown renderer for card preview ────────────────────────────────
// All elements are rendered as inline spans so line-clamp-2 works on the wrapper

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const INLINE_MD: Record<string, (props: any) => React.ReactElement> = {
  h1: ({ children }) => <span className="font-bold">{children} </span>,
  h2: ({ children }) => <span className="font-semibold">{children} </span>,
  h3: ({ children }) => <span className="font-semibold">{children} </span>,
  h4: ({ children }) => <span className="font-medium">{children} </span>,
  p:  ({ children }) => <span>{children} </span>,
  strong: ({ children }) => <span className="font-semibold">{children}</span>,
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => <span className="font-mono text-[11px]">{children}</span>,
  li: ({ children }) => <span>{children} </span>,
  ul: ({ children }) => <span>{children}</span>,
  ol: ({ children }) => <span>{children}</span>,
  blockquote: ({ children }) => <span className="italic">{children}</span>,
  a: ({ children }) => <span>{children}</span>,
  hr: () => <span> — </span>,
}

// ─── Status options for "Move to" ─────────────────────────────────────────────

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'BACKLOG',     label: 'Backlog' },
  { value: 'TODO',        label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE',        label: 'Done' },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const dotsRef = React.useRef<HTMLButtonElement>(null)

  const deleteTask = useDeleteTask()
  const updateStatus = useUpdateTaskStatus()

  const date = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button, a')) return
    onDragStart?.(task, e)
  }

  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button, a')) return
    setViewOpen(true)
  }

  function handleDotsClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!menuOpen && dotsRef.current) {
      const rect = dotsRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setMenuOpen(p => !p)
  }

  function closeMenu() {
    setMenuOpen(false)
    setMenuPos(null)
  }

  return (
    <>
      <div
        data-card={task.id}
        onPointerDown={handlePointerDown}
        onClick={handleCardClick}
        className={cn(
          'bg-white rounded-xl border border-stone-100 select-none group',
          'shadow-[0_1px_4px_rgba(0,0,0,0.05)]',
          'hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] hover:border-stone-200',
          'transition-all duration-150 cursor-pointer'
        )}
      >
        {/* ── Card body ── */}
        <div className="px-4 pt-4 pb-3">
          {/* Top row: status tag + menu */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Tag status={task.status} />
            <button
              ref={dotsRef}
              onPointerDown={e => e.stopPropagation()}
              onClick={handleDotsClick}
              aria-label="Opções da tarefa"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <DotsIcon />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-stone-900 leading-snug line-clamp-2 mb-1.5">
            {task.title}
          </h3>

          {/* Description — inline markdown, clamped to 2 lines */}
          {task.description && (
            <div className="text-sm text-stone-400 leading-relaxed line-clamp-2 [&_*]:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={INLINE_MD}>
                {task.description}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <FlagIcon />
            <span>{date}</span>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Context menu via portal */}
      {menuOpen && menuPos && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenu} />
          <div
            className="bg-white border border-stone-200 rounded-xl py-1.5 w-52 overflow-hidden"
            style={{
              position: 'fixed',
              top: menuPos.top,
              right: menuPos.right,
              zIndex: 50,
              boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)',
            }}
          >
            <button
              onClick={() => { closeMenu(); setEditOpen(true) }}
              className="w-full text-left px-3.5 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
            >
              <span className="text-stone-400"><PencilIcon /></span>
              Editar
            </button>

            <div className="h-px bg-stone-100 mx-2 my-1" />

            <p className="px-3.5 pt-0.5 pb-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Mover para
            </p>
            {STATUS_OPTIONS.filter(s => s.value !== task.status).map(s => (
              <button
                key={s.value}
                onClick={() => { updateStatus.mutate({ id: task.id, status: s.value }); closeMenu() }}
                className="w-full text-left px-3.5 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <span className="text-stone-400"><MoveIcon /></span>
                {s.label}
              </button>
            ))}

            <div className="h-px bg-stone-100 mx-2 my-1" />

            <button
              onClick={() => { deleteTask.mutate(task.id); closeMenu() }}
              disabled={deleteTask.isPending}
              className="w-full text-left px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 disabled:opacity-50 cursor-pointer transition-colors"
            >
              <TrashIcon />
              Excluir
            </button>
          </div>
        </>,
        document.body
      )}

      {/* View modal — opened on card click */}
      {viewOpen && (
        <TaskViewModal
          open={viewOpen}
          task={task}
          onClose={() => setViewOpen(false)}
          onEdit={() => { setViewOpen(false); setEditOpen(true) }}
        />
      )}

      {/* Edit modal */}
      {editOpen && (
        <EditTaskModal
          open={editOpen}
          task={task}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  )
}

// React must be in scope for JSX (used in INLINE_MD object literals)
import React from 'react'
