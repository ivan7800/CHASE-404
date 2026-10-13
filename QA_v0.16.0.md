# QA v0.16.0 — Ciudad jugable

## Corregido

- Las estructuras principales comparten su huella entre la geometría visible y un índice espacial de colisiones. El coche usa tres muestras longitudinales y un barrido de movimiento con deslizamiento; Gael comprueba la misma huella al andar y al salir del vehículo.
- Las casas procedimentales se sitúan fuera de la calzada y no se solapan entre sí. También se recolocaron edificios de Gràcia, Eixample y puerto que atravesaban el eje de las calles.
- El límite lateral de conducción ya no devuelve el vehículo al eje de la calle, eliminando ese salto repentino.
- Varias decenas de fachadas residenciales se orientan hacia la calle con zócalos, portales, ventanas, cornisas y toldos. El terreno lejano reduce su densidad de triángulos.

## Evidencia automatizada

- `npm run audit`: 96 archivos de pruebas correctos; 6/6 GLB válidos; auditoría estática, gate de release y sitio estático correctos.
- El test de colisiones recorre a intervalos de 2 m todos los ejes de la red vial: cero edificios invadiendo el paso de un coche. Comprueba un impacto barrido, deslizamiento, conducción continua hacia una fachada, caminata y salida del vehículo.
- La malla urbana registra 381.105 vértices frente a 399.165 en v0.15.0, bajo el límite de 400.000.

## Prueba manual pendiente

1. Abrir en navegador con WebGL y recorrer el Carmel, Gràcia, Eixample y puerto; observar puertas, ventanas y esquinas desde la cámara de juego.
2. Chocar contra varias fachadas de frente y en diagonal; girar junto a una esquina y confirmar ausencia de penetración o rebote brusco.
3. Salir del coche junto a una pared y caminar alrededor de las viviendas; verificar pasos accesibles y objetivos de campaña.
4. Medir FPS en un equipo modesto y en móvil. Las pruebas de Node no miden la GPU ni certifican el aspecto final.

La ciudad sigue siendo una Barcelona ficticia condensada. Propiedad de carreteras, tráfico y misiones existentes no se rediseñó en esta iteración.
