const ClipboardIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
)

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-3 text-stone-400">
        <ClipboardIcon />
      </div>
      <p className="text-sm font-medium text-stone-700 mb-1">{title}</p>
      <p className="text-xs text-stone-400 max-w-[144px] leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 text-xs font-medium text-violet-700 hover:text-violet-800 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
