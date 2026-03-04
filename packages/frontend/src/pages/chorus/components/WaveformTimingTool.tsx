import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SaveIcon from '@mui/icons-material/Save'
import { chorusLines } from '@/shared/data/lyricsData'
import type { LyricLineTiming } from '@/shared/data/lyricsTiming'

const AUDIO_SRC = '/songs/dtmf-bad-bunny.mp3'
const CANVAS_HEIGHT = 80

interface WaveformTimingToolProps {
  onExport?: (timings: LyricLineTiming[]) => void
}

export function WaveformTimingTool({ onExport }: WaveformTimingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [timings, setTimings] = useState<LyricLineTiming[]>(
    chorusLines.map((line) => ({
      id: line.id,
      spanishText: line.spanishText,
      englishText: line.englishText,
      startMs: 0,
      endMs: 0,
    }))
  )
  const [clickMode, setClickMode] = useState<'start' | 'end'>('start')

  const loadAndAnalyzeAudio = useCallback(async () => {
    const audioContext = new AudioContext()
    const response = await fetch(AUDIO_SRC)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    const channelData = audioBuffer.getChannelData(0)
    const samples = 500
    const blockSize = Math.floor(channelData.length / samples)
    const waveform: number[] = []

    for (let i = 0; i < samples; i++) {
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j] ?? 0)
      }
      waveform.push(sum / blockSize)
    }

    const max = Math.max(...waveform)
    const normalized = max > 0 ? waveform.map((v) => v / max) : waveform
    setWaveformData(normalized)
    setDuration(audioBuffer.duration)
  }, [])

  useEffect(() => {
    loadAndAnalyzeAudio()
  }, [loadAndAnalyzeAudio])

  const drawWaveform = useCallback(
    (highlightStart?: number, highlightEnd?: number) => {
      const canvas = canvasRef.current
      if (!canvas || waveformData.length === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = CANVAS_HEIGHT

      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const barWidth = width / waveformData.length

      ctx.fillStyle = '#1b1436'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#4a2f7a'
      waveformData.forEach((value, i) => {
        const x = i * barWidth
        const barHeight = (value * height * 0.8) / 2
        const isHighlighted =
          duration > 0 &&
          highlightStart != null &&
          highlightEnd != null &&
          (i / waveformData.length) * duration * 1000 >= highlightStart &&
          (i / waveformData.length) * duration * 1000 <= highlightEnd

        ctx.fillStyle = isHighlighted ? '#e9d5ff' : '#958da5'
        ctx.fillRect(x, centerY - barHeight, Math.max(1, barWidth), barHeight * 2)
      })

      if (duration > 0 && currentTime > 0) {
        const playheadX = (currentTime / duration) * width
        ctx.fillStyle = '#e9d5ff'
        ctx.fillRect(playheadX, 0, 2, height)
      }
    },
    [waveformData, duration, currentTime]
  )

  useEffect(() => {
    const line = timings[currentLineIndex]
    drawWaveform(line?.startMs, line?.endMs)
  }, [drawWaveform, timings, currentLineIndex])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || duration <= 0) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = x / rect.width
      const timeSeconds = percent * duration
      const timeMs = timeSeconds * 1000

      setTimings((prev) => {
        const next = [...prev]
        const line = next[currentLineIndex]
        if (!line) return prev

        if (clickMode === 'start') {
          line.startMs = Math.round(timeMs)
          setClickMode('end')
        } else {
          line.endMs = Math.round(timeMs)
          if (line.endMs < line.startMs) {
            const tmp = line.startMs
            line.startMs = line.endMs
            line.endMs = tmp
          }
          setClickMode('start')
          setCurrentLineIndex((i) => Math.min(i + 1, next.length - 1))
        }
        return next
      })
    },
    [duration, currentLineIndex, clickMode]
  )

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleExport = useCallback(() => {
    const output = `export const lyricsWithTiming: LyricLineTiming[] = ${JSON.stringify(timings, null, 2)}`
    onExport?.(timings)
    console.log('Copy the following to lyricsTiming.ts:\n', output)
    navigator.clipboard
      ?.writeText(output)
      .then(() => alert('Timings copied to clipboard! Paste into lyricsTiming.ts'))
      .catch(() => alert('Timings logged to console. Copy manually.'))
  }, [timings, onExport])

  return (
    <Paper sx={{ p: 2, backgroundColor: '#0d0a12', color: '#f5f3ff' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#e9d5ff' }}>
        Waveform Timing Tool
      </Typography>
      <Typography variant="body2" sx={{ color: '#d6c7e6', mb: 2 }}>
        Click waveform to set start time for line {currentLineIndex + 1}, click again to set end time.
        Mode: {clickMode === 'start' ? 'Set START' : 'Set END'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleTogglePlay} sx={{ color: '#e9d5ff', bgcolor: '#1b1436' }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Typography variant="body2">{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleExport}
          sx={{ color: '#e9d5ff', borderColor: '#4a2f7a' }}
        >
          Export
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#958da5', mb: 0.5, display: 'block' }}>
          Line {currentLineIndex + 1}: {chorusLines[currentLineIndex]?.spanishText}
        </Typography>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            width: '100%',
            height: CANVAS_HEIGHT,
            cursor: 'pointer',
            borderRadius: 8,
            border: '1px solid #4a2f7a',
          }}
        />
      </Box>

      <Divider sx={{ borderColor: '#4a2f7a', my: 2 }} />

      <Typography variant="subtitle2" sx={{ color: '#958da5', mb: 1 }}>
        Mapped timings
      </Typography>
      <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
        {timings.map((t, i) => (
          <Box
            key={t.id}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              bgcolor: i === currentLineIndex ? 'rgba(233,213,255,0.1)' : 'transparent',
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#d6c7e6',
            }}
          >
            {i + 1}. {t.startMs}ms – {t.endMs}ms
          </Box>
        ))}
      </Box>

      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" style={{ display: 'none' }} />
    </Paper>
  )
}
