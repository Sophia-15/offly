// Best-effort ways to "bug" the person once they've switched away from the tab.
// This app has no backend and no service worker, so there's a hard platform
// limit: the Notification API only fires while this tab is still open
// somewhere (backgrounded is fine, fully closed is not — that needs Web Push,
// which needs a server). iOS Safari is stricter still: it only allows
// Notification at all once the app is added to the home screen (iOS 16.4+),
// and even then only while that tab is alive. Desktop and Android Chrome get
// the full experience. We do what's possible everywhere and degrade quietly.

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestNotifyPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/** Shows (or replaces, via `tag`) a notification for the given alarm unlock. No-ops if unsupported/not granted. */
export function notifyTimesUp(unlockId: string, title: string, body: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  try {
    const options: NotificationOptions & { renotify?: boolean } = { body, tag: `offly-timesup-${unlockId}`, renotify: true, silent: false }
    new Notification(title, options)
  } catch {
    // Some browsers (notably mobile Safari outside an installed PWA) reject the constructor entirely — ignore.
  }
}

/** A short, non-jarring vibration pattern. No-ops on platforms without the Vibration API (iOS). */
export function vibrateSoft(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([120, 80, 120])
    } catch {
      // ignore
    }
  }
}

const originalTitles = new WeakMap<Document, string>()
let flashInterval: ReturnType<typeof setInterval> | null = null

/** Alternates the tab title with `alertText` so the alarm is visible from another tab/app. Call `stopTitleFlash` to restore it. */
export function startTitleFlash(alertText: string): void {
  if (typeof document === 'undefined' || flashInterval) return
  const original = originalTitles.get(document) ?? document.title
  originalTitles.set(document, original)
  let showingAlert = false
  flashInterval = setInterval(() => {
    showingAlert = !showingAlert
    document.title = showingAlert ? alertText : original
  }, 1000)
}

export function stopTitleFlash(): void {
  if (flashInterval) {
    clearInterval(flashInterval)
    flashInterval = null
  }
  if (typeof document !== 'undefined') {
    const original = originalTitles.get(document)
    if (original !== undefined) document.title = original
  }
}
