import type { CompletionEntry } from '../../entities/task/model'

function toDateKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dateKeyDaysAgo(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export interface StreakStats {
  current: number
  longest: number
  totalPoints: number
  totalCompletions: number
}

export interface WeekDay {
  date: string
  done: boolean
  isToday: boolean
}

export function computeStreakStats(completions: CompletionEntry[]): StreakStats {
  const totalPoints = completions.reduce((sum, c) => sum + c.points, 0)
  const totalCompletions = completions.length

  if (completions.length === 0) {
    return { current: 0, longest: 0, totalPoints, totalCompletions }
  }

  const activeDays = new Set(completions.map((c) => toDateKey(c.completedAt)))

  // Current streak: walk back from today (or yesterday, so a day in progress
  // doesn't reset the streak before it's over) while each day was active.
  let current = 0
  const startOffset = activeDays.has(dateKeyDaysAgo(0)) ? 0 : 1
  if (startOffset === 1 && !activeDays.has(dateKeyDaysAgo(1))) {
    current = 0
  } else {
    let offset = startOffset
    while (activeDays.has(dateKeyDaysAgo(offset))) {
      current += 1
      offset += 1
    }
  }

  // Longest streak: scan the sorted set of active days for the longest
  // run of consecutive calendar dates.
  const sortedTimes = Array.from(activeDays)
    .map((key) => {
      const [y, m, d] = key.split('-').map(Number)
      return new Date(y, m, d).getTime()
    })
    .sort((a, b) => a - b)

  let longest = 1
  let run = 1
  const oneDay = 24 * 60 * 60 * 1000
  for (let i = 1; i < sortedTimes.length; i++) {
    if (sortedTimes[i] - sortedTimes[i - 1] === oneDay) {
      run += 1
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  return { current, longest, totalPoints, totalCompletions }
}

export function computeWeek(completions: CompletionEntry[]): WeekDay[] {
  const activeDays = new Set(completions.map((c) => toDateKey(c.completedAt)))

  const today = new Date()
  const todayKey = toDateKey(today.toISOString())
  // Calendar week, Monday through Sunday: getDay() is 0=Sunday..6=Saturday,
  // so (day + 6) % 7 gives the offset back to this week's Monday.
  const mondayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(monday.getDate() - mondayOffset)

  const days: WeekDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    days.push({ date: d.toISOString(), done: activeDays.has(key), isToday: key === todayKey })
  }
  return days
}
