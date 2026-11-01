# Digitale Speisekarte + Bestellen am Tisch – Landingpage

Conversion-Landingpage für die BlitzScan-Kampagne „Digitale Speisekarte +
Bestellen am Tisch“ (Google Ads). Zielgruppe: Restaurantinhaber und
-manager. Einziges Ziel der Seite: das Formular „Kostenlose Demo anfragen“.

- **Aufbau:** Hero → Problem → So funktioniert es → Digitale Speisekarte →
  Bestellen am Tisch (+ Demo-Knopf) → Vergleich Papier/PDF/BlitzScan →
  Einrichtung & Ansprechpartner → Zwischenaufruf → optionale Erweiterungen →
  FAQ → Formular. Die Texte stehen in `src/lib/i18n.tsx` (DE/EN), die
  Abschnitte in `src/components/landing-sections.tsx`.
- **Bilder:** echte Screenshots aus dem Kundenportal (`portal-speisekarte`,
  `portal-bestellungen` – auf dem Handy als vergrößerter Ausschnitt),
  Gäste-Motive (`gast-*`) und Team-Fotos, übernommen von blitzscan.de.
  Vorschaubild für geteilte Links: `public/og-digitale-speisekarte.jpg`.
- **Produktaussagen:** nur, was auf blitzscan.de belegt ist (Preise-Seite,
  FAQ, Referenzen). Keine Preise, keine Online-Zahlung, keine Kassenanbindung
  auf der Seite, solange nicht freigegeben.
- **Adresse:** blitzscan.de/digitale-speisekarte/, Danke-Seite
  /digitale-speisekarte/danke – Upload siehe `DEPLOY.md`.
- **Anzeigen & Tracking:** `GOOGLE-ADS.md`. Jeder Knopf trägt ein `data-track` und
  wird als Klick gemeldet (`src/lib/tracking.ts`).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bs-convert.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f449659-4a89-475e-8e1e-7cc0f8912d2a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
