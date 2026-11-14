/** Briefings and handoffs describe the same evidence the player encounters. */
const chapters = [
  ['Gael Verenne repara coches en el Carmel. Su hermano Pau, mecánico en el puerto, no ha vuelto a casa. Antes de desaparecer dejó un casete en el taller. Un recadero lo espera en el Turó.', 'En la cinta se oye a Pau leer matrículas y decir «turno de noche». El recadero conoce a alguien que puede identificar las voces. La cita es en Gràcia.'],
  ['El recadero te dejó una hora y una cabina de Gràcia. Lleva el casete al contacto antes de que cierre el bar.', 'El contacto reconoce los distintivos de los vehículos del puerto. Te dicta una referencia del registro municipal. Hay una copia en el Eixample.'],
  ['Cruza el control del Eixample sin llamar la atención. El buzón indicado contiene una copia del registro de vehículos.', 'Varias matrículas del casete aparecen en el registro con el mismo destino. Todas las salidas nocturnas se sellaron en el almacén 04.'],
  ['Sigue los partes de salida del Eixample al almacén 04. Pau firmó el último antes de que desapareciera.', 'En el almacén falta el parte original. Queda un calco con las matrículas y una anotación al margen: Montjuïc, al anochecer.'],
  ['Lleva el calco al mirador de Montjuïc. Quien recoja el siguiente envío puede llevarte hasta Pau.', 'Un hombre del puerto recoge un sobre y vuelve a su coche. Gael decide quedarse en el mirador para oír la llamada que hará antes de bajar.'],
  ['Estaciona en el mirador y escucha la llamada desde el coche. No dejes que el hombre te vea.', 'El hombre pide un sedán gris en el muelle y dice que el mecánico sigue vivo. Por primera vez Gael sabe que puede alcanzar a Pau.'],
  ['Busca el sedán gris en el almacén 04 y síguelo a distancia. Su matrícula puede vincular el convoy al registro.', 'La matrícula coincide con el calco. El convoy circula con vehículos que constan como inmovilizados. El mismo almacén sigue activo esta noche.'],
  ['Vuelve al 04. En cuanto veas salir las patrullas, elige una salida hacia el refugio de Gràcia.', 'Llegas al refugio. La salida que elegiste determina quién puede corroborar la emboscada.'],
  ['Alguien vio la emboscada. Pasa por el refugio y busca una prueba de lo que ocurrió durante tu huida.', 'La prueba vincula las patrullas al convoy. Clara Vidal conoce el almacén y acepta verte en el refugio.'],
  ['Clara te espera en Gràcia. Quiere sacar del puerto a un testigo que conoce el próximo traslado.', 'Clara confirma que Pau sigue vivo y que el testigo está retenido junto al almacén 04. El traslado sale esta misma noche.'],
  ['Saca al testigo del muelle y vuelve con él al refugio. Si las patrullas os siguen, aléjalas antes de parar.', 'El testigo llega al refugio. Vio dónde guardan una segunda copia del registro. Ahora se atreve a dar la dirección.'],
  ['Consigue la dirección del testigo, busca el registro en el Eixample y lleva su código al enlace del puerto.', 'El archivo contiene un código de traslado. Es la primera pista que indica dónde retienen a Pau y permite cotejar las órdenes del convoy.'],
  ['Coteja el código en el puerto, observa el intercambio en Montjuïc y vuelve al archivo con lo que descubras.', 'Las firmas y el casete señalan al inspector Víctor Salvat. Usa la red del puerto para sacar mercancía robada y retiene a Pau porque copió los partes.'],
  ['Clara conoce dos destinos. Puedes liberar a Pau en el muelle o asegurar el expediente que vincula a Salvat con las órdenes. Solo hay tiempo para llegar primero a uno.', 'La decisión determina qué queda por recuperar antes de volver al Carmel.'],
  ['Clara te espera en el Carmel para cerrar el caso. Resuelve lo que quedó pendiente en el puerto y despista a las patrullas antes de llegar.', 'La última parada es el Carmel.']
];
export function campaignBriefing(chapter, finalChoice) {
  if (chapter === 15) {
    if (finalChoice === 'RECUPERAR LAS PRUEBAS') return 'Clara tiene el expediente. Pau sigue en el muelle. Sácalo de allí y vuelve con él al Carmel, donde Clara hará pública la copia.';
    if (finalChoice === 'RESCATAR A MI HERMANO') return 'Pau está a salvo con Clara. Vuelve al puerto a buscar el dossier que quedó atrás. La red ha tenido tiempo de limpiar parte del registro.';
  }
  return chapters[chapter - 1]?.[0] || '';
}

export function campaignOutcome({ chapter, routeChoice, finalChoice }) {
  switch (chapter) {
    case 8:
      return routeChoice === 'CALLE DE SERVICIO'
        ? 'Un trabajador del puerto te vio pasar por la calle de servicio. Clara cree que puede identificar a los hombres de la patrulla.'
        : 'Te vieron cruzar la avenida. Clara sabe dónde guardan las fotos con las matrículas de la patrulla.';
    case 9:
      return routeChoice === 'CALLE DE SERVICIO'
        ? 'El trabajador reconoce al conductor de una patrulla y lo vincula al convoy. Clara acepta verte en Gràcia.'
        : 'Las fotos sitúan una patrulla del puerto en la emboscada. Clara acepta verte en Gràcia con la copia.';
    case 14:
      return finalChoice === 'RECUPERAR LAS PRUEBAS'
        ? 'Clara saca el expediente completo del puerto. Pau sigue retenido en el muelle y su traslado es inminente.'
        : 'Pau llega a salvo al refugio. Mientras Gael lo sacaba, la red se llevó el registro original. Aún queda un dossier en el control.';
    case 15:
      return finalChoice === 'RECUPERAR LAS PRUEBAS'
        ? 'FIN · LA VERDAD. Pau vuelve a casa. Clara publica las órdenes originales y los nombres de la red. Salvat queda detenido y el expediente permite seguir investigando a quienes firmaron con él.'
        : 'FIN · LA FAMILIA. Pau vuelve a casa. Clara publica lo que Gael salvó del dossier. Salvat pierde el control del puerto, pero las órdenes que desaparecieron mantienen a parte de la red fuera del alcance de la investigación.';
    default:
      return chapters[chapter - 1]?.[1] || '';
  }
}
