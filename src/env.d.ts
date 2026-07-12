/// <reference types="astro/client" />

/** Versión de package.json, inyectada en build vía define (docs/01 §6). */
declare const __APP_VERSION__: string;
/** Hash corto (7) del commit de build, para el footer. */
declare const __COMMIT_HASH__: string;
/** Fecha del commit de build (YYYY-MM-DD), para el footer. */
declare const __COMMIT_DATE__: string;
/** Año de build, para el copyright del footer. */
declare const __BUILD_YEAR__: string;

interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID: string;
}
