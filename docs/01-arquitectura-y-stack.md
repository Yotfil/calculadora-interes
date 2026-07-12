# 01 — Arquitectura y stack

## 1. Condicionantes (de los que TODO se deriva)

Web estática (no PWA) · SEO como requisito duro · multi-idioma con rutas
indexables · sin backend ni persistencia · embebible en otra página a futuro ·
$0/mes de operación · código legible por un junior · lógica testeable sin mocks.

## 2. Stack (cada pieza contra el filtro)

| Pieza          | Elección                                              | Por qué (contra el filtro)                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | **Astro** en modo SSG                                 | HTML completo en build → SEO real sin servidor; i18n con rutas `/es/` `/en/`; usa Vite. SSR descartado: el contenido es idéntico para todos, generar por request paga infraestructura para producir lo mismo. Next-estático descartado: hidrata toda la página (~85 KB+ de runtime) para contenido mayormente estático |
| UI interactiva | **React 18** como isla                                | La calculadora es UN componente autocontenido → embebible por diseño                                                                                                                                                                                                                                                   |
| Motor          | **TypeScript puro** en `src/core/`, cero dependencias | Sobrevive a cualquier migración; testeable sin mocks; sin `Date` (el tiempo del producto es "mes 1..N" relativo — no se necesita puerto Clock porque no hay efectos de tiempo)                                                                                                                                         |
| Estilos        | **Tailwind** consumiendo tokens semánticos            | Tokens en `tokens.css` (docs/05); prohibidos valores literales en componentes                                                                                                                                                                                                                                          |
| Gráficos       | **Recharts**                                          | Torta + barras apiladas declarativas; vive SOLO en `src/ui/`                                                                                                                                                                                                                                                           |
| Validación     | **Zod**                                               | Un esquema para formulario Y parámetros de URL                                                                                                                                                                                                                                                                         |
| i18n           | Diccionarios JSON + rutas Astro + `Intl.NumberFormat` | docs/07                                                                                                                                                                                                                                                                                                                |
| Tests          | **Vitest** (core) + **Playwright** (e2e)              | TDD desde tablas de casos                                                                                                                                                                                                                                                                                              |
| Límites        | **eslint-plugin-boundaries**                          | Los límites se fuerzan con tooling, no con buena voluntad                                                                                                                                                                                                                                                              |
| Deploy         | **Netlify** estático                                  | Plan gratis, conocido                                                                                                                                                                                                                                                                                                  |

## 3. Estructura de carpetas

```
src/
  core/            # motor puro: cálculo, despeje, deflactación, tipos
    __tests__/     # tablas de casos de docs/02 y docs/03
  ui/              # isla React: Calculadora.tsx y subcomponentes, Recharts
  i18n/            # es.json (canónico), en.json, helpers, formatMoney.ts
  analytics/       # wrapper mínimo de GA4 (interfaz de 1 función: track)
  pages/           # Astro: /es/index.astro, /en/index.astro, raíz
  styles/          # tokens.css (única fuente de tokens)
```

## 4. Reglas de límites (config de boundaries)

- `core` → no importa de ningún otro elemento (ni librerías de UI, ni DOM, ni `Date`).
- `ui` → puede importar `core`, `i18n`, `analytics`. No importa `pages`.
- `i18n`, `analytics` → no importan `ui` ni `pages`.
- `pages` → puede importar todo.

Violación de límites = error de lint = commit bloqueado.

## 5. Contrato del motor (firma pública de `core`)

```ts
export type FrecuenciaCap = 1 | 2 | 4 | 12; // anual..mensual
export type AniosSeccion = 1 | 2 | 3 | 4 | 5;

export interface Escenario {
  capitalInicial: number;
  aporteRegimen: number;
  duracionMeses: number; // unidad canónica: meses
  tasaNominalAnual: number; // en %, ej. 10
  frecuencia: FrecuenciaCap;
  impulso?: { anios: AniosSeccion; aporteMensual: number };
  proteccion?: { anios: AniosSeccion; tasaReducida: number };
  varianza?: number; // en puntos de %, ej. 1
}

export interface FilaAnual {
  anio: number;
  aportado: number;
  interes: number;
  balance: number;
}

export interface Resultado {
  balanceFinal: number;
  filas: FilaAnual[]; // la última puede ser parcial
  totalAportado: number; // incluye capital inicial
  interesTotal: number;
  multiplicador: number; // balanceFinal / totalAportado
  banda?: { inferior: number; superior: number }; // si hay varianza
}

export function calcular(e: Escenario): Resultado;
export function despejarRegimen(
  e: Omit<Escenario, "aporteRegimen">,
  meta: number,
): Despeje; // docs/03 §1
export function deflactar(
  valorNominal: number,
  mes: number,
  inflacionAnualPct: number,
): number;
```

La UI nunca calcula nada: toda cifra mostrada sale de `Resultado` o de las
funciones de `docs/06` §1 (que también viven en `core`).

## 6. Build, versión y deploy

- La versión de `package.json` se inyecta en build (`import.meta.env` /
  `define`) y se muestra en el footer (desktop y mobile).
- Deploy: Netlify sirve `dist/` generado por `astro build` desde `main`.
- Variables: `.env.example` versionado con `PUBLIC_GA4_ID=` (vacío en local ⇒
  analítica desactivada, la app funciona igual).
