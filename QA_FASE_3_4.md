# QA Fase 3.4 — daños mecánicos

Alcance: sistema de condición del vehículo limitado al modo urbano de CHASE 404.

- El daño aumenta con impactos significativos contra coches y barreras; los golpes menores se ignoran.
- Protección temporal contra daño duplicado; estado acotado al 0–100 %.
- La pérdida de condición afecta aceleración, dirección y frenada, con mínimos de control arcade.
- El estado del vehículo aparece en el HUD; reiniciar crea un coche reparado.
- Los circuitos arcade conservan las físicas anteriores.

Limitaciones: todavía no hay daños visuales de chapa, taller de reparación, desgaste de neumáticos ni colisiones con todas las fachadas. El daño acumulado no se guarda entre sesiones; se reinicia con la misión. Prueba de navegador interactivo y mediciones FPS pendientes.
