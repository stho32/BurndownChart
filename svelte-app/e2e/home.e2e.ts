import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('renders title and subtitle', async ({ page }) => {
		await page.goto('/BurndownChart/');
		await expect(page.locator('h1')).toHaveText('BurndownChart');
		await expect(page.locator('.subtitle')).toBeVisible();
	});

	test('shows all 7 app cards', async ({ page }) => {
		await page.goto('/BurndownChart/');
		const cards = page.locator('.card');
		await expect(cards).toHaveCount(7);
	});

	test('navigation has all links', async ({ page }) => {
		await page.goto('/BurndownChart/');
		const nav = page.locator('nav');
		await expect(nav.locator('a')).toHaveCount(9); // logo + 8 nav items
	});

	test('clicking a card navigates to the app', async ({ page }) => {
		await page.goto('/BurndownChart/');
		await page.locator('.card', { hasText: 'Experiment 2' }).click();
		await expect(page).toHaveURL(/experiment2/);
	});
});
