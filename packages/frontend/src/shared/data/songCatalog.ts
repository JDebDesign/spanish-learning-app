/**
 * Song catalog for the song selector dropdown.
 * Add entries here to populate the menu.
 */
export interface SongEntry {
  id: string
  title: string
  artist: string
  /** If true, song has lyrics and audio - can be selected */
  hasData?: boolean
}

export const SONG_CATALOG: SongEntry[] = [
  { id: 'dtmf', title: 'DTMF', artist: 'Bad Bunny', hasData: true },
  { id: 'telepatia', title: 'Telepatía', artist: 'Kali Uchis', hasData: true },
  { id: 'baile-inolvidable', title: 'Baile Inolvidable', artist: 'Bad Bunny', hasData: true },
  { id: 'la-cancion', title: 'La Canción', artist: 'J Balvin & Bad Bunny', hasData: true },
  { id: 'titi-me-pregunto', title: 'Tití Me Preguntó', artist: 'Bad Bunny', hasData: true },
]
