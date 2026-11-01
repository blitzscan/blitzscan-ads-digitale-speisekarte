/**
 * Baut die Landingpage für das WordPress-Hosting.
 *
 *   npm run build:static
 *
 * Danach enthält dist/ genau die Dateien, die per FTP nach
 * blitzscan.de/digitale-speisekarte/ hochgeladen werden – nichts mehr und nichts
 * weniger. Der normale `npm run build` bleibt unangetastet, damit der Build
 * bei Lovable weiter gegen Nitro/Cloudflare läuft.
 *
 * Der Umweg über einen Zwischenordner ist nötig, weil Vite selbst nach dist/
 * schreibt (dist/client für die Seite, dist/server für den ungenutzten
 * SSR-Teil): erst bauen, dann die Upload-Struktur daneben aufbauen und zum
 * Schluss dist/ durch sie ersetzen.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * Ordner auf dem Server. Standard "digitale-speisekarte"; anderer Name per
 * Argument: `npm run build:static -- speisekarte`. Die Vite-Konfiguration
 * bekommt ihn über DEPLOY_DIR und schreibt ihn in alle Dateipfade.
 */
const ROUTE_DIR = process.argv[2] ?? process.env.DEPLOY_DIR ?? "digitale-speisekarte";

if (!/^[A-Za-z0-9_-]+$/.test(ROUTE_DIR)) {
  console.error(
    `Ungültiger Ordnername "${ROUTE_DIR}" – erlaubt sind Buchstaben, Ziffern, - und _.`,
  );
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
 * Damit Apache Unterseiten wie /digitale-speisekarte/danke ausliefert und ein
 * direkter Aufruf nicht auf einer 404-Seite von WordPress landet.
 *
 * Alle Unterseiten liegen vorgerendert als Ordner vor. Eine unbekannte Adresse
 * (z. B. Tippfehler in einem Anzeigen-Link) leitet auf die Landingpage um,
 * statt deren HTML unter falscher Adresse auszuliefern – das ergäbe eine leere
 * Seite, weil der Router beim Start abbricht. Der Query-String (gclid, utm_*)
 * bleibt bei der Umleitung erhalten.
 */
const HTACCESS = `DirectoryIndex index.html
RewriteEngine On
RewriteBase /${ROUTE_DIR}/
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ /${ROUTE_DIR}/ [R=302,L]
`;

rmSync(dist, { recursive: true, force: true });
rmSync(staging, { recursive: true, force: true });

// Vite direkt über Node starten statt über npx: das spart die Shell und
// funktioniert unter Windows wie unter Linux gleich.
const build = spawnSync(
  process.execPath,
  [join(root, "node_modules", "vite", "bin", "vite.js"), "build"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, BUILD_STATIC: "1", DEPLOY_DIR: ROUTE_DIR },
  },
);

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

// Unter Windows hält oft der Virenscanner oder die Suche den Ordner kurz fest,
// dann scheitert das Umbenennen mit EPERM. Erst kurz warten und wiederholen,
// zuletzt kopieren statt umbenennen – das Ergebnis ist dasselbe.
let moved = false;
for (let attempt = 0; attempt < 5 && !moved; attempt++) {
  try {
    renameSync(staging, dist);
    moved = true;
  } catch (error) {
    if (error.code !== "EPERM" && error.code !== "EBUSY") throw error;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  }
}
if (!moved) {
  cpSync(staging, dist, { recursive: true });
  rmSync(staging, { recursive: true, force: true });
}

console.log(
  `\nFertig. Der Inhalt von dist/ gehört nach blitzscan.de/${ROUTE_DIR}/\n` +
    `Enthalten: ${readdirSync(dist).join(", ")}\n`,
);
