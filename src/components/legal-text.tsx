import { useEffect, useRef, useState } from "react";

import { useLang } from "@/lib/i18n";

const SCRIPT_SRC = "https://www.it-recht-kanzlei.de/js/itrk-legaltext.js";

/**
 * Bindet einen Rechtstext der IT-Recht Kanzlei ein.
 *
 * Das Skript der Kanzlei sucht beim Ausführen nach Behältern mit der Klasse
 * `itrk-legaltext` und schreibt den Text hinein. Wir hängen es deshalb erst im
 * Effekt an – zu diesem Zeitpunkt steht der Behälter sicher im Dokument. Bei
 * jedem Mounten wird ein frisches <script>-Element erzeugt, denn ein bereits
 * vorhandenes würde beim Wechsel zwischen Impressum und Datenschutz nicht noch
 * einmal laufen.
 *
 * `direct` ist der Ausweg, wenn das Skript blockiert wird oder nicht antwortet:
 * Der Hinweis darunter bleibt sichtbar, bis wirklich Text angekommen ist.
 */
export function LegalText({ snippetUrl, directUrl }: { snippetUrl: string; directUrl: string }) {
  const { t } = useLang();
  const container = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    setFilled(false);

    // Sobald die Kanzlei-Seite Inhalt einfügt, ist der Ladehinweis überflüssig.
    const observer = new MutationObserver(() => {
      if (node.childNodes.length > 0) setFilled(true);
    });
    observer.observe(node, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, [snippetUrl]);

  return (
    <div>
      <div
        ref={container}
        className="itrk-legaltext text-left text-sm leading-relaxed text-muted-foreground [&_a]:text-amber [&_a]:underline [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mb-1 [&_p]:mb-4 [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
        data-itrk-legaltext-url={snippetUrl}
      />

      {!filled && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("legalFallback")}{" "}
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber underline decoration-1 underline-offset-2"
          >
            {t("legalOpenDirect")}
          </a>
        </p>
      )}

      <noscript>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <a href={directUrl} className="font-medium text-amber underline">
            {t("legalOpenDirect")}
          </a>
        </p>
      </noscript>
    </div>
  );
}
