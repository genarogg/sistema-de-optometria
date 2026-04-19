// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	server: {
		host: '0.0.0.0',
		allowedHosts: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		starlight({
			title: 'My Docs',
			customCss: ['./src/styles/global.css'],
			plugins: [
				starlightThemeNova(),
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
