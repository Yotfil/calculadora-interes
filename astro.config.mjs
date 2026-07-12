// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

// Dominio de producción: PLACEHOLDER hasta M8 (deploy). Fija canonical, hreflang
// y las URLs absolutas del sitemap (docs/06 §3). Único punto de cambio en M8.
const SITE = "https://calculadora-interes.example";

// output: 'static' es el default de Astro — SSG sin adapter (docs/01 §2).
export default defineConfig({
  site: SITE,
  integrations: [
    react(),
    // Sitemap generado en build (docs/06 §3). i18n añade <xhtml:link hreflang>
    // recíprocos por URL; defaultLocale 'en' ⇒ x-default → /en/ (docs/06 §3).
    // Se excluye la raíz `/` (solo redirige; no es contenido indexable, docs/07 §1).
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", es: "es" } },
      filter: (page) => new URL(page).pathname !== "/",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // La versión de package.json se inyecta en build y se muestra en la UI (docs/01 §6).
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  },
});
