# QA Fase 11.10 — Remaster de vehículos · v0.13.4

## Implementación
- Seis modelos GLB locales reconstruidos desde sus generadores originales con el nuevo acabado de época.
- Parrillas, faros delanteros, pilotos traseros, molduras, retrovisores y defensas diferenciadas por modelo.
- Lógica y dimensiones físicas del vehículo intactas; cambios únicamente en la geometría visual.

## Verificaciones realizadas
- `node --test tests/vehicle-remaster-11-10.test.js`: **7/7 superadas**; las seis mallas exportadas coinciden exactamente con sus mallas generadoras y tienen complejidad diferenciada.
- `npm run check`: sintaxis JavaScript correcta.
- `npm run assets:validate`: **6/6 GLB correctos**.
- `npm run release:gate`: superado, v0.13.4.
- `npm run site:prepare`: **58 archivos publicables**, superado.
- La batería global `npm test` se inició pero **no terminó dentro del límite de ejecución**, por tanto NO se considera aprobada en esta fase.

## Pendientes
- Capturas del juego real para evaluar escala, alineación, superposición y acabado artístico de los detalles.
- Rendimiento FPS y memoria en Windows, Linux Mint y móvil.
- Aceptación jugable de las 15 misiones y dos finales.

**No se ha publicado en GitHub.**
