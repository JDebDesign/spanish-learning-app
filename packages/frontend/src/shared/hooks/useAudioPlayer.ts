import { useState, useCallback, useRef, useEffect } from 'react'

const POSITION_UPDATE_INTERVAL_MS = 100

export interface UseAudioPlayerReturn {
  isPlaying: boolean
  duration: number
  currentTime: number
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (timeSeconds: number) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  audioSrc: string
}

export function useAudioPlayer(
  audioSrc: string,
  onTimeUpdate?: (currentTime: number) => void,
  volume: number = 1
): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  // Reset Web Audio graph when switching songs so the new element gets volume control
  useEffect(() => {
    gainNodeRef.current = null
  }, [audioSrc])

  /**
   * Uses Web Audio API GainNode for volume control. Required because iOS Safari
   * ignores HTMLAudioElement.volume (it is read-only and always 1 on iOS).
   * Sets up the graph on first play (user gesture) and reuses it.
   */
  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current
    if (!audio || gainNodeRef.current) return gainNodeRef.current

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return null

      const ctx = new AudioContextClass()
      const source = ctx.createMediaElementSource(audio)
      const gainNode = ctx.createGain()
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
      gainNode.gain.value = volumeRef.current
      gainNodeRef.current = gainNode
      return gainNode
    } catch {
      return null
    }
  }, [])
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeUpdateRef = useRef(onTimeUpdate)
  onTimeUpdateRef.current = onTimeUpdate

  const updateTime = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const time = audio.currentTime
    setCurrentTime(time)
    onTimeUpdateRef.current?.(time)
  }, [])

  // Re-attach listeners when audioSrc changes (element remounts with key={audioSrc})
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [audioSrc])

  useEffect(() => {
    if (!isPlaying) {
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
      return
    }
    tickRef.current = setInterval(updateTime, POSITION_UPDATE_INTERVAL_MS)
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
    }
  }, [isPlaying, updateTime])

  // Sync volume to GainNode (iOS) or audio.volume (desktop fallback)
  useEffect(() => {
    const audio = audioRef.current
    const gain = gainNodeRef.current
    if (gain) {
      gain.gain.value = volume
    } else if (audio) {
      audio.volume = volume
    }
  }, [volume])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const gainNode = ensureAudioGraph()
    if (gainNode) {
      const ctx = gainNode.context as AudioContext
      if (ctx.state === 'suspended') ctx.resume()
      gainNode.gain.value = volumeRef.current
    } else {
      audio.volume = volumeRef.current
    }
    audio.play().catch(() => {})
  }, [ensureAudioGraph])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      const gainNode = ensureAudioGraph()
      if (gainNode) {
        const ctx = gainNode.context as AudioContext
        if (ctx.state === 'suspended') ctx.resume()
        gainNode.gain.value = volumeRef.current
      } else {
        audio.volume = volumeRef.current
      }
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [ensureAudioGraph])

  const seek = useCallback((timeSeconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = timeSeconds
    setCurrentTime(timeSeconds)
    updateTime()
  }, [updateTime])

  return {
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    seek,
    audioRef,
    audioSrc,
  }
}
