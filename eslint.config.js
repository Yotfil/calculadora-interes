import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "playwright-report/",
      "test-results/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  // Archivos de configuración y e2e corren en Node.
  {
    files: ["**/*.config.{js,mjs,ts}", "e2e/**/*.ts"],
    languageOptions: { globals: globals.node },
  },

  // __APP_VERSION__ la inyecta Vite en build (define en astro.config.mjs).
  {
    files: ["**/*.astro", "src/**/*.{ts,tsx}"],
    languageOptions: { globals: { __APP_VERSION__: "readonly" } },
  },

  // Límites de arquitectura (docs/01 §4). Violación = error = commit bloqueado.
  {
    files: ["src/**/*.{ts,tsx,astro}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "core", pattern: "src/core" },
        { type: "ui", pattern: "src/ui" },
        { type: "i18n", pattern: "src/i18n" },
        { type: "analytics", pattern: "src/analytics" },
        { type: "pages", pattern: "src/pages" },
        { type: "layouts", pattern: "src/layouts" },
        { type: "styles", pattern: "src/styles" },
      ],
      "boundaries/include": ["src/**/*"],
      "import/resolver": { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { types: "core" } },
              allow: { to: { element: { types: "core" } } },
            },
            {
              from: { element: { types: "ui" } },
              allow: {
                to: {
                  element: {
                    types: ["ui", "core", "i18n", "analytics", "styles"],
                  },
                },
              },
            },
            {
              from: { element: { types: "i18n" } },
              allow: { to: { element: { types: ["i18n", "core"] } } },
            },
            {
              from: { element: { types: "analytics" } },
              allow: { to: { element: { types: ["analytics", "core"] } } },
            },
            {
              from: { element: { types: "pages" } },
              allow: {
                to: {
                  element: {
                    types: [
                      "pages",
                      "core",
                      "ui",
                      "i18n",
                      "analytics",
                      "layouts",
                      "styles",
                    ],
                  },
                },
              },
            },
            // Un layout es pegamento presentacional: espeja a `pages` (docs/01 §4,
            // extensión anotada en ESTADO — la estructura no listaba `layouts`).
            {
              from: { element: { types: "layouts" } },
              allow: {
                to: {
                  element: {
                    types: ["layouts", "core", "ui", "i18n", "analytics", "styles"],
                  },
                },
              },
            },
            // Módulos externos (npm y builtins): todos pueden, MENOS core.
            // Nota: aquí 'core' en origin significa builtins de Node, no nuestro elemento.
            {
              from: {
                element: {
                  types: ["ui", "i18n", "analytics", "pages", "layouts", "styles"],
                },
              },
              allow: { to: { module: { origin: ["external", "core"] } } },
            },
          ],
        },
      ],
    },
  },

  // Pureza de src/core: candado independiente de boundaries (docs/01 §2 y §4).
  {
    files: ["src/core/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^[^.]",
              message:
                "src/core solo importa rutas relativas dentro de core (cero dependencias).",
            },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "Date",
          message:
            'El motor no usa Date: el tiempo es "mes 1..N" relativo (docs/01 §2).',
        },
        { name: "window", message: "core no toca el DOM." },
        { name: "document", message: "core no toca el DOM." },
        { name: "fetch", message: "core no hace I/O." },
        { name: "localStorage", message: "core no persiste." },
      ],
    },
  },

  // Los tests de core son la única excepción: pueden importar vitest (y nada más).
  {
    files: ["src/core/**/__tests__/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(?!vitest$)[^.]",
              message:
                "Los tests de core solo importan vitest y rutas relativas de core.",
            },
          ],
        },
      ],
    },
  },
);
