import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Slider,
  ButtonBase,
  Popover,
  ClickAwayListener,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { ChorusLine } from './components/ChorusLine'
import { WordTooltip } from './components/WordTooltip'
import { useAudioPlayer } from '@/shared/hooks/useAudioPlayer'
import { getActiveLineIndex } from '@/shared/utils/getActiveLineIndex'
import { lyricsWithTiming } from '@/shared/data/lyricsTiming'
import { mockChorusData, getTokensForLine } from '@/shared/data/mockChorus'
import { WaveformTimingTool } from './components/WaveformTimingTool'
import type { WordToken } from '@/shared/types/chorus'

const ENABLE_TIMING_TOOL = false

/** Merge timing data with token data for word tooltips */
function getMergedLines() {
  return lyricsWithTiming.map((timingLine) => ({
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
  const volumeAutoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const VOLUME_AUTO_HIDE_MS = 2500
  const lastScrolledIndexRef = useRef(-1)
  const linesContainerRef = useRef<HTMLDivElement>(null)
  const lineRefsRef = useRef<(HTMLDivElement | null)[]>([])

  const handleTimeUpdate = useCallback((currentTime: number) => {
    const index = getActiveLineIndex(currentTime, lyricsWithTiming)
    setActiveLineIndex(index)
  }, [])

  const {
    isPlaying,
    duration,
    currentTime,
    toggle,
    seek,
    audioRef,
    audioSrc,
  } = useAudioPlayer(handleTimeUpdate)

  const mergedLines = getMergedLines()
  const { songTitle, artist } = mockChorusData

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
      const line = lyricsWithTiming[index]
      if (!line) return
      seek(line.startMs / 1000)
      setActiveLineIndex(index)
      lastScrolledIndexRef.current = index
      if (wasPlaying) {
        audioRef.current?.play().catch(() => {})
      }
    },
    [seek, audioRef]
  )

  const handleProgressChange = useCallback(
    (_: Event, value: number | number[]) => {
      const seconds = Array.isArray(value) ? value[0] : value
      seek(seconds)
    },
    [seek]
  )

  const handleSkipPrevious = useCallback(() => {
    const targetIndex = activeLineIndex <= 0 ? 0 : activeLineIndex - 1
    const line = lyricsWithTiming[targetIndex]
    if (!line) return
    seek(line.startMs / 1000)
    setActiveLineIndex(targetIndex)
    lastScrolledIndexRef.current = targetIndex
    if (isPlaying) audioRef.current?.play().catch(() => {})
  }, [activeLineIndex, seek, isPlaying, audioRef])

  const handleSkipNext = useCallback(() => {
    const lastIndex = lyricsWithTiming.length - 1
    const targetIndex = activeLineIndex < 0 ? 0 : Math.min(lastIndex, activeLineIndex + 1)
    const line = lyricsWithTiming[targetIndex]
    if (!line) return
    seek(line.startMs / 1000)
    setActiveLineIndex(targetIndex)
    lastScrolledIndexRef.current = targetIndex
    if (isPlaying) audioRef.current?.play().catch(() => {})
  }, [activeLineIndex, seek, isPlaying, audioRef])

  const handleWordClick = useCallback((e: React.MouseEvent<HTMLElement>, token: WordToken) => {
    setTooltipAnchor(e.currentTarget)
    setTooltipToken(token)
  }, [])

  const handleTooltipClose = useCallback(() => {
    setTooltipAnchor(null)
    setTooltipToken(null)
  }, [])

  useEffect(() => {
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {})
    }
  }, [])

  // Sync volume to audio element
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume, audioRef])

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
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setShowEnglish((v) => !v)}
              sx={{
                color: showEnglish ? '#e9d5ff' : '#71717a',
                bgcolor: showEnglish ? 'rgba(233, 213, 255, 0.15)' : 'transparent',
                fontWeight: 600,
                fontSize: 12,
                minWidth: 34,
                '&:hover': { bgcolor: showEnglish ? 'rgba(233, 213, 255, 0.25)' : 'rgba(113, 113, 122, 0.2)' },
              }}
              aria-pressed={showEnglish}
              aria-label={showEnglish ? 'Hide English (difficult mode)' : 'Show English'}
            >
              EN
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, px: 1 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#f9fafb' }}>
              {songTitle}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#c7b8e6' }}>
              {artist}
            </Typography>
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
                  <ChorusLine line={line} onWordClick={handleWordClick} showEnglish={showEnglish} />
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={handleSkipPrevious}
            sx={{ color: '#e9d5ff' }}
            size="medium"
            aria-label="Previous lyric"
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={toggle}
            sx={{
              bgcolor: '#e9d5ff',
              color: '#05020a',
              width: 40,
              height: 40,
              borderRadius: '20px',
              '&:hover': { bgcolor: '#f0dfff' },
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 28 }} /> : <PlayArrowIcon sx={{ fontSize: 28 }} />}
          </IconButton>
          <IconButton
            onClick={handleSkipNext}
            sx={{ color: '#e9d5ff' }}
            size="medium"
            aria-label="Next lyric"
          >
            <SkipNextIcon />
          </IconButton>
        </Box>
        <audio
          ref={audioRef}
          src={audioSrc}
          style={{ display: 'none' }}
          preload="metadata"
        />
      </Paper>

      <WordTooltip
        anchorEl={tooltipAnchor}
        token={tooltipToken}
        onClose={handleTooltipClose}
        volume={volume}
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
