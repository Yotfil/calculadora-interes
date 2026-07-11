import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('la home carga y el footer muestra la versión de package.json', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('version')).toContainText(`v${version}`);
});

test('el footer con versión es visible en mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await expect(page.getByTestId('version')).toBeVisible();
});
