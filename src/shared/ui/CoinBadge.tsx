import { Coin } from './Coin'

interface CoinBadgeProps {
  amount: number
  size?: 'md' | 'lg'
  reward?: boolean
}

export function CoinBadge({ amount, size = 'md', reward = false }: CoinBadgeProps) {
  const classes = ['coin-badge', size === 'lg' ? 'coin-badge-lg' : '', reward ? 'coin-badge-reward' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-label={`${reward ? 'Earn ' : ''}${amount} coins`}>
      <Coin size={size === 'lg' ? 38 : 28} />
      {reward ? '+' : ''}
      {amount}
    </span>
  )
}
