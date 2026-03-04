import type { LyricLineTiming } from '@/shared/data/lyricsTiming'

/**
 * Returns the index of the lyric line active at the given time (in seconds).
 * Returns -1 if no line is active.
 */
export function getActiveLineIndex(
  currentTimeSeconds: number,
  lines: LyricLineTiming[]
): number {
  const currentMs = currentTimeSeconds * 1000
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (currentMs >= line.startMs && currentMs < line.endMs) {
      return i
    }
  }
  return -1
}
