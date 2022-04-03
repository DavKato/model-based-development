import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	retries: 0,
	timeout: 15000,
	webServer: {
		command: 'pnpm dev',
		port: 3000,
	},
	use: {
		launchOptions: {
			args: ['--disable-web-security'],
		},
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
};
export default config;
