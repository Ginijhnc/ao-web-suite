import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/**/*.d.ts',
				'**/*.config.ts',
				'src/main.tsx',
				'e2e/**',
			],
		},
	},
	resolve: {
		alias: {
			'@Components': path.resolve(__dirname, './src/components'),
			'@Pages': path.resolve(__dirname, './src/pages'),
			'@Utils': path.resolve(__dirname, './src/utils'),
			'@Hooks': path.resolve(__dirname, './src/hooks'),
			'@Helpers': path.resolve(__dirname, './src/helpers'),
			'@Types': path.resolve(__dirname, './src/types'),
			'@SharedStyles': path.resolve(__dirname, './src/styles'),
			'@Constants': path.resolve(__dirname, './src/constants'),
			'@Theme': path.resolve(__dirname, './src/theme'),
			'@Assets': path.resolve(__dirname, './src/assets'),
			'@Contexts': path.resolve(__dirname, './src/contexts'),
		},
	},
});
