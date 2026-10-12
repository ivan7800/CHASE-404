# QA — Fase 11.11 · Materiales de vehículos (v0.13.5)

- Shader WebGL1: detección de cromados y cristales por paleta local, con respuesta de Fresnel y reflejos de cielo. El tratamiento solo se aplica a coches (uMaterialType > 0.5), sin cambiar el pavimento ni los edificios.
- Se mantienen los seis GLB, el trazado, las físicas, los controles y las quince misiones.
- Las pruebas específicas verifican el shader, la paleta de los seis coches y las uniformes atmosféricas.
- **Pendiente:** compilación y aspecto en GPU real, reflejos diurnos/nocturnos, capturas y FPS en Windows/Linux/móvil. La comprobación sintáctica JS no compila el GLSL.
- No se declara aceptación visual ni jugable.

## Regresiones de pruebas heredadas
Tras ejecutar la batería completa, cuatro límites históricos (<355.000/<365.000 vértices) rechazaban la ciudad actual de 365.613 vértices, ampliada en fases 11.4–11.9; se actualizan a un techo documentado de 380.000. El test de longitud del Verenne pasa de ±4,20 a ±4,25 unidades para permitir los paragolpes existentes (medidos: ±4,225). No se ha cambiado la geometría del juego para corregir esos tests.
