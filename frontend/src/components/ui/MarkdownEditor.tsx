'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Bold, Italic,
  Heading1, Heading2, Heading3,
  Quote, Code, Link as LinkIcon,
  List, ListOrdered, ListChecks,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  error?: string
  rows?: number
}

interface ToolDef {
  icon: React.ReactNode
  label: string
  prefix: string
  suffix?: string
  placeholder?: string
  block?: boolean
}

// Primary tools — shown inline, collapse into "..." when space is tight
const PRIMARY: ToolDef[] = [
  { icon: <Heading1 size={13} strokeWidth={2} />, label: 'Título 1', prefix: '# ', placeholder: 'Título', block: true },
  { icon: <Heading2 size={13} strokeWidth={2} />, label: 'Título 2', prefix: '## ', placeholder: 'Título', block: true },
  { icon: <Heading3 size={13} strokeWidth={2} />, label: 'Título 3', prefix: '### ', placeholder: 'Título', block: true },
  { icon: <Bold size={13} strokeWidth={2.5} />, label: 'Negrito', prefix: '**', suffix: '**', placeholder: 'texto' },
  { icon: <Italic size={13} strokeWidth={2.5} />, label: 'Itálico', prefix: '_', suffix: '_', placeholder: 'texto' },
]

// More tools — always in "..." dropdown
const MORE: ToolDef[] = [
  { icon: <Quote size={13} />, label: 'Citação', prefix: '> ', placeholder: 'citação', block: true },
  { icon: <Code size={13} />, label: 'Código inline', prefix: '`', suffix: '`', placeholder: 'código' },
  { icon: <LinkIcon size={13} />, label: 'Link', prefix: '[', suffix: '](url)', placeholder: 'texto' },
  { icon: <List size={13} />, label: 'Lista', prefix: '- ', placeholder: 'item', block: true },
  { icon: <ListOrdered size={13} />, label: 'Lista numerada', prefix: '1. ', placeholder: 'item', block: true },
  { icon: <ListChecks size={13} />, label: 'Lista de tarefas', prefix: '- [ ] ', placeholder: 'tarefa', block: true },
]

// Each tool button slot: w-7 (28px) + gap-0.5 (2px)
const BTN_SLOT = 30
const MORE_SLOT = 30
const SEPARATOR_W = 10
const MIN_SPACER = 12
const TOOLBAR_H_PADDING = 16 // px-2 each side

export default function MarkdownEditor({
  value,
  onChange,
  maxLength = 500,
  placeholder = 'Escreva em Markdown...',
  error,
  rows = 7,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [showMore, setShowMore] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PRIMARY.length)

  const taRef = useRef<HTMLTextAreaElement>(null)
  const lineNumRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  // ── Responsive toolbar via ResizeObserver ──────────────────────────
  const recalcToolbar = useCallback(() => {
    const toolbar = toolbarRef.current
    const tabs = tabsRef.current
    if (!toolbar || !tabs) return

    const toolbarW = toolbar.getBoundingClientRect().width
    const tabsW = tabs.getBoundingClientRect().width
    // Available space for primary buttons (always reserve MORE + separator + spacer + padding)
    const available = toolbarW - tabsW - TOOLBAR_H_PADDING - MIN_SPACER - SEPARATOR_W - MORE_SLOT
    const count = Math.max(0, Math.floor(available / BTN_SLOT))
    setVisibleCount(Math.min(count, PRIMARY.length))
  }, [])

  useEffect(() => {
    const el = toolbarRef.current
    if (!el) return
    const observer = new ResizeObserver(recalcToolbar)
    observer.observe(el)
    recalcToolbar()
    return () => observer.disconnect()
  }, [recalcToolbar])

  // ── Sync line-numbers scroll with textarea ─────────────────────────
  function handleScroll() {
    if (lineNumRef.current && taRef.current) {
      lineNumRef.current.scrollTop = taRef.current.scrollTop
    }
  }

  // ── Insert / toggle markdown syntax at cursor ─────────────────────
  function apply(tool: ToolDef) {
    const ta = taRef.current
    if (!ta) return

    const savedScrollTop = ta.scrollTop
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)

    let newValue: string
    let selStart: number
    let selEnd: number

    if (tool.block) {
      const before = value.slice(0, start)
      const lineStart = before.lastIndexOf('\n') + 1
      const lineEnd = value.indexOf('\n', start)
      const lineEndPos = lineEnd === -1 ? value.length : lineEnd
      const lineText = value.slice(lineStart, lineEndPos)

      if (lineText.startsWith(tool.prefix)) {
        // Toggle off: remove prefix from current line
        newValue = value.slice(0, lineStart) + lineText.slice(tool.prefix.length) + value.slice(lineEndPos)
        selStart = Math.max(lineStart, start - tool.prefix.length)
        selEnd = Math.max(selStart, end - tool.prefix.length)
      } else {
        // Toggle on: add prefix
        const text = selected || tool.placeholder || ''
        const needsNewline = before.length > 0 && !before.endsWith('\n')
        const fullPrefix = (needsNewline ? '\n' : '') + tool.prefix
        newValue = value.slice(0, start) + fullPrefix + text + value.slice(end)
        selStart = start + fullPrefix.length
        selEnd = selStart + text.length
      }
    } else {
      const suffix = tool.suffix ?? ''
      const before = value.slice(0, start)
      const after = value.slice(end)

      // Toggle off: selection already has the markers
      if (suffix && selected.startsWith(tool.prefix) && selected.endsWith(suffix) && selected.length > tool.prefix.length + suffix.length) {
        const inner = selected.slice(tool.prefix.length, selected.length - suffix.length)
        newValue = before + inner + after
        selStart = start
        selEnd = start + inner.length
      }
      // Toggle off: surrounding text has the markers
      else if (before.endsWith(tool.prefix) && after.startsWith(suffix || tool.prefix)) {
        const cleanSuffix = suffix || tool.prefix
        newValue = before.slice(0, -tool.prefix.length) + selected + after.slice(cleanSuffix.length)
        selStart = start - tool.prefix.length
        selEnd = selStart + selected.length
      }
      // Toggle on: add markers
      else {
        const text = selected || tool.placeholder || ''
        newValue = before + tool.prefix + text + suffix + after
        selStart = start + tool.prefix.length
        selEnd = selStart + text.length
      }
    }

    onChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      ta.scrollTop = savedScrollTop
      ta.setSelectionRange(selStart, selEnd)
    })
  }

  // ── Auto-continue lists on Enter ───────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter') return
    const ta = e.currentTarget
    const start = ta.selectionStart
    const end = ta.selectionEnd
    if (start !== end) return // let browser handle selection replacement

    const savedScroll = ta.scrollTop
    const beforeCursor = value.slice(0, start)
    const lineStart = beforeCursor.lastIndexOf('\n') + 1
    const currentLine = beforeCursor.slice(lineStart)

    // Task list: "- [ ] " or "- [x] "
    const taskMatch = currentLine.match(/^(\s*)-\s\[[ x]\]\s(.*)/)
    if (taskMatch) {
      e.preventDefault()
      const content = taskMatch[2]
      if (!content.trim()) {
        // Exit list: remove marker from current line
        const newVal = value.slice(0, lineStart) + value.slice(start)
        onChange(newVal)
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(lineStart, lineStart) })
      } else {
        const prefix = currentLine.match(/^(\s*)/)![1] + '- [ ] '
        const newVal = value.slice(0, start) + '\n' + prefix + value.slice(end)
        onChange(newVal)
        const newPos = start + 1 + prefix.length
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(newPos, newPos) })
      }
      return
    }

    // Unordered list: "- " or "* "
    const bulletMatch = currentLine.match(/^(\s*)([-*])\s(.*)/)
    if (bulletMatch) {
      e.preventDefault()
      const [, indent, bullet, content] = bulletMatch
      if (!content.trim()) {
        const newVal = value.slice(0, lineStart) + value.slice(start)
        onChange(newVal)
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(lineStart, lineStart) })
      } else {
        const prefix = indent + bullet + ' '
        const newVal = value.slice(0, start) + '\n' + prefix + value.slice(end)
        onChange(newVal)
        const newPos = start + 1 + prefix.length
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(newPos, newPos) })
      }
      return
    }

    // Ordered list: "1. "
    const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)/)
    if (numberedMatch) {
      e.preventDefault()
      const [, indent, num, content] = numberedMatch
      if (!content.trim()) {
        const newVal = value.slice(0, lineStart) + value.slice(start)
        onChange(newVal)
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(lineStart, lineStart) })
      } else {
        const prefix = indent + (parseInt(num) + 1) + '. '
        const newVal = value.slice(0, start) + '\n' + prefix + value.slice(end)
        onChange(newVal)
        const newPos = start + 1 + prefix.length
        requestAnimationFrame(() => { ta.scrollTop = savedScroll; ta.setSelectionRange(newPos, newPos) })
      }
      return
    }
  }

  // ── Derived values ─────────────────────────────────────────────────
  const lineCount = Math.max(1, value.split('\n').length)
  const dropdownItems = [...PRIMARY.slice(visibleCount), ...MORE]
  // Fixed content area height based on rows
  const CONTENT_H = rows * 23 + 20

  return (
    <div className={cn('rounded-lg border overflow-visible', error ? 'border-red-400' : 'border-stone-200')}>

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div
        ref={toolbarRef}
        className="flex items-center bg-stone-50 border-b border-stone-200 px-2 py-1 rounded-t-lg gap-1"
      >
        {/* Write / Preview tabs */}
        <div ref={tabsRef} className="flex gap-0.5 flex-shrink-0">
          {(['write', 'preview'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap',
                tab === t
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-500 hover:text-stone-700'
              )}
            >
              {t === 'write' ? 'Escrever' : 'Visualizar'}
            </button>
          ))}
        </div>

        {/* Breathing space */}
        <div className="flex-1" />

        {/* Formatting tools — only in write mode */}
        {tab === 'write' && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Visible primary buttons (collapse dynamically) */}
            {PRIMARY.slice(0, visibleCount).map(tool => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                onClick={() => apply(tool)}
                className="h-7 w-7 flex items-center justify-center rounded text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors flex-shrink-0"
              >
                {tool.icon}
              </button>
            ))}

            {/* Separator — only when at least one primary button is visible */}
            {visibleCount > 0 && (
              <div className="w-px h-4 bg-stone-200 mx-0.5 flex-shrink-0" />
            )}

            {/* "..." — always visible at the end */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                title="Mais formatações"
                onClick={() => setShowMore(s => !s)}
                className={cn(
                  'h-7 w-7 flex items-center justify-center rounded transition-colors',
                  showMore
                    ? 'bg-stone-200 text-stone-800'
                    : 'text-stone-500 hover:bg-stone-200 hover:text-stone-800'
                )}
              >
                <MoreHorizontal size={14} />
              </button>

              {showMore && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
                  <div
                    className="absolute right-0 top-8 z-50 bg-white border border-stone-200 rounded-xl py-1.5 w-48 overflow-hidden"
                    style={{ boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)' }}
                  >
                    {dropdownItems.map(tool => (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => { apply(tool); setShowMore(false) }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-stone-400 flex-shrink-0">{tool.icon}</span>
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Write area (line numbers + textarea) ─────────────────── */}
      {tab === 'write' && (
        <div className="flex overflow-hidden" style={{ height: CONTENT_H }}>
          {/* Line numbers */}
          <div
            ref={lineNumRef}
            className="select-none flex-shrink-0 w-10 bg-stone-50 border-r border-stone-100 text-[11px] font-mono text-stone-400 text-right py-2.5 px-2 overflow-hidden"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-[1.625] text-[13px]">{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={taRef}
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-0 px-3 py-2.5 text-sm font-mono leading-[1.625] text-stone-900 placeholder:text-stone-400 resize-none focus:outline-none bg-white overflow-y-auto"
            style={{ height: CONTENT_H }}
          />
        </div>
      )}

      {/* ── Preview area ─────────────────────────────────────────── */}
      {tab === 'preview' && (
        <div
          className={cn(
            'overflow-y-auto px-3 py-2.5 text-sm bg-white leading-relaxed',
            '[&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-1',
            '[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:mt-1',
            '[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1',
            '[&_h4]:text-sm [&_h4]:font-medium [&_h4]:mb-1 [&_h4]:text-stone-600',
            '[&_strong]:font-semibold',
            '[&_em]:italic',
            '[&_p]:mb-1.5 [&_p]:text-stone-800',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-stone-300 [&_blockquote]:pl-3 [&_blockquote]:text-stone-500 [&_blockquote]:my-2 [&_blockquote]:italic',
            '[&_code]:bg-stone-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-stone-700',
            '[&_pre]:bg-stone-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:my-2',
            '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5',
            '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5',
            '[&_li]:mb-1 [&_li]:text-stone-800',
            '[&_a]:text-violet-700 [&_a]:underline',
            '[&_input]:mr-1.5 [&_input]:accent-violet-700',
            '[&_hr]:border-stone-200 [&_hr]:my-2'
          )}
          style={{ height: CONTENT_H }}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-stone-400 italic text-sm">...</p>
          )}
        </div>
      )}
    </div>
  )
}
