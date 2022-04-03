import type { SetupFn } from '../../types';

const setup: SetupFn = async ({ page }) => {
	await page.goto('/');

	return { page };
};

export default setup;
