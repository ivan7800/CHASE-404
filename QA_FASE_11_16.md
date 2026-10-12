# CHASE 404 — QA Fase 11.16 (v0.14.0)

## Alcance
Gael se exporta como seis GLB locales independientes (torso, detalles, muslos, brazos, pantorrillas y antebrazos). El motor espera a cargar **todas** las piezas antes de sustituir el modelo procedural, de modo que un error de carga no deje una figura incompleta.

## Limitaciones
No se ha implementado skinning glTF ni animaciones glTF: las transformaciones de los segmentos siguen calculándose en JavaScript. La apariencia geométrica es equivalente a la fase anterior; el objetivo de esta entrega es preparar un flujo de activos 3D modificables. Se requiere modelado artístico nuevo para mejorar de verdad la silueta y texturizado. No se ha realizado prueba visual real de GPU ni una campaña jugada íntegramente.

## Comprobaciones
- `npm run gael:build`: exportación local reproducible.
- `node --test tests/gael-glb.test.js`: comparación de las seis mallas importadas con la geometría origen.
- `npm run check`, `npm run assets:validate` y `node tools/validate_assets.mjs assets/models/gael`.
- `npm test`, puertas de distribución y aceptación técnica, si finalizan.

## Resultados verificados de esta entrega
- Pruebas nuevas: **2/2 correctas**.
- Sintaxis JavaScript: **correcta**.
- GLB de vehículos: **6/6 correctos**.
- GLB del personaje: **6/6 correctos**.
- Puerta de distribución: **OK (20 recursos críticos)**.
- Preparación del sitio: **OK (64 archivos)**.
- Aceptación técnica: **18/18**, aceptación manual pendiente.
- **Batería global: no finalizó antes del límite de ejecución**; no se afirma que esté aprobada.
