import type { Page } from "@playwright/test";

/**
 * Navega a una ruta con la isla y espera su hidratación antes de devolver.
 * Una interacción (fill/click) previa a la hidratación se pierde: React monta
 * y re-renderiza su estado inicial, produciendo fallos fantasma intermitentes
 * en la suite completa (ESTADO). `data-hidratada` la pone la isla en su primer
 * efecto de cliente; esperarla hace la interacción determinista.
 */
export async function abrir(page: Page, ruta: string): Promise<void> {
  await page.goto(ruta);
  await page.locator('[data-testid="calculadora"][data-hidratada]').waitFor();
}
