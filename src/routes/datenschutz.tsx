import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/site";

export const Route = createFileRoute("/datenschutz")({
  component: DatenschutzPage,
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung | BlitzScan" },
      {
        name: "description",
        content: "Wie wir mit Ihren Daten umgehen, wenn Sie einen Rückruf anfordern.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function DatenschutzPage() {
  return (
    <LegalPage
      titleKey="privacy"
      snippetUrl={LEGAL.privacy.snippet}
      directUrl={LEGAL.privacy.direct}
    />
  );
}
