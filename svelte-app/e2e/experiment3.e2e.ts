import { test, expect } from '@playwright/test';

test.describe('Experiment 3 — Burndown Chart Generator', () => {
	test('page loads with title and textarea', async ({ page }) => {
		await page.goto('/BurndownChart/experiment3/');
		await expect(page.locator('h1')).toContainText('Burndown Chart Generator');
		await expect(page.locator('textarea')).toBeVisible();
	});

	test('chart canvas renders on load', async ({ page }) => {
		await page.goto('/BurndownChart/experiment3/');
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('throughput table has data rows', async ({ page }) => {
		await page.goto('/BurndownChart/experiment3/');
		// Wait for chart to render and table to populate
		await page.waitForTimeout(500);
		const rows = page.locator('table tbody tr');
		await expect(rows.first()).toBeVisible();
	});

	test('shows error for invalid input', async ({ page }) => {
		await page.goto('/BurndownChart/experiment3/');
		const textarea = page.locator('textarea');
		await textarea.fill('invalid data');
		await page.waitForTimeout(300);
		const errorMsg = page.locator('.text-danger, [class*="error"]');
		await expect(errorMsg).toBeVisible();
	});
});
