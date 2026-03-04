export interface WordToken {
  spanishWord: string
  englishGloss: string
  lemma?: string
  grammarNote?: string
  /** Context in the song - explains how the word is used in this line */
  contextInSong?: string
}

export interface ChorusLine {
  spanishText: string
  englishText: string
  tokens: WordToken[]
}

export interface ChorusData {
  songTitle: string
  artist: string
  lines: ChorusLine[]
}
