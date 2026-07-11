// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// output: 'static' es el default de Astro — SSG sin adapter (docs/01 §2).
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // La versión de package.json se inyecta en build y se muestra en la UI (docs/01 §6).
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  },
});
