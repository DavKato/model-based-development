import type { Page } from '@playwright/test';
import type { CTXConsumer } from '../../types';

const btn = (page: Page, eventName: string) => page.locator(`[data-test-id=events-container] button:has-text("${eventName}")`);

const events: CTXConsumer = {
	handBinky: async ({ page }) => {
		await btn(page, 'handBinky').click();
	},
	takeItAway: async ({ page }) => {
		await btn(page, 'takeItAway').click();
	},
	feed: async ({ page }) => {
		await btn(page, 'feed').click();
	},
	threeSecPassed: async ({ page }) => {
		await page.waitForTimeout(3000);
	},
	putToSleep: async ({ page }) => {
		await btn(page, 'putToSleep').click();
	},
	awaken: async ({ page }) => {
		await btn(page, 'awaken').click();
	}
}

export default events;
