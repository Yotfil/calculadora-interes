# 06 — Métricas y analítica

## 1. Métricas para el usuario (viven en `core`, con tests)

| Métrica                        | Fórmula exacta                                                                                                                         | Dónde                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Total aportado                 | capitalInicial + Σ aportes                                                                                                             | leyenda torta, frase                              |
| Interés total                  | balanceFinal − totalAportado                                                                                                           | torta, frase                                      |
| Multiplicador                  | balanceFinal / totalAportado (1 decimal)                                                                                               | frase resumen                                     |
| **Ahorro del plan escalonado** | Fijo equivalente F = (balanceFinal_escalonado − FV(solo capital)) / FV(aporte 1 todos los meses); Ahorro = F·M − Σ aportes escalonados | resultados Avanzada (solo con impulso aplicado)   |
| **Costo de la protección**     | calcular(sin protección).balanceFinal − calcular(con protección).balanceFinal                                                          | resultados Experto (solo con protección aplicada) |
| Banda de varianza              | balanceFinal con tasa ± v (docs/02 §8)                                                                                                 | Experto                                           |

Definición del "fijo equivalente": el aporte mensual constante que alcanza el
**mismo balance final** que el plan escalonado (manzanas con manzanas). No es
el aporte que alcanza la meta — esa es otra cifra (docs/03 §1).

### Casos de prueba (sobre E1 canónico, m=12, 10 %)

| Caso                 | Salida                               |
| -------------------- | ------------------------------------ |
| K1 fijo equivalente  | F = **668,06** /mes                  |
| K2 ahorro escalonado | 668,06·300 − 160 800 = **39 616,90** |
| K3 costo protección  | **137 928,15** (= G2)                |
| K4 multiplicador     | 1 006 968,93 / 170 800 = **5,9**     |
| K5 interés total     | **836 168,93**                       |

Nota de contrato: durante el diseño circuló un ahorro de "≈ 65 700" comparando
contra un plan fijo de 755/mes que NO era equivalente (llega a ~1,12 M, no al
mismo balance). Con la definición correcta el ahorro es 39 616,90. La tabla manda.

## 2. Analítica del producto

- **Google Search Console** (imprescindible: SEO es el objetivo clave):
  alta tras primer deploy, sitemap enviado, monitoreo por idioma.
- **GA4** — exactamente 4 eventos, ni uno más:

| Evento               | Parámetros                                            | Pregunta que responde       |
| -------------------- | ----------------------------------------------------- | --------------------------- |
| `calcular`           | `tab` (b/a/e), `con_impulso`, `con_proteccion` (bool) | ¿Se usa? ¿Suben de nivel?   |
| `modo_meta_activado` | `tab`                                                 | ¿El diferencial se usa?     |
| `toggle_inflacion`   | —                                                     | ¿Interesa el valor real?    |
| `compartir`          | `tab`                                                 | ¿Hay distribución orgánica? |

- Implementación detrás de `src/analytics/track(evento, params)`; si
  `PUBLIC_GA4_ID` está vacío, `track` es no-op (dev y tests sin ruido).
- Sin funnels, sin heatmaps, sin cookies adicionales. Revisar aviso de
  cookies/consentimiento según lo exija GA4 en la configuración elegida
  (pendiente humano en README).

## 3. SEO on-page (checklist del módulo M7)

- `<title>` y `meta description` por idioma, con la keyword natural
  ("calculadora de interés compuesto" / "compound interest calculator").
- `hreflang` recíproco entre `/es/` y `/en/` + `x-default` → `/en/`
  (mayor volumen de búsqueda); canonical absoluto por página.
- HTML semántico: el copy educativo de campos y una sección de preguntas
  frecuentes al pie (contenido de docs/07 §5) renderizados en el HTML estático
  — es lo que indexa.
- `schema.org`: `WebApplication` + `FAQPage` (JSON-LD) por idioma.
- sitemap.xml generado en build; robots.txt.
- Presupuesto de rendimiento: JS de la isla < 200 KB gzip (Recharts incluido);
  fuentes subset; imágenes ninguna en el crítico. Core Web Vitals verdes es
  parte de la definición de "hecho" del M7.
