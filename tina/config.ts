import { defineConfig } from "tinacms";
import GoogleMapField from "../src/components/GoogleMapField";
import GoogleMapsIsland from "../src/components/GoogleMapsIsland";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  ui: {
    components: {
      GoogleMapsIsland, // map the template to your React component
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      // --- new docs collection for Starlight pages ---
      {
        name: "docs",
        label: "Documentation",
        path: "src/content/docs",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
            templates: [
              {
                name: 'GoogleMapsIsland',
                label: 'Google Map',
                fields: [
                  { type: 'number', name: 'latitude', label: 'Latitude' },
                  { type: 'number', name: 'longitude', label: 'Longitude' },
                  { type: 'number', name: 'zoom', label: 'Zoom' },
                  { type: 'string', name: 'height', label: 'Height', required: false },
                  {
                    type: 'boolean',
                    name: 'client_load',
                    nameOverride: 'client:load',
                    label: ' ',
                    defaultValue: true,
                    ui: { hidden: true },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'locations',
        label: 'Locations',
        path: 'src/content/locations',
        format: 'mdx',
        fields: [
          { type: 'string', name: 'title', label: 'Title' },
          {
            type: 'object',
            name: 'coords',
            label: 'Map Coordinates',
            ui: { component: GoogleMapField },
            fields: [
              { type: 'number', name: 'lat', label: 'Latitude' },
              { type: 'number', name: 'lng', label: 'Longitude' },
              { type: 'number', name: 'zoom', label: 'Zoom', required: false },
            ],
          },
        ],
      },
      // --- single-page collection for "About" ---
      {
        name: "about",
        label: "About Page",
        path: "src/content",
        format: "md",
        match: {
          include: "about.md",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          { type: "rich-text", name: "body", label: "Content", isBody: true },
        ],
      },
    ],
  },
});
