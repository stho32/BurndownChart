import { test, expect } from '@playwright/test';

test.describe('Priohelper', () => {
	test('prio page loads with form and chart', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/');
		await expect(page.locator('h1')).toContainText('Priorisierungshelfer');
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('prio page has all select inputs', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/');
		const selects = page.locator('select');
		await expect(selects).toHaveCount(7);
	});

	test('prio page has goal checkboxes', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/');
		const checkboxes = page.locator('input[type="checkbox"]');
		await expect(checkboxes).toHaveCount(4);
	});

	test('prio page shows priority value', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/');
		await expect(page.getByText(/Die Priorität beträgt:/)).toBeVisible();
	});

	test('entwicklungsbedarf page loads', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/entwicklungsbedarf/');
		await expect(page.locator('h1')).toContainText('Entwicklungsbedarf');
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('entwicklungsbedarf has range slider', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/entwicklungsbedarf/');
		await expect(page.locator('input[type="range"]')).toBeVisible();
	});

	test('test links page loads with test links', async ({ page }) => {
		await page.goto('/BurndownChart/priohelper/test/');
		await expect(page.locator('h1')).toContainText('Test Links');
		const links = page.locator('main a[href*="priohelper/?"]');
		const count = await links.count();
		expect(count).toBeGreaterThanOrEqual(10);
	});
});
