/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig carga astro.config.mjs → los tests ven el mismo `define`
// (__APP_VERSION__) que el build, sin duplicar la fuente.
export default getViteConfig({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    environment: "node",
  },
});
