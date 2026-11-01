/**
 * Google-Tag-Konfiguration für Conversion-Tracking.
 *
 * Diese Werte sind keine Secrets: Sie stehen ohnehin im ausgelieferten
 * JavaScript und sind für jeden Besucher sichtbar. Deshalb liegen sie hier
 * versioniert im Code und nicht in der .env.
 *
 * Die Labels stammen aus Google Ads unter Ziele → Conversions → Aktion →
 * Tag einrichten → "Tag selbst hinzufügen", aus dem Ereignis-Snippet:
 *   send_to: 'AW-18432836798/-1EnCLOIo6YdEL6Ju9VE'
 *             ^^^^^^^^^^^^^^ conversionId  ^^^^^^ Label
 *
 * Die Formular-Conversion "Lead – Digitale Speisekarte – Formular gesendet" hat
 * hier bewusst KEIN Label. Google Ads erkennt sie ausschließlich am Aufruf von
 * /digitale-speisekarte/danke (Seitenaufruf-Conversion im Konto, siehe
 * GOOGLE-ADS.md, 7.1). Ein zusätzliches Conversion-Ereignis würde jede
 * Anfrage doppelt zählen.
 */
/**
 * Nur auf diesen Domains wird an Google gesendet – Google Ads und GA4
 * (Tag, Seitenaufrufe, Conversions, Ereignisse). Auf localhost, Lovable-Vorschau
 * und allen anderen Domains geht nichts raus, sonst zählen Tests als echte
 * Besuche und Conversions.
 */
export const PRODUCTION_HOSTS: readonly string[] = ["blitzscan.de", "www.blitzscan.de"];

export const GOOGLE_ADS: {
  /** Conversion-ID des Kontos. Leer = kein Google-Tag, keine Messung. */
  readonly conversionId: string;
  /** Labels der manuellen Event-Conversions. Leer = diese Conversion wird nicht gemeldet. */
  readonly labels: {
    /** "Anruf geklickt" – in Google Ads als sekundär führen. */
    readonly callClick: string;
    /** "WhatsApp geklickt" – in Google Ads als sekundär führen. */
    readonly whatsappClick: string;
  };
} = {
  conversionId: "AW-18432836798",
  labels: {
    callClick: "-1EnCLOIo6YdEL6Ju9VE",
    whatsappClick: "StbwCKGDmqYdEL6Ju9VE",
  },
};

/**
 * Messkennung der GA4-Property. Auch das ist kein Secret.
 *
 * Läuft über denselben Google-Tag wie Google Ads, siehe GOOGLE-ADS.md,
 * Abschnitt 7.2. Leer = kein GA4.
 */
export const GA4_MEASUREMENT_ID: string = "G-8N16B2B2RG";
