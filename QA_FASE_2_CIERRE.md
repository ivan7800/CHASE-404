# Fase 2 — cierre técnico condicionado · v0.4.3

## Integrado
- Vehículo protagonista Verenne V8/BLAZE: molduras, línea de techo, detalles de matrícula, lunas y elementos cromados (GLB reconstruido).
- El Carmel: mobiliario ochentero adicional, marquesinas y persianas comerciales, farolas, jardineras, vegetación, señales, cabinas telefónicas y antenas.
- Integración directa en buildCity sin recursos remotos ni rutas absolutas.
- Test de geometría de ciudad reforzado: evitar spread gigantes que agotaba la pila con la nueva malla.

## Validaciones
- Node test: 76/76 pasan.
- node --check: correcto.
- Asset validator: 6/6 archivos GLB correctos.
- Chromium Playwright: intentado con ruta simulada y servidor HTTP 127.0.0.1; ambos bloqueados por ERR_BLOCKED_BY_ADMINISTRATOR (no se pudo verificar render ni botones de forma visual).
- Blender: no está instalado; scripts Blender no ejecutados.
- Windows/Linux: sin ejecución interactiva de usuario.

## Pendiente antes de dar por cerrada la fase visual
- Prueba real en navegador, inspección de apariencia e iluminación y corrección de fallos visuales.
- Comparación de rendimiento y revisión de triángulos/consumo de memoria en hardware modesto.
- Probar lanzadores Windows y Linux Mint.
- Los detalles de calle son geometría procedural y NO un paquete de edificios esculpidos en Blender; ampliar variedad de fachadas requiere validación visual y artística.

No publicar en GitHub hasta autorización expresa.
