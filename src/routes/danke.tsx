import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { LangToggle, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/danke")({
  component: DankePage,
  head: () => ({
    meta: [
      { title: "Vielen Dank | BlitzScan" },
      {
        name: "description",
        content: "Wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich bei Ihnen.",
      },
      {
        property: "og:title",
        content: "Vielen Dank | BlitzScan",
      },
      {
        property: "og:description",
        content: "Wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich bei Ihnen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // Die Dankeseite gehört nicht in die Suchergebnisse: Wer sie ohne
      // Formular erreicht, versteht sie nicht – und sie verwässert die
      // Auswertung der Conversions.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function DankePage() {
  const { t } = useLang();
  return (
    <main className="relative flex min-h-screen flex-col bg-background px-6 pb-0 pt-20 text-center">
      <LangToggle className="absolute right-5 top-5 z-10 inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-muted sm:right-6 sm:top-6" />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
            <CheckCircle className="h-10 w-10 text-amber" />
          </div>
        </div>
        <h1 className="text-balance mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("thanksTitle")}
        </h1>
        <p className="text-balance mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          {t("thanksText")}
        </p>

        <div className="mt-10 rounded-2xl bg-card p-6 shadow-lg shadow-navy/5 ring-1 ring-border">
          <p className="text-base leading-relaxed text-card-foreground">
            {t("thanksMore")}{" "}
            <a
              href="https://www.blitzscan.de"
              data-track="thanks_website"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber underline decoration-1 underline-offset-4 transition-colors hover:text-amber-dark"
            >
              www.blitzscan.de
            </a>
          </p>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            data-track="thanks_home"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-amber px-8 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] active:bg-amber-dark"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
