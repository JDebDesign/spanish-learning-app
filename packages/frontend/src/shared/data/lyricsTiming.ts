/**
 * Lyric timings from LRC - synced with actual song audio.
 * Source: LRC [length: 03:57] = 237 seconds
 */
export interface LyricLineTiming {
  id: string
  spanishText: string
  englishText: string
  startMs: number
  endMs: number
}

/** Convert min:sec.xx to milliseconds */
function ms(min: number, sec: number) {
  return (min * 60 + sec) * 1000
}

export const lyricsWithTiming: LyricLineTiming[] = [
  { id: 'line1', spanishText: 'Eh-eh, eh-eh, eh-eh, eh-eh', englishText: 'Eh-eh, eh-eh, eh-eh, eh-eh', startMs: ms(0, 13.22), endMs: ms(0, 18.14) },
  { id: 'line2', spanishText: 'Otro sunset bonito que veo en San Juan', englishText: 'Another beautiful sunset I see in San Juan', startMs: ms(0, 18.14), endMs: ms(0, 22.46) },
  { id: 'line3', spanishText: 'Disfrutando de todas esas cosas que extrañan los que se van', englishText: "Enjoying all those things that those who leave miss", startMs: ms(0, 22.46), endMs: ms(0, 26.69) },
  { id: 'line4', spanishText: 'Disfrutando de noches de esas', englishText: 'Enjoying nights like those', startMs: ms(0, 26.69), endMs: ms(0, 28.95) },
  { id: 'line5', spanishText: 'Que ya no se dan, que ya no se dan', englishText: "That don't happen anymore, that don't happen anymore", startMs: ms(0, 28.95), endMs: ms(0, 32.86) },
  { id: 'line6', spanishText: 'Pero queriendo volver a la última vez', englishText: 'But wanting to go back to the last time', startMs: ms(0, 32.86), endMs: ms(0, 37.12) },
  { id: 'line7', spanishText: 'Que a los ojos te miré y contarte las cosas que no te conté', englishText: "That I looked into your eyes and tell you the things I didn't tell you", startMs: ms(0, 37.12), endMs: ms(0, 43.73) },
  { id: 'line8', spanishText: 'Y tirarte las fotos que no te tiré', englishText: "And take the photos of you that I didn't take", startMs: ms(0, 43.73), endMs: ms(0, 49.38) },
  { id: 'line9', spanishText: 'Ey, tengo el pecho pelau, me di una mata', englishText: 'Hey, my chest is bare, I gave myself a buzzcut', startMs: ms(0, 49.38), endMs: ms(0, 52.51) },
  { id: 'line10', spanishText: "El corazón dándome patá'", englishText: 'My heart kicking me', startMs: ms(0, 52.51), endMs: ms(0, 54.58) },
  { id: 'line11', spanishText: 'Dime, baby, ¿dónde tú estás?', englishText: 'Tell me, baby, where you are?', startMs: ms(0, 54.58), endMs: ms(0, 56.91) },
  { id: 'line12', spanishText: "Pa' llegarle con Roro, Julito, Cristal", englishText: 'To get there with Roro, Julito, Cristal', startMs: ms(0, 56.91), endMs: ms(0, 59.35) },
  { id: 'line13', spanishText: 'Roy, Edgar, Sebas, Oscar, Darnel y Big J tocando Batá', englishText: 'Roy, Edgar, Sebas, Oscar, Darnel and Big J playing Batá', startMs: ms(0, 59.35), endMs: ms(1, 3.82) },
  { id: 'line14', spanishText: "Hoy la calle la dejamos 'esbaratá'", englishText: 'Today we left the street shattered', startMs: ms(1, 3.82), endMs: ms(1, 6.99) },
  { id: 'line15', spanishText: "Y sería cabrón que tú me toque' el güiro", englishText: 'And it would be messed up if you play the güiro for me', startMs: ms(1, 6.99), endMs: ms(1, 10.32) },
  { id: 'line16', spanishText: 'Yo veo tu nombre y me salen suspiros', englishText: 'I see your name and sighs come out', startMs: ms(1, 10.32), endMs: ms(1, 13.42) },
  { id: 'line17', spanishText: 'No sé si son petardos o si son tiros', englishText: "I don't know if they're firecrackers or gunshots", startMs: ms(1, 13.42), endMs: ms(1, 17.67) },
  { id: 'line18', spanishText: 'Mi blanquita, perico, mi kilo', englishText: 'My white girl, coke, my kilo', startMs: ms(1, 17.67), endMs: ms(1, 19.89) },
  { id: 'line19', spanishText: 'Yo estoy en PR tranquilo', englishText: "I'm in PR chillin'", startMs: ms(1, 19.89), endMs: ms(1, 22.22) },
  { id: 'line20', spanishText: 'Pero…', englishText: 'But…', startMs: ms(1, 22.22), endMs: ms(1, 23.54) },
  { id: 'line21', spanishText: 'Debí tirar más fotos de cuando te tuve', englishText: 'I should have taken more photos of when I had you', startMs: ms(1, 23.54), endMs: ms(1, 27.72) },
  { id: 'line22', spanishText: 'Debí darte más besos y abrazos las veces que pude', englishText: 'I should have given you more kisses and hugs the times I could', startMs: ms(1, 27.72), endMs: ms(1, 33.88) },
  { id: 'line23', spanishText: 'Ey, ojalá que los míos nunca se muden', englishText: 'Hey, I hope my people never move away', startMs: ms(1, 33.88), endMs: ms(1, 37.81) },
  { id: 'line24', spanishText: 'Y si hoy me emborracho, pues que me ayuden', englishText: 'And if I get drunk today, well, let them help me', startMs: ms(1, 37.81), endMs: ms(1, 40.49) },
  { id: 'line25', spanishText: 'Debí tirar más fotos de cuando te tuve', englishText: 'I should have taken more photos of when I had you', startMs: ms(1, 40.49), endMs: ms(1, 44.79) },
  { id: 'line26', spanishText: 'Debí darte más besos y abrazos las veces que pude', englishText: 'I should have given you more kisses and hugs the times I could', startMs: ms(1, 44.79), endMs: ms(1, 51.62) },
  { id: 'line27', spanishText: 'Ojalá que los míos nunca se muden', englishText: 'I hope my people never move away', startMs: ms(1, 51.62), endMs: ms(1, 55.84) },
  { id: 'line28', spanishText: 'Y si hoy me emborracho, pues que me ayuden', englishText: 'And if I get drunk today, well, let them help me', startMs: ms(1, 55.84), endMs: ms(1, 59.43) },
  { id: 'line29', spanishText: "Ey, hoy voy a estar con abuelo to' el día", englishText: "Hey, today I'm gonna be with grandpa all day", startMs: ms(1, 59.43), endMs: ms(2, 2.34) },
  { id: 'line30', spanishText: 'Jugando dominó', englishText: 'Playing dominoes', startMs: ms(2, 2.34), endMs: ms(2, 4.15) },
  { id: 'line31', spanishText: 'Si me pregunta si aún pienso en ti', englishText: 'If he asks me if I still think of you', startMs: ms(2, 4.15), endMs: ms(2, 6.49) },
  { id: 'line32', spanishText: 'Yo le digo que no', englishText: 'I tell him no', startMs: ms(2, 6.49), endMs: ms(2, 8.9) },
  { id: 'line33', spanishText: 'Que mi estadía cerquita de ti ya se terminó', englishText: 'That my stay close to you is already over', startMs: ms(2, 8.9), endMs: ms(2, 13.06) },
  { id: 'line34', spanishText: 'Ya se terminó', englishText: "It's already over", startMs: ms(2, 13.06), endMs: ms(2, 14.31) },
  { id: 'line35', spanishText: "Ey, que prendan las máquinas, voy pa' Santurce", englishText: "Hey, fire up the machines, I'm heading to Santurce", startMs: ms(2, 14.31), endMs: ms(2, 18.2) },
  { id: 'line36', spanishText: "Aquí todavía se da caña", englishText: 'Here we still go hard', startMs: ms(2, 18.2), endMs: ms(2, 20.02) },
  { id: 'line37', spanishText: "Chequéate las babies, diablo, mami, qué dulce", englishText: 'Check out the babes, damn, mami, how sweet', startMs: ms(2, 20.02), endMs: ms(2, 23.57) },
  { id: 'line38', spanishText: 'Hoy yo quiero beber, beber, beber', englishText: 'Today I want to drink, drink, drink', startMs: ms(2, 23.57), endMs: ms(2, 29.37) },
  { id: 'line39', spanishText: 'Y hablar mierda hasta que me expulsen', englishText: 'And talk shit until they kick me out', startMs: ms(2, 29.37), endMs: ms(2, 32.29) },
  { id: 'line40', spanishText: 'Toi bien loco', englishText: "I'm real crazy", startMs: ms(2, 32.29), endMs: ms(2, 34.42) },
  { id: 'line41', spanishText: 'Toi bien loco', englishText: "I'm real crazy", startMs: ms(2, 34.42), endMs: ms(2, 36.4) },
  { id: 'line42', spanishText: "Cabrón, guía tú, que hasta caminando yo toi que choco", englishText: "Dude, you lead, 'cause even walking I'm about to crash", startMs: ms(2, 36.4), endMs: ms(2, 40.88) },
  { id: 'line43', spanishText: 'Toi bien loco', englishText: "I'm real crazy", startMs: ms(2, 40.88), endMs: ms(2, 42.95) },
  { id: 'line44', spanishText: 'Toi bien loco', englishText: "I'm real crazy", startMs: ms(2, 42.95), endMs: ms(2, 45) },
  { id: 'line45', spanishText: "Vamo' a disfrutar, que nunca se sabe si nos queda poco… Debí tirar más f-", englishText: "Let's enjoy, you never know if we have little left… I should have taken more pho-", startMs: ms(2, 45), endMs: ms(2, 50.17) },
  { id: 'line46', spanishText: 'Gente, los quiero con cojones, los amo', englishText: 'Folks, I love you with cojones, I love you', startMs: ms(2, 50.17), endMs: ms(2, 53.06) },
  { id: 'line47', spanishText: 'Gracias por estar aquí, de verdad', englishText: 'Thanks for being here, for real', startMs: ms(2, 53.06), endMs: ms(2, 55.48) },
  { id: 'line48', spanishText: 'Para mí es bien importante que estén aquí', englishText: "It's really important to me that you're here", startMs: ms(2, 55.48), endMs: ms(2, 57.31) },
  { id: 'line49', spanishText: 'Y cada uno de ustedes significa mucho para mí', englishText: 'And each one of you means a lot to me', startMs: ms(2, 57.31), endMs: ms(3, 0.03) },
  { id: 'line50', spanishText: "Así que vamo' pa' la foto, vengan pa' acá", englishText: "So let's go for the photo, come over here", startMs: ms(3, 0.03), endMs: ms(3, 1.77) },
  { id: 'line51', spanishText: "Métanse to' el mundo, to' el corillo, vamo'", englishText: "Everybody get in, the whole crew, let's go", startMs: ms(3, 1.77), endMs: ms(3, 4.14) },
  { id: 'line52', spanishText: 'Zumba', englishText: 'Zumba', startMs: ms(3, 4.14), endMs: ms(3, 6.03) },
  { id: 'line53', spanishText: 'Ya Bernie tiene el nene y Jan la nena', englishText: 'Bernie already has the boy and Jan the girl', startMs: ms(3, 6.03), endMs: ms(3, 9.32) },
  { id: 'line54', spanishText: "Ya no estamos pa' las movie' y las cadenas", englishText: "We're no longer for the movies and the chains", startMs: ms(3, 9.32), endMs: ms(3, 12.5) },
  { id: 'line55', spanishText: "Estamos pa' las cosas que valgan la pena", englishText: "We're for the things that are worth it", startMs: ms(3, 12.5), endMs: ms(3, 15.86) },
  { id: 'line56', spanishText: "Ey, pa'l perreo, la salsa, la bomba y la plena", englishText: 'Hey, for perreo, salsa, bomba and plena', startMs: ms(3, 15.86), endMs: ms(3, 19.77) },
  { id: 'line57', spanishText: 'Chequéate la mía cómo es que suena', englishText: 'Check out how mine sounds', startMs: ms(3, 19.77), endMs: ms(3, 22.45) },
  { id: 'line58', spanishText: 'Debí tirar más fotos de cuando te tuve', englishText: 'I should have taken more photos of when I had you', startMs: ms(3, 22.45), endMs: ms(3, 26.77) },
  { id: 'line59', spanishText: 'Debí darte más besos y abrazos las veces que pude', englishText: 'I should have given you more kisses and hugs the times I could', startMs: ms(3, 26.77), endMs: ms(3, 33.82) },
  { id: 'line60', spanishText: 'Ojalá que los míos nunca se muden', englishText: 'I hope my people never move away', startMs: ms(3, 33.82), endMs: ms(3, 37.74) },
  { id: 'line61', spanishText: 'Y que tú me envíes más nudes', englishText: 'And that you send me more nudes', startMs: ms(3, 37.74), endMs: ms(3, 44.51) },
  { id: 'line62', spanishText: 'Y si hoy me emborracho, que Beno me ayude', englishText: 'And if I get drunk today, may Beno help me', startMs: ms(3, 46.2), endMs: ms(3, 57) },
]
