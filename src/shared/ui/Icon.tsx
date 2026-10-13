import { createElement } from 'react'

type IconPart = [string, Record<string, number | string>]

const ICONS: Record<string, IconPart[]> = {
  offline: [
    ['rect', { x: 7, y: 3, width: 10, height: 18, rx: 3 }],
    ['path', { d: 'M4 4l16 16' }],
  ],
  read: [
    ['path', { d: 'M3 5.5c3-1.2 6-1 9 1.2v13c-3-2.2-6-2.4-9-1.2z' }],
    ['path', { d: 'M21 5.5c-3-1.2-6-1-9 1.2v13c3-2.2 6-2.4 9-1.2z' }],
  ],
  walk: [
    ['ellipse', { cx: 8, cy: 8, rx: 3, ry: 4.2 }],
    ['ellipse', { cx: 16, cy: 15.5, rx: 3, ry: 4.2 }],
  ],
  breathe: [
    ['path', { d: 'M3 9h11a3 3 0 1 0-3-3' }],
    ['path', { d: 'M3 15h15a3 3 0 1 1-3 3' }],
  ],
  sleep: [['path', { d: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z' }]],
  lock: [
    ['rect', { x: 5, y: 11, width: 14, height: 10, rx: 3 }],
    ['path', { d: 'M8 11V8a4 4 0 0 1 8 0v3' }],
  ],
  unlock: [
    ['rect', { x: 5, y: 11, width: 14, height: 10, rx: 3 }],
    ['path', { d: 'M8 11V8a4 4 0 0 1 7.6-1.8' }],
  ],
  check: [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
  play: [['path', { d: 'M8 5.5v13l10-6.5z' }]],
  chevron: [['path', { d: 'M9 5l7 7-7 7' }]],
  flame: [
    ['path', { d: 'M12 21c-4 0-7-2.8-7-6.6 0-3.4 2.6-5.4 4-8.4.6 1.8 1.6 3 3 3.6.2-2.4 1.2-4.6 3-6.6.4 3 4 5.6 4 10.4C19 18 16 21 12 21z' }],
  ],
  close: [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
  clock: [
    ['circle', { cx: 12, cy: 12, r: 8.5 }],
    ['path', { d: 'M12 7.5V12l3 2' }],
  ],
  person: [
    ['circle', { cx: 12, cy: 8, r: 4 }],
    ['path', { d: 'M4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5' }],
  ],
  hide: [
    ['path', { d: 'M3 12s3.2-6 9-6c1.6 0 3 .4 4.2 1.1M21 12s-3.2 6-9 6c-1.6 0-3-.4-4.2-1.1' }],
    ['path', { d: 'M4 4l16 16' }],
    ['path', { d: 'M9.8 9.8a3 3 0 0 0 4.4 4.1' }],
  ],
  show: [
    ['path', { d: 'M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6z' }],
    ['circle', { cx: 12, cy: 12, r: 3 }],
  ],
  trash: [['path', { d: 'M4.5 7h15M9.5 7V4.8h5V7M6.5 7l1 12.2h9l1-12.2' }]],
  download: [['path', { d: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14' }]],
  upload: [['path', { d: 'M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19.5h14' }]],
  pause: [['path', { d: 'M9 5.5v13M15 5.5v13' }]],
  focus: [
    ['circle', { cx: 12, cy: 12, r: 8.5 }],
    ['circle', { cx: 12, cy: 12, r: 4 }],
    ['circle', { cx: 12, cy: 12, r: 0.6 }],
  ],
  cup: [
    ['path', { d: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z' }],
    ['path', { d: 'M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16' }],
    ['path', { d: 'M9 3.5c0 1.5 1.5 1.5 1.5 3M12.5 3.5c0 1.5 1.5 1.5 1.5 3' }],
  ],
  skip: [
    ['path', { d: 'M6 5.5l9 6.5-9 6.5z' }],
    ['path', { d: 'M18.5 5.5v13' }],
  ],
  undo: [
    ['path', { d: 'M9 7L4.5 11.5 9 16' }],
    ['path', { d: 'M5 11.5h9.5a5 5 0 0 1 0 10H12' }],
  ],
  restart: [
    ['path', { d: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3' }],
    ['path', { d: 'M4 4.5v3.8h3.8' }],
  ],
}

interface IconProps {
  name: keyof typeof ICONS
  size?: number
  strokeWidth?: number
}

export function Icon({ name, size = 24, strokeWidth = 2.4 }: IconProps) {
  const parts = ICONS[name] ?? ICONS.check
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {parts.map((part, i) => createElement(part[0], { key: i, ...part[1] }))}
    </svg>
  )
}
