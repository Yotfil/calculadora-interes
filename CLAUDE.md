# CLAUDE.md — Reglas de trabajo (Calculadora de Interés Compuesto)

Este archivo se carga en cada sesión. Es corto a propósito: apunta, no duplica.
La checklist de módulos vive SOLO en `docs/ESTADO.md`.

## 1. Lectura dirigida

Prohibido leer todos los docs por sesión. Visión (`00`) y arquitectura (`01`)
completos solo en la primera sesión. **Toda tarea empieza leyendo
`docs/ESTADO.md` + la fila de su módulo:**

| Módulo(s)                   | Leer                     |
| --------------------------- | ------------------------ |
| 1 (setup)                   | `01`                     |
| 2 (motor núcleo)            | `02` §1–3, §7            |
| 3 (validación/tipos)        | `02` §6, `04` §5         |
| 4 (i18n base)               | `07`                     |
| 5 (UI formulario)           | `04` §1–3, `05`          |
| 6 (UI resultados)           | `04` §4, `05`, `06` §1   |
| 7 (SEO + analítica)         | `06` §2–3                |
| 8 (deploy/release)          | `01` §6                  |
| 9 (motor escalonado)        | `02` §4                  |
| 10 (motor glide)            | `02` §5                  |
| 11 (métricas derivadas)     | `06` §1                  |
| 12–13 (UI Avanzada/Experto) | `04` §1–4, `05`          |
| 14 (motor meta)             | `03` §1                  |
| 15 (motor inflación)        | `03` §2                  |
| 16–17 (UI meta/inflación)   | `04` §3–4, `03`, `07` §4 |
| 18 (compartir URL)          | `04` §5                  |

## 2. Protocolo de sesión

1. **Apertura**: leer (según tabla) → resumir alcance → **confirmar con Jef** → codear.
2. Una sesión = un módulo de la checklist de `ESTADO.md`.
3. **Plan Mode** para tareas estructurales/multi-archivo. Módulos de motor con
   tablas de casos cerradas van directo a TDD.
4. **Cierre**: revisión del diff con subagente en contexto fresco contra la spec
   (verificar sus reportes contra el código, no aceptarlos a ciegas) → commit →
   actualizar `ESTADO.md` (checklist, decisiones nuevas, trampas, próximo paso).

## 3. TDD desde la spec

Los módulos de lógica tienen tablas de casos con entradas y salidas exactas en
`docs/02` y `docs/03`. Se escriben PRIMERO esos tests (Vitest), se ven fallar,
y luego se implementa. Las tablas son contrato anti-deriva: si un resultado no
coincide, se revisa la implementación contra la spec, nunca se "ajusta" el test.
Tolerancia de asserts monetarios: ±0,01 USD.

## 4. Commits granulares

Un commit por cambio lógico, revisable solo (code review commit a commit).
Mensaje describe únicamente ese cambio. **Sin atribuciones auto-generadas**
(nada de "Generated with...", "Co-Authored-By...").

## 5. Flujo de git

- `main` ← `dev` ← `feature/*`. `dev` se crea de `main` una sola vez.
- Toda rama de trabajo sale de `dev` actualizado. **Claude nunca mergea.**
- Al terminar cada feature, entregar en BLOQUE DE CÓDIGO el link de PR con base
  dev preseleccionada: `https://github.com/<owner>/<repo>/compare/dev...<rama>?expand=1`
  más una descripción lista para pegar.
- No borrar ramas. Sincronizar tras cada merge. Avisar si un push falla por credenciales.

## 6. Releases

- Release = merge `dev → main`. Antes: rama `release/X.Y.Z` desde dev con
  ÚNICAMENTE el bump (`npm version <minor|patch> --no-git-tag-version`),
  mergeada a dev. Minor = features; patch = fixes.
- La versión de `package.json` se inyecta en build y se muestra en la UI
  (footer, visible en desktop y mobile).

## 7. Compactación

Al compactar: preservar archivos modificados, comandos de test, casos de prueba
pendientes y decisiones tomadas en la sesión.

## 8. Reglas del proyecto (verificables)

**Arquitectura**

- `src/core/` no importa NADA de fuera de `src/core/` (ni React, ni Astro, ni
  DOM, ni `Date`). Forzado por eslint-plugin-boundaries; el lint en rojo bloquea commit.
- El motor es determinista: mismas entradas → mismas salidas. Sin efectos.
- Un componente / una interfaz por archivo. Código legible por un junior.
- Cero secretos hardcodeados. `.env.example` versionado (GA4 ID, etc.).

**Datos**

- Dinero en `number` (float64) durante el cálculo; redondeo SOLO al presentar
  (`docs/02` §7). Nunca redondear dentro de la iteración mensual.
- Todo dato de formulario y de URL pasa por el MISMO esquema Zod (`docs/02` §6).
- La moneda se formatea únicamente vía `formatMoney(valor, locale)` (USD es un
  literal en UN solo archivo). El default de inflación vive en config por país.

**UI**

- Ningún color/espaciado literal en componentes: solo tokens semánticos (`docs/05`).
- Todo texto visible sale de los diccionarios i18n; cero strings en JSX.
  `es.json` es la fuente canónica (`docs/07`).
- Los mensajes de casos especiales se copian textuales de `docs/07` §4; no se inventan.
- El botón Calcular nunca se deshabilita (errores → scroll al primero).

**Testing**

- Motor: Vitest, tablas de `docs/02`/`docs/03` como casos con nombre.
- E2E: Playwright, flujos de `docs/04` §6.
- `npm test` verde es precondición del ritual de frontera. Sin excepciones.
