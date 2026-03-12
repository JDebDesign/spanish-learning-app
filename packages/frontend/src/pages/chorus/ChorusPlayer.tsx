import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  IconButton,
  Paper,
  Slider,
  ButtonBase,
  Popover,
  ClickAwayListener,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import { ChorusLine, CLICKABLE_WORD_SELECTOR } from './components/ChorusLine'
import { SongDropdown } from './components/SongDropdown'
import { WordTooltip } from './components/WordTooltip'
import { SONG_CATALOG } from '@/shared/data/songCatalog'
import { SONG_DATA } from '@/shared/data/songData'
import { useAudioPlayer } from '@/shared/hooks/useAudioPlayer'
import { useWakeLockContext } from '@/shared/contexts/WakeLockContext'
import { getActiveLineIndex } from '@/shared/utils/getActiveLineIndex'
import { getTokensForLine } from '@/shared/data/mockChorus'
import type { LyricLineTiming } from '@/shared/data/lyricsTiming'
import { WaveformTimingTool } from './components/WaveformTimingTool'
import type { WordToken } from '@/shared/types/chorus'

const ENABLE_TIMING_TOOL = false

type RepeatMode = 'off' | 'once' | 'forever'
const REPEAT_CYCLE: RepeatMode[] = ['off', 'once', 'forever']
const LOOP_EPSILON_S = 0.05

/** Merge timing data with token data for word tooltips */
function getMergedLines(lyrics: LyricLineTiming[]) {
  return lyrics.map((timingLine) => ({
    ...timingLine,
    tokens: getTokensForLine(timingLine.spanishText),
  }))
}

export function ChorusPlayer() {
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null)
  const [tooltipToken, setTooltipToken] = useState<WordToken | null>(null)
  const [activeLineIndex, setActiveLineIndex] = useState(-1)
  const [showEnglish, setShowEnglish] = useState(true)
  const [volumeAnchor, setVolumeAnchor] = useState<HTMLElement | null>(null)
  const [volume, setVolume] = useState(1)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')
  const [loopTargetLineId, setLoopTargetLineId] = useState<string | null>(null)
  const [loopCount, setLoopCount] = useState(0)
  const [selectedSongId, setSelectedSongId] = useState('dtmf')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const volumeAutoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const VOLUME_AUTO_HIDE_MS = 2500
  const showToast = useCallback((message: string) => {
    setToastMessage(message)
  }, [])
  const lastScrolledIndexRef = useRef(-1)
  const linesContainerRef = useRef<HTMLDivElement>(null)
  const lineRefsRef = useRef<(HTMLDivElement | null)[]>([])
  const lastLoopHandledRef = useRef<string | null>(null)

  const { requestWakeLock } = useWakeLockContext()
  const currentSongData = SONG_DATA[selectedSongId] ?? SONG_DATA.dtmf
  const lyrics = currentSongData.lyrics
  const mergedLines = getMergedLines(lyrics)

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      const index = getActiveLineIndex(currentTime, lyrics)
      setActiveLineIndex(index)
    },
    [lyrics]
  )

  const {
    isPlaying,
    duration,
    currentTime,
    toggle,
    pause,
    seek,
    audioRef,
    audioSrc,
  } = useAudioPlayer(currentSongData.audioSrc, handleTimeUpdate, volume)

  // Line-repeat loop: when playing and repeat on, seek back to loop start when we pass loop end
  useEffect(() => {
    if (!isPlaying || repeatMode === 'off' || !loopTargetLineId) return
    const line = mergedLines.find((l) => l.id === loopTargetLineId)
    if (!line || line.startMs == null || line.endMs == null) return
    const loopStart = line.startMs / 1000
    const loopEnd = line.endMs / 1000
    if (currentTime < loopEnd - LOOP_EPSILON_S) {
      lastLoopHandledRef.current = null
      return
    }
    const key = `${loopTargetLineId}-${loopCount}`
    if (lastLoopHandledRef.current === key) return
    lastLoopHandledRef.current = key

    if (repeatMode === 'forever') {
      seek(loopStart)
      audioRef.current?.play().catch(() => {})
    } else if (repeatMode === 'once') {
      if (loopCount === 0) {
        seek(loopStart)
        setLoopCount(1)
        audioRef.current?.play().catch(() => {})
      } else {
        const idx = mergedLines.findIndex((l) => l.id === loopTargetLineId)
        const nextLine = mergedLines[idx + 1]
        if (nextLine) {
          setLoopTargetLineId(nextLine.id)
          setLoopCount(0)
        } else {
          setRepeatMode('off')
          setLoopTargetLineId(null)
          setLoopCount(0)
        }
      }
    }
  }, [isPlaying, repeatMode, loopTargetLineId, loopCount, currentTime, mergedLines, seek, audioRef])

  const currentSong = SONG_CATALOG.find((s) => s.id === selectedSongId) ?? SONG_CATALOG[0]

  const handleSelectSong = useCallback(
    (song: { id: string; title: string; artist: string }) => {
      if (song.id === selectedSongId) return
      pause()
      seek(0)
      setActiveLineIndex(-1)
      setRepeatMode('off')
      setLoopTargetLineId(null)
      setLoopCount(0)
      setSelectedSongId(song.id)
      lastScrolledIndexRef.current = -1
      linesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [selectedSongId, pause, seek]
  )

  // Scroll active line into view when it changes
  useEffect(() => {
    if (activeLineIndex < 0 || activeLineIndex === lastScrolledIndexRef.current) return
    lastScrolledIndexRef.current = activeLineIndex
    const el = lineRefsRef.current[activeLineIndex]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeLineIndex])

  const handleLineClick = useCallback(
    (index: number, wasPlaying: boolean) => {
      requestWakeLock()
      const line = lyrics[index]
      if (!line) return
      seek(line.startMs / 1000)
      setActiveLineIndex(index)
      lastScrolledIndexRef.current = index
      if (repeatMode !== 'off') {
        setLoopTargetLineId(line.id)
        setLoopCount(0)
      }
      if (wasPlaying) {
        audioRef.current?.play().catch(() => {})
      }
    },
    [requestWakeLock, seek, audioRef, repeatMode, lyrics]
  )

  const handleProgressChange = useCallback(
    (_: Event, value: number | number[]) => {
      const seconds = Array.isArray(value) ? value[0] : value
      seek(seconds)
    },
    [seek]
  )

  const handleRepeatClick = useCallback(() => {
    const nextIndex = (REPEAT_CYCLE.indexOf(repeatMode) + 1) % REPEAT_CYCLE.length
    const next = REPEAT_CYCLE[nextIndex]
    setRepeatMode(next)
    const repeatMessages: Record<RepeatMode, string> = {
      off: 'Repeat off',
      once: 'Repeat current line once',
      forever: 'Repeat current line continuously',
    }
    showToast(repeatMessages[next])
    if (next !== 'off') {
      const lineIndex = activeLineIndex >= 0 ? activeLineIndex : lastScrolledIndexRef.current
      const line = lyrics[lineIndex]
      if (line) {
        setLoopTargetLineId(line.id)
        setLoopCount(0)
      } else {
        setLoopTargetLineId(null)
      }
    } else {
      setLoopTargetLineId(null)
      setLoopCount(0)
    }
  }, [repeatMode, activeLineIndex, lyrics, showToast])

  const handleRestart = useCallback(() => {
    requestWakeLock()
    seek(0)
    if (isPlaying) audioRef.current?.play().catch(() => {})
    linesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('Restart song from the beginning')
  }, [requestWakeLock, seek, isPlaying, audioRef, showToast])

  const handleSkipPrevious = useCallback(() => {
    requestWakeLock()
    const targetIndex = activeLineIndex <= 0 ? 0 : activeLineIndex - 1
    const line = lyrics[targetIndex]
    if (!line) return
    seek(line.startMs / 1000)
    setActiveLineIndex(targetIndex)
    lastScrolledIndexRef.current = targetIndex
    if (isPlaying) audioRef.current?.play().catch(() => {})
    showToast('Go to previous lyric')
  }, [requestWakeLock, activeLineIndex, seek, isPlaying, audioRef, lyrics, showToast])

  const handleSkipNext = useCallback(() => {
    requestWakeLock()
    const lastIndex = lyrics.length - 1
    const targetIndex = activeLineIndex < 0 ? 0 : Math.min(lastIndex, activeLineIndex + 1)
    const line = lyrics[targetIndex]
    if (!line) return
    seek(line.startMs / 1000)
    setActiveLineIndex(targetIndex)
    lastScrolledIndexRef.current = targetIndex
    if (isPlaying) audioRef.current?.play().catch(() => {})
    showToast('Go to next lyric')
  }, [requestWakeLock, activeLineIndex, seek, isPlaying, audioRef, lyrics, showToast])

  const handleWordClick = useCallback((e: React.MouseEvent<HTMLElement>, token: WordToken) => {
    setTooltipAnchor(e.currentTarget)
    setTooltipToken(token)
  }, [])

  /** Open/switch tooltip on pointerdown - runs before outside-click, so single tap switches */
  const handleWordPointerDown = useCallback((element: HTMLElement, token: WordToken) => {
    setTooltipAnchor(element)
    setTooltipToken(token)
  }, [])

  const handleTooltipClose = useCallback(() => {
    setTooltipAnchor(null)
    setTooltipToken(null)
  }, [])

  // Custom outside-click: close only when target is NOT a clickable word and NOT inside tooltip
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!tooltipAnchor) return
      const target = e.target as Node
      if (target instanceof HTMLElement) {
        if (target.closest(CLICKABLE_WORD_SELECTOR)) return
        if (target.closest('[data-tooltip-content]') || target.closest('.MuiPopover-paper')) return
      }
      handleTooltipClose()
    }
    document.addEventListener('pointerdown', handlePointerDown, { capture: true })
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true })
  }, [tooltipAnchor, handleTooltipClose])

  useEffect(() => {
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {})
    }
  }, [])

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setVolumeAnchor((prev) => (prev ? null : e.currentTarget))
  }, [])

  const handleVolumeClose = useCallback(() => {
    setVolumeAnchor(null)
    if (volumeAutoHideTimerRef.current) {
      clearTimeout(volumeAutoHideTimerRef.current)
      volumeAutoHideTimerRef.current = null
    }
  }, [])

  const scheduleVolumeAutoHide = useCallback(() => {
    if (volumeAutoHideTimerRef.current) clearTimeout(volumeAutoHideTimerRef.current)
    volumeAutoHideTimerRef.current = setTimeout(() => {
      setVolumeAnchor(null)
      volumeAutoHideTimerRef.current = null
    }, VOLUME_AUTO_HIDE_MS)
  }, [])

  const handleVolumeChange = useCallback(
    (_: Event, value: number | number[]) => {
      setVolume(Array.isArray(value) ? value[0] : value)
      scheduleVolumeAutoHide()
    },
    [scheduleVolumeAutoHide]
  )

  // Start auto-hide timer when popover opens
  useEffect(() => {
    if (volumeAnchor) scheduleVolumeAutoHide()
  }, [volumeAnchor, scheduleVolumeAutoHide])

  if (ENABLE_TIMING_TOOL) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', minHeight: '100vh', backgroundColor: '#05020a' }}>
        <WaveformTimingTool />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100vh', // 100dvh preferred for iOS; fallback for older browsers
        minHeight: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh', minHeight: '100dvh' },
        backgroundColor: '#05020a',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 430,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Header - sticky to top */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          borderBottom: '1px solid #4a2f7a',
          py: 2,
          px: 3,
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          backgroundColor: '#05020a',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '16.8px',
                color: '#c7b8e6',
                whiteSpace: 'nowrap',
              }}
            >
              Show English
            </Typography>
            <Switch
              checked={showEnglish}
              onChange={() => {
                const next = !showEnglish
                setShowEnglish(next)
                showToast(next ? 'English shown' : 'English hidden')
              }}
              aria-label={showEnglish ? 'Hide English (difficult mode)' : 'Show English'}
              sx={{
                width: 52,
                height: 32,
                p: 0,
                '& .MuiSwitch-switchBase': {
                  p: '2px',
                  '&.Mui-checked': {
                    transform: 'translateX(20px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                      bgcolor: '#6750a4',
                      opacity: 1,
                    },
                  },
                },
                '& .MuiSwitch-thumb': {
                  width: 28,
                  height: 28,
                  boxShadow: 'none',
                },
                '& .MuiSwitch-track': {
                  borderRadius: 100,
                  bgcolor: '#49454f',
                  opacity: 1,
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 1 }}>
            <SongDropdown
              currentSong={currentSong}
              songs={SONG_CATALOG}
              onSelectSong={handleSelectSong}
            />
          </Box>
          <IconButton
            size="small"
            sx={{ color: '#c7b8e6' }}
            onClick={handleVolumeClick}
            aria-label="Volume"
            aria-expanded={Boolean(volumeAnchor)}
          >
            <VolumeUpIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Lyrics */}
      <Box
        ref={linesContainerRef}
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 3 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {mergedLines.map((line, i) => {
            const isActive = activeLineIndex === i
            const lineOpacity = !isPlaying ? 1 : isActive ? 1 : 0.5
            return (
              <ButtonBase
                key={line.id}
                ref={(el) => { lineRefsRef.current[i] = el }}
                component="div"
                onClick={() => handleLineClick(i, isPlaying)}
                disableRipple
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  width: '100%',
                  opacity: lineOpacity,
                  transition: 'opacity 0.2s ease',
                  borderRadius: 1,
                  '&:hover': { opacity: lineOpacity < 1 ? 0.7 : 1 },
                }}
              >
                <Box
                  sx={{
                    borderLeft: isActive ? '3px solid #e9d5ff' : '3px solid transparent',
                    pl: isActive ? 1.5 : 2,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChorusLine line={line} onWordClick={handleWordClick} onWordPointerDown={handleWordPointerDown} showEnglish={showEnglish} selectedToken={tooltipToken} />
                </Box>
              </ButtonBase>
            )
          })}
        </Box>
      </Box>

      {/* Footer - sticky to bottom, safe area for iPhone home indicator */}
      <Paper
        elevation={0}
        component="footer"
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          flexShrink: 0,
          borderTop: '1px solid #4a2f7a',
          backgroundColor: '#05020a',
          py: 2,
          px: 3,
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <Slider
          size="small"
          value={duration > 0 ? currentTime : 0}
          min={0}
          max={duration || 100}
          step={0.1}
          onChange={handleProgressChange}
          sx={{
            color: '#e9d5ff',
            mb: 1,
            '& .MuiSlider-thumb': { width: 12, height: 12 },
          }}
        />
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: 40,
          }}
        >
          {/* Left side: Restart (outer) → Previous (inner) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end', pr: 7 }}>
            <IconButton
              onClick={handleRestart}
              sx={{ color: '#e9d5ff' }}
              size="medium"
              aria-label="Restart song"
            >
              <SkipPreviousIcon />
            </IconButton>
            <IconButton
              onClick={handleSkipPrevious}
              sx={{ color: '#e9d5ff' }}
              size="medium"
              aria-label="Previous lyric"
            >
              <FastRewindIcon />
            </IconButton>
          </Box>

          {/* Center: Play - always perfectly centered */}
          <IconButton
            onClick={() => {
              requestWakeLock()
              toggle()
              showToast(isPlaying ? 'Paused' : 'Playing')
            }}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: '#e9d5ff',
              color: '#05020a',
              width: 40,
              height: 40,
              borderRadius: '20px',
              '&:hover': { bgcolor: '#f0dfff' },
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 28 }} /> : <PlayArrowIcon sx={{ fontSize: 28 }} />}
          </IconButton>

          {/* Right side: Next (inner) → Repeat (outer) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-start', pl: 7 }}>
            <IconButton
              onClick={handleSkipNext}
              sx={{ color: '#e9d5ff' }}
              size="medium"
              aria-label="Next lyric"
            >
              <SkipNextIcon />
            </IconButton>
            <IconButton
              onClick={handleRepeatClick}
              sx={{
                color: repeatMode === 'off' ? '#71717a' : '#e9d5ff',
                ...(repeatMode !== 'off' && {
                  bgcolor: 'rgba(233, 213, 255, 0.2)',
                  boxShadow: '0 0 0 2px #e9d5ff',
                  '&:hover': { bgcolor: 'rgba(233, 213, 255, 0.3)' },
                }),
              }}
              size="medium"
              aria-label={
                repeatMode === 'off'
                  ? 'Line repeat off'
                  : repeatMode === 'once'
                    ? 'Repeat current line once'
                    : 'Repeat current line'
              }
            >
              {repeatMode === 'once' ? <RepeatOneIcon /> : <RepeatIcon />}
            </IconButton>
          </Box>
        </Box>
        <audio
          key={audioSrc}
          ref={audioRef}
          src={audioSrc}
          style={{ display: 'none' }}
          preload="metadata"
        />
      </Paper>

      <Snackbar
        open={Boolean(toastMessage)}
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 'calc(120px + env(safe-area-inset-bottom, 0px))', sm: 120 },
          '& .MuiSnackbar-content, & .MuiSnackbarContent-root': {
            bgcolor: '#1b1436',
            color: '#e9d5ff',
            border: '1px solid #4a2f7a',
            borderRadius: 2,
            py: 0.75,
            px: 1.5,
            minWidth: 'auto',
            fontSize: 13,
            transform: 'scale(0.5)',
            transformOrigin: 'bottom center',
          },
        }}
      />

      <WordTooltip
        anchorEl={tooltipAnchor}
        token={tooltipToken}
        onClose={handleTooltipClose}
        volume={volume}
        disableBackdropClose
      />

      {/* Floating volume slider */}
      <Popover
        open={Boolean(volumeAnchor)}
        anchorEl={volumeAnchor}
        onClose={handleVolumeClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#1b1436',
              border: '1px solid #4a2f7a',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            },
          },
        }}
      >
        <ClickAwayListener onClickAway={handleVolumeClose}>
          <Box
            sx={{ width: 40, height: 120, display: 'flex', justifyContent: 'center', py: 1 }}
            onMouseEnter={() => {
              if (volumeAutoHideTimerRef.current) {
                clearTimeout(volumeAutoHideTimerRef.current)
                volumeAutoHideTimerRef.current = null
              }
            }}
            onMouseLeave={scheduleVolumeAutoHide}
          >
            <Slider
              orientation="vertical"
              value={volume}
              min={0}
              max={1}
              step={0.05}
              onChange={handleVolumeChange}
              sx={{
                color: '#e9d5ff',
                height: 100,
                '& .MuiSlider-thumb': { width: 14, height: 14 },
              }}
            />
          </Box>
        </ClickAwayListener>
      </Popover>
    </Box>
  )
}
