/**
 * Absenden des Rückruf-Formulars an den PHP-Endpunkt auf dem WordPress-Server.
 *
 * Im Build liegt die Seite unter blitzscan.de/reservierungssystem/, der Endpunkt
 * unter blitzscan.de/api/ – also dieselbe Domain, kein CORS nötig. Für die
 * lokale Entwicklung lässt sich per VITE_LEAD_ENDPOINT eine vollständige URL
 * setzen (siehe .env.example).
 */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "/api/public/lead.php";

/**
 * Nach dieser Zeit gilt die Anfrage als gescheitert.
 *
 * Ohne Abbruch dreht sich der Knopf endlos weiter, wenn der Server nicht
 * antwortet – der Besucher sieht dann nie, dass er es erneut versuchen kann.
 */
const TIMEOUT_MS = 15_000;

export type LeadPayload = {
  restaurant: string;
  contact_person: string;
  phone: string;
  /** Freiwillig. Leerer String, wenn das Feld nicht ausgefüllt wurde. */
  email: string;
  language: "de" | "en";
  /** Honigtopf – für Menschen unsichtbar, gefüllt nur von Bots. */
  website: string;
  /** Zeit zwischen Seitenaufruf und Absenden; das Backend weist zu schnelle Anfragen ab. */
  elapsed_ms: number;
};

/**
 * Wirft bei jedem Fehlschlag, damit der Aufrufer nur einen Erfolgspfad hat.
 *
 * Die Fehlermeldung des Servers wird durchgereicht, wenn es eine gibt: Bei der
 * Sperre nach zu vielen Anfragen ist "Bitte später erneut versuchen" deutlich
 * hilfreicher als der pauschale Hinweis, das Senden sei fehlgeschlagen. Ohne
 * verwertbare Antwort bleibt die Meldung leer und der Aufrufer setzt seinen
 * eigenen Text ein.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "reservierungssystem" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Netzwerk weg, Zeitüberschreitung, Seite offline – alles derselbe Fall.
    throw new Error("");
  }

  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
  } | null;

  if (!response.ok || !result?.ok) {
    // 422 heißt: Die Prüfung im Browser hat etwas durchgelassen. Für den
    // Besucher ist das derselbe Fehler wie jeder andere.
    const serverMessage =
      response.status === 429 && typeof result?.error === "string" ? result.error : "";
    throw new Error(serverMessage);
  }
}
