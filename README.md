# TSP Tournament — Proyecto para Matemáticas Discretas

Este proyecto es una **página web interactiva** (single-page) que sirve como prototipo y demo para un trabajo de curso sobre el **Problema del Agente Viajero (TSP)**. Está pensada para impresionar al docente porque:

- Integra conceptos del syllabus: grafos, árboles, permutaciones, conteo, análisis de algoritmos y demostraciones formales.
- Presenta una **interfaz tipo juego**: varios jugadores escogen algoritmos y compiten en la misma instancia.
- Muestra animaciones que "exponen" cómo piensa cada algoritmo.
- Incluye secciones de teoría que mapean directamente los temas del curso y las demostraciones sugeridas.

## Contenido del ZIP

- `index.html` — página principal (juego, secciones de algoritmos y teoría)
- `style.css` — estilos
- `script.js` — lógica, algoritmos y animaciones
- `README.md` — este archivo
- `LICENSE` — MIT

## Qué algoritmos incluye y su relación con el Syllabus

1. **Brute force (fuerza bruta)** — Permutaciones, crecimiento factorial (Unidad 3: conteo).
2. **Held–Karp (DP, bitmask)** — Relaciones de recurrencia y análisis (Unidad 4).
3. **Nearest Neighbor (voraz)** — Heurística simple; relacionada con grafos (Unidad 5).
4. **2-opt (mejora local)** — Recorridos hamiltonianos y operaciones sobre permutaciones (Unidades 2 y 5).
5. **MST 2-approx (Prim + shortcutting)** — Árboles, MST y prueba de cota 2-approx (Unidad 5).

## Instrucciones rápidas

1. Descomprime el ZIP y abre `index.html` en tu navegador (no necesita servidor).
2. En la pestaña "Jugar":
   - Genera una instancia (ciudades de Ecuador incluidas o aleatorias).
   - Escoge algoritmos para cada jugador.
   - Haz clic en "Iniciar partida" para ver animaciones y comparar resultados.
3. Revisa la sección "Algoritmos" para explicaciones y la sección "Teoría" para mapeo al syllabus.

## Notas técnicas y recomendaciones

- El demo de Held–Karp y Brute Force es práctico solo para `n` pequeño (≤10–12) por razones computacionales.
- Para una entrega más completa puedes:
  - Añadir una página con la **demostración formal** de la cota 2-approx (MST doblado).
  - Incluir **TSPLIB** como conjunto de instancias y correr comparativas experimentales (Jupyter notebooks).
  - Integrar un servidor en Flask si quieres registrar partidas o hacer multijugador real.

## Ideas para la entrega (ganar puntos extra)

- Grabar un video en el que mostrar la app y explicar la correspondencia matemática (p. ej. prueba por inducción del comportamiento del DP).
- Adjuntar un documento con las demostraciones formales: reducción a Hamiltonian Cycle, prueba de la cota 2-approx, análisis de la complejidad de Held–Karp.
- Incluir una maqueta o robot que recorra físicamente la solución calculada (video).

---

Desarrollado como prototipo para un proyecto de curso. Puedes personalizar nombres de ciudades, logos (insertar logo de ESPOL en la carátula) y ampliar el código con más algoritmos (Christofides, branch-and-bound con cuts, ILP).
