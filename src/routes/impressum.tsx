import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/site";

export const Route = createFileRoute("/impressum")({
  component: ImpressumPage,
  head: () => ({
    meta: [
      { title: "Impressum | BlitzScan" },
      { name: "description", content: "Anbieterkennzeichnung nach § 5 DDG." },
      // Für die Anzeigenprüfung muss die Seite erreichbar sein, in der Suche
      // hat sie nichts verloren.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function ImpressumPage() {
  return (
    <LegalPage
      titleKey="imprint"
      snippetUrl={LEGAL.imprint.snippet}
      directUrl={LEGAL.imprint.direct}
    />
  );
}
