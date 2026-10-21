import { defineConfig, devices } from '@playwright/test';
import os from 'os';

export default defineConfig({
	testDir: './e2e',
	timeout: 30000,
	expect: {
		timeout: 10000,
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 1,
	// Use 1 worker in CI for stability, and a quarter of the available CPU cores locally
	workers: process.env.CI
		? 1
		: Math.max(1, Math.floor(os.cpus().length / 4)),
	reporter: 'html',
	use: {
		viewport: { width: 1920, height: 1080 },
		headless: true,
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
	},
});
