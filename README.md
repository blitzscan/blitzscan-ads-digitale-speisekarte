# Reservierungssystem – Landingpage

Conversion-Landingpage für das BlitzScan-Reservierungssystem (Google Ads). Ziel der
Seite: Gastronomen ohne Reservierungssystem zum Rückruf-Formular führen.

- **Aufbau:** Hero → Vorteile → Portal → Preis & Kostenrechner → Ablauf → Vergleich →
  Vertrauen → FAQ → Formular. Die Texte stehen in `src/lib/i18n.tsx` (DE/EN), die
  Abschnitte in `src/components/landing-sections.tsx`.
- **Adresse:** blitzscan.de/reservierungssystem/ – Upload siehe `DEPLOY.md`.
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
