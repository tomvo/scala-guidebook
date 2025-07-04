import fetch from 'node-fetch';
import Papa from 'papaparse';
import fs from 'fs/promises';

// URL of the published Google Sheets CSV
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSn74tS8Vv1mDl9TGnzrh2Z8znZQmcqgPYkJBnpwrhMlypfae99w3WtVLlo1ywWrTju6jklsXcxxg0c/pub?gid=0&single=true&output=csv';

// Path to the .mdx file where you'll inject content
const TEMPLATE_FILE = './src/content/templates/where-to-eat.mdx';
const OUTPUT_FILE = './src/content/docs/guides/where-to-eat.mdx';

// Placeholder comment to replace (JSX-style MDX comment)
const PLACEHOLDER_REGEX = /%%RESTAURANT_LIST%%/;



async function generateRestaurantMarkdown() {
  const response = await fetch(CSV_URL);
  const csv = await response.text();
  const { data } = Papa.parse(csv, { header: true });

  return data.map(entry => {
    const name = entry.Name || 'Unnamed';
    const address = entry.Address || '';
    const url = entry.URL || '#';
    const price = entry.Price || '';
    const description = entry.Description || '';
    const notes = entry.Notes || '';

    return `## ${name}

<div class="flex justify-between gap-2">
  <a class="text-sm text-gray-500 cursor-pointer" href="${url}" target="_blank">${address}</a>
  <span class="rounded-full bg-gray-200 px-2 py-1 text-xs">${price}</span>
</div>

${description.trim()}

${notes.trim()}
`;
  }).join('\n');
}

async function injectIntoMdx() {
  const originalMdx = await fs.readFile(TEMPLATE_FILE, 'utf-8');
  const generatedContent = await generateRestaurantMarkdown();

  if (!PLACEHOLDER_REGEX.test(originalMdx)) {
    throw new Error(`❌ Placeholder {/** RESTAURANT_LIST */} not found in ${MDX_PATH}`);
  }

  const updatedMdx = originalMdx.replace(PLACEHOLDER_REGEX, generatedContent.trim());

  await fs.writeFile(OUTPUT_FILE, updatedMdx);
  console.log(`✅ Injected restaurant list into ${OUTPUT_FILE}`);
}

injectIntoMdx().catch(err => {
  console.error('❌ Error injecting restaurant list:', err);
});
