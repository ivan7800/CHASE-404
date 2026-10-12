# QA — Fase 7.2, versión 0.10.0

## Implementado
- Encuadres de conversación con retratos CSS individualizados para Manel, Clara y Núria.
- Cambio de rótulo y tratamiento visual según pista recogida, decisión pendiente o historia resuelta.
- Entrada visual animada sin bibliotecas externas y supresión automática de animación con prefers-reduced-motion.
- Se conserva íntegramente el panel de decisiones y su guardado existente; no se modifican física ni controles.
- Archivo de contactos conserva una presentación neutral.

## Verificación automática
- `npm run audit`: **274/274 pruebas**, 6/6 GLB y auditoría estática correcta (166 IDs únicos, 41 botones asociados, 15 misiones).
- `src/dialogue-presentation.js`: tests de identidad de retratos, estados y degradación segura.

## Pendiente
- Navegador real con WebGL: encuadres, escala táctil y accesibilidad visual.
- Estos retratos son ilustraciones CSS estilizadas; no son modelos faciales 3D. Los PNJ en la calle continúan estáticos; no se han creado gestos 3D ni cinemáticas de cámara real.

## Prueba manual
1. Explorar Barcelona, bajar del coche y hablar con Manel, Clara o Núria (N).
2. Verificar retratos distintos y que al aceptar el encargo no cambien sus recompensas.
3. Recoger la pista, comprobar «PISTA RECUPERADA» y regresar al contacto.
4. Confirmar elección original/copia y rótulo «HISTORIA RESUELTA».
5. Abrir diario (J), comprobar retrato neutral y volver sin perder progreso.
6. Probar 360 px de ancho y la opción del sistema «Reducir movimiento».
