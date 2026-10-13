import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'sun' | 'mint' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'md' | 'sm'
  block?: boolean
}

export function Button({ variant = 'primary', size = 'md', block, className, ...rest }: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...rest} />
}
