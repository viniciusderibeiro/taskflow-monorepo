import KanbanBoard from '@/components/features/kanban/KanbanBoard'

function TabButton({
  children,
  active,
  disabled,
}: {
  children: string
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      disabled={disabled}
      className={[
        'px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
        active ? 'text-violet-700 border-violet-700' : 'text-stone-400 border-transparent',
        disabled ? 'cursor-not-allowed' : 'hover:text-stone-600',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-stone-900">Tasks</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Gerencie e acompanhe as tarefas do seu time.
        </p>
      </div>

      <div className="flex items-center gap-0.5 border-b border-stone-200 mb-5">
        <TabButton active>Board</TabButton>
        <TabButton disabled>List</TabButton>
        <TabButton disabled>Table</TabButton>
        <TabButton disabled>Timeline</TabButton>
      </div>

      <KanbanBoard />
    </div>
  )
}
