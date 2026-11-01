/**
 * Conversion- und Klick-Tracking für Google Ads und Google Analytics 4.
 *
 * Zwei getrennte Dinge passieren hier:
 *
 * 1. Conversions für Google Ads.
 *    - Lead: Im Konto als Seitenaufruf-Conversion für /digitale-speisekarte/danke
 *      einzurichten (siehe GOOGLE-ADS.md, 7.1). Die Seite sendet dafür kein
 *      Conversion-Ereignis, sondern
 *      nur den Seitenaufruf (siehe trackPageView) – sonst zählt jede Anfrage
 *      doppelt.
 *    - Anruf und WhatsApp: manuelle Event-Conversions, je mit Label aus dem
 *      Konto, siehe src/config/googleAds.ts.
 * 2. Ereignisse für die Auswertung in GA4: Seitenaufrufe, `phone_click`,
 *    `whatsapp_click`, `form_submit_success`, `demo_cta_click`,
 *    `live_demo_click`, dazu `button_click` mit der Kennung des Knopfes und
 *    `form_start` beim ersten Tippen ins Formular.
 *
 * Diese Seite ist eine Single-Page-App: Der Wechsel auf /danke passiert im
 * Browser ohne Neuladen, der Google-Tag sieht von sich aus nur die erste
 * Seite. Deshalb meldet die Seite jeden weiteren Seitenwechsel selbst als
 * `page_view` – an Google Ads (für die URL-Regel /danke) und an GA4.
 *
 * Gesendet wird nur auf den Produktionsdomains (PRODUCTION_HOSTS in
 * src/config/googleAds.ts). Auf localhost, in der Lovable-Vorschau und auf
 * allen anderen Domains geht nichts an Google. In der Entwicklung
 * (`npm run dev`) erscheint jedes Ereignis stattdessen in der Browser-Konsole.
 *
 * Einwilligung (§ 25 TDDDG): Das Google-Skript wird erst geladen, wenn der
 * Besucher im Banner zugestimmt hat. Vorher geht keine Anfrage an Google
 * (Consent Mode "basic"). Mit Zustimmung gelten die Consent-Mode-v2-Signale
 * als erteilt; ohne sie bleibt die Seite vollständig nutzbar, nur die
 * Messung fehlt. Die Entscheidung liegt im localStorage und lässt sich über
 * den Link "Cookie-Einstellungen" in der Fußzeile ändern.
 */
import { GA4_MEASUREMENT_ID, GOOGLE_ADS, PRODUCTION_HOSTS } from "@/config/googleAds";

/**
 * Läuft die Seite auf der Produktionsdomain? Erst im Browser auswerten, nie
 * beim Vorrendern – dort gibt es keine Domain.
 */
function isProductionHost(): boolean {
  return typeof window !== "undefined" && PRODUCTION_HOSTS.includes(window.location.hostname);
}

/** Google-Ads-Kennung, aber nur auf der Produktionsdomain – sonst leer. */
function activeAdsId(): string {
  return isProductionHost() ? GOOGLE_ADS.conversionId : "";
}

/** GA4-Messkennung, aber nur auf der Produktionsdomain – sonst leer. */
function activeGa4Id(): string {
  return isProductionHost() ? GA4_MEASUREMENT_ID : "";
}

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/** Nur wenn Kennungen gesetzt sind, gibt es überhaupt etwas zu erlauben. */
export const TRACKING_CONFIGURED = Boolean(GOOGLE_ADS.conversionId || GA4_MEASUREMENT_ID);

export type ConsentChoice = "granted" | "denied";

const CONSENT_KEY = "blitzscan-consent";

/** Der Footer-Link löst dieses Ereignis aus, der Banner hört darauf. */
export const CONSENT_REOPEN_EVENT = "blitzscan:consent-reopen";

let initialized = false;
let tagLoaded = false;
let formStarted = false;
/** Adresse der zuletzt gemeldeten Seite – Referrer für den nächsten Seitenwechsel. */
let lastPageUrl = "";

/** `null`, solange der Besucher noch nicht entschieden hat (oder localStorage fehlt). */
export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** Hängt den Klick-Zähler ein und lädt das Skript, falls schon zugestimmt wurde. */
export function initTracking(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  lastPageUrl = window.location.href;

  // Ein einziger Zähler für alle Knöpfe, statt an jeder Stelle einen eigenen:
  // Ein neuer Knopf braucht nur data-track="…" und wird automatisch erfasst.
  document.addEventListener("click", onDocumentClick);

  if (getStoredConsent() === "granted") loadGoogleTag();
}

/** Speichert die Entscheidung aus dem Banner und setzt sie sofort um. */
export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Ohne Speicher gilt die Entscheidung nur bis zum Neuladen – der Banner
    // erscheint dann wieder, das ist die sichere Richtung.
  }

  if (choice === "granted") {
    loadGoogleTag();
    return;
  }

  // Widerruf nach bereits geladenem Skript: Das Skript lässt sich nicht
  // entladen, aber ab jetzt sendet es nichts mehr.
  if (tagLoaded) {
    window.gtag?.("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    if (GA4_MEASUREMENT_ID) {
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = true;
    }
  }
}

/** Lädt gtag.js einmalig. Nur nach Zustimmung aufrufen. */
function loadGoogleTag(): void {
  const adsId = activeAdsId();
  const ga4Id = activeGa4Id();
  const ids = [adsId, ga4Id].filter(Boolean);
  const [firstId] = ids;
  if (tagLoaded || !firstId) return;
  tagLoaded = true;

  window.dataLayer = window.dataLayer ?? [];
  // Muss eine echte function sein: gtag arbeitet mit `arguments`.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  } as GtagFn;

  // Consent Mode v2: erst auf "abgelehnt" setzen, dann sofort erteilen. Das
  // Skript wird ja erst nach der Zustimmung geladen, Google erwartet die
  // Signale aber trotzdem in dieser Reihenfolge.
  const signals = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"];
  window.gtag("consent", "default", Object.fromEntries(signals.map((s) => [s, "denied"])));
  window.gtag("consent", "update", Object.fromEntries(signals.map((s) => [s, "granted"])));
  if (ga4Id) (window as unknown as Record<string, unknown>)[`ga-disable-${ga4Id}`] = false;

  // Jedes config sendet den Seitenaufruf der aktuellen Seite selbst; spätere
  // Seitenwechsel meldet trackPageView.
  window.gtag("js", new Date());
  for (const id of ids) window.gtag("config", id);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(firstId)}`;
  document.head.appendChild(script);
}

/** Ohne `send_to` geht ein Ereignis an alle konfigurierten Ziele (Ads und GA4). */
function sendEvent(name: string, params: Record<string, string> = {}): void {
  if (import.meta.env.DEV) console.info("[tracking]", name, params);
  if (!activeAdsId() && !activeGa4Id()) return;
  window.gtag?.("event", name, params);
}

/** Ein Ereignis nur an GA4 – Google Ads bekommt davon nichts. */
function sendGa4Event(name: string, params: Record<string, string> = {}): void {
  if (import.meta.env.DEV) console.info("[tracking] GA4", name, params);
  const ga4Id = activeGa4Id();
  if (!ga4Id) return;
  window.gtag?.("event", name, { ...params, send_to: ga4Id });
}

function sendConversion(label: string): void {
  const adsId = activeAdsId();
  if (!adsId || !label) return;
  window.gtag?.("event", "conversion", { send_to: `${adsId}/${label}` });
}

/**
 * Meldet jeden Klick auf ein Element mit `data-track="kennung"`.
 *
 * Die Kennung benennt Ort und Zweck (z. B. `hero_demo`, `bar_whatsapp`),
 * nicht den Text auf dem Knopf: Der ändert sich mit Sprache und Wortlaut, die
 * Auswertung soll aber über beides hinweg vergleichbar bleiben.
 */
function onDocumentClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const id = target.closest("[data-track]")?.getAttribute("data-track");
  if (id) sendEvent("button_click", { button_id: id });
}

/**
 * Ein Seitenwechsel innerhalb der App, z. B. vom Formular auf /danke.
 *
 * Den ersten Seitenaufruf sendet gtag("config") selbst – diese Funktion nur bei
 * späteren Wechseln aufrufen, und erst wenn der neue Seitentitel gesetzt ist.
 *
 * - Google Ads: Darüber zählt die Lead-Conversion (URL-Regel /danke im Konto).
 * - GA4: Damit jede Unterseite als eigener Seitenaufruf erscheint. In GA4 muss
 *   dafür die automatische Erkennung über den Browserverlauf ausgeschaltet
 *   sein, sonst zählt jeder Wechsel doppelt (siehe GOOGLE-ADS.md, 7.2).
 */
export function trackPageView(): void {
  const pageUrl = window.location.href;
  const referrer = lastPageUrl;
  lastPageUrl = pageUrl;

  if (import.meta.env.DEV) console.info("[tracking] page_view", window.location.pathname);
  if (!tagLoaded) return;

  const adsId = activeAdsId();
  if (adsId) {
    window.gtag?.("event", "page_view", {
      send_to: adsId,
      page_location: pageUrl,
    });
  }

  const ga4Id = activeGa4Id();
  if (ga4Id) {
    window.gtag?.("event", "page_view", {
      send_to: ga4Id,
      page_location: pageUrl,
      page_title: document.title,
      page_referrer: referrer,
    });
  }
}

/**
 * Ein Rückruf wurde angefordert und vom Server bestätigt.
 *
 * Bewusst keine Google-Ads-Conversion: Die zählt der Aufruf von /danke (siehe
 * trackPageView). Deshalb geht das Ereignis nur an GA4.
 */
export function trackLead(): void {
  sendGa4Event("form_submit_success");
}

/**
 * Jemand hat angefangen, das Formular auszufüllen.
 *
 * Der Schritt zwischen "Knopf geklickt" und "abgeschickt": Er zeigt, ob das
 * Formular selbst abschreckt. Nur einmal pro Seitenaufruf, sonst zählt jedes
 * Feld mit.
 */
export function trackFormStart(): void {
  if (formStarted) return;
  formStarted = true;
  sendEvent("form_start");
}

/**
 * Jemand hat die Telefonnummer angetippt.
 *
 * Ein Klick ist kein bewiesenes Gespräch – wer auflegt, zählt trotzdem. Diese
 * Conversion deshalb in Google Ads als *sekundär* führen, damit sie die
 * Gebotssteuerung nicht verzerrt.
 */
export function trackCallClick(): void {
  sendConversion(GOOGLE_ADS.labels.callClick);
  sendGa4Event("phone_click");
}

/** Jemand hat den WhatsApp-Knopf angetippt. Wie der Anruf-Klick: sekundär führen. */
export function trackWhatsAppClick(): void {
  sendConversion(GOOGLE_ADS.labels.whatsappClick);
  sendGa4Event("whatsapp_click");
}

/**
 * Ein Knopf "Kostenlose Demo anfragen" wurde geklickt (führt zum Formular).
 *
 * Nur an GA4: Der Klick ist noch keine Anfrage. Wo geklickt wurde, steht im
 * gleichzeitig gesendeten `button_click`.
 */
export function trackDemoCtaClick(): void {
  sendGa4Event("demo_cta_click");
}

/** Jemand öffnet die Live-Demo der Speisekarte. Nur an GA4. */
export function trackLiveDemoClick(): void {
  sendGa4Event("live_demo_click");
}
