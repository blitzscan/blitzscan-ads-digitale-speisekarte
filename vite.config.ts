// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Zielordner auf dem WordPress-Server, z. B. blitzscan.de/digitale-speisekarte/
 *
 * Steht in der Umgebungsvariable DEPLOY_DIR, die `npm run build:static` setzt
 * (siehe scripts/build-static.mjs und DEPLOY.md). Alle Dateipfade der fertigen
 * Seite beginnen mit diesem Ordner – liegt die Seite auf dem Server woanders,
 * lädt sie weder CSS noch Skripte.
 */
const DEPLOY_PATH = `/${process.env["DEPLOY_DIR"] ?? "digitale-speisekarte"}/`;

/**
 * `npm run build:static` setzt BUILD_STATIC=1 und baut die Seite für das
 * eigene Hosting: ohne Nitro-Server, dafür als fertig gerenderte HTML-Dateien,
 * die sich per FTP hochladen lassen.
 *
 * Ohne die Variable bleibt alles unverändert – `npm run build` und der Build
 * bei Lovable laufen weiter wie zuvor gegen Nitro/Cloudflare.
 */
const staticExport = process.env["BUILD_STATIC"] === "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(staticExport
      ? {
          // Die Seiten, die als HTML vorgerendert werden. Angegeben wird der
          // Routenpfad, nicht die spätere Adresse: DEPLOY_PATH steht schon als
          // base davor.
          pages: [
            { path: "/" },
            { path: "/danke" },
            { path: "/impressum" },
            { path: "/datenschutz" },
          ],
          prerender: { enabled: true, autoSubfolderIndex: true, crawlLinks: false },
          sitemap: { enabled: false },
        }
      : {}),
  },
  ...(staticExport
    ? {
        // Nitro würde einen Cloudflare-Worker bauen; auf dem WordPress-Hosting
        // läuft aber kein Node. Ohne Nitro schreibt der Prerender die Seiten
        // direkt als HTML nach dist/client.
        nitro: false as const,
        vite: { base: DEPLOY_PATH },
      }
    : {}),
});
