import { useEffect, useRef, useState } from 'react'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  ariaLabel?: string
  placeholder?: string
}

function firstGrapheme(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    const first = segmenter.segment(trimmed)[Symbol.iterator]().next()
    if (!first.done) return first.value.segment
  }
  return Array.from(trimmed)[0] ?? ''
}

export function EmojiPicker({ value, onChange, ariaLabel, placeholder }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function commit(text: string) {
    const picked = firstGrapheme(text)
    if (picked) onChange(picked)
    setOpen(false)
  }

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => {
          setDraft('')
          setOpen((o) => !o)
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="pick"
        style={{ width: 44, height: 44, padding: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 20 }}
      >
        {value}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 999,
            background: 'var(--surface-raised)',
            border: '1.5px solid var(--line)',
            boxShadow: 'var(--shadow-float)',
            zIndex: 20,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit(draft)
              }
            }}
            placeholder={placeholder}
            style={{
              width: 120,
              border: 0,
              outline: 'none',
              background: 'transparent',
              fontSize: 20,
              color: 'var(--ink)',
            }}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!firstGrapheme(draft)}
            onClick={() => commit(draft)}
          >
            {firstGrapheme(draft) || value}
          </button>
        </div>
      )}
    </div>
  )
}
