import { test, expect } from '@playwright/test';

test.describe('Task Burndown Simulator', () => {
	test('page loads with inputs and calculate button', async ({ page }) => {
		await page.goto('/BurndownChart/task-burndown-simulator/');
		await expect(page.locator('h1')).toContainText('Task Burndown Simulator');
		await expect(page.locator('textarea')).toBeVisible();
		await expect(page.locator('input[type="number"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /Calculate/i })).toBeVisible();
	});

	test('simulation runs and shows results', async ({ page }) => {
		await page.goto('/BurndownChart/task-burndown-simulator/');
		await page.getByRole('button', { name: /Calculate/i }).click();

		// Wait for simulation to complete and canvas to appear
		await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30000 });
	});

	test('textarea has default CSV data', async ({ page }) => {
		await page.goto('/BurndownChart/task-burndown-simulator/');
		const textarea = page.locator('textarea');
		await expect(textarea).toHaveValue(/-1.*0.*-1/);
	});
});
