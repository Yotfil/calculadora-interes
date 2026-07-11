/// <reference types="astro/client" />

/** Versión de package.json, inyectada en build vía define (docs/01 §6). */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID: string;
}
