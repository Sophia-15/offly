import { useTranslation } from 'react-i18next'
import { Mascot, type MascotMood } from '../../shared/ui/Mascot'
import type { Buddy } from './model'

interface BuddyAvatarProps {
  buddy: Buddy
  size?: number
  mood?: MascotMood
}

export function BuddyAvatar({ buddy, size = 96, mood = 'happy' }: BuddyAvatarProps) {
  const { t } = useTranslation()
  return <Mascot character={buddy.id} mood={mood} size={size} label={`${buddy.name}, ${t(buddy.roleKey)}`} />
}
