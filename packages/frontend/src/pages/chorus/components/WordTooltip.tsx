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

/** Known female Spanish voice names (platform-specific) - best for natural pronunciation */
const FEMALE_SPANISH_VOICE_NAMES = [
  'Paulina',      // macOS es-MX
  'Monica',       // macOS es-ES
  'Helena',       // Windows/Chrome
  'Sabina',       // Windows
  'Laura',        // Various
  'Lucia',        // Various
  'Maria',        // Various
  'Mónica',       // macOS (accented)
  'Paulina (Enhanced)', // macOS enhanced
]

/** Check if voice name suggests female (API has no gender property) */
function isLikelyFemale(voice: SpeechSynthesisVoice): boolean {
  const n = voice.name.toLowerCase()
  if (n.includes('female') || n.includes('woman') || n.includes('femenin')) return true
  return FEMALE_SPANISH_VOICE_NAMES.some((name) => n.includes(name.toLowerCase()))
}

/** Prefer female, natural-sounding Spanish voice for pronunciation */
function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const spanish = voices.filter((v) => v.lang === 'es' || v.lang.startsWith('es-'))
  if (spanish.length === 0) return undefined

  // Filter to female voices first
  const female = spanish.filter(isLikelyFemale)
  const pool = female.length > 0 ? female : spanish

  // Prefer cloud/network voices (localService: false) - Google/Microsoft, more natural
  const cloud = pool.filter((v) => !v.localService)
  const candidates = cloud.length > 0 ? cloud : pool

  // Avoid robotic/low-quality voices
  const preferred = candidates.filter(
    (v) =>
      !v.name.toLowerCase().includes('compact') &&
      !v.name.toLowerCase().includes('basic')
  )
  const filtered = preferred.length > 0 ? preferred : candidates

  // Prefer enhanced/premium/natural for best Spanish pronunciation
  const enhanced = filtered.find(
    (v) =>
      v.name.toLowerCase().includes('enhanced') ||
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('google') ||
      v.name.toLowerCase().includes('microsoft')
  )
  if (enhanced) return enhanced

  // Prefer regional Spanish (es-ES, es-MX) for accurate accent
  const regional = filtered.find((v) => v.lang === 'es-ES' || v.lang === 'es-MX')
  if (regional) return regional

  return filtered[0]
}

function speakWord(word: string, volume: number = 1) {
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'es'
  utterance.volume = Math.max(0, Math.min(1, volume))
  utterance.rate = 0.9  // Slightly slower for clearer, more natural Spanish
  utterance.pitch = 1  // Neutral pitch for natural tone
  const voices = window.speechSynthesis.getVoices()
  const spanishVoice = pickSpanishVoice(voices)
  if (spanishVoice) utterance.voice = spanishVoice
  window.speechSynthesis.speak(utterance)
}

/** Generate concise, learner-friendly context fallback when contextInSong is missing */
function getContextFallback(token: WordToken): string {
  const g = (token.grammarNote || '').toLowerCase()
  const gloss = token.englishGloss

  // If slang, always use "Slang for..." (matches DTMF popover style)
  if (g.includes('slang') || gloss.toLowerCase().includes('(slang)')) {
    const cleanGloss = gloss.replace(/\s*\(slang\)\s*/gi, '').trim()
    return `Slang for ${cleanGloss}.`
  }

  if (g.includes('conjunction'))
    return `Connects two phrases or clauses—think of it as the glue between ideas in the sentence.`
  if (g.includes('preposition'))
    return `Shows the relationship (to, from, with, etc.)—usually comes before a noun or infinitive.`
  if (g.includes('object pronoun'))
    return `Replaces the person or thing that receives the action—avoids repeating the noun.`
  if (g.includes('reflexive pronoun'))
    return `Refers back to the subject—the person does the action to themselves (e.g., me lavo = I wash myself).`
  if (g.includes('possessive'))
    return `Goes before the noun to show ownership—in Spanish it usually doesn't change for gender (e.g., "mi" + noun).`
  if (g.includes('definite article') || g.includes('indefinite article'))
    return `Article before the noun—"el/la" (the) or "un/una" (a) must match the noun's gender in Spanish.`
  if (g.includes('adverb'))
    return `Adds when, how, or where the action happens—often ends in -mente in Spanish (like -ly in English).`
  if (g.includes('imperative'))
    return `Command form—tells someone to do something (e.g., "¡Canta!" = Sing!).`
  if (g.includes('infinitive'))
    return `Base verb form (to + verb in English)—used after other verbs or prepositions, like "quiero cantar" (I want to sing).`
  if (g.includes('gerund'))
    return `The -ing form—describes an action in progress (e.g., "cantando" = singing).`
  if (g.includes('preterite'))
    return `Past tense—describes a completed action (e.g., "canté" = I sang).`
  if (g.includes('imperfect'))
    return `Past tense—describes ongoing or habitual actions in the past (e.g., "cantaba" = I used to sing).`
  if (g.includes('present') || g.includes('conditional'))
    return `Verb form—expresses the action in present or conditional mood.`
  if (g.includes('subjunctive'))
    return `Used after "que" with wishes, doubts, or emotions—e.g., "quiero que cantes" (I want you to sing).`
  if (g.includes('adjective') || (g.includes('masculine') && g.includes('adjective')) || (g.includes('feminine') && g.includes('adjective')))
    return `Describes the noun—in Spanish, adjectives usually come after the noun and match its gender (e.g., casa blanca).`
  if (g.includes('noun'))
    return `The person, place, or thing—the main subject or object of the sentence.`
  if (g.includes('relative pronoun') || g.includes('interrogative'))
    return `Connects clauses or introduces a question—"que" often means that/which/who.`
  if (g.includes('negative'))
    return `Creates denial—"no" typically comes right before the verb in Spanish.`
  if (g.includes('interjection') || g.includes('vocalization'))
    return `Exclamation or filler—expresses emotion without grammar (e.g., "¡Ay!" = Oh!).`
  if (token.grammarNote) return `In this line: ${token.grammarNote}—"${gloss}".`
  return `Means "${gloss}" in this line.`
}

/** Check if token indicates slang (grammarNote, gloss, or contextInSong) */
function isSlang(token: WordToken): boolean {
  const g = (token.grammarNote || '').toLowerCase()
  const gloss = (token.englishGloss || '').toLowerCase()
  const ctx = (token.contextInSong || '').toLowerCase()
  return (
    g.includes('slang') ||
    gloss.includes('(slang)') ||
    gloss.includes('(pr slang)') ||
    g.includes('puerto rican') ||
    g.includes('(pr)') ||
    g.includes('pr slang') ||
    ctx.includes('slang')
  )
}

/** Get clean gloss (strip "(slang)" suffix) */
function getCleanGloss(token: WordToken): string {
  return token.englishGloss.replace(/\s*\(slang\)\s*/gi, '').replace(/\s*\(PR slang\)\s*/gi, '').trim()
}

/** Get slang label: "Slang" or "PR slang" based on token */
function getSlangLabel(token: WordToken): string {
  const g = (token.grammarNote || '').toLowerCase()
  const ctx = (token.contextInSong || '').toLowerCase()
  if (g.includes('puerto rican') || g.includes('(pr)') || g.includes('pr slang') || ctx.includes('pr slang')) {
    return 'PR slang'
  }
  return 'Slang'
}

/** Final context text: ensure slang words always have a slang call-out in the popover */
function getContextDisplayText(token: WordToken): string {
  const hasContext = token.contextInSong && token.contextInSong.trim() !== ''
  const context = hasContext ? token.contextInSong! : getContextFallback(token)

  if (!isSlang(token)) return context
  if (/slang|Slang for|PR slang/i.test(context)) return context

  const cleanGloss = getCleanGloss(token)
  const label = getSlangLabel(token)
  return `${label} for ${cleanGloss}. ${context}`
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography sx={labelStyle}>Context in the song</Typography>
              <Typography sx={bodyStyle}>
                {getContextDisplayText(token)}
              </Typography>
            </Box>
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
