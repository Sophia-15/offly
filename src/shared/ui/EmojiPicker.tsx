import { useEffect, useRef, useState } from 'react'

interface EmojiPickerProps {
  choices: string[]
  value: string
  onChange: (emoji: string) => void
  ariaLabel?: string
}

export function EmojiPicker({ choices, value, onChange, ariaLabel }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
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

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 4,
            padding: 8,
            borderRadius: 16,
            background: 'var(--surface-raised)',
            border: '1.5px solid var(--line)',
            boxShadow: 'var(--shadow-float)',
            zIndex: 20,
          }}
        >
          {choices.map((choice) => (
            <button
              type="button"
              key={choice}
              role="menuitem"
              onClick={() => {
                onChange(choice)
                setOpen(false)
              }}
              className={`pick ${choice === value ? 'pick-active' : ''}`}
              style={{ width: 36, height: 36, padding: 0, borderRadius: '50%', display: 'grid', placeItems: 'center' }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
