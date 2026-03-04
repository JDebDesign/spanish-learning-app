import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ListIcon from '@mui/icons-material/List'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { ChorusLine } from './components/ChorusLine'
import { WordTooltip } from './components/WordTooltip'
import { mockChorusData } from '@/shared/data/mockChorus'
import type { WordToken } from '@/shared/types/chorus'

export function ChorusPage() {
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null)
  const [tooltipToken, setTooltipToken] = useState<WordToken | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { songTitle, artist, lines } = mockChorusData

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {}) // File may not exist yet; fail silently
    }
  }, [isPlaying])

  const handleWordClick = useCallback((e: React.MouseEvent<HTMLElement>, token: WordToken) => {
    setTooltipAnchor(e.currentTarget)
    setTooltipToken(token)
  }, [])

  const handleTooltipClose = useCallback(() => {
    setTooltipAnchor(null)
    setTooltipToken(null)
  }, [])

  // Ensure SpeechSynthesis voices are loaded (Chrome loads them asynchronously)
  useEffect(() => {
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {})
    }
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#05020a',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 430,
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid #4a2f7a',
          py: 2,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: '#1b1436',
              borderRadius: '20px',
              color: '#e9d5ff',
              '&:hover': { bgcolor: '#2a2044' },
            }}
          >
            <ArrowUpwardIcon sx={{ transform: 'rotate(-45deg)' }} />
          </IconButton>
          <Box sx={{ textAlign: 'center', flex: 1, px: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: 20,
                color: '#f9fafb',
              }}
            >
              {songTitle}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 14,
                color: '#c7b8e6',
              }}
            >
              {artist}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#c7b8e6' }}>
              <VolumeUpIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: '#c7b8e6' }}>
              <ListIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Lyrics */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {lines.map((line, i) => (
            <ChorusLine key={i} line={line} onWordClick={handleWordClick} />
          ))}
        </Box>
      </Box>

      {/* Footer - Playback controls */}
      <Paper
        elevation={0}
        sx={{
          borderTop: '1px solid #4a2f7a',
          backgroundColor: '#05020a',
          py: 2,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <IconButton sx={{ color: '#e9d5ff' }} size="medium">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={handlePlayPause}
            sx={{
              bgcolor: '#e9d5ff',
              color: '#05020a',
              width: 40,
              height: 40,
              borderRadius: '20px',
              '&:hover': { bgcolor: '#f0dfff' },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton sx={{ color: '#e9d5ff' }} size="medium">
            <SkipNextIcon />
          </IconButton>
        </Box>
        {/* Audio element - serves from backend /media/instrumental.mp3 when available */}
        <audio
          ref={audioRef}
          src="/media/instrumental.mp3"
          style={{ display: 'none' }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </Paper>

      <WordTooltip
        anchorEl={tooltipAnchor}
        token={tooltipToken}
        onClose={handleTooltipClose}
      />
    </Box>
  )
}
