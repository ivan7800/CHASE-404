/** Short scenes anchored to the objective the player has just completed. */
export const STORY_BEATS = Object.freeze({
 '1:0': {speaker:'PAU VERENNE · CASETE',place:'TALLER DEL CARMEL',title:'EL TURNO DE NOCHE',text:'«Gael, si mañana no estoy en casa, lleva esto al Turó. Me han mandado firmar por unos coches que no deberían moverse.»'},
 '6:0': {speaker:'VOZ AL TELÉFONO',place:'MIRADOR DE MONTJUÏC',title:'EL MECÁNICO SIGUE VIVO',text:'«Manda el sedán gris al 04. El mecánico sigue vivo. Mientras no sepamos dónde dejó la copia, se queda con nosotros.»'},
 '10:0': {speaker:'CLARA VIDAL',place:'REFUGIO DE GRÀCIA',title:'LA VOZ DE CLARA',text:'«Pau llamó a mi periódico hace dos días. Desde entonces vigilan su casa. Hay un hombre en el 04 que vio adónde lo llevaron. Empieza por él.»'},
 '11:1': {speaker:'EL TESTIGO',place:'ALMACÉN 04 · PUERTO',title:'EL HOMBRE QUE ESCAPÓ',text:'«Pau escondió una copia en el Eixample. Te diré dónde cuando salgamos de aquí. Los coches de la puerta son los mismos del registro.»'},
 '14:0': {speaker:'CLARA VIDAL',place:'CONTROL DEL PUERTO',title:'LO QUE ESTÁ EN JUEGO',text:'«Pau está en el muelle. El expediente está en el control. Si sacas a Pau primero, quemarán las órdenes. Si buscas las órdenes primero, pueden trasladarlo.»'},
 '14:1': {speaker:'GAEL VERENNE',place:'LOS MUELLES',title:'UNA DECISIÓN SIN VUELTA ATRÁS',text:'«Si llego a tiempo todavía podré evitar que se lleven lo que quede.»'},
 '15:0': {speaker:'GAEL VERENNE',place:'PUERTO DE BARCELONA',title:'NO HAY MARCHA ATRÁS',text:'«Ya tengo lo que quedaba pendiente. Clara espera en el Carmel. Salvat ha mandado cerrar las salidas.»'},
 '15:1': {speaker:'CLARA VIDAL · RADIO',place:'SALIDA DE GRÀCIA',title:'LA ÚLTIMA PARADA',text:'«Te espero en el Carmel, junto al cruce. En cuanto llegues, hago llegar una copia al periódico.»'}
});
const afterDecision = {
 'RESCATAR A MI HERMANO': {...STORY_BEATS['14:1'],text:'«Voy a por Pau. Clara, en cuanto lo saque, llévalo al refugio. Volveré al control si aún queda algo que salvar.»'},
 'RECUPERAR LAS PRUEBAS': {...STORY_BEATS['14:1'],text:'«Voy al control. Clara, cuando te dé el expediente, sácalo del puerto. Yo volveré a por Pau.»'}
};
export function storyBeat(chapter,completedIndex,finalChoice){
 if(chapter===14&&completedIndex===1&&Object.hasOwn(afterDecision,finalChoice))return afterDecision[finalChoice];
 return STORY_BEATS[`${chapter}:${completedIndex}`]||null;
}
