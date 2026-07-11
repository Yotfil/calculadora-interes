# ESTADO.md — Bitácora viva

> Única fuente de la checklist. Se actualiza al cierre de CADA sesión.

## Próximo paso

Módulo 1 (setup del repo). Ver prompt inicial en `README.md`.

## Checklist canónica de módulos

### Fase 1 — Básica completa y publicada (release 1.0.0)

- [ ] **M1 · Setup**: Astro + React + Tailwind + Vitest + Playwright +
      eslint-plugin-boundaries + Prettier; estructura de `docs/01` §3;
      `.env.example`; script de versión en UI.
- [ ] **M2 · Motor núcleo** [TDD]: tasas equivalentes, simulación mensual,
      resultado con filas anuales y totales (`docs/02` §1–3, §7).
- [ ] **M3 · Validación y tipos** [TDD]: esquemas Zod, rangos y clampeos
      (`docs/02` §6), tipos compartidos core↔UI.
- [ ] **M4 · i18n base**: rutas `/es/` `/en/`, diccionarios, `formatMoney`,
      redirección de raíz (`docs/07`).
- [ ] **M5 · UI formulario Básica**: layout, tabs (Avanzada/Experto visibles pero
      con contenido de Fase 2 oculto), pasos 1–4, validación inline (`docs/04`).
- [ ] **M6 · UI resultados**: cifra grande + frase, torta, barras, tabla,
      animación firma, ejemplo precargado, temas claro/oscuro (`docs/04` §4, `docs/05`).
- [ ] **M7 · SEO + analítica**: metas, hreflang, schema.org, GA4 (4 eventos),
      sitemap (`docs/06`).
- [ ] **M8 · Deploy**: Netlify + release 1.0.0.

### Fase 2 — Avanzada y Experto (release 1.1.0)

- [ ] **M9 · Motor escalonado** [TDD] (`docs/02` §4).
- [ ] **M10 · Motor glide path gradual** [TDD] (`docs/02` §5).
- [ ] **M11 · Métricas derivadas** [TDD]: ahorro del escalonado, costo de la
      protección, banda de varianza (`docs/06` §1).
- [ ] **M12 · UI tab Avanzada**: sección "Impulso inicial" + métrica de ahorro.
- [ ] **M13 · UI tab Experto**: "Protección final" + varianza + costo de la
      protección. Release 1.1.0.

### Fase 3 — Meta, inflación y compartir (release 1.2.0)

- [ ] **M14 · Motor modo meta** [TDD] (`docs/03` §1).
- [ ] **M15 · Motor inflación** [TDD] (`docs/03` §2).
- [ ] **M16 · UI modo meta**: paso 5, campo régimen deshabilitado, copys de
      casos especiales.
- [ ] **M17 · UI toggle inflación**: transforma cifra/barras/tabla, leyenda de torta.
- [ ] **M18 · Compartir URL**: codificación, parseo tolerante, abre tab correcto.
      Release 1.2.0.

## Decisiones sobre la marcha

(ninguna aún — las de diseño están en README.md y no se re-abren)

## Trampas conocidas

- El motor NO redondea dentro de la iteración; solo la capa de presentación
  redondea. Redondear adentro rompe las anclas de `docs/02`.
- La tasa reducida del glide usa la MISMA convención (nominal + selector) que
  la principal; no convertirla dos veces.
- `Intl.NumberFormat` difiere entre Node y navegador en espacios no separables:
  en asserts de e2e comparar con `\u00A0` normalizado.
- Los bloques del glide se cuentan DESDE EL FINAL (`docs/02` §5); contarlos
  desde el inicio de la protección da otra escalera en duraciones no múltiplo de 12.

## Historial de sesiones

(vacío)
