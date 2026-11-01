import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Toaster } from "sonner";

import { ConsentBanner } from "../components/consent-banner";
import { LangProvider } from "../lib/i18n";
import { initTracking, trackPageView } from "../lib/tracking";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Seite nicht gefunden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Diese Seite gibt es nicht oder nicht mehr.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Zur digitalen Speisekarte
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Die Seite konnte nicht geladen werden
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bei uns ist etwas schiefgelaufen. Bitte laden Sie die Seite neu.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Erneut versuchen
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Digitale Speisekarte & Bestellsystem für Restaurants | BlitzScan" },
      {
        name: "description",
        content:
          "Digitale Speisekarte mit Bestellfunktion für Restaurants: Gäste bestellen per QR-Code direkt am Tisch.",
      },
      { name: "author", content: "BlitzScan" },
      {
        property: "og:title",
        content: "Digitale Speisekarte & Bestellsystem für Restaurants | BlitzScan",
      },
      {
        property: "og:description",
        content:
          "Digitale Speisekarte mit Bestellfunktion für Restaurants: Gäste bestellen per QR-Code direkt am Tisch.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.png`, type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const resolvedPath = useRouterState({ select: (s) => s.resolvedLocation?.pathname });
  const lastPath = useRef<string | undefined>(undefined);

  // Erst im Browser laden, nie beim Vorrendern. Ohne gesetzte Kennung in
  // src/config/googleAds.ts passiert hier gar nichts.
  useEffect(() => {
    initTracking();
  }, []);

  // Seitenwechsel ohne Neuladen (z. B. Formular → /danke) an Google melden.
  // Als Effekt, damit der Titel der neuen Seite schon im Dokument steht.
  // Den ersten Aufruf meldet gtag("config") selbst.
  useEffect(() => {
    if (!resolvedPath) return;
    const previous = lastPath.current;
    lastPath.current = resolvedPath;
    if (previous !== undefined && previous !== resolvedPath) trackPageView();
  }, [resolvedPath]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <LangProvider>
        <Outlet />
        <ConsentBanner />
      </LangProvider>
      <Toaster position="bottom-center" richColors />
    </QueryClientProvider>
  );
}
