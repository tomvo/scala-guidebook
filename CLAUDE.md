# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A local guidebook website for Agriturismo Scala (guide.agriturismoscala.com), built with Astro Starlight and TinaCMS. It provides guests with curated guides on restaurants, activities, and beaches in the area.

## Commands

- `npm run dev` — Start dev server with TinaCMS at localhost:4321 (runs `tinacms dev -c "astro dev"`)
- `npm run build` — Production build to `./dist/`
- `npm run generate:restaurants` — Regenerate the restaurant list from a Google Sheets CSV into `where-to-eat.mdx`

## Architecture

- **Astro Starlight** with Tailwind CSS v4 for the documentation site framework
- **TinaCMS** provides a visual editor; config is in `tina/config.ts` with collections for docs, locations, and an about page
- **React** is used for interactive islands (Google Maps components)

### Localization

All content must be provided in three languages: English (EN), German (DE), and Italian (IT). When adding or updating any content entry, always create or update the corresponding versions in all three languages.

### Content Flow

- Guide pages live in `src/content/docs/guides/` as `.mdx` files
- The restaurant guide (`where-to-eat.mdx`) is generated from a template at `src/content/templates/where-to-eat.mdx` — the `%%RESTAURANT_LIST%%` placeholder gets replaced with data fetched from a Google Sheets CSV via `scripts/generateMarkdown.js`
- Sidebar navigation is manually configured in `astro.config.mjs`

### Components

- `src/components/GoogleMapsIsland.jsx` — React island for embedded Google Maps, auto-imported into MDX
- `src/components/GoogleMapField.jsx` — Custom TinaCMS field for picking map coordinates in the editor
- `src/components/MarkdownRenderer.astro` — Renders markdown content

### Environment Variables

TinaCMS requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` (from tina.io) for cloud editing.
