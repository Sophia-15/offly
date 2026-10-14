import type { CSSProperties, ReactNode } from 'react'
import { resolveTime, sceneArt, timeVars, type SceneTime } from '../lib/sceneTime'

interface SceneProps {
  height?: number | string
  /** 'auto' (default) reads the real current hour; pick a specific time to pin it. */
  time?: SceneTime
  wide?: boolean
  style?: CSSProperties
  children?: ReactNode
}

export function Scene({ height = 300, time = 'auto', wide = false, style, children }: SceneProps) {
  const key = resolveTime(time)

  return (
    <div className={`scene scene-${key}`} data-time={key} style={{ height, ...timeVars(time), ...style }}>
      <svg viewBox={wide ? '0 0 1200 300' : '0 0 390 300'} preserveAspectRatio="xMidYMax slice" aria-hidden>
        {sceneArt(wide, key)}
      </svg>
      <div className="scene-body">{children ?? null}</div>
    </div>
  )
}
