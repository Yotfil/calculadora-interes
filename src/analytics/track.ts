// Wrapper único de telemetría de producto (docs/06 §2). GA4 con EXACTAMENTE 4
// eventos, ni uno más. Es un no-op si `PUBLIC_GA4_ID` está vacío: en dev y en
// tests el snippet de gtag no se inyecta (Base.astro lo condiciona), así que
// `window.gtag` no existe y no debemos tocarlo. La guarda del ID cubre ambos.

declare global {
  interface Window {
    // gtag.js define esta función global cuando el snippet está presente.
    gtag?: (...args: unknown[]) => void;
  }
}

type Tab = "b" | "a" | "e";

// Contrato de eventos ↔ parámetros de docs/06 §2. Solo `calcular` se dispara en
// Fase 1; los otros tres se cablean con su feature (M16/M17/M18).
interface Eventos {
  calcular: { tab: Tab; con_impulso: boolean; con_proteccion: boolean };
  modo_meta_activado: { tab: Tab };
  toggle_inflacion: Record<string, never>;
  compartir: { tab: Tab };
}

export function track<E extends keyof Eventos>(
  evento: E,
  params: Eventos[E],
): void {
  // Sin ID configurado ⇒ analítica desactivada (docs/06 §2). Retorno temprano:
  // no referenciamos `window`, seguro también en entorno Node (tests).
  if (!import.meta.env.PUBLIC_GA4_ID) return;
  window.gtag?.("event", evento, params);
}
