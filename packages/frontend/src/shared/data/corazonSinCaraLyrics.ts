/**
 * Corazón Sin Cara - Prince Royce
 * Lyric timings from LRC - synced with actual song audio.
 * Source: LRC [length: 03:31]
 */
import type { LyricLineTiming } from './lyricsTiming'

/** Convert mm:ss.xx to milliseconds */
function lrcMs(min: number, sec: number) {
  return (min * 60 + sec) * 1000
}

export const corazonSinCaraLyrics: LyricLineTiming[] = [
  { id: 'csc1', spanishText: 'Y ya me contaron que te acomplejas de tu imagen', englishText: "And they already told me you're insecure about your image", startMs: lrcMs(0, 15.60), endMs: lrcMs(0, 23.06) },
  { id: 'csc2', spanishText: 'Y mira el espejo, qué linda eres sin maquillaje', englishText: "And look in the mirror, how beautiful you are without makeup", startMs: lrcMs(0, 23.06), endMs: lrcMs(0, 30.09) },
  { id: 'csc3', spanishText: 'Y si eres gorda o flaca, todo eso no me importa a mí', englishText: "And if you're fat or thin, none of that matters to me", startMs: lrcMs(0, 30.09), endMs: lrcMs(0, 37.79) },
  { id: 'csc4', spanishText: 'Y tampoco soy perfecto, solo sé que yo te quiero así', englishText: "And I'm not perfect either, I just know I love you the way you are", startMs: lrcMs(0, 37.79), endMs: lrcMs(0, 43.51) },
  { id: 'csc5', spanishText: 'Y el corazón no tiene cara', englishText: "And the heart doesn't have a face", startMs: lrcMs(0, 45.22), endMs: lrcMs(0, 49.06) },
  { id: 'csc6', spanishText: 'Y te prometo que lo nuestro nunca va a terminar', englishText: "And I promise you that what we have will never end", startMs: lrcMs(0, 49.06), endMs: lrcMs(0, 52.98) },
  { id: 'csc7', spanishText: 'Y el amor vive en el alma', englishText: 'And love lives in the soul', startMs: lrcMs(0, 52.98), endMs: lrcMs(0, 56.36) },
  { id: 'csc8', spanishText: 'Ni con deseos sabes que nada de ti va a cambiar', englishText: "Not even with wishes, you know nothing about you will change", startMs: lrcMs(0, 56.36), endMs: lrcMs(1, 0.50) },
  { id: 'csc9', spanishText: 'Prende una vela, rézale a Dios', englishText: 'Light a candle, pray to God', startMs: lrcMs(1, 0.50), endMs: lrcMs(1, 4.12) },
  { id: 'csc10', spanishText: 'Y dale gracias que tenemos ese lindo corazón', englishText: "And thank Him that we have that beautiful heart", startMs: lrcMs(1, 4.12), endMs: lrcMs(1, 8.06) },
  { id: 'csc11', spanishText: 'Prende una vela, pide perdón', englishText: 'Light a candle, ask for forgiveness', startMs: lrcMs(1, 8.06), endMs: lrcMs(1, 11.68) },
  { id: 'csc12', spanishText: 'Y por creer que tú eres fea te dedico esta canción', englishText: "And for believing you're ugly I dedicate this song to you", startMs: lrcMs(1, 11.68), endMs: lrcMs(1, 15.65) },
  { id: 'csc13', spanishText: 'Y si eres gorda o flaca, todo eso no me importa a mí', englishText: "And if you're fat or thin, none of that matters to me", startMs: lrcMs(1, 15.65), endMs: lrcMs(1, 23.13) },
  { id: 'csc14', spanishText: 'Y tampoco soy perfecto, solo sé que yo te quiero así', englishText: "And I'm not perfect either, I just know I love you the way you are", startMs: lrcMs(1, 23.13), endMs: lrcMs(1, 28.84) },
  { id: 'csc15', spanishText: 'Y si eres gorda o flaca, todo eso no me importa a mí', englishText: "And if you're fat or thin, none of that matters to me", startMs: lrcMs(1, 47.68), endMs: lrcMs(1, 55.37) },
  { id: 'csc16', spanishText: 'Tampoco soy perfecto, solo sé que yo te quiero así', englishText: "I'm not perfect either, I just know I love you the way you are", startMs: lrcMs(1, 55.37), endMs: lrcMs(2, 1.08) },
  { id: 'csc17', spanishText: 'Y el corazón no tiene cara', englishText: "And the heart doesn't have a face", startMs: lrcMs(2, 2.65), endMs: lrcMs(2, 6.56) },
  { id: 'csc18', spanishText: 'Y te prometo que lo nuestro nunca va a terminar', englishText: "And I promise you that what we have will never end", startMs: lrcMs(2, 6.56), endMs: lrcMs(2, 10.43) },
  { id: 'csc19', spanishText: 'Y el amor vive en el alma', englishText: 'And love lives in the soul', startMs: lrcMs(2, 10.43), endMs: lrcMs(2, 13.82) },
  { id: 'csc20', spanishText: 'Ni con deseos sabes que nada de ti va a cambiar', englishText: "Not even with wishes, you know nothing about you will change", startMs: lrcMs(2, 13.82), endMs: lrcMs(2, 17.96) },
  { id: 'csc21', spanishText: 'Nadie es perfecto en el amor', englishText: "Nobody's perfect in love", startMs: lrcMs(2, 17.96), endMs: lrcMs(2, 21.42) },
  { id: 'csc22', spanishText: 'Ay, seas blanquita, morenita, no me importa el color', englishText: "Whether you're fair-skinned or dark-skinned, I don't care about the color", startMs: lrcMs(2, 21.42), endMs: lrcMs(2, 25.53) },
  { id: 'csc23', spanishText: 'Mírame a mí, mírame bien', englishText: 'Look at me, look at me well', startMs: lrcMs(2, 25.53), endMs: lrcMs(2, 28.91) },
  { id: 'csc24', spanishText: 'Aunque tenga cara de bonito, me acomplejo yo también', englishText: "Even though I have a pretty face, I have insecurities too", startMs: lrcMs(2, 28.91), endMs: lrcMs(2, 33.08) },
  { id: 'csc25', spanishText: 'Y si eres gorda o flaca, todo eso no me importa a mí', englishText: "And if you're fat or thin, none of that matters to me", startMs: lrcMs(2, 33.08), endMs: lrcMs(2, 40.65) },
  { id: 'csc26', spanishText: 'Tampoco soy perfecto, solo sé que yo te quiero así', englishText: "I'm not perfect either, I just know I love you the way you are", startMs: lrcMs(2, 40.65), endMs: lrcMs(2, 46.36) },
  { id: 'csc27', spanishText: 'Y el corazón no tiene cara', englishText: "And the heart doesn't have a face", startMs: lrcMs(3, 3.25), endMs: lrcMs(3, 7.08) },
  { id: 'csc28', spanishText: 'Y te prometo que lo nuestro nunca va a terminar', englishText: "And I promise you that what we have will never end", startMs: lrcMs(3, 7.08), endMs: lrcMs(3, 10.90) },
  { id: 'csc29', spanishText: 'Y el amor vive en el alma', englishText: 'And love lives in the soul', startMs: lrcMs(3, 10.90), endMs: lrcMs(3, 14.22) },
  { id: 'csc30', spanishText: 'Ni con deseos sabes que nada de ti va a cambiar', englishText: "Not even with wishes, you know nothing about you will change", startMs: lrcMs(3, 14.22), endMs: lrcMs(3, 18.59) },
]
