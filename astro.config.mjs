// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

// Metadatos de build para el footer. Se leen de git; en Netlify (clon shallow)
// git está disponible y además expone COMMIT_REF como respaldo. Fallbacks para
// entornos sin git: no rompen el build, solo muestran valores neutros.
function git(args, fallback) {
  try {
    return execSync(`git ${args}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return fallback;
  }
}
const commitHash = (process.env.COMMIT_REF || git("rev-parse HEAD", "")).slice(
  0,
  7,
); // 7 = short SHA
const commitDate = git("log -1 --format=%cs", ""); // %cs = YYYY-MM-DD (committer date)
const buildYear = commitDate.slice(0, 4) || String(new Date().getFullYear()); // copyright

// Dominio de producción. Fija canonical, hreflang y las URLs absolutas del
// sitemap (docs/06 §3). Netlify sirve HTTPS con cert automático, por eso https.
const SITE = "https://helenguevara.com";

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
    // La versión de package.json se inyecta en build y se muestra en la UI (docs/01 §6),
    // junto con la fecha y el hash del commit para el footer.
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __COMMIT_DATE__: JSON.stringify(commitDate),
      __BUILD_YEAR__: JSON.stringify(buildYear),
    },
  },
});
