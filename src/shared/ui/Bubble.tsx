import type { ReactNode } from 'react'

export function Bubble({ children }: { children: ReactNode }) {
  return <div className="bubble">{children}</div>
}
