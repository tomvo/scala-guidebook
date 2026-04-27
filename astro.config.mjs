// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://guide.agriturismoscala.com',
	redirects: {
		'/': '/welcome',
		'/de': '/de/welcome',
		'/it': '/it/welcome',
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
					label: 'Welcome',
					slug: 'welcome',
					translations: { it: 'Benvenuti', de: 'Willkommen' },
				},
				{
					label: 'Practical things to know',
					slug: 'practical-things-to-know',
					translations: { it: 'Cose pratiche da sapere', de: 'Praktisches zum Wissen' },
				},
				{
					label: 'At Agriturismo Scala',
					translations: { it: "All'Agriturismo Scala", de: 'Im Agriturismo Scala' },
					items: [
						{ label: 'Quick info', slug: 'agriturismo/quick-info', translations: { it: 'Informazioni rapide', de: 'Kurzinfo' } },
						{ label: 'The house', slug: 'agriturismo/the-house', translations: { it: 'La casa', de: 'Das Haus' } },
						{ label: 'Breakfast', slug: 'agriturismo/breakfast', translations: { it: 'Colazione', de: 'Frühstück' } },
						{ label: 'Comfort and climate', slug: 'agriturismo/comfort-and-climate', translations: { it: 'Comfort e clima', de: 'Komfort und Klima' } },
						{ label: 'Housekeeping & extras', slug: 'agriturismo/housekeeping-and-extras', translations: { it: 'Pulizie e servizi extra', de: 'Zimmerservice & Extras' } },
						{ label: 'Around the property', slug: 'agriturismo/around-the-property', translations: { it: 'Intorno alla proprietà', de: 'Auf dem Gelände' } },
						{ label: 'E-bikes', slug: 'agriturismo/e-bikes', translations: { it: 'E-bike', de: 'E-Bikes' } },
						{ label: 'Drinks & farm dinners', slug: 'agriturismo/drinks-and-farm-dinners', translations: { it: 'Drink e cene contadine', de: 'Getränke & Farm-Dinner' } },
						{ label: 'How we try to do things', slug: 'agriturismo/how-we-try-to-do-things', translations: { it: 'Come cerchiamo di fare le cose', de: 'Wie wir die Dinge angehen' } },
						{ label: 'Take a piece of Scala home', slug: 'agriturismo/take-a-piece-of-scala-home', translations: { it: 'Porta un pezzo di Scala a casa', de: 'Nimm ein Stück Scala mit nach Hause' } },
					],
				},
				{
					label: 'Exploring the area',
					translations: { it: 'Esplorare la zona', de: 'Die Umgebung erkunden' },
					items: [
						{
							label: 'At your doorstep (up to 20 minutes)',
							translations: { it: 'A un passo da te (fino a 20 minuti)', de: 'Direkt vor der Tür (bis 20 Minuten)' },
							items: [
								{ label: 'Potenza Picena', slug: 'exploring/at-your-doorstep/potenza-picena' },
								{ label: 'Montelupone', slug: 'exploring/at-your-doorstep/montelupone' },
								{ label: 'Porto Potenza Picena, nearest sandy beach', slug: 'exploring/at-your-doorstep/porto-potenza-picena', translations: { it: 'Porto Potenza Picena, la spiaggia sabbiosa più vicina', de: 'Porto Potenza Picena, der nächstgelegene Sandstrand' } },
								{ label: 'Porto Recanati, nearest pebble beach', slug: 'exploring/at-your-doorstep/porto-recanati', translations: { it: 'Porto Recanati, la spiaggia di ciottoli più vicina', de: 'Porto Recanati, der nächstgelegene Kiesstrand' } },
							],
						},
						{
							label: 'A short drive (20–45 minutes)',
							translations: { it: 'Un breve viaggio in auto (20–45 minuti)', de: 'Eine kurze Fahrt (20–45 Minuten)' },
							items: [
								{ label: 'Recanati', slug: 'exploring/short-drive/recanati' },
								{ label: 'Loreto', slug: 'exploring/short-drive/loreto' },
								{ label: 'Osimo', slug: 'exploring/short-drive/osimo' },
								{ label: 'Macerata', slug: 'exploring/short-drive/macerata' },
								{ label: 'Civitanova Marche', slug: 'exploring/short-drive/civitanova-marche' },
								{ label: 'Treia', slug: 'exploring/short-drive/treia' },
								{ label: 'Montecassiano', slug: 'exploring/short-drive/montecassiano' },
								{ label: 'Montecosaro', slug: 'exploring/short-drive/montecosaro' },
								{ label: 'Appignano', slug: 'exploring/short-drive/appignano' },
								{ label: 'Mogliano', slug: 'exploring/short-drive/mogliano' },
								{ label: 'Fermo', slug: 'exploring/short-drive/fermo' },
							],
						},
						{
							label: 'Day-trip distance (45 min – 1h30)',
							translations: { it: 'Distanza per una gita in giornata (45 min – 1h30)', de: 'Tagesausflugs-Distanz (45 Min. – 1h30)' },
							items: [
								{ label: 'The Conero coast, Sirolo, Numana & Portonovo', slug: 'exploring/day-trip/conero-coast', translations: { it: 'La costa del Conero, Sirolo, Numana e Portonovo', de: 'Die Conero-Küste, Sirolo, Numana & Portonovo' } },
								{ label: 'Cingoli', slug: 'exploring/day-trip/cingoli' },
								{ label: 'Ancona', slug: 'exploring/day-trip/ancona' },
								{ label: 'Jesi', slug: 'exploring/day-trip/jesi' },
								{ label: 'Filottrano', slug: 'exploring/day-trip/filottrano' },
								{ label: 'Frasassi Caves', slug: 'exploring/day-trip/frasassi-caves', translations: { it: 'Grotte di Frasassi', de: 'Frasassi-Höhlen' } },
								{ label: 'Sibillini Mountains National Park', slug: 'exploring/day-trip/sibillini', translations: { it: 'Parco Nazionale dei Monti Sibillini', de: 'Nationalpark Monti Sibillini' } },
							],
						},
						{
							label: 'A full day out (1h30+)',
							translations: { it: 'Una giornata intera fuori (1h30+)', de: 'Ein ganzer Tagesausflug (1h30+)' },
							items: [
								{ label: 'Urbino', slug: 'exploring/full-day/urbino' },
								{ label: 'Senigallia', slug: 'exploring/full-day/senigallia' },
								{ label: 'Porto San Giorgio & coast south', slug: 'exploring/full-day/porto-san-giorgio', translations: { it: 'Porto San Giorgio e costa sud', de: 'Porto San Giorgio & Südküste' } },
								{ label: 'Grottammare', slug: 'exploring/full-day/grottammare' },
								{ label: 'Ascoli Piceno', slug: 'exploring/full-day/ascoli-piceno' },
							],
						},
					],
				},
				{
					label: 'Best of',
					translations: { it: 'Il meglio di', de: 'Das Beste' },
					items: [
						{ label: 'Best beach for swimming', slug: 'best-of/beach-for-swimming', translations: { it: 'La miglior spiaggia per nuotare', de: 'Der beste Strand zum Schwimmen' } },
						{ label: 'Best gelato', slug: 'best-of/gelato', translations: { it: 'Il miglior gelato', de: 'Das beste Gelato' } },
						{ label: 'Best pizza', slug: 'best-of/pizza', translations: { it: 'La miglior pizza', de: 'Die beste Pizza' } },
						{ label: 'Best rainy-day plan', slug: 'best-of/rainy-day-plan', translations: { it: 'Il miglior piano per un giorno di pioggia', de: 'Der beste Plan für einen Regentag' } },
						{ label: 'Best view', slug: 'best-of/view', translations: { it: 'La migliore vista', de: 'Die beste Aussicht' } },
						{ label: 'Best long lunch or dinner', slug: 'best-of/long-lunch-or-dinner', translations: { it: 'Il miglior pranzo o cena lunga', de: 'Das beste lange Mittag- oder Abendessen' } },
						{ label: 'Best special-occasion dinner', slug: 'best-of/special-occasion-dinner', translations: { it: 'La miglior cena per occasioni speciali', de: 'Das beste Dinner für besondere Anlässe' } },
						{ label: 'Best market morning', slug: 'best-of/market-morning', translations: { it: 'La miglior mattina di mercato', de: 'Der beste Marktvormittag' } },
						{ label: 'Best hilltop borgo', slug: 'best-of/hilltop-borgo', translations: { it: 'Il miglior borgo in collina', de: 'Der beste Hügel-Borgo' } },
						{ label: 'Best short hike', slug: 'best-of/short-hike', translations: { it: 'La miglior escursione breve', de: 'Die beste kurze Wanderung' } },
					],
				},
				{
					label: 'Weekly markets',
					translations: { it: 'Mercati settimanali', de: 'Wochenmärkte' },
					items: [
						{ label: 'Thursday', slug: 'weekly-markets/thursday', translations: { it: 'Giovedì', de: 'Donnerstag' } },
						{ label: 'Wednesday', slug: 'weekly-markets/wednesday', translations: { it: 'Mercoledì', de: 'Mittwoch' } },
						{ label: 'Saturday', slug: 'weekly-markets/saturday', translations: { it: 'Sabato', de: 'Samstag' } },
					],
				},
				{
					label: 'Vintage & antiques markets (2026)',
					translations: { it: 'Mercati vintage e antiquariato (2026)', de: 'Vintage- und Antikmärkte (2026)' },
					items: [
						{ label: 'Year-round (closed July & August)', slug: 'vintage-markets/year-round', translations: { it: "Tutto l'anno (chiuso a luglio e agosto)", de: 'Ganzjährig (geschlossen im Juli & August)' } },
						{ label: 'Monthly, runs in summer too', slug: 'vintage-markets/monthly-summer-included', translations: { it: "Mensile, si tiene anche d'estate", de: 'Monatlich, auch im Sommer' } },
						{ label: 'Summer evenings only (July & August)', slug: 'vintage-markets/summer-evenings', translations: { it: "Solo sere d'estate (luglio e agosto)", de: 'Nur an Sommerabenden (Juli & August)' } },
					],
				},
				{
					label: 'Summer events',
					translations: { it: 'Eventi estivi', de: 'Sommerveranstaltungen' },
					items: [
						{ label: 'Macerata Opera Festival, Sferisterio', slug: 'summer-events/macerata-opera-festival' },
						{ label: 'Sferisterio Live+', slug: 'summer-events/sferisterio-live-plus' },
						{ label: 'Summer Jamboree, Senigallia', slug: 'summer-events/summer-jamboree' },
						{ label: 'Civitanova Danza', slug: 'summer-events/civitanova-danza' },
						{ label: 'Adriatico Mediterraneo Festival, Ancona', slug: 'summer-events/adriatico-mediterraneo' },
						{ label: 'Porto Recanati, Arena Gigli summer season', slug: 'summer-events/arena-gigli', translations: { it: 'Porto Recanati, stagione estiva Arena Gigli', de: 'Porto Recanati, Sommersaison Arena Gigli' } },
						{ label: 'Local sagre & village festivals', slug: 'summer-events/local-sagre', translations: { it: 'Sagre e feste di paese', de: 'Lokale Sagre & Dorffeste' } },
					],
				},
				{
					label: 'Restaurants, the full list',
					translations: { it: "Ristoranti, l'elenco completo", de: 'Restaurants, die vollständige Liste' },
					items: [
						{ label: 'At your doorstep, Potenza Picena', slug: 'restaurants/potenza-picena', translations: { it: 'A un passo da te, Potenza Picena', de: 'Direkt vor der Tür, Potenza Picena' } },
						{ label: 'Short drive, Macerata province', slug: 'restaurants/macerata-province', translations: { it: 'Breve viaggio in auto, provincia di Macerata', de: 'Kurze Fahrt, Provinz Macerata' } },
						{ label: 'Conero coast, Ancona province', slug: 'restaurants/conero-coast', translations: { it: 'Costa del Conero, provincia di Ancona', de: 'Conero-Küste, Provinz Ancona' } },
						{ label: 'Loreto', slug: 'restaurants/loreto' },
						{ label: 'Senigallia & north', slug: 'restaurants/senigallia-north', translations: { it: 'Senigallia e nord', de: 'Senigallia & Norden' } },
						{ label: 'Fermo province & south coast', slug: 'restaurants/fermo-south', translations: { it: 'Provincia di Fermo e costa sud', de: 'Provinz Fermo & Südküste' } },
						{ label: 'Sibillini', slug: 'restaurants/sibillini' },
					],
				},
			],
			customCss: [
				'./src/styles/global.css',
				'./src/fonts/font-face.css',
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
