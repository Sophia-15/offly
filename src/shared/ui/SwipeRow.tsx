import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Icon } from './Icon'

const SWIPE_W = 168

interface DragState {
  startX: number
  base: number
  moved: boolean
}

interface SwipeRowProps {
  children: ReactNode
  onHide: () => void
  onDelete: () => void
  hideLabel: string
  deleteLabel: string
  ariaLabel: string
}

export function SwipeRow({ children, onHide, onDelete, hideLabel, deleteLabel, ariaLabel }: SwipeRowProps) {
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const open = x <= -SWIPE_W / 2

  function settle(v: number) {
    setX(v < -SWIPE_W / 3 ? -SWIPE_W : 0)
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.swipe-actions')) return
    dragRef.current = { startX: e.clientX, base: x, moved: false }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    if (!d.moved && Math.abs(dx) < 6) return
    d.moved = true
    setX(Math.max(-SWIPE_W - 24, Math.min(0, d.base + dx)))
  }

  function onPointerUp() {
    const d = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (d && d.moved) settle(x)
    else if (d && open) setX(0)
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft') {
      setX(-SWIPE_W)
      e.preventDefault()
    }
    if (e.key === 'ArrowRight' || e.key === 'Escape') setX(0)
  }

  return (
    <div className={`swipe ${open ? 'swipe-open' : ''}`}>
      <div className="swipe-actions" aria-hidden={!open}>
        <button
          type="button"
          className="swipe-btn swipe-hide"
          tabIndex={open ? 0 : -1}
          onClick={() => {
            setX(0)
            onHide()
          }}
        >
          <Icon name="hide" size={20} />
          {hideLabel}
        </button>
        <button
          type="button"
          className="swipe-btn swipe-delete"
          tabIndex={open ? 0 : -1}
          onClick={() => {
            setX(0)
            onDelete()
          }}
        >
          <Icon name="trash" size={20} />
          {deleteLabel}
        </button>
      </div>
      <div
        className="swipe-front"
        style={{ transform: `translateX(${x}px)`, transition: dragging ? 'none' : 'transform .25s cubic-bezier(.2,.8,.3,1)' }}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </div>
  )
}
