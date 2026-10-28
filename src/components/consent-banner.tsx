import { useEffect, useState } from "react";

import { useLang } from "@/lib/i18n";
import {
  CONSENT_REOPEN_EVENT,
  TRACKING_CONFIGURED,
  getStoredConsent,
  setConsent,
  type ConsentChoice,
} from "@/lib/tracking";

/**
 * Einwilligung für Google Ads und Google Analytics.
 *
 * Bewusst eine kleine schwebende Karte am unteren Rand statt einer
 * Vollbild-Sperre: Die Seite bleibt les- und bedienbar, auch wenn der Besucher
 * gar nicht antwortet. Beide Knöpfe sind gleich groß, "Ablehnen" ist also genauso
 * leicht erreichbar wie "Akzeptieren".
 *
 * Erscheint nur, wenn Tracking-Kennungen gesetzt sind und noch keine
 * Entscheidung vorliegt. Der Link "Cookie-Einstellungen" in der Fußzeile öffnet
 * ihn erneut, damit sich die Entscheidung widerrufen lässt.
 */
export function ConsentBanner() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!TRACKING_CONFIGURED) return;
    if (getStoredConsent() === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setOpen(false);
  };

  const button =
    "inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors";

  return (
    <section
      aria-label={t("cookieTitle")}
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-card p-4 text-card-foreground shadow-2xl shadow-navy/30 ring-1 ring-border sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm"
    >
      <p className="text-sm leading-relaxed">
        {t("cookieText")}{" "}
        <a
          href={`${import.meta.env.BASE_URL}datenschutz`}
          className="underline decoration-1 underline-offset-2 transition-colors hover:text-amber-dark"
        >
          {t("consentLink")}
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`${button} bg-muted text-foreground hover:bg-border`}
        >
          {t("cookieDecline")}
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className={`${button} bg-amber text-navy hover:bg-amber-light active:bg-amber-dark`}
        >
          {t("cookieAccept")}
        </button>
      </div>
    </section>
  );
}
