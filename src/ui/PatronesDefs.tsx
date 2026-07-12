/**
 * Definiciones SVG de los patrones de las tres series (docs/05 §5): color +
 * patrón para no depender solo del color (daltonismo). Cada patrón pinta el
 * token semántico de fondo y superpone una trama en color superficie, así
 * ambos temas recolorean el patrón sin recompilar. Se referencian por id
 * (`url(#patron-<clave>)`) desde la torta y las barras; por eso vive una sola
 * vez en el DOM, en un <svg> de tamaño cero.
 */
export default function PatronesDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {/* inicial — líneas diagonales */}
        <pattern
          id="patron-inicial"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="8" style={{ fill: "var(--sem-inicial)" }} />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--sem-superficie)"
            strokeWidth="2"
            opacity="0.5"
          />
        </pattern>

        {/* aportes — puntos */}
        <pattern
          id="patron-aportes"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" style={{ fill: "var(--sem-aportes)" }} />
          <circle
            cx="4"
            cy="4"
            r="1.6"
            fill="var(--sem-superficie)"
            opacity="0.6"
          />
        </pattern>

        {/* interes — rejilla */}
        <pattern
          id="patron-interes"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" style={{ fill: "var(--sem-interes)" }} />
          <path
            d="M0 0H8M0 0V8"
            stroke="var(--sem-superficie)"
            strokeWidth="1.5"
            opacity="0.45"
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
  );
}
