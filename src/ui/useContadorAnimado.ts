import { useEffect, useRef, useState } from "react";

/**
 * Evalúa la curva de easing firma (docs/05 §4): cubic-bezier(0.5, 0, 0.9, 0.4)
 * — lento al inicio, veloz al final, como el interés compuesto. Devuelve una
 * función progreso∈[0,1] → salida∈[0,1] resolviendo x(t)=progreso por
 * Newton-Raphson (bastan pocas iteraciones para el conteo).
 */
function crearEasing(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const fx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const fy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dfx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 5; i++) {
      const err = fx(t) - x;
      if (Math.abs(err) < 1e-4) break;
      const d = dfx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return fy(t);
  };
}

/**
 * Cuenta desde 0 hasta `objetivo` con el easing firma, sincronizable con la
 * animación de las barras (misma duración). Con `activo` en false (p. ej.
 * `prefers-reduced-motion`) devuelve el objetivo de inmediato, sin animar.
 */
export function useContadorAnimado(
  objetivo: number,
  {
    duracionMs = 1500,
    activo = true,
  }: { duracionMs?: number; activo?: boolean } = {},
): number {
  const [valor, setValor] = useState(activo ? 0 : objetivo);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!activo) {
      setValor(objetivo);
      return;
    }
    const easing = crearEasing(0.5, 0, 0.9, 0.4);
    let inicio: number | undefined;
    const paso = (ts: number) => {
      if (inicio === undefined) inicio = ts;
      const p = Math.min(1, (ts - inicio) / duracionMs);
      setValor(objetivo * easing(p));
      if (p < 1) rafRef.current = requestAnimationFrame(paso);
    };
    setValor(0);
    rafRef.current = requestAnimationFrame(paso);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [objetivo, duracionMs, activo]);

  return valor;
}
