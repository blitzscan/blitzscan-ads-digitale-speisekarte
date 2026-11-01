/**
 * Feste Werte, die an mehreren Stellen gebraucht werden.
 *
 * Alles, was sich ohne Code-Kenntnis ändern kann (Telefonnummer, Adressen der
 * Rechtstexte), steht hier an einer Stelle statt verstreut in den Seiten.
 */

/**
 * Live-Demo: eine echte BlitzScan-Gästeseite mit digitaler Speisekarte.
 *
 * Gesetzt → im Hero läuft die Seite in einem Handy-Rahmen (LiveDemoPhone in
 * src/components/landing-sections.tsx), direkt bedienbar. Auf dem Handy und
 * Tablet scrollt der Knopf "Live-Demo ansehen" (data-track "hero_live_demo")
 * dorthin. `null` → kein Handy und kein Knopf, im Hero steht wieder das Foto.
 *
 * Nur eine Adresse eintragen, die auf dem Handy funktioniert, keine Testpreise
 * zeigt und keinen "Bezahlen"-Knopf hat – Online-Zahlung ist keine
 * freigegebene Standardfunktion.
 *
 * Stand 01.11.2026: Bestellen ohne Bezahlen. Im Dashboard deaktivierte
 * Gerichte werden ausgeblendet; "Bestellen" ohne Tisch-QR zeigt einen
 * Demo-Hinweis mit Link zum Kontaktformular dieser Seite (#kontakt).
 * Die alte Adresse ".../speisekarte_bigbite_bestellen/" gibt es nicht mehr.
 */
export const DEMO_URL: string | null = "https://blitzscan.de/speisekarte_bigbite/";

/**
 * Telefonnummer.
 *
 * Sichtbar als kleiner Link unter den Hero-Knöpfen, in der festen Leiste am
 * unteren Rand (nur Handy) und im Fehlerhinweis des Formulars. In Kopf- und
 * Fußzeile steht sie absichtlich nicht – dort würde sie vom Formular ablenken,
 * ohne jemandem zu helfen, der ohnehin schon liest.
 */
export const PHONE_DISPLAY = "+49 1573 5592456";

/** Wählform für tel:-Links – ohne Leerzeichen, sonst wählen manche Geräte falsch. */
export const PHONE_DIAL = "+4915735592456";

/**
 * WhatsApp-Link mit vorausgefüllter Nachricht.
 *
 * wa.me will die Nummer ohne "+" und ohne Leerzeichen. Der Text spart dem
 * Gastronomen das Formulieren – und uns die Rückfrage, worum es geht.
 */
const WHATSAPP_NUMBER = "4915735592456";

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/**
 * Rechtstexte der IT-Recht Kanzlei.
 *
 * `snippet` wird von deren Skript in die Seite geschrieben und bleibt damit
 * automatisch aktuell. `direct` ist die Fassung auf dem Kanzlei-Server – sie
 * dient als Ausweichlink, falls das Skript nicht lädt.
 */
export const LEGAL = {
  imprint: {
    snippet: "https://itrk.legal/1yqx.0.17zw-de-iframe.html",
    direct: "https://itrk.legal/1yqx.0.17zw-de.html",
  },
  privacy: {
    snippet: "https://itrk.legal/1yqx.8V.17zw-iframe.html",
    direct: "https://itrk.legal/1yqx.8V.17zw.html",
  },
} as const;
