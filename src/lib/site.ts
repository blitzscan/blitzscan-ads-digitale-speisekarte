/**
 * Feste Werte, die an mehreren Stellen gebraucht werden.
 *
 * Alles, was sich ohne Code-Kenntnis ändern kann (Telefonnummer, Adressen der
 * Rechtstexte), steht hier an einer Stelle statt verstreut in den Seiten.
 */

/**
 * Monatspreis in Euro, netto. Speist den Kostenrechner.
 *
 * Der Preis steht außerdem als Text in i18n.tsx (heroChip1, f2Text, cmp2New,
 * faq1A) – bei einer Preisänderung dort mit anpassen.
 */
export const PRICE_MONTHLY = 29;

/**
 * Gebühr pro Reservierung bei einem Provisionsmodell, in Euro. Rechenbeispiel
 * im Kostenrechner, kein Preis eines bestimmten Anbieters. Der Wert steht auch
 * als Text in i18n.tsx (calcNote) – bei einer Änderung dort mit anpassen.
 */
export const FEE_PER_RESERVATION = 1.5;

/**
 * Telefonnummer.
 *
 * Sichtbar als zweiter Knopf im Hero, in der festen Leiste am unteren Rand
 * (nur Handy) und im Fehlerhinweis des Formulars. In Kopf- und
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
