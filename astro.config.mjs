// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// output: 'static' es el default de Astro — SSG sin adapter (docs/01 §2).
export default defineConfig({
  integrations: [react()],
});
