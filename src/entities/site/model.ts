import type { Tone } from '../../shared/ui/Tile';

export interface Site {
  id: string;
  name: string;
  tone: Tone;
  ratePer5Min: number;
  isCustom: boolean;
}

export interface UnlockEntry {
  id: string;
  siteId: string;
  siteName: string;
  minutes: number;
  cost: number;
  unlockedAt: string;
  /** Set once the times-up alarm for this session has been dismissed ("done") , stops it from re-triggering. */
  dismissedAt?: string;
  /** Coins already spent snoozing this alarm, deducted from balance. */
  snoozeSpent?: number;
  /** Times this alarm has been snoozed , shown on the "nice stop" recap. */
  snoozeCount?: number;
  /** Cost of the next snooze , starts at `ALARM_SNOOZE_BASE_COST`, doubles each time. */
  nextSnoozeCost?: number;
  /** Bonus coins earned for dismissing the alarm ("+2 for putting it down"). */
  bonusCoins?: number;
}

export const DEFAULT_SITES: Site[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    tone: 'ink',
    ratePer5Min: 4,
    isCustom: false,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    tone: 'tangerine',
    ratePer5Min: 3,
    isCustom: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    tone: 'blue',
    ratePer5Min: 3,
    isCustom: false,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    tone: 'sun',
    ratePer5Min: 5,
    isCustom: false,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    tone: 'tangerine',
    ratePer5Min: 2,
    isCustom: false,
  },
  { id: 'x', name: 'X', tone: 'ink', ratePer5Min: 3, isCustom: false },
  {
    id: 'twitch',
    name: 'Twitch',
    tone: 'blue',
    ratePer5Min: 4,
    isCustom: false,
  },
];

export const UNLOCK_LENGTHS_MINUTES = [5, 15, 30, 60] as const;

export function costFor(site: Site, minutes: number): number {
  return Math.round(site.ratePer5Min * (minutes / 5));
}
