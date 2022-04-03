import type { Page } from '@playwright/test';
import type { CTXConsumer } from '../../types';

import { expect } from '@playwright/test';

const stateDisplay = (page: Page) => page.locator('[data-test-id=state-display]');

const checks: CTXConsumer = {
	'crying': async ({ page }) => {
		const state = stateDisplay(page);
		expect(await state.innerHTML()).toBe('crying');
	},

	'suckingBinky': async ({ page }) => {
		const state = stateDisplay(page);
		expect(await state.innerHTML()).toBe('suckingBinky');
	},

	'drinking': async ({ page }) => {
		const state = stateDisplay(page);
		expect(await state.innerHTML()).toBe('drinking');
	},

	'sleeping': async ({ page }) => {
		const state = stateDisplay(page);
		expect(await state.innerHTML()).toBe('sleeping');
	},
};

export default checks;
