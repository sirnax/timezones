import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function waitForMap(page: Page) {
  await page.goto('/');
  // Map markers are rendered once the topojson has loaded and the container is measured
  await expect(page.locator('svg [role="group"][aria-label="Capital cities"] [role="button"]').first())
    .toBeVisible({ timeout: 15_000 });
}

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
}

test.describe('accessibility (WCAG 2.1 AA)', () => {
  test('initial load has no violations', async ({ page }) => {
    await waitForMap(page);
    await expectNoViolations(page);
  });

  test('search dropdown open has no violations', async ({ page }) => {
    await waitForMap(page);
    const search = page.getByRole('combobox', { name: 'Search cities' });
    await search.fill('lon');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expectNoViolations(page);
  });

  test('sidebar with a favourite added has no violations', async ({ page }) => {
    await waitForMap(page);
    const search = page.getByRole('combobox', { name: 'Search cities' });
    await search.fill('london');
    await page.getByRole('option').first().click();
    await expect(page.getByRole('complementary', { name: 'Favourites' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove London' })).toBeVisible();
    await expectNoViolations(page);
  });

  test('map markers are keyboard operable', async ({ page }) => {
    await waitForMap(page);
    const markers = page.locator('svg [role="group"][aria-label="Capital cities"] [role="button"]');
    const first = markers.locator('nth=0');
    await first.focus();
    await expect(first).toBeFocused();

    // Arrow key moves the roving tab stop
    await page.keyboard.press('ArrowRight');
    const second = markers.locator('nth=1');
    await expect(second).toBeFocused();

    // Enter toggles favourite (aria-pressed flips)
    await expect(second).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-pressed', 'false');
  });

  test('mobile drawer has no violations', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await waitForMap(page);
    await page.getByRole('button', { name: 'Favourites' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectNoViolations(page);
  });
});
