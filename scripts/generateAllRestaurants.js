import fs from 'fs/promises';
import path from 'path';
import GithubSlugger from 'github-slugger';

// Order matches the sidebar grouping in astro.config.mjs.
const REGIONS = [
  {
    slug: 'potenza-picena',
    titles: {
      en: 'At your doorstep, Potenza Picena',
      de: 'Direkt vor der Tür, Potenza Picena',
      it: 'A un passo da te, Potenza Picena',
    },
  },
  {
    slug: 'macerata-province',
    titles: {
      en: 'Short drive, Macerata province',
      de: 'Kurze Fahrt, Provinz Macerata',
      it: 'Breve viaggio in auto, provincia di Macerata',
    },
  },
  {
    slug: 'conero-coast',
    titles: {
      en: 'Conero coast, Ancona province',
      de: 'Conero-Küste, Provinz Ancona',
      it: 'Costa del Conero, provincia di Ancona',
    },
  },
  {
    slug: 'loreto',
    titles: { en: 'Loreto', de: 'Loreto', it: 'Loreto' },
  },
  {
    slug: 'senigallia-north',
    titles: {
      en: 'Senigallia & north',
      de: 'Senigallia & Norden',
      it: 'Senigallia e nord',
    },
  },
  {
    slug: 'fermo-south',
    titles: {
      en: 'Fermo province & south coast',
      de: 'Provinz Fermo & Südküste',
      it: 'Provincia di Fermo e costa sud',
    },
  },
  {
    slug: 'sibillini',
    titles: { en: 'Sibillini', de: 'Sibillini', it: 'Sibillini' },
  },
];

const PAGE_META = {
  en: {
    title: 'All restaurants on one page',
    description: 'Every restaurant we recommend, on one map and one list, with a direct Google Maps link for each.',
    pageTitle: 'All restaurants on one page',
    intro:
      'A single, scrollable list of every restaurant we recommend, grouped by area. Tap *Open in Google Maps* on any entry to navigate straight there.',
    priceLegend:
      'Price bands: € budget · €€ casual · €€€ mid-range · €€€€ special occasion. (*) = Michelin stars.',
    jumpTo: 'Jump to an area',
  },
  de: {
    title: 'Alle Restaurants auf einer Seite',
    description: 'Alle empfohlenen Restaurants, auf einer Karte und in einer Liste, jeweils mit direktem Google-Maps-Link.',
    pageTitle: 'Alle Restaurants auf einer Seite',
    intro:
      'Eine einzige, scrollbare Liste aller von uns empfohlenen Restaurants, nach Gebiet gruppiert. Tippe bei einem Eintrag auf *Auf Google Maps öffnen*, um direkt dorthin zu navigieren.',
    priceLegend:
      'Preisklassen: € günstig · €€ locker · €€€ Mittelklasse · €€€€ besonderer Anlass. (*) = Michelin-Sterne.',
    jumpTo: 'Zu einem Gebiet springen',
  },
  it: {
    title: 'Tutti i ristoranti in una pagina',
    description: 'Tutti i ristoranti che consigliamo, su un’unica mappa ed elenco, con il link diretto a Google Maps per ciascuno.',
    pageTitle: 'Tutti i ristoranti in una pagina',
    intro:
      'Un unico elenco scorrevole di tutti i ristoranti che consigliamo, raggruppati per zona. Tocca *Apri su Google Maps* su qualsiasi voce per navigare direttamente.',
    priceLegend:
      'Fasce di prezzo: € economico · €€ informale · €€€ fascia media · €€€€ occasione speciale. (*) = stelle Michelin.',
    jumpTo: 'Vai a una zona',
  },
};

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOCS = path.join(ROOT, 'src/content/docs');

function regionDocsDir(lang) {
  return lang === 'en' ? path.join(DOCS, 'restaurants') : path.join(DOCS, lang, 'restaurants');
}

function outputPath(lang) {
  const base = lang === 'en' ? path.join(DOCS, 'restaurants') : path.join(DOCS, lang, 'restaurants');
  return path.join(base, 'all.mdx');
}

function importPathForAllPage(lang, target) {
  // 'all.mdx' lives at .../docs/restaurants/ (en) or .../docs/<lang>/restaurants/
  // Component target: src/components/RestaurantsAllMap.jsx
  // Data target: src/data/restaurantMap.json
  const fromAllPage = lang === 'en'
    ? path.join(DOCS, 'restaurants')
    : path.join(DOCS, lang, 'restaurants');
  return path.relative(fromAllPage, path.join(ROOT, target)).replaceAll(path.sep, '/');
}

// Use github-slugger so the anchors we generate match the heading IDs Astro
// emits via rehype-slug.
function makeSlugger() {
  return new GithubSlugger();
}

// Pull just the bullet block from a regional MDX file: everything starting at
// the first `- **` line through the last contiguous bullet line.
async function readBullets(lang, slug) {
  const file = path.join(regionDocsDir(lang), `${slug}.mdx`);
  const raw = await fs.readFile(file, 'utf-8');
  const lines = raw.split('\n');
  const bullets = [];
  let inBullets = false;
  for (const line of lines) {
    const isBullet = /^- \*\*/.test(line);
    if (isBullet) {
      inBullets = true;
      bullets.push(line);
    } else if (inBullets && line.trim() === '') {
      // Allow blank lines between bullets but stop at a non-bullet content line.
      bullets.push(line);
    } else if (inBullets) {
      // First non-bullet, non-blank line after bullets started → end of block.
      break;
    }
  }
  // Trim trailing blanks.
  while (bullets.length && bullets[bullets.length - 1].trim() === '') bullets.pop();
  return bullets.join('\n');
}

async function buildPage(lang) {
  const meta = PAGE_META[lang];
  const componentImport = importPathForAllPage(lang, 'src/components/RestaurantsMap.jsx');
  const dataImport = importPathForAllPage(lang, 'src/data/restaurantMap.json');

  const slugger = makeSlugger();
  const sections = [];
  const tocItems = [];
  for (const region of REGIONS) {
    const heading = region.titles[lang];
    const anchor = slugger.slug(heading);
    tocItems.push(`- [${heading}](#${anchor})`);
    const bullets = await readBullets(lang, region.slug);
    sections.push(`## ${heading}\n\n${bullets}`);
  }

  const content = `---
title: "${meta.title.replace(/"/g, '\\"')}"
description: ${JSON.stringify(meta.description)}
---

import RestaurantsMap from '${componentImport}';
import mapData from '${dataImport}';

${meta.intro}

<RestaurantsMap client:only="react" places={Object.values(mapData).flat()} />

${meta.priceLegend}

### ${meta.jumpTo}

${tocItems.join('\n')}

${sections.join('\n\n')}
`;

  return content;
}

async function main() {
  for (const lang of ['en', 'de', 'it']) {
    const content = await buildPage(lang);
    const out = outputPath(lang);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, content);
    console.log(`✅ Wrote ${path.relative(ROOT, out)}`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
