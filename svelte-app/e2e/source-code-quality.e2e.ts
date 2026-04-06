import { test, expect } from '@playwright/test';

test.describe('Source Code Quality Chart', () => {
	test('page loads with title and YAML editor', async ({ page }) => {
		await page.goto('/BurndownChart/source-code-quality/');
		await expect(page.locator('h1')).toContainText('Source Code Quality');
		await expect(page.locator('textarea')).toBeVisible();
	});

	test('radar chart canvas exists', async ({ page }) => {
		await page.goto('/BurndownChart/source-code-quality/');
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('update chart button works', async ({ page }) => {
		await page.goto('/BurndownChart/source-code-quality/');
		const btn = page.getByRole('button', { name: /Update Chart/i });
		await btn.click();
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('documentation section with copy button', async ({ page }) => {
		await page.goto('/BurndownChart/source-code-quality/');
		await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
		await expect(page.getByRole('button', { name: /Copy Documentation/i })).toBeVisible();
	});
});
