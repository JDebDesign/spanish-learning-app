import {
  Popover,
  Button,
  Typography,
  Box,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import type { WordToken } from '@/shared/types/chorus'

interface WordTooltipProps {
  anchorEl: HTMLElement | null
  token: WordToken | null
  onClose: () => void
  /** Volume for pronunciation (0–1). Uses music volume when provided. */
  volume?: number
  /** If true, backdrop does not intercept clicks - parent handles outside-click */
  disableBackdropClose?: boolean
}

function speakWord(word: string, volume: number = 1) {
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'es'
  utterance.volume = Math.max(0, Math.min(1, volume))
  const voices = window.speechSynthesis.getVoices()
  const spanishVoice = voices.find((v) => v.lang === 'es' || v.lang.startsWith('es-'))
  if (spanishVoice) utterance.voice = spanishVoice
  window.speechSynthesis.speak(utterance)
}

/** Label style: #958da5, 14px, medium */
const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  color: '#958da5',
  lineHeight: 1.43,
  letterSpacing: '0.1px',
} as const

/** Body large emphasized: #49454f, 16px, medium - for meaning */
const meaningStyle = {
  fontSize: 16,
  fontWeight: 500,
  color: '#49454f',
  lineHeight: 1.5,
  letterSpacing: '0.5px',
} as const

/** Body medium: #49454f, 14px, regular */
const bodyStyle = {
  fontSize: 14,
  fontWeight: 400,
  color: '#49454f',
  lineHeight: 1.43,
  letterSpacing: '0.25px',
} as const

export function WordTooltip({ anchorEl, token, onClose, volume = 1, disableBackdropClose = false }: WordTooltipProps) {
  const open = Boolean(anchorEl) && Boolean(token)

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={disableBackdropClose ? () => {} : onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        ...(disableBackdropClose && {
          root: {
            sx: {
              pointerEvents: 'none',
              '& .MuiPopover-paper': { pointerEvents: 'auto' },
            },
          },
        }),
        paper: {
          ...(disableBackdropClose && { 'data-tooltip-content': '' }),
          sx: {
            mt: 1,
            borderRadius: '12px',
            backgroundColor: '#f3edf7',
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
            maxWidth: 312,
            px: 2,
            py: 1.5,
          },
        },
      }}
    >
      {token && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Content: Meaning, Root, Grammar, Context (per Figma design) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={meaningStyle}>
              {token.englishGloss}
            </Typography>

            {token.lemma != null && token.lemma !== '' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography sx={labelStyle}>Root</Typography>
                <Typography sx={bodyStyle}>{token.lemma}</Typography>
              </Box>
            )}

            {token.contextInSong != null && token.contextInSong !== '' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography sx={labelStyle}>Context in the song</Typography>
                <Typography sx={bodyStyle}>{token.contextInSong}</Typography>
              </Box>
            )}
          </Box>

          {/* Actions: Play pronunciation */}
          <Button
            size="small"
            startIcon={<PlayArrowIcon sx={{ fontSize: 20 }} />}
            onClick={() => speakWord(token.spanishWord, volume)}
            sx={{
              color: '#6750a4',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 14,
              justifyContent: 'flex-start',
              px: 0,
              minWidth: 0,
            }}
          >
            Play pronunciation
          </Button>
        </Box>
      )}
    </Popover>
  )
}
