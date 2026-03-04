import { useMemo } from 'react'
import { Box, Typography, ButtonBase } from '@mui/material'
import type { ChorusLine as ChorusLineType, WordToken } from '@/shared/types/chorus'

interface ChorusLineProps {
  line: ChorusLineType
  onWordClick: (e: React.MouseEvent<HTMLElement>, token: WordToken) => void
  showEnglish?: boolean
}

/** Normalize word for token lookup: lowercase, trim punctuation */
function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/^[,.\-—;:'"!?]+|[,:.\-—;:'"!?]+$/g, '')
}

/** Split Spanish text into words, preserving spaces for wrapping */
function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

export function ChorusLine({ line, onWordClick, showEnglish = true }: ChorusLineProps) {
  const tokenMap = useMemo(() => {
    const m = new Map<string, WordToken>()
    for (const t of line.tokens) {
      m.set(normalizeWord(t.spanishWord), t)
    }
    return m
  }, [line.tokens])

  const words = splitIntoWords(line.spanishText)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Typography
        component="div"
        sx={{
          fontWeight: 800,
          fontSize: { xs: 24, sm: 28, md: 32 },
          lineHeight: 1.2,
          color: '#f5f3ff',
          '& .chorus-word': {
            cursor: 'default',
            borderRadius: 1,
            px: 0.25,
            mx: -0.25,
            '&:hover': {
              backgroundColor: 'rgba(233, 213, 255, 0.15)',
              cursor: 'pointer',
            },
          },
        }}
      >
        {words.map((word, i) => {
          const token = tokenMap.get(normalizeWord(word))
          const isClickable = Boolean(token)
          return (
            <span key={i}>
              {i > 0 ? ' ' : ''}
              {isClickable ? (
                <ButtonBase
                  component="span"
                  className="chorus-word"
                  onClick={(e) => {
                    e.stopPropagation()
                    token && onWordClick(e, token)
                  }}
                  disableRipple
                  sx={{ textAlign: 'inherit', font: 'inherit' }}
                >
                  {word}
                </ButtonBase>
              ) : (
                <span>{word}</span>
              )}
            </span>
          )
        })}
      </Typography>
      {showEnglish && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 18, sm: 20, md: 22 },
            lineHeight: 1.4,
            color: '#d6c7e6',
          }}
        >
          {line.englishText}
        </Typography>
      )}
    </Box>
  )
}
