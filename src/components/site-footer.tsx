import { Link } from "@tanstack/react-router";

import { useLang } from "@/lib/i18n";
import { CONSENT_REOPEN_EVENT, TRACKING_CONFIGURED } from "@/lib/tracking";

/**
 * Fußzeile für alle Seiten.
 *
 * Impressum und Datenschutz liegen bewusst auf eigenen Unterseiten statt als
 * Verweis auf den Kanzlei-Server: § 5 DDG verlangt die Angaben auf der eigenen
 * Präsenz, und bei der Prüfung durch Google Ads wird eine Seite ohne
 * erreichbares Impressum regelmäßig beanstandet.
 */
export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="px-6 py-6 text-center">
      {/* py-2 statt winziger Textlinks: auf dem Handy gut antippbar. */}
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        <Link
          to="/impressum"
          data-track="footer_imprint"
          className="py-2 text-sm text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("imprint")}
        </Link>
        <Link
          to="/datenschutz"
          data-track="footer_privacy"
          className="py-2 text-sm text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("privacy")}
        </Link>
        {TRACKING_CONFIGURED && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
            className="py-2 text-sm text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("cookieSettings")}
          </button>
        )}
      </nav>
    </footer>
  );
}
