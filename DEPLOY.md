# Upload auf blitzscan.de

Die Seite läuft am Ende unter **https://blitzscan.de/reservierungssystem/** und
schickt das Formular an den PHP-Endpunkt derselben Domain. Weil beides auf
blitzscan.de liegt, ist kein CORS nötig – genauso wie beim Kontaktformular der
Hauptseite unter `/home/`.

## 1. Bauen

```sh
npm install      # nur beim ersten Mal
npm run build:static
```

Danach enthält `dist/` genau die Dateien, die hochgeladen werden:

```
dist/
├── .htaccess                # Apache-Regeln für Unterseiten (z. B. /danke)
├── index.html               # die Landingpage, fertig gerendert
├── danke/index.html         # die Dankeseite nach dem Absenden
├── impressum/index.html     # Anbieterkennzeichnung nach § 5 DDG
├── datenschutz/index.html   # Datenschutzerklärung
├── assets/                  # JS, CSS, Logo
└── favicon.png
```

Impressum und Datenschutz holen ihren Text beim Aufruf von der IT-Recht Kanzlei
und bleiben dadurch ohne Zutun aktuell. Im vorgerenderten HTML steht deshalb nur
der leere Behälter – das ist richtig so. Lädt das Skript der Kanzlei nicht,
zeigen beide Seiten einen Verweis auf die Fassung auf deren Server, damit die
Angaben nie ganz fehlen.

`npm run build` (ohne `:static`) bleibt unverändert und baut wie bisher für
Lovable/Cloudflare – der Ordner `.output/` daraus wird hier nicht gebraucht.

**Tracking.** Die Google-Ads-Conversion-ID und die Labels stehen versioniert in
`src/config/googleAds.ts` und werden bei jedem Build mitgebaut, eine `.env` ist
dafür nicht nötig. Die Einrichtung im Konto beschreibt `GOOGLE-ADS.md`.

**Unter Windows** endet `npm run build:static` am letzten Schritt unter
Umständen mit `EPERM: operation not permitted, rename … dist-upload → dist`.
Die Seite ist dann trotzdem fertig gebaut: Der Ordner `dist-upload/` enthält
dieselben Dateien, die sonst in `dist/` lägen, und wird genauso hochgeladen.

## 2. Hochladen

| Woher | Wohin auf dem Server |
| --- | --- |
| **Inhalt** von `dist/` | `/reservierungssystem/` |
| `api/public/lead.php` | `/api/public/lead.php` |
| `api/_core/mailer_lead.php` | `/api/_core/mailer_lead.php` |

Wichtig: der **Inhalt** von `dist/` kommt in den Ordner, nicht der Ordner
`dist` selbst. Die versteckte Datei `.htaccess` muss mit – manche FTP-Programme
blenden Dateien mit Punkt am Anfang standardmäßig aus.

Die beiden PHP-Dateien sind neu; `api/_core/mailer_contact.php`,
`api/_core/mail_config.php` und der Rest von `api/` bleiben unverändert. Der
Mailversand läuft über dasselbe IONOS-Postfach wie das Kontaktformular, es sind
also keine neuen Zugangsdaten nötig.

## 3. Nach dem Upload prüfen

1. https://blitzscan.de/reservierungssystem/ aufrufen – die Seite muss sofort
   erscheinen (sie ist vorgerendert, also auch ohne JavaScript sichtbar).
2. https://blitzscan.de/reservierungssystem/danke direkt aufrufen – muss die
   Dankeseite zeigen und keine 404 von WordPress. Kommt hier ein Fehler, fehlt
   die `.htaccess`.
3. `/reservierungssystem/impressum` und `/reservierungssystem/datenschutz` aufrufen –
   nach kurzem Moment muss der Rechtstext erscheinen. Bleibt stattdessen der
   Hinweis mit dem Ausweichlink stehen, wird das Skript der Kanzlei blockiert
   (Adblocker, Firewall) – dann von einem anderen Netz aus gegenprüfen.
4. Das Formular einmal echt ausfüllen und absenden. Erwartet:
   Weiterleitung auf `/danke` **und** eine Mail „Rückruf-Anfrage: …" an
   service@blitzscan.de. Einmal mit und einmal ohne E-Mail-Adresse testen –
   das Feld ist freiwillig.

Kommt keine Mail an, steht die Anfrage trotzdem in
`api/_core/_data/leads-JJJJ-MM.log` – protokolliert wird vor dem Versand. Der
Besucher sieht in diesem Fall bewusst **keinen** Fehler: Solange der Lead im
Protokoll liegt, ist er nicht verloren, und eine Fehlermeldung würde nur den
Abschluss kosten. Erkennbar ist der Fall an einer Zeile `"mail_failed":true`
direkt hinter dem Eintrag – und an einem Vermerk im Server-Fehlerprotokoll.

## Gut zu wissen

**Der Ordnername auf dem Server muss zum Build passen.** Alle Pfade zu CSS, JS und
Bildern beginnen mit dem Ordner (`/reservierungssystem/assets/…`). Liegt die Seite
woanders, findet der Browser sie nicht, WordPress antwortet mit 404 – die Seite
erscheint dann als ungestalteter Text.

Standard ist `reservierungssystem`. Für einen anderen Ordner den Namen beim Bauen
mitgeben, der Ordner auf dem Server heißt dann genauso:

```sh
npm run build:static -- reservations      # für blitzscan.de/reservations/
```

Der Name steckt dann in den Dateipfaden und in der `RewriteBase` der `.htaccess`.
Die Anzeigen-Links in `GOOGLE-ADS.md` müssen zum Ordner passen.

**Der alte Ordner `/notfall-wechsel/`.** Die Seite der beendeten
Quandoo-Kampagne liegt noch dort. Sobald die neue Seite läuft, entweder den
Ordner löschen oder – besser, falls noch Links darauf zeigen – seinen Inhalt
durch eine einzige `.htaccess` ersetzen, die auf die neue Adresse weiterleitet:

```
RewriteEngine On
RewriteRule ^ /reservierungssystem/ [R=301,L]
```

Das leitet auch Unterseiten wie `/notfall-wechsel/danke` auf die Startseite der
neuen Seite um.

**Spamschutz.** Der Endpunkt lehnt ab, was zu schnell abgeschickt wurde
(< 2 Sekunden), was das unsichtbare Zusatzfeld ausgefüllt hat, und was von
derselben IP-Adresse öfter als fünfmal pro Stunde kommt. Gleiche Regeln wie im
Kontaktformular der Hauptseite.

**Lokal testen.** Die Seite kann nur zusammen mit WordPress getestet werden,
weil das Formular einen echten PHP-Endpunkt braucht. Dafür den Inhalt von
`dist/` in den lokalen Site-Ordner unter `app/public/reservierungssystem/` kopieren
und https://blitzscan.local/reservierungssystem/ aufrufen.

Für `npm run dev` ohne WordPress ginge das Formular ins Leere – dafür lässt
sich in einer `.env`-Datei eine vollständige URL setzen, siehe `.env.example`.
