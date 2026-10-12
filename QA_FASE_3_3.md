# CHASE 404 — QA Fase 3.3 · v0.5.2 ALPHA

## Implementado
- Red navegable extraída de los ejes de las calles existentes, con enlaces entre cruces próximos y búsqueda de ruta de coste mínimo.
- Patrulla recalcula recorrido y sigue puntos de calle; se proyecta al eje urbano si una maniobra la desplaza fuera de la calzada.
- Contactos básicos entre coche jugador y tráfico/patrulla: separación arcade, pérdida de velocidad y enfriamiento antirrebote.
- Las carreras originales y el sistema de control no se alteran.

## Evidencias
- `npm run check`: PASS, código de salida 0.
- `npm test`: PASS, 86/86 pruebas, código de salida 0, incluidas cuatro pruebas nuevas de red, persecución en calle y contactos.
- `npm run assets:validate`: PASS, 6 modelos GLB.
- `unzip -t`: comprobar tras crear el paquete.

## Límites
- La red de calles es una simplificación: cruces con prioridad y semáforos reales aún pendientes.
- El contacto usa volúmenes circulares y respuesta arcade, no deformación ni dinámica multicuerpo.
- La patrulla sigue puntos sobre el eje vial, no realiza adelantamientos ni evita todavía los atascos con planificación avanzada.
- El código se ha probado con Node; falta una sesión real en navegador con inspección visual/FPS, además de pruebas prácticas Windows/Linux.
- La Fase 3 no está concluida: daños, salir del coche y cambio de vehículo pendientes.
