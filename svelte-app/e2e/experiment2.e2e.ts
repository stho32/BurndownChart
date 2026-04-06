import { test, expect } from '@playwright/test';

test.describe('Experiment 2 — Chart.js Burndown', () => {
	test('page loads with title', async ({ page }) => {
		await page.goto('/BurndownChart/experiment2/');
		await expect(page.locator('h1')).toHaveText('My Study Progress');
	});

	test('canvas element exists for chart', async ({ page }) => {
		await page.goto('/BurndownChart/experiment2/');
		await expect(page.locator('canvas')).toBeVisible();
	});
});
