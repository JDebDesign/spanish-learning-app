import { useState, useCallback, useRef, useEffect } from 'react'

const AUDIO_SRC = '/songs/dtmf-bad-bunny.mp3'
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
  onTimeUpdate?: (currentTime: number) => void
): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement>(null)
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
  }, [])

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

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [])

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
    audioSrc: AUDIO_SRC,
  }
}
