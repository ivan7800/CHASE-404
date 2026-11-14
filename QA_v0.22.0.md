# QA · CHASE 404 v0.22.0 ALPHA

- Regresiones para los tres encargos, sus restricciones y la ubicación de peatones fuera de la calzada y de los edificios.
- La prueba de persecución verifica que la patrulla conserva la última posición conocida y abandona la búsqueda. Las pruebas previas siguen cubriendo activación, conducción normal y detención.
- La auditoría comprueba 427 pruebas, 49 botones, 6 modelos GLB, arranque HTTP (7/7) y aceptación técnica (18/18).
- El intento de abrir Chromium local quedó bloqueado al crear un socket del proceso. Queda pendiente valorar el ritmo de los encargos y de las persecuciones jugando, además del rendimiento en hardware real.
