/**
 * Telepatía - Kali Uchis
 * Lyric timings from LRC - synced with actual song audio.
 * Source: LRC [length: ~2:28]
 */
import type { LyricLineTiming } from './lyricsTiming'

/** Convert mm:ss.xxx to milliseconds */
function lrcMs(min: number, sec: number) {
  return (min * 60 + sec) * 1000
}

export const telepatiaLyrics: LyricLineTiming[] = [
  { id: 't1', spanishText: 'Quién lo diría que se podría', englishText: "Who would say that you could", startMs: lrcMs(0, 11.872), endMs: lrcMs(0, 16.229) },
  { id: 't2', spanishText: 'Hacer el amor por telepatía', englishText: 'Make love through telepathy', startMs: lrcMs(0, 16.229), endMs: lrcMs(0, 20.286) },
  { id: 't3', spanishText: 'La luna está llena, mi cama vacía', englishText: 'The moon is full, my bed empty', startMs: lrcMs(0, 20.286), endMs: lrcMs(0, 23.387) },
  { id: 't4', spanishText: 'Lo que yo te haría', englishText: 'What I would do to you', startMs: lrcMs(0, 23.387), endMs: lrcMs(0, 25.999) },
  { id: 't5', spanishText: 'Si te tuviera de frente, la mente te la volaría', englishText: "If I had you in front of me, I'd blow your mind", startMs: lrcMs(0, 25.999), endMs: lrcMs(0, 31.607) },
  { id: 't6', spanishText: 'De noche y de día, de noche y de día', englishText: 'Night and day, night and day', startMs: lrcMs(0, 31.607), endMs: lrcMs(0, 34.970) },
  { id: 't7', spanishText: 'Sabes que estoy a solo un vuelo de distancia', englishText: "You know I'm just a flight away", startMs: lrcMs(0, 34.970), endMs: lrcMs(0, 36.971) },
  { id: 't8', spanishText: 'Si lo deseas, puedes tomar un avión privado', englishText: 'If you want it, you could take a private plane', startMs: lrcMs(0, 36.971), endMs: lrcMs(0, 39.817) },
  { id: 't9', spanishText: 'A kilómetros estamos conectando', englishText: "From kilometers away we're connecting", startMs: lrcMs(0, 39.817), endMs: lrcMs(0, 42.709) },
  { id: 't10', spanishText: 'Y me prendes aunque no me estés tocando', englishText: "And you turn me on even though you aren't touching me", startMs: lrcMs(0, 42.709), endMs: lrcMs(0, 46.251) },
  { id: 't11', spanishText: 'Sabes que tengo mucho que decir', englishText: "You know I got a lot to say", startMs: lrcMs(0, 46.251), endMs: lrcMs(0, 48.399) },
  { id: 't12', spanishText: 'Todas estas voces en el fondo de mi cerebro', englishText: 'All these voices in the background of my brain', startMs: lrcMs(0, 48.399), endMs: lrcMs(0, 51.277) },
  { id: 't13', spanishText: 'Y me dicen todo lo que estás pensando', englishText: "And they tell me everything you're thinking", startMs: lrcMs(0, 51.277), endMs: lrcMs(0, 54.136) },
  { id: 't14', spanishText: 'Me imagino lo que ya estás maquinando', englishText: "I imagine what you're already plotting", startMs: lrcMs(0, 54.136), endMs: lrcMs(0, 57.568) },
  { id: 't15', spanishText: 'Quién lo diría que se podría', englishText: "Who would say that you could", startMs: lrcMs(0, 57.568), endMs: lrcMs(1, 1.864) },
  { id: 't16', spanishText: 'Hacer el amor por telepatía', englishText: 'Make love through telepathy', startMs: lrcMs(1, 1.864), endMs: lrcMs(1, 6.007) },
  { id: 't17', spanishText: 'La luna está llena, mi cama vacía', englishText: 'The moon is full, my bed empty', startMs: lrcMs(1, 6.007), endMs: lrcMs(1, 8.871) },
  { id: 't18', spanishText: 'Lo que yo te haría', englishText: 'What I would do to you', startMs: lrcMs(1, 8.871), endMs: lrcMs(1, 11.799) },
  { id: 't19', spanishText: 'Si te tuviera de frente, la mente te la volaría', englishText: "If I had you in front of me, I'd blow your mind", startMs: lrcMs(1, 11.799), endMs: lrcMs(1, 17.354) },
  { id: 't20', spanishText: 'De noche y de día, de noche y de día', englishText: 'Night and day, night and day', startMs: lrcMs(1, 17.354), endMs: lrcMs(1, 21.220) },
  { id: 't21', spanishText: 'Sabes que puedo ver a través de ti', englishText: "You know that I can see right through you", startMs: lrcMs(1, 23.850), endMs: lrcMs(1, 28.987) },
  { id: 't22', spanishText: 'Puedo leer tu mente, puedo leer tu mente', englishText: "I can read your mind, I can read your mind", startMs: lrcMs(1, 28.987), endMs: lrcMs(1, 31.220) },
  { id: 't23', spanishText: '¿Qué quieres hacer?', englishText: "What you wanna do?", startMs: lrcMs(1, 31.220), endMs: lrcMs(1, 35.567) },
  { id: 't24', spanishText: 'Está escrito en toda tu cara, dos veces', englishText: "It's written all over your face, times two", startMs: lrcMs(1, 35.567), endMs: lrcMs(1, 40.066) },
  { id: 't25', spanishText: 'Porque puedo leer tu mente, puedo leer tu mente', englishText: "'Cause I can read your mind, I can read your mind", startMs: lrcMs(1, 40.066), endMs: lrcMs(1, 43.315) },
  { id: 't26', spanishText: 'Puedo escuchar tus pensamientos como una melodía', englishText: "I can hear your thoughts like a melody", startMs: lrcMs(1, 43.315), endMs: lrcMs(1, 46.114) },
  { id: 't27', spanishText: 'Escucha mientras hablas cuando estás dormido', englishText: "Listen while you talk when you're fast asleep", startMs: lrcMs(1, 46.114), endMs: lrcMs(1, 49.108) },
  { id: 't28', spanishText: 'Te quedas en el teléfono sólo para oírme respirar', englishText: "You stay on the phone just to hear me breathe", startMs: lrcMs(1, 49.108), endMs: lrcMs(1, 53.427) },
  { id: 't29', spanishText: 'Quién lo diría que se podría', englishText: "Who would say that you could", startMs: lrcMs(1, 54.812), endMs: lrcMs(1, 58.867) },
  { id: 't30', spanishText: 'Hacer el amor por telepatía', englishText: 'Make love through telepathy', startMs: lrcMs(1, 58.867), endMs: lrcMs(2, 3.065) },
  { id: 't31', spanishText: 'La luna está llena, mi cama vacía', englishText: 'The moon is full, my bed empty', startMs: lrcMs(2, 3.065), endMs: lrcMs(2, 5.863) },
  { id: 't32', spanishText: 'Lo que yo te haría', englishText: 'What I would do to you', startMs: lrcMs(2, 5.863), endMs: lrcMs(2, 8.820) },
  { id: 't33', spanishText: 'Si te tuviera de frente, la mente te la volaría', englishText: "If I had you in front of me, I'd blow your mind", startMs: lrcMs(2, 8.820), endMs: lrcMs(2, 14.457) },
  { id: 't34', spanishText: 'De noche y de día, de noche y de día', englishText: 'Night and day, night and day', startMs: lrcMs(2, 14.457), endMs: lrcMs(2, 17.768) },
  { id: 't35', spanishText: 'Sabes que tengo mucho que decir', englishText: "You know I got a lot to say", startMs: lrcMs(2, 18.353), endMs: lrcMs(2, 21.698) },
  { id: 't36', spanishText: 'Todas estas voces en el fondo de mi cerebro', englishText: 'All these voices in the background of my brain', startMs: lrcMs(2, 21.698), endMs: lrcMs(2, 28.432) },
]
