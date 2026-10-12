/** Secuencias narrativas breves; no alteran objetivos ni guardados. */
export const STORY_BEATS = Object.freeze({
 '10:0': {speaker:'CLARA VIDAL',place:'REFUGIO DE GRÀCIA',title:'LA VOZ DE CLARA',text:'«No uses tu nombre al llamar. En el puerto alguien reconoce tu voz, Gael. Y tu hermano todavía está vivo.»'},
 '11:1': {speaker:'EL TESTIGO',place:'ALMACÉN 04 · PUERTO',title:'EL HOMBRE QUE ESCAPÓ',text:'«Vi las listas. Los trasladan de noche. Salvat tiene policías vigilando cada salida.»'},
 '14:0': {speaker:'CLARA VIDAL',place:'CONTROL DEL PUERTO',title:'LO QUE ESTÁ EN JUEGO',text:'«Puedes ir a por tu hermano o conseguir el expediente. Esta noche no podrás hacer las dos cosas.»'},
 '14:1': {speaker:'GAEL VERENNE',place:'LOS MUELLES',title:'UNA DECISIÓN SIN VUELTA ATRÁS',text:'«He elegido. Ahora tendré que vivir con lo que ocurra después.»'},
 '15:0': {speaker:'GAEL VERENNE',place:'ÚLTIMA NOCHE · BARCELONA',title:'NO HAY MARCHA ATRÁS',text:'«Salvat no piensa dejarme salir. Entonces tendrá que perseguirme hasta el final.»'},
 '15:1': {speaker:'VÍCTOR SALVAT',place:'EL CARMEL · ENCUENTRO FINAL',title:'BARCELONA NO PERDONA',text:'«La ciudad olvida pronto, Verenne. Pero tú has venido a recordármelo.»'}
});
export function storyBeat(chapter,completedIndex){return STORY_BEATS[`${chapter}:${completedIndex}`]||null;}
