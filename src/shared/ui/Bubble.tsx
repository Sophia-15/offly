import type { ReactNode } from 'react'

interface BubbleProps {
  children: ReactNode
  tail?: 'center' | 'left'
}

export function Bubble({ children, tail = 'center' }: BubbleProps) {
  return <div className={`bubble ${tail === 'left' ? 'bubble-left' : ''}`}>{children}</div>
}
