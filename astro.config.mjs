// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react'; 
import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';

// https://astro.build/config
export default defineConfig({
	site: 'https://guide.agriturismoscala.com',
	integrations: [
		starlight({
			title: 'Local Guide',
			social: [{ icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/agriturismoscala/' }],
			logo: {
				src: './src/assets/logo-horizontal.svg',
				alt: 'Logo',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Where to eat and drink', slug: 'guides/where-to-eat' },
						{ label: 'Things to do', slug: 'guides/things-to-do' },
					],
				}
			],
			customCss: [
				'./src/styles/global.css',
				'./src/fonts/font-face.css',
			],
		}),
		AutoImport({
			imports: [
				// Add your Note component to the auto-imports:
				'./src/components/GoogleMapsIsland.jsx',
			],
			
		}),
		mdx(),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: { include: ['@react-google-maps/api'] },
	},
});
