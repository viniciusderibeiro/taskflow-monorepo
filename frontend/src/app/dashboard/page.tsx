'use client'

import { useState } from 'react'
import KanbanBoard from '@/components/features/kanban/KanbanBoard'
import type { TaskPriority } from '@/types/task'

type PriorityFilter = 'ALL' | TaskPriority

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const BoardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="18" rx="1" />
    <rect x="14" y="3" width="7" height="10" rx="1" />
    <rect x="14" y="17" width="7" height="4" rx="1" />
  </svg>
)

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({
  children,
  icon,
  active,
}: {
  children: string
  icon?: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      className={[
        'flex items-center gap-1.5 px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors cursor-pointer',
        active
          ? 'text-violet-700 border-violet-700'
          : 'text-stone-400 border-transparent hover:text-stone-600',
      ].join(' ')}
    >
      {icon}
      {children}
    </button>
  )
}

const PRIORITY_FILTERS: { value: PriorityFilter; label: string; activeClass: string }[] = [
  { value: 'ALL',    label: 'Todos',  activeClass: 'bg-stone-900 text-white border-stone-900' },
  { value: 'HIGH',   label: 'Alta',   activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 'MEDIUM', label: 'Média',  activeClass: 'bg-orange-400 text-white border-orange-400' },
  { value: 'LOW',    label: 'Baixa',  activeClass: 'bg-blue-500 text-white border-blue-500' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')

  return (
    <div>
      {/* ── Page title ────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Tasks</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Gerencie e acompanhe as tarefas do seu time.
        </p>
      </div>

      {/* ── Tabs + controls ───────────────────────────────────────── */}
      <div className="border-b border-stone-200 mb-0">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 py-3">
          {/* Tabs */}
          <div className="flex items-center gap-0.5">
            <TabButton active icon={<BoardIcon />}>Board</TabButton>
          </div>

          {/* Search + priority filter */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {/* Search input */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 w-40 sm:w-48 rounded-lg border border-stone-200 bg-white pl-8 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:border-transparent transition-shadow"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label="Limpar busca"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Priority filter pills */}
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
              {PRIORITY_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setPriorityFilter(f.value)}
                  className={[
                    'h-7 px-2 sm:px-2.5 rounded-md text-xs font-medium border transition-all cursor-pointer',
                    priorityFilter === f.value
                      ? f.activeClass
                      : 'bg-transparent text-stone-500 border-transparent hover:bg-white hover:text-stone-700',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <KanbanBoard search={search} priorityFilter={priorityFilter} />
    </div>
  )
}
