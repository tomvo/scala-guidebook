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
	redirects: {
		'/': '/agriturismo/welcome',
		'/de': '/de/agriturismo/welcome',
		'/it': '/it/agriturismo/welcome',
	},
	integrations: [
		starlight({
			title: {
				en: 'Local Guide',
				it: 'Guida Locale',
				de: 'Lokaler Reiseführer',
			},
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				it: { label: 'Italiano', lang: 'it' },
				de: { label: 'Deutsch', lang: 'de' },
			},
			social: [{ icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/agriturismoscala/' }],
			logo: {
				src: './src/assets/logo-horizontal.svg',
				alt: 'Logo',
			},
			sidebar: [
				{
					label: 'Agriturismo Scala',
					items: [
						{ label: 'Welcome', slug: 'agriturismo/welcome', translations: { it: 'Benvenuti', de: 'Willkommen' } },
						{ label: 'Good to Know', slug: 'agriturismo/good-to-know', translations: { it: 'Buono a sapersi', de: 'Gut zu wissen' } },
						{ label: 'Food & Drinks', slug: 'agriturismo/food-and-drinks', translations: { it: 'Cibo e bevande', de: 'Essen & Trinken' } },
						{ label: 'Sustainability & Shop', slug: 'agriturismo/sustainability-and-shop', translations: { it: 'Sostenibilità e negozio', de: 'Nachhaltigkeit & Shop' } },
					],
				},
				{
					label: 'Guides',
					translations: { it: 'Guide', de: 'Reiseführer' },
					items: [
						{ label: 'Where to eat and drink', slug: 'guides/where-to-eat', translations: { it: 'Dove mangiare e bere', de: 'Wo man essen und trinken kann' } },
						{ label: 'Things to do', slug: 'guides/things-to-do', translations: { it: 'Cosa fare', de: 'Aktivitäten' } },
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
				'./src/components/GoogleMapsIsland.jsx',
				'./src/components/MapListings.jsx',
			],
			
		}),
		mdx(),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: { include: ['@react-google-maps/api', 'maplibre-gl'] },
	},
});
