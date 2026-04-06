import { test, expect } from '@playwright/test';

test.describe('PPP Chart — Project Quality', () => {
	test('page loads with title and YAML editor', async ({ page }) => {
		await page.goto('/BurndownChart/pppchart/');
		await expect(page.locator('h1')).toContainText('Project Quality');
		await expect(page.locator('textarea')).toBeVisible();
	});

	test('radar chart canvas exists', async ({ page }) => {
		await page.goto('/BurndownChart/pppchart/');
		await expect(page.locator('canvas')).toBeVisible();
	});

	test('documentation section exists', async ({ page }) => {
		await page.goto('/BurndownChart/pppchart/');
		await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
	});

	test('language toggle buttons exist', async ({ page }) => {
		await page.goto('/BurndownChart/pppchart/');
		await expect(page.getByText(/Switch to German/i)).toBeVisible();
	});

	test('update chart button works', async ({ page }) => {
		await page.goto('/BurndownChart/pppchart/');
		const btn = page.getByRole('button', { name: /Update Chart/i });
		await expect(btn).toBeVisible();
		await btn.click();
		// Chart should still be visible after update
		await expect(page.locator('canvas')).toBeVisible();
	});
});
