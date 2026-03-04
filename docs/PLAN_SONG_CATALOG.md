# Plan: Spanish Song Catalog & Song Switching UI

## Goal

Scale the Spanish karaoke learning app by adding a catalog of Spanish songs without downloading MP3s from YouTube. Build a clean, legal audio source system and add a UI for switching songs.

---

## Phase 1: Song Data Model

### 1.1 Create Song Type

**File:** `packages/frontend/src/shared/types/song.ts` (new)

```typescript
export type AudioProvider = 'spotify' | 'deezer' | 'upload' | 'local' | 'licensed_future'

export interface SongLyricLine {
  id: string
  startMs: number
  endMs: number
  spanishText: string
  englishText?: string
}

export interface SongAudio {
  previewUrl: string | null   // Spotify/Deezer 30s preview
  streamUrl: string | null   // Future licensed
  localPath: string | null    // Dev mode or user upload
}

export interface SongLyrics {
  lrcText: string | null
  lines: SongLyricLine[]
}

export interface Song {
  id: string
  title: string
  artist: string
  albumArtUrl?: string
  language: string
  provider: AudioProvider
  providerTrackId: string
  audio: SongAudio
  lyrics: SongLyrics
  /** Flag when previewUrl is missing - song needs alternate audio source */
  needsAudioSource?: boolean
}
```

### 1.2 Resolve Effective Audio URL

**Logic:** Pick the first non-null from `localPath` → `streamUrl` → `previewUrl`.

- `localPath`: Relative path under `/songs/` (e.g. `songs/dtmf-bad-bunny.mp3`) for dev or user uploads
- `previewUrl`: Full URL from Spotify/Deezer API (30s preview)
- `streamUrl`: Reserved for future licensed provider

---

## Phase 2: Starter Catalog Data

### 2.1 Catalog JSON

**File:** `packages/frontend/src/shared/data/songCatalog.ts` (new)

- Export `Song[]` array
- Seed with current DTMF (Bad Bunny) as the first entry, migrated from existing `lyricsTiming`, `lyricsData`, `mockChorus`, and hardcoded local path
- Structure supports future entries from the ingestion script

**Migration for DTMF:**
- `id`: `'dtmf-bad-bunny'`
- `title`: `'DTMF'`, `artist`: `'Bad Bunny'`
- `provider`: `'local'`, `providerTrackId`: `''`
- `audio.localPath`: `'/songs/dtmf-bad-bunny.mp3'`
- `audio.previewUrl`: `null`, `audio.streamUrl`: `null`
- `lyrics.lines`: Merge `lyricsTiming` + `lyricsData` (id, startMs, endMs, spanishText, englishText)
- `lyrics.lrcText`: optional, can be null initially

### 2.2 Token Data (Word Glosses)

- Keep `mockChorus.ts` / `getTokensForLine` as-is
- Map tokens by `spanishText` (line-level). Songs without token data use enriched fallback
- Future: token data could be keyed by `songId` + line or stored per song

---

## Phase 3: Catalog Ingestion Script

### 3.1 Script Location

**File:** `scripts/ingest-songs.ts` (new, at repo root or in a `scripts/` package)

- Run with `npx tsx scripts/ingest-songs.ts` (add `tsx` as devDependency if needed)
- Or use Node + fetch if no TS runtime

### 3.2 API Choice: Deezer vs Spotify

| API        | Auth                   | Preview                         |
|-----------|------------------------|----------------------------------|
| Spotify   | OAuth2 (Client Credentials) | `preview_url` on Track (often null) |
| Deezer    | No auth for public search | `preview` URL (30s)              |

**Recommendation:** Prefer **Deezer** for ingestion:
- No auth for search
- `https://api.deezer.com/search?q=artist:"Bad Bunny" track:"DTMF"`
- Track object has `preview` (30s MP3 URL), `title`, `artist.name`, `album.cover_medium`

### 3.3 Script Behavior

1. **Input:** List of `{ artist, title }` (e.g. Bad Bunny/DTMF, Karol G/PROVENZA, Rosalía/DESPECHÁ, etc.)
2. **For each:**
   - Search Deezer: `GET https://api.deezer.com/search?q=artist:"{artist}" track:"{title}"&limit=1`
   - Extract: `title`, `artist.name`, `album.cover_medium`, `id` (providerTrackId), `preview`
   - If `preview` exists: set `audio.previewUrl`, `needsAudioSource: false`
   - If `preview` is null: set `needsAudioSource: true`, `audio.previewUrl: null`
3. **Output:** Append/merge into `songCatalog.ts` or a JSON file that the app imports
   - For JSON: `packages/frontend/src/shared/data/catalog.json`
   - App imports and types as `Song[]`

### 3.4 Example Deezer Response (relevant fields)

```json
{
  "data": [{
    "id": 12345,
    "title": "DTMF",
    "artist": { "name": "Bad Bunny" },
    "album": { "cover_medium": "https://..." },
    "preview": "https://cdns-preview-...mp3"
  }]
}
```

---

## Phase 4: Song Switching UI

### 4.1 Header Layout Change

**Current (ChorusPlayer.tsx ~324–330):**
```
[ EN ]    Song Title    [ Volume ]
          Artist
```

**New:**
```
[ EN ]    🎵 DTMF — Bad Bunny ▼    [ Volume ]
```

- Center block becomes a **clickable dropdown trigger** (not just static text)
- Format: `🎵 {title} — {artist} ▼`
- Arrow indicates it’s selectable

### 4.2 Song Selector Component

**File:** `packages/frontend/src/pages/chorus/components/SongSelector.tsx` (new)

- **Trigger:** Button or Box showing current song + dropdown chevron
- **Dropdown:** MUI `Menu` or `Popover` anchored to the trigger
- **Content:**
  - Search `TextField` at top (debounced ~150ms)
  - Scrollable list of songs below
  - Each item: optional `albumArtUrl` thumbnail (small), `title`, `artist`
- **Filtering:** Client-side, real-time: match query against `title` or `artist` (case-insensitive)

### 4.3 Integration in ChorusPlayer

- Add `selectedSongId` state (or `selectedSong: Song | null`)
- Default: first song in catalog
- Pass `songs`, `selectedSong`, `onSelectSong` to `SongSelector`
- Replace `{songTitle}` / `{artist}` with `selectedSong.title` / `selectedSong.artist`

---

## Phase 5: Song Selection Behavior

### 5.1 Handler

When user selects a song in the dropdown:

1. Close the dropdown
2. Update header (via `selectedSong` state)
3. Stop current audio: `audioRef.current?.pause()`
4. Load new audio source: pass `audioSrc` from `selectedSong` into `useAudioPlayer`
5. Load lyric timing: `mergedLines` from `selectedSong.lyrics.lines`
6. Reset playback: `seek(0)`
7. Clear repeat: `setRepeatMode('off')`, `setLoopTargetLineId(null)`, `setLoopCount(0)`
8. Scroll lyrics to top: `linesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })`

### 5.2 useAudioPlayer Changes

**Current:** `audioSrc` is a constant (`AUDIO_SRC`).

**New:** Accept `audioSrc: string` as a parameter. When it changes:

- Update `<audio src={audioSrc} />`
- Optionally call `load()` on the element and reset `currentTime`, `duration`
- Ensure `onTimeUpdate` and lyric highlighting use the new song’s `lyrics.lines`

### 5.3 ChorusPlayer Refactor

- `useAudioPlayer(handleTimeUpdate, volume, selectedSong?.audioSrc ?? '')`
- `getMergedLines()` becomes `getMergedLines(selectedSong)` or equivalent
- All references to `lyricsWithTiming`, `mockChorusData` flow from `selectedSong`

---

## Phase 6: Lyrics Import (Admin/Dev Workflow)

### 6.1 Scope

- Admin/dev-only UI or script (can live behind a flag or separate route)
- **Not** user-facing in production initially

### 6.2 Flow

1. Select song from catalog (or create placeholder)
2. Paste LRC text (timestamped lines)
3. Parse LRC into `{ id, startMs, endMs, spanishText }`
4. Optionally paste English translations; map by line index or inline format
5. Store: Update `songCatalog` / JSON, or emit a JSON blob to paste into the codebase

### 6.3 LRC Parser

**File:** `packages/frontend/src/shared/utils/parseLrc.ts` (new)

- Input: LRC string (e.g. `[00:13.22]Spanish line`)
- Output: `SongLyricLine[]` with `id`, `startMs` (from timestamp), `endMs` (from next line or estimate), `spanishText`
- Handle `[mm:ss.xx]` and `[mm:ss]` formats

### 6.4 Import UI (Optional)

- Route: `/chorus/import` or `?import=1`
- Components: song dropdown, text area for LRC, text area for English (optional), “Parse & Save” button
- Output: console log or clipboard with JSON to add to catalog

---

## Phase 7: Playback Compatibility

### 7.1 Checklist

After switching songs, verify:

- [ ] Lyric highlighting (active line from `currentTime` + `lyrics.lines`)
- [ ] Line repeat mode (once / forever) with new `mergedLines`
- [ ] Play / pause
- [ ] Restart button → `seek(0)` + scroll to top
- [ ] Volume control (unchanged; uses same `useAudioPlayer` volume)
- [ ] Translation tooltips (WordTooltip) – tokens from `getTokensForLine`; fallback when no token data

### 7.2 Key Considerations

- `getActiveLineIndex(currentTime, lines)` must receive the **current song’s** lines
- Line click → seek to that line’s `startMs` for the current song
- Repeat loop uses `loopTargetLineId` which references `line.id` from the current song’s `lines`

---

## Phase 8: Legal Audio Sources

### 8.1 Allowed

- `previewUrl`: 30s preview from Spotify/Deezer (API-compliant)
- `localPath`: User-uploaded or dev-hosted files in `/songs/`
- `streamUrl`: Future licensed full-track streaming

### 8.2 Forbidden

- YouTube downloading
- Scraping MP3s from any site

---

## Phase 9: File Change Summary

| Action | File |
|--------|------|
| Create | `packages/frontend/src/shared/types/song.ts` |
| Create | `packages/frontend/src/shared/data/songCatalog.ts` |
| Create | `packages/frontend/src/shared/data/catalog.json` (optional; script output) |
| Create | `packages/frontend/src/pages/chorus/components/SongSelector.tsx` |
| Create | `packages/frontend/src/shared/utils/parseLrc.ts` |
| Create | `scripts/ingest-songs.ts` |
| Modify | `packages/frontend/src/shared/hooks/useAudioPlayer.ts` (accept `audioSrc`) |
| Modify | `packages/frontend/src/pages/chorus/ChorusPlayer.tsx` (song state, selector, data flow) |
| Modify | `packages/frontend/src/shared/utils/getActiveLineIndex.ts` (accept lines param) |
| Modify | `packages/frontend/src/shared/data/mockChorus.ts` (optional: support per-song tokens) |
| Create | `packages/frontend/src/pages/chorus/LyricsImportPage.tsx` (optional admin UI) |
| Modify | `package.json` (add `tsx` or script runner if needed) |

---

## Phase 10: How to Add New Songs

### Option A: Via Ingestion Script

1. Add `{ artist, title }` to the script’s input list
2. Run `npx tsx scripts/ingest-songs.ts`
3. Script fetches metadata + `previewUrl` from Deezer
4. Append to `catalog.json` or `songCatalog.ts`
5. If `previewUrl` is null, song is marked `needsAudioSource: true` – add lyrics but no audio until you have a local file or other source

### Option B: Manual Entry

1. Add a new object to `songCatalog` array following the `Song` type
2. Fill `lyrics.lines` (from LRC or manual)
3. Set `audio.previewUrl` (if you have one), `audio.localPath` (if you added a file to `public/songs/`), or leave null and set `needsAudioSource: true`

### Option C: Lyrics Import UI

1. Open admin import page
2. Select or create song
3. Paste LRC, optionally English
4. Parse and save to catalog

---

## Acceptance Criteria

- [ ] Song dropdown works in header
- [ ] Search filters by title/artist in real time
- [ ] Selecting a song reloads the player (audio, lyrics, state reset)
- [ ] Lyric timing updates correctly for the selected song
- [ ] Line repeat still works after switching
- [ ] UI remains mobile-friendly (dropdown doesn’t overflow; list scrollable)
- [ ] Header shows `🎵 {title} — {artist} ▼` per UX recommendation
