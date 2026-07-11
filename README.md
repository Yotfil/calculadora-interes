# Calculadora de Interés Compuesto — Paquete de documentación

Calculadora web de interés compuesto en tres niveles (Básica / Avanzada / Experto),
multi-idioma (es/en), estática, sin backend, optimizada para SEO.
Este repositorio de documentos es el **contrato** entre el diseño de producto
(ya cerrado) y la implementación (Claude Code).

## Índice

| Documento | Contenido |
|---|---|
| `CLAUDE.md` | Reglas de trabajo para Claude Code (liviano, se carga cada sesión) |
| `docs/ESTADO.md` | Bitácora viva: checklist canónica de módulos, decisiones sobre la marcha, trampas, próximo paso |
| `docs/00-vision-y-fases.md` | Qué es el producto, para quién, fases de entrega |
| `docs/01-arquitectura-y-stack.md` | Stack, estructura de carpetas, reglas de límites, testing |
| `docs/02-motor-de-calculo.md` | El motor: fórmulas, escalonado, glide path, rangos, tablas de casos |
| `docs/03-modo-meta-e-inflacion.md` | Despeje del aporte, deflactación, casos especiales |
| `docs/04-pantallas-y-navegacion.md` | Tabs, pasos, resultados, URL compartible, estados |
| `docs/05-diseno-visual-y-tokens.md` | Identidad, tokens en dos capas, temas, animación firma, accesibilidad |
| `docs/06-metricas-y-analitica.md` | Métricas para el usuario (fórmulas) y del producto (GA4, Search Console, SEO) |
| `docs/07-i18n-y-contenido.md` | Rutas por idioma, diccionarios, copy canónico en español |

## Decisiones ya tomadas (NO re-abrir)

Cada una está desarrollada con su porqué en el documento indicado.

1. **Semántica de tasa (Opción B)**: tasa nominal anual + tasa periódica equivalente
   según selector de capitalización (anual/semestral/trimestral/mensual); aportes al
   **fin de mes**. → `docs/02`
2. **Aportes escalonados ("Impulso inicial")**: sección opcional (años 1–5 con aporte X,
   luego régimen); ruleset y bordes cerrados. → `docs/02`
3. **Glide path ("Protección final")**: sección opcional (últimos 1–5 años, tasa reducida
   libre) con **transición gradual por interpolación automática** en escalera anual. → `docs/02`
4. **Modo meta (Opción A)**: se despeja únicamente el aporte de régimen (álgebra exacta,
   redondeo hacia arriba al centavo); sin solver numérico. → `docs/03`
5. **Inflación**: campo editable, default 3 % (USA), rango 0–20 %, sin API; toggle
   "ver en dinero de hoy" en resultados; la meta siempre se ingresa nominal. → `docs/03`
6. **Sin login, sin backend, sin localStorage**: pura calculadora con defaults al entrar.
   Único extra: botón **Compartir** que codifica el escenario en la URL. → `docs/04`
7. **Pantallas**: una sola página, 3 tabs con pasos compartidos, secciones colapsadas,
   resultados debajo (desktop: al costado), ejemplo precargado como estado vacío. → `docs/04`
8. **Stack**: Astro (SSG) + isla React + motor TS puro sin dependencias + Tailwind +
   Recharts + Zod + Vitest/Playwright + eslint-plugin-boundaries + Netlify estático.
   Idiomas día 1: **es + en**. Moneda: **USD siempre** (un solo punto de cambio). → `docs/01`
9. **Métricas y diseño**: métricas de usuario con fórmula exacta; GA4 con 4 eventos +
   Search Console; identidad anclada en la curva exponencial; elemento firma = revelación
   animada de barras + conteo de cifra; temas claro/oscuro por tokens. → `docs/05`, `docs/06`

**Condicionantes no funcionales**: web simple (no PWA) · SEO clave · multi-idioma desde
el día 1 · embebible en otra página a futuro (la calculadora es UN componente React
autocontenido) · cero costo de infraestructura.

## Pendientes fuera del código (humano)

- [ ] Crear propiedad GA4 y obtener el ID de medición (va en `.env`, ver `docs/06`).
- [ ] Alta del sitio en Google Search Console tras el primer deploy.
- [ ] Crear el sitio en Netlify y conectar el repo (deploy de `main`).
- [ ] Decidir dominio definitivo (afecta hreflang y canonical, ver `docs/06`).
- [ ] Revisión humana de la traducción `en.json` antes del release 1.0.0.

## Arranque con Claude Code (handoff)

### Prompt inicial (sesión 1)

```
Lee README.md, CLAUDE.md, docs/ESTADO.md, docs/00-vision-y-fases.md y
docs/01-arquitectura-y-stack.md. Resume en 10 líneas qué vamos a construir,
con qué stack y cuál es el módulo 1, y espera mi confirmación.
Tras mi OK: inicializa git (main → dev → feature/modulo-01-setup),
y ejecuta el módulo 1 de la checklist de docs/ESTADO.md en Plan Mode.
Cierra con el ritual de frontera de CLAUDE.md (tests verdes, commit,
actualizar ESTADO.md, link de PR con base dev en bloque de código).
```

### Plantilla de apertura (sesiones siguientes)

```
Lee docs/ESTADO.md y los documentos de la fila del módulo N en la tabla de
ruteo de CLAUDE.md. Resume el alcance del módulo y confirma conmigo antes
de codear.
```

### Criterios de gestión de sesiones

- Una sesión = un módulo. Agrupar dos solo si comparten fila de ruteo, ambos son
  pequeños y el contexto está por debajo del 40 %.
- Al acercarse al 60 % de contexto a mitad de módulo: `/compact` dirigido
  (preservar archivos modificados, comandos de test, casos pendientes, decisiones).
- Tras dos correcciones fallidas del mismo problema: `/clear` y prompt nuevo que
  incorpore lo aprendido.
- El ritual de frontera (tests verdes → commit → ESTADO.md) **nunca** se salta.
