import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { LegalText } from "@/components/legal-text";
import { SiteFooter } from "@/components/site-footer";
import { LangToggle, useLang, type TranslationKey } from "@/lib/i18n";
import logoUrl from "@/assets/blitzscan-logo.png";

/**
 * Gemeinsames Gerüst für Impressum und Datenschutzerklärung – beide Seiten
 * unterscheiden sich nur in Überschrift und Quelle des Rechtstextes.
 */
export function LegalPage({
  titleKey,
  snippetUrl,
  directUrl,
}: {
  titleKey: TranslationKey;
  snippetUrl: string;
  directUrl: string;
}) {
  const { t } = useLang();

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="section-navy px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <Link
            to="/"
            className="rounded-xl bg-white p-1.5 shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.02]"
            aria-label={t("logoAria")}
          >
            <img src={logoUrl} alt="BlitzScan" className="h-10 w-auto" width="40" height="40" />
          </Link>
          <LangToggle className="inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20" />
        </div>
      </header>

      <div className="flex-1 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("backToPage")}
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t(titleKey)}
          </h1>

          <div className="mt-8 rounded-2xl bg-card p-6 shadow-lg shadow-navy/5 ring-1 ring-border sm:p-10">
            <LegalText snippetUrl={snippetUrl} directUrl={directUrl} />
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
