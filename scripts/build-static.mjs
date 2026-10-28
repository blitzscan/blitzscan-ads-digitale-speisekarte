/**
 * Baut die Landingpage für das WordPress-Hosting.
 *
 *   npm run build:static
 *
 * Danach enthält dist/ genau die Dateien, die per FTP nach
 * blitzscan.de/reservierungssystem/ hochgeladen werden – nichts mehr und nichts
 * weniger. Der normale `npm run build` bleibt unangetastet, damit der Build
 * bei Lovable weiter gegen Nitro/Cloudflare läuft.
 *
 * Der Umweg über einen Zwischenordner ist nötig, weil Vite selbst nach dist/
 * schreibt (dist/client für die Seite, dist/server für den ungenutzten
 * SSR-Teil): erst bauen, dann die Upload-Struktur daneben aufbauen und zum
 * Schluss dist/ durch sie ersetzen.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * Ordner auf dem Server. Standard "reservierungssystem"; anderer Name per
 * Argument: `npm run build:static -- reservations`. Die Vite-Konfiguration
 * bekommt ihn über DEPLOY_DIR und schreibt ihn in alle Dateipfade.
 */
const ROUTE_DIR = process.argv[2] ?? process.env.DEPLOY_DIR ?? "reservierungssystem";

if (!/^[A-Za-z0-9_-]+$/.test(ROUTE_DIR)) {
  console.error(`Ungültiger Ordnername "${ROUTE_DIR}" – erlaubt sind Buchstaben, Ziffern, - und _.`);
  process.exit(1);
}

const dist = join(root, "dist");
const staging = join(root, "dist-upload");

/**
 * robots.txt wirkt nur im Wurzelverzeichnis einer Domain; in einem Unterordner
 * liest sie kein Suchdienst. Für blitzscan.de gilt die Datei im
 * WordPress-Wurzelverzeichnis, deshalb gehört diese hier nicht mit hoch.
 */
const SKIP = new Set(["robots.txt"]);

/**
 * Damit Apache Unterseiten wie /reservierungssystem/danke ausliefert und ein
 * direkter Aufruf nicht auf einer 404-Seite von WordPress landet.
 * Vorbild ist die .htaccess der Hauptseite unter /home/.
 */
const HTACCESS = `DirectoryIndex index.html
RewriteEngine On
RewriteBase /${ROUTE_DIR}/
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
`;

rmSync(dist, { recursive: true, force: true });
rmSync(staging, { recursive: true, force: true });

// Vite direkt über Node starten statt über npx: das spart die Shell und
// funktioniert unter Windows wie unter Linux gleich.
const build = spawnSync(process.execPath, [join(root, "node_modules", "vite", "bin", "vite.js"), "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, BUILD_STATIC: "1", DEPLOY_DIR: ROUTE_DIR },
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const client = join(dist, "client");

// Ohne index.html gäbe es nichts hochzuladen – dann lieber hier abbrechen als
// einen leeren Ordner auf den Server schieben.
if (!existsSync(join(client, "index.html"))) {
  console.error(
    `\nFehler: ${join("dist", "client", "index.html")} fehlt.\n` +
      "Der Prerender hat die Seite nicht erzeugt – bitte die Ausgabe oben prüfen.",
  );
  process.exit(1);
}

mkdirSync(staging, { recursive: true });

for (const entry of readdirSync(client)) {
  if (SKIP.has(entry)) continue;
  cpSync(join(client, entry), join(staging, entry), { recursive: true });
}

writeFileSync(join(staging, ".htaccess"), HTACCESS);

rmSync(dist, { recursive: true, force: true });
renameSync(staging, dist);

console.log(
  `\nFertig. Der Inhalt von dist/ gehört nach blitzscan.de/${ROUTE_DIR}/\n` +
    `Enthalten: ${readdirSync(dist).join(", ")}\n`,
);
