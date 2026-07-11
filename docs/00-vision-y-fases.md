# 00 — Visión y fases

## Qué es

Una calculadora de interés compuesto web, gratuita, sin registro, en español e
inglés, con tres niveles de profundidad en tabs:

- **Básica**: capital inicial + aporte mensual + tiempo + tasa + frecuencia de
  capitalización, en formulario por pasos con copy educativo (patrón Investor.gov
  sobre estructura de tabs de Fical).
- **Avanzada**: + "Impulso inicial" (aportes mayores los primeros 1–5 años),
  con la métrica de cuánto se ahorra en aportes frente a un plan fijo equivalente.
- **Experto**: + "Protección final" (glide path: la rentabilidad baja en escalera
  automática los últimos 1–5 años) + varianza de tasa (escenarios ±), con la
  métrica del costo de la protección.

Transversales: modo meta (la app despeja el aporte de régimen para llegar a un
monto objetivo), toggle "ver en dinero de hoy" (inflación USA, default 3 %),
y compartir escenario por URL.

## Para quién y por qué gana

Persona que planifica ahorro/inversión de largo plazo y llega desde un buscador.
Las referencias del mercado (Investor.gov, Fical, JaviLinares) hacen bien UNA
cosa cada una; este producto combina las tres y agrega lo que ninguna tiene:
aportes escalonados, glide path con interpolación automática, costo visible de
la protección y modo meta integrado.

## Principios de producto

1. El valor se obtiene en la primera visita, sin fricción: sin login, sin
   guardar nada, defaults sensatos, botón "Ver un ejemplo".
2. La complejidad es opt-in: cada tab agrega secciones colapsadas; nada se
   reordena al cambiar de nivel.
3. El copy educa (cada campo lleva su línea); los casos raros tienen frase
   propia especificada, no mensajes genéricos.
4. Honestidad financiera: convención de tasa explícita, inflación visible,
   costo de proteger capital mostrado sin adornos.
5. Cero costo de operación: sitio estático, sin APIs pagas, sin servidor.

## Fases

| Fase | Alcance | Release |
|---|---|---|
| 1 | Motor núcleo + tab Básica completa + resultados con gráficos + i18n + SEO + deploy | 1.0.0 |
| 2 | Escalonado + glide path + métricas derivadas + tabs Avanzada y Experto | 1.1.0 |
| 3 | Modo meta + toggle inflación + compartir URL | 1.2.0 |

Los módulos concretos de cada fase viven SOLO en `docs/ESTADO.md`.

## Fuera de alcance (candidatos post-Fase 3, no comprometidos)

- Multi-moneda y multi-inflación por país (diseño ya preparado: `formatMoney`
  y config de inflación por país como puntos únicos de cambio).
- Despejar duración o tasa en modo meta (requiere solver numérico).
- Meta expresada "en dinero de hoy".
- Tasa por tramos personalizada (año a año manual).
- Aportes negativos / retiros.
- Más idiomas (solo agregar diccionarios).
- Guardar/comparar escenarios con cuenta (decisión cerrada en contra para este
  producto; si la visión cambia, re-abrir con puerto `ScenarioRepository`).
