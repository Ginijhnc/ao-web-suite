import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [
					[
						'babel-plugin-react-compiler',
						{
							target: '19',
							sources: [
								path.resolve(import.meta.dirname, 'src'),
							],
							environment: {
								enableResetCacheOnSourceFileChanges: true,
							},
						},
					],
				],
			},
		} as never),
	],
	resolve: {
		alias: {
			'@Components': path.resolve(
				import.meta.dirname,
				'./src/components',
			),
			'@Pages': path.resolve(import.meta.dirname, './src/pages'),
			'@Utils': path.resolve(import.meta.dirname, './src/utils'),
			'@Hooks': path.resolve(import.meta.dirname, './src/hooks'),
			'@Helpers': path.resolve(import.meta.dirname, './src/helpers'),
			'@Types': path.resolve(import.meta.dirname, './src/types'),
			'@SharedStyles': path.resolve(
				import.meta.dirname,
				'./src/styles',
			),
			'@Constants': path.resolve(
				import.meta.dirname,
				'./src/constants',
			),
			'@Theme': path.resolve(import.meta.dirname, './src/theme'),
			'@Assets': path.resolve(import.meta.dirname, './src/assets'),
			'@Contexts': path.resolve(
				import.meta.dirname,
				'./src/contexts',
			),
		},
	},
	build: {
		target: 'esnext',
		sourcemap: false,
	},
	server: {
		port: 5173,
		open: true,
	},
});
