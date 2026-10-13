import type { ReactNode } from 'react'

export type Tone = 'blue' | 'sun' | 'tangerine' | 'mint' | 'ink'

interface TileProps {
  tone: Tone
  children: ReactNode
}

export function Tile({ tone, children }: TileProps) {
  return <div className={`tile tile-${tone}`}>{children}</div>
}
