import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "wxt";

export default defineConfig({
  webExt: {
    startUrls: [ "https://play.autodarts.io/" ],
  },
  modules: [ "@wxt-dev/webextension-polyfill" ],
  imports: {
    presets: [],
    addons: {},
  },
  manifest: {
    host_permissions: [
      "*://play.autodarts.io/*",
      "https://autodarts-liga.de/*",
    ],
    permissions: [
      "storage",
    ],
    background: {
      service_worker: "background.js",
      type: "module",
      persistent: false,
    },
    name: "autodarts-liga.de",
    description: "Sendet Autodarts-Spieldaten an autodarts-liga.de",
    icons: {
      16: "icon/icon.png",
      48: "icon/icon.png",
      128: "icon/icon.png",
    },
    web_accessible_resources: [
      {
        resources: [ "websocket-capture.js" ],
        matches: [ "*://play.autodarts.io/*" ],
      },
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
    },
    browser_specific_settings: {
      gecko: {
        data_collection_permissions: {
          required: [ "none" ],
          optional: [],
        },
      } as any,
    } as any,
  },
  vite: () => ({
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./", import.meta.url)),
        "~": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  }),
});

