/**
 * Song data: lyrics + audio path per song ID.
 * Use simple ASCII filenames (e.g. telepatia.mp3) to avoid encoding issues.
 */
import type { LyricLineTiming } from './lyricsTiming'
import { lyricsWithTiming } from './lyricsTiming'
import { telepatiaLyrics } from './telepatiaLyrics'
import { baileInolvidableLyrics } from './baileInolvidableLyrics'
import { laCancionLyrics } from './laCancionLyrics'
import { titiMePreguntoLyrics } from './titiMePreguntoLyrics'
import { corazonSinCaraLyrics } from './corazonSinCaraLyrics'

export interface SongDataEntry {
  lyrics: LyricLineTiming[]
  audioSrc: string
}

export const SONG_DATA: Record<string, SongDataEntry> = {
  dtmf: {
    lyrics: lyricsWithTiming,
    audioSrc: '/songs/dtmf-bad-bunny.mp3',
  },
  telepatia: {
    lyrics: telepatiaLyrics,
    audioSrc: '/songs/telepatia.mp3',
  },
  'baile-inolvidable': {
    lyrics: baileInolvidableLyrics,
    audioSrc: '/songs/baile-inolvidable.mp3',
  },
  'la-cancion': {
    lyrics: laCancionLyrics,
    audioSrc: '/songs/la-cancion.mp3',
  },
  'titi-me-pregunto': {
    lyrics: titiMePreguntoLyrics,
    audioSrc: '/songs/titi-me-pregunto.mp3',
  },
  'corazon-sin-cara': {
    lyrics: corazonSinCaraLyrics,
    audioSrc: '/songs/corazon-sin-cara.mp3?v=3',
  },
}
