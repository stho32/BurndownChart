import { test, expect } from '@playwright/test';

test.describe('Experiment 1 — Google Charts Burndown', () => {
	test('page loads with chart container', async ({ page }) => {
		await page.goto('/BurndownChart/experiment1/');
		await expect(page.locator('#chart')).toBeVisible();
	});

	test('event table renders 5 events', async ({ page }) => {
		await page.goto('/BurndownChart/experiment1/');
		const rows = page.locator('.event-table tbody tr');
		await expect(rows).toHaveCount(5);
	});

	test('event table has correct headers', async ({ page }) => {
		await page.goto('/BurndownChart/experiment1/');
		const headers = page.locator('.event-table th');
		await expect(headers).toHaveCount(4);
		await expect(headers.nth(0)).toHaveText('#');
		await expect(headers.nth(1)).toHaveText('Date');
		await expect(headers.nth(2)).toHaveText('Event');
		await expect(headers.nth(3)).toHaveText('Details');
	});
});
