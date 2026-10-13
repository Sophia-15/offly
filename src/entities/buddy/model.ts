import type { MascotCharacter } from '../../shared/ui/Mascot'

export interface Buddy {
  id: MascotCharacter
  name: string
  roleKey: string
  lineKey: string
}

export const BUDDIES: Buddy[] = [
  { id: 'sun', name: 'Pip', roleKey: 'buddy.sun_role', lineKey: 'buddy.sun_line' },
  { id: 'moon', name: 'Luna', roleKey: 'buddy.moon_role', lineKey: 'buddy.moon_line' },
  { id: 'cloud', name: 'Puff', roleKey: 'buddy.cloud_role', lineKey: 'buddy.cloud_line' },
  { id: 'tree', name: 'Sprout', roleKey: 'buddy.tree_role', lineKey: 'buddy.tree_line' },
  { id: 'leaf', name: 'Fern', roleKey: 'buddy.leaf_role', lineKey: 'buddy.leaf_line' },
  { id: 'mushroom', name: 'Mo', roleKey: 'buddy.mushroom_role', lineKey: 'buddy.mushroom_line' },
  { id: 'cactus', name: 'Spike', roleKey: 'buddy.cactus_role', lineKey: 'buddy.cactus_line' },
  { id: 'fire', name: 'Ember', roleKey: 'buddy.fire_role', lineKey: 'buddy.fire_line' },
]

export function findBuddy(id: string): Buddy {
  return BUDDIES.find((b) => b.id === id) ?? BUDDIES[0]
}
