import { createContext, useContext, useCallback, useRef, useEffect } from 'react'
import NoSleep from '@zakj/no-sleep'

interface WakeLockContextValue {
  /** Call from a user gesture (e.g. play button click) to keep screen awake during playback */
  requestWakeLock: () => void
}

const WakeLockContext = createContext<WakeLockContextValue | null>(null)

export function useWakeLockContext(): WakeLockContextValue {
  const ctx = useContext(WakeLockContext)
  if (!ctx) return { requestWakeLock: () => {} }
  return ctx
}

export function WakeLockProvider({ children }: { children: React.ReactNode }) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const noSleepRef = useRef<InstanceType<typeof NoSleep> | null>(null)

  const releaseAll = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release()
      wakeLockRef.current = null
    }
    noSleepRef.current?.disable()
  }, [])

  const requestWakeLock = useCallback(async () => {
    // Try Wake Lock API first (works on HTTPS, newer iOS PWA)
    if ('wakeLock' in navigator) {
      try {
        if (document.visibilityState === 'visible') {
          const wl = await navigator.wakeLock.request('screen')
          wakeLockRef.current = wl
          wl.addEventListener('release', () => {
            wakeLockRef.current = null
          })
          noSleepRef.current?.disable()
          return
        }
      } catch {
        // Wake lock denied (HTTP, iOS Safari, low battery, etc.)
      }
    }

    // Fallback: NoSleep uses a playing video to prevent sleep (works on iOS Safari, local network)
    try {
      if (!noSleepRef.current) {
        noSleepRef.current = new NoSleep()
      }
      noSleepRef.current.enable()
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    } catch {
      // NoSleep may fail in some environments
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        releaseAll()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      releaseAll()
    }
  }, [releaseAll])

  const value: WakeLockContextValue = { requestWakeLock }

  return (
    <WakeLockContext.Provider value={value}>
      {children}
    </WakeLockContext.Provider>
  )
}
