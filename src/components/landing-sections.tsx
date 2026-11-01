/**
 * Die Abschnitte der Landingpage "Digitale Speisekarte + Bestellen am Tisch"
 * zwischen Hero und Formular.
 *
 * Reihenfolge und Zweck: Problem → Ablauf (in fünf Sekunden verstehen, wie es
 * funktioniert) → die beiden Produkte mit echten Screenshots aus dem
 * Kundenportal → Abgrenzung zur PDF-Karte → Einrichtung und Ansprechpartner
 * (Vertrauen) → optionale Erweiterungen → FAQ. Alles endet in derselben
 * Handlung: Demo anfragen.
 *
 * Jeder Knopf trägt ein `data-track="…"`. Die Kennung (Ort_Zweck) wird beim
 * Klick an Google gemeldet, siehe src/lib/tracking.ts. Neue Knöpfe bekommen
 * einfach ebenfalls eines.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  ChefHat,
  ClipboardList,
  Coffee,
  FileText,
  Footprints,
  Gift,
  Globe,
  HeartHandshake,
  Hourglass,
  ListChecks,
  Lock,
  MessageCircle,
  Phone,
  Pointer,
  Printer,
  QrCode,
  RefreshCw,
  Server,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  TrendingUp,
  Wifi,
  Wine,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLang, type TranslationKey } from "@/lib/i18n";
import { DEMO_URL, PHONE_DIAL, whatsappUrl } from "@/lib/site";
import {
  trackCallClick,
  trackDemoCtaClick,
  trackLiveDemoClick,
  trackWhatsAppClick,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";
import menuEditorUrl from "@/assets/portal-speisekarte.webp";
import ordersUrl from "@/assets/portal-bestellungen.webp";
import qrScanUrl from "@/assets/gast-qr-code-scannen.webp";
import vladislavUrl from "@/assets/team-vladislav-stoev.webp";
import emilUrl from "@/assets/team-emil-koevski.webp";
import shahoUrl from "@/assets/kunde-shaho.webp";
import pizzaLabUrl from "@/assets/kunde-pizza-lab-napoli.webp";
import atrinUrl from "@/assets/kunde-atrin.webp";
import fasikaUrl from "@/assets/kunde-fasika.png";

type Icon = React.ComponentType<{ className?: string }>;

/** Abstände aller Abschnitte: auf dem Handy enger, damit nichts leer wirkt. */
const SECTION = "scroll-mt-4 px-4 py-14 sm:px-6 sm:py-20 md:py-28";

export function scrollToForm() {
  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
}

/** Für jeden Knopf "Demo anfragen": melden und zum Formular scrollen. */
export function requestDemo() {
  trackDemoCtaClick();
  scrollToForm();
}

/** Der Hauptknopf der Seite – überall gleich beschriftet und gestaltet. */
export function DemoButton({
  track,
  children,
  className,
}: {
  track: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={requestDemo}
      data-track={track}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl bg-amber px-7 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] active:bg-amber-dark sm:w-auto",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Link zu WhatsApp mit vorausgefüllter Nachricht in der aktuellen Sprache. */
export function WhatsAppLink({
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"a">, "href">) {
  const { t } = useLang();
  return (
    <a
      href={whatsappUrl(t("waMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackWhatsAppClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------------- */
/* Live-Demo im Handy                                                         */
/* ------------------------------------------------------------------------- */

// Die Demo-Seite wird in echter Handybreite gerendert und dann in den Rahmen
// skaliert – sonst zeigt sie die Desktop-Ansicht.
const DEMO_WIDTH = 390;
const DEMO_HEIGHT = Math.round(DEMO_WIDTH * (19 / 9));

/**
 * Knopf "Live-Demo ansehen": scrollt zum Handy mit der Demo, statt einen neuen
 * Tab zu öffnen. Ohne Adresse in DEMO_URL (src/lib/site.ts) wird nichts
 * angezeigt.
 */
export function LiveDemoButton({
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"button">, "type" | "onClick">) {
  if (!DEMO_URL) return null;
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("live-demo")
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Die echte Gästeseite (DEMO_URL) in einem Handy-Rahmen, direkt bedienbar –
 * wie auf blitzscan.de.
 *
 * - Lädt erst, wenn das Handy in die Nähe des Bildschirms kommt und der
 *   Browser Leerlauf hat. Das schützt die Ladezeit der Landingpage.
 * - Auf Touch-Geräten liegt zuerst ein "Antippen und ausprobieren"-Knopf
 *   darüber. Sonst würde jeder Wisch über das Handy die Demo scrollen statt
 *   der Seite, und der Besucher bliebe darin hängen.
 * - `live_demo_click` wird einmal gemeldet: beim Antippen (Touch) bzw. beim
 *   ersten Klick in die Demo (Maus – erkannt daran, dass das iframe den Fokus
 *   bekommt).
 */
export function LiveDemoPhone({ className }: { className?: string }) {
  const { t } = useLang();
  const screenRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const counted = useRef(false);
  const [scale, setScale] = useState(0.62);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(false);

  const activate = useCallback(() => {
    setActive(true);
    if (counted.current) return;
    counted.current = true;
    trackLiveDemoClick();
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const resize = () => setScale(el.clientWidth / DEMO_WIDTH);
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);

    let cancelIdle = () => {};
    const viewObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        viewObserver.disconnect();
        const start = () => setLoad(true);
        if (typeof window.requestIdleCallback === "function") {
          const handle = window.requestIdleCallback(start, { timeout: 2500 });
          cancelIdle = () => window.cancelIdleCallback(handle);
        } else {
          const timer = window.setTimeout(start, 800);
          cancelIdle = () => window.clearTimeout(timer);
        }
      },
      { rootMargin: "300px" },
    );
    viewObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      viewObserver.disconnect();
      cancelIdle();
    };
  }, []);

  useEffect(() => {
    const onBlur = () => {
      if (document.activeElement === frameRef.current) activate();
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [activate]);

  // Auf blitzscan.de liegen Landingpage und Demo auf derselben Domain: Links
  // der Demo, die einen neuen Tab öffnen würden, bleiben im Handy.
  const keepLinksInside = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      event.currentTarget.contentDocument
        ?.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
        .forEach((link) => {
          const href = link.getAttribute("href") ?? "";
          if (href.startsWith("/") || href.includes("blitzscan.de")) link.target = "_self";
        });
    } catch {
      // Andere Domain (lokaler Test) – dann bleibt es, wie es ist.
    }
  };

  if (!DEMO_URL) return null;

  return (
    <div id="live-demo" className={cn("relative mx-auto w-[260px] sm:w-[290px]", className)}>
      <span className="absolute -top-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-lg">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        {t("demoBadge")}
      </span>

      <div className="rounded-[2.75rem] bg-black p-2.5 shadow-2xl shadow-black/50 ring-1 ring-white/20">
        <div className="overflow-hidden rounded-[2.25rem] bg-white">
          <div className="flex h-7 items-center justify-center bg-white" aria-hidden="true">
            <span className="h-[18px] w-20 rounded-full bg-black" />
          </div>
          <div ref={screenRef} className="relative aspect-[9/19] w-full overflow-hidden bg-muted">
            {load && (
              <iframe
                ref={frameRef}
                src={DEMO_URL}
                title={t("demoFrameTitle")}
                onLoad={keepLinksInside}
                className={cn(
                  "absolute left-0 top-0 origin-top-left border-0 bg-white",
                  !active && "pointer-events-none pointer-fine:pointer-events-auto",
                )}
                style={{
                  width: DEMO_WIDTH,
                  height: DEMO_HEIGHT,
                  transform: `scale(${scale})`,
                }}
              />
            )}
            {!active && (
              <button
                type="button"
                onClick={activate}
                data-track="phone_live_demo"
                className="absolute inset-0 flex items-end justify-center pb-6 pointer-fine:hidden"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-navy/90 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur">
                  <Pointer className="h-4 w-4 text-amber" aria-hidden="true" />
                  {t("demoTap")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bestellungen landen je nach Einrichtung in Küche, Bar oder an der Theke.
 * Taucht im Hero-Bon und im Ablauf auf, deshalb als eigenes Bauteil.
 */
export function RouteChips({ className }: { className?: string }) {
  const { t } = useLang();
  const routes: { icon: Icon; label: TranslationKey }[] = [
    { icon: ChefHat, label: "routeKitchen" },
    { icon: Wine, label: "routeBar" },
    { icon: Coffee, label: "routeCounter" },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {routes.map((r) => (
        <li
          key={r.label}
          className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-xs font-semibold text-foreground ring-1 ring-border"
        >
          <r.icon className="h-3.5 w-3.5 text-amber" aria-hidden="true" />
          {t(r.label)}
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  dark,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-balance text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "text-balance mx-auto mt-4 text-base leading-relaxed sm:text-lg",
            dark ? "text-slate-light" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/**
 * Echter Screenshot aus dem Kundenportal im angedeuteten Browserfenster.
 *
 * Die Screenshots sind 1400 px breit. Auf dem Handy auf die volle Breite
 * gestaucht, wäre die Schrift darin rund 3 px groß. Deshalb zeigt das Handy
 * einen Ausschnitt (`crop`, in Pixeln des Originals) im Maßstab MOBILE_SCALE
 * über die volle Bildschirmbreite, ab sm das ganze Bild.
 */
const MOBILE_SCALE = 0.45;

function Screenshot({
  src,
  alt,
  width,
  height,
  crop,
  dark,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop: { x: number; y: number; h: number };
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "-mx-4 overflow-hidden bg-card shadow-2xl sm:mx-0 sm:rounded-2xl sm:ring-1",
        dark ? "shadow-black/40 sm:ring-white/10" : "shadow-navy/15 sm:ring-border",
      )}
    >
      <div
        className="flex h-7 items-center gap-1.5 border-b bg-muted px-4 sm:h-8 sm:px-3"
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
      </div>
      <div className="relative overflow-hidden sm:hidden" style={{ height: crop.h * MOBILE_SCALE }}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="absolute max-w-none"
          style={{
            width: width * MOBILE_SCALE,
            height: height * MOBILE_SCALE,
            left: -crop.x * MOBILE_SCALE,
            top: -crop.y * MOBILE_SCALE,
          }}
        />
      </div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="hidden h-auto w-full sm:block"
      />
    </div>
  );
}

/** Kleine Karte mit Symbol, Titel und Text – für Problem-, Nutzen- und Ablaufkarten. */
function IconCard({
  icon: Icon,
  title,
  text,
  dark,
}: {
  icon: Icon;
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex gap-4 rounded-2xl p-5 sm:block sm:p-6",
        dark
          ? "bg-navy-light ring-1 ring-white/10"
          : "bg-card shadow-lg shadow-navy/5 ring-1 ring-border",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          dark ? "bg-amber/15" : "bg-amber/10",
        )}
      >
        <Icon
          className={cn("h-5 w-5", dark ? "text-amber-light" : "text-amber")}
          aria-hidden="true"
        />
      </div>
      <div>
        <h3
          className={cn(
            "text-base font-bold leading-snug sm:mt-5 sm:text-lg",
            dark ? "text-white" : "text-card-foreground",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-[0.95rem] leading-relaxed sm:mt-2",
            dark ? "text-slate-light" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------------- */
/* Problem                                                                    */
/* ------------------------------------------------------------------------- */

const PROBLEMS: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: RefreshCw, title: "prob1Title", text: "prob1Text" },
  { icon: Hourglass, title: "prob2Title", text: "prob2Text" },
  { icon: Footprints, title: "prob3Title", text: "prob3Text" },
  { icon: FileText, title: "prob4Title", text: "prob4Text" },
];

export function ProblemSection() {
  const { t } = useLang();

  return (
    <section id="problem" className={SECTION}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("probTitle")} />
        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <IconCard key={p.title} icon={p.icon} title={t(p.title)} text={t(p.text)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* So funktioniert es                                                         */
/* ------------------------------------------------------------------------- */

const STEPS: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: QrCode, title: "s1Title", text: "s1Text" },
  { icon: Smartphone, title: "s2Title", text: "s2Text" },
  { icon: ListChecks, title: "s3Title", text: "s3Text" },
  { icon: BellRing, title: "s4Title", text: "s4Text" },
];

/**
 * Vier Schritte als Zeitstrahl: auf dem Desktop waagerecht, auf dem Handy
 * senkrecht mit Linie links. Die Linie ist ein eigenes Element je Schritt und
 * reicht bis zum nächsten – beim letzten entfällt sie.
 */
export function StepsSection() {
  const { t } = useLang();

  return (
    <section id="ablauf" className={cn("section-muted", SECTION)}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("stepsTitle")} sub={t("stepsSub")} />
        <ol className="mx-auto mt-10 max-w-md sm:mt-14 lg:grid lg:max-w-none lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li
                key={step.title}
                className="relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0"
              >
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-7 top-16 w-0.5 bg-amber/30 lg:bottom-auto lg:left-[4.5rem] lg:right-[-1.5rem] lg:top-7 lg:h-0.5 lg:w-auto"
                  />
                )}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-lg shadow-navy/20">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-navy ring-2 ring-[oklch(0.94_0.01_260)]">
                    {i + 1}
                  </span>
                </div>
                <div className="pt-1 lg:mt-6 lg:pt-0">
                  <h3 className="text-lg font-bold text-foreground">{t(step.title)}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{t(step.text)}</p>
                  {last && <RouteChips className="mt-3" />}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Produkt: Digitale Speisekarte                                              */
/* ------------------------------------------------------------------------- */

const MENU_FEATURES: TranslationKey[] = [
  "menuF1",
  "menuF2",
  "menuF3",
  "menuF4",
  "menuF5",
  "menuF6",
];

export function MenuSection() {
  const { t } = useLang();

  return (
    <section id="speisekarte" className={SECTION}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber">
            {t("menuEyebrow")}
          </p>
          <h2 className="text-balance text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {t("menuTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("menuSub")}
          </p>

          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {MENU_FEATURES.map((key) => (
              <li key={key} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
                <span className="leading-snug text-foreground">{t(key)}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 flex gap-3 rounded-2xl bg-amber/10 p-4 font-medium leading-relaxed text-foreground ring-1 ring-amber/25 sm:p-5">
            <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-amber-dark" aria-hidden="true" />
            {t("menuBenefit")}
          </p>
        </div>

        <figure>
          <Screenshot
            src={menuEditorUrl}
            alt={t("menuShotAlt")}
            width={1400}
            height={839}
            crop={{ x: 205, y: 272, h: 540 }}
          />
          <figcaption className="text-balance mt-4 text-center text-sm leading-relaxed text-muted-foreground">
            {t("menuShotCap")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Produkt: Bestellen am Tisch                                                */
/* ------------------------------------------------------------------------- */

const ORDER_BENEFITS: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: Footprints, title: "order1Title", text: "order1Text" },
  { icon: ClipboardList, title: "order2Title", text: "order2Text" },
  { icon: Printer, title: "order3Title", text: "order3Text" },
  { icon: Tablet, title: "order4Title", text: "order4Text" },
];

export function OrderSection() {
  const { t } = useLang();

  return (
    <section id="bestellen" className={cn("section-navy", SECTION)}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t("orderEyebrow")}
          title={t("orderTitle")}
          sub={t("orderSub")}
          dark
        />

        <figure className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <Screenshot
            src={ordersUrl}
            alt={t("orderShotAlt")}
            width={1400}
            height={841}
            crop={{ x: 165, y: 285, h: 470 }}
            dark
          />
          <figcaption className="text-balance mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-light">
            {t("orderShotCap")}
          </figcaption>
        </figure>

        <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {ORDER_BENEFITS.map((b) => (
            <IconCard key={b.title} icon={b.icon} title={t(b.title)} text={t(b.text)} dark />
          ))}
        </ul>

        {/* Wer Produkt und Nutzen gesehen hat, soll hier direkt weiterkommen. */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <DemoButton track="order_demo">{t("orderCta")}</DemoButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Vergleich: Papier, PDF, BlitzScan                                          */
/* ------------------------------------------------------------------------- */

const COMPARISON: {
  label: TranslationKey;
  paper: TranslationKey;
  pdf: TranslationKey;
  next: TranslationKey;
}[] = [
  { label: "cmp1Label", paper: "cmp1Paper", pdf: "cmp1Pdf", next: "cmp1New" },
  { label: "cmp2Label", paper: "cmp2Paper", pdf: "cmp2Pdf", next: "cmp2New" },
  { label: "cmp3Label", paper: "cmp3Paper", pdf: "cmp3Pdf", next: "cmp3New" },
  { label: "cmp4Label", paper: "cmp4Paper", pdf: "cmp4Pdf", next: "cmp4New" },
];

/**
 * Die wichtigste Abgrenzung: Viele Wirte kennen die PDF hinter dem QR-Code als
 * "digitale Speisekarte". Die BlitzScan-Spalte ist grün und wirkt so wie die
 * passende Lösung. Papier und PDF bleiben neutral grau, nicht rot: Die
 * klassische Karte ist kein Fehler, und das Servicepersonal soll nicht
 * schlecht dastehen.
 *
 * Raster mit Tabellen-Rollen statt <table>: Auf dem Handy rückt die
 * Zeilenbeschriftung über die drei Werte, sonst sind vier Spalten auf 360 px
 * zu eng.
 */
export function ComparisonSection() {
  const { t } = useLang();
  const row = "grid grid-cols-3 sm:grid-cols-[24%_1fr_1fr_1fr]";
  const cell = "px-2.5 py-3 sm:p-5";

  return (
    <section id="vergleich" className={SECTION}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading title={t("compareTitle")} sub={t("compareSub")} />
        <div
          role="table"
          aria-label={t("compareTitle")}
          className="mt-10 overflow-hidden rounded-2xl bg-card text-sm shadow-lg shadow-navy/5 ring-1 ring-border sm:mt-12 sm:text-base"
        >
          <div role="row" className={cn(row, "border-b font-semibold")}>
            <div role="columnheader" className="hidden p-5 sm:block">
              <span className="sr-only">–</span>
            </div>
            <div role="columnheader" className={cn(cell, "text-muted-foreground")}>
              {t("compareColPaper")}
            </div>
            <div role="columnheader" className={cn(cell, "text-muted-foreground")}>
              {t("compareColPdf")}
            </div>
            <div role="columnheader" className={cn(cell, "bg-emerald-600 font-bold text-white")}>
              {t("compareColNew")}
            </div>
          </div>
          {COMPARISON.map((r) => (
            <div key={r.label} role="row" className={cn(row, "border-b last:border-b-0")}>
              <div
                role="rowheader"
                className="col-span-3 bg-muted/70 px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:col-span-1 sm:bg-transparent sm:p-5 sm:text-base sm:normal-case sm:tracking-normal sm:text-foreground"
              >
                {t(r.label)}
              </div>
              <div role="cell" className={cn(cell, "text-muted-foreground")}>
                {t(r.paper)}
              </div>
              <div role="cell" className={cn(cell, "text-muted-foreground")}>
                {t(r.pdf)}
              </div>
              <div
                role="cell"
                className={cn(
                  cell,
                  "flex items-start gap-1.5 bg-emerald-50 font-semibold text-emerald-950",
                )}
              >
                <Check
                  className="mt-0.5 hidden h-4 w-4 shrink-0 text-emerald-600 sm:block"
                  aria-hidden="true"
                />
                {t(r.next)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Warum BlitzScan: Einrichtung, Ansprechpartner, Referenzen                  */
/* ------------------------------------------------------------------------- */

const START_STEPS: { title: TranslationKey; text: TranslationKey }[] = [
  { title: "start1Title", text: "start1Text" },
  { title: "start2Title", text: "start2Text" },
  { title: "start3Title", text: "start3Text" },
];

const TEAM: { name: string; src: string; role: TranslationKey; note: TranslationKey }[] = [
  { name: "Vladislav Stoev", src: vladislavUrl, role: "team1Role", note: "team1Note" },
  { name: "Emil Koevski", src: emilUrl, role: "team2Role", note: "team2Note" },
];

/**
 * Nur Betriebe, bei denen BlitzScan im Bereich Speisekarte/Bestellung arbeitet
 * (Angaben laut Referenzen auf blitzscan.de). Das Hotel aus der
 * Reservierungsseite fehlt hier bewusst – es passt nicht zum Produkt.
 *
 * Fasika steht ohne Leistungsangabe da, bis bestätigt ist, was dort im
 * Einsatz ist (`note` ergänzen, sobald klar).
 */
const REFERENCES: { name: string; src: string; tile: string; note?: TranslationKey }[] = [
  { name: "Café Restaurant by Shaho", src: shahoUrl, tile: "bg-black", note: "refShaho" },
  { name: "Pizza Lab Napoli", src: pizzaLabUrl, tile: "bg-white p-2", note: "refPizzaLab" },
  { name: "Atrin Kebab Restaurant", src: atrinUrl, tile: "bg-white p-1.5", note: "refAtrin" },
  { name: "Fasika", src: fasikaUrl, tile: "bg-white p-1" },
];

/**
 * Was Kunden uns zurückmelden, zusammengefasst in unseren Worten. Bewusst
 * keine Zitate mit Namen: Erfundene oder nicht freigegebene Kundenstimmen
 * sind irreführende Werbung. Wörtliche Zitate nur mit Freigabe des Kunden.
 */
const VOICES: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: HeartHandshake, title: "voice1Title", text: "voice1Text" },
  { icon: Sparkles, title: "voice2Title", text: "voice2Text" },
  { icon: TrendingUp, title: "voice3Title", text: "voice3Text" },
];

/**
 * "Server in Deutschland" stützt sich auf das Hosting bei IONOS – bei einem
 * Wechsel des Anbieters diesen Punkt (und formTrust) prüfen.
 */
const TRUST_BADGES: { icon: Icon; label: TranslationKey }[] = [
  { icon: Lock, label: "trustBadge1" },
  { icon: Server, label: "trustBadge2" },
  { icon: Check, label: "trustBadge3" },
];

export function TrustSection() {
  const { t } = useLang();

  return (
    <section id="warum" className={SECTION}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("whyTitle")} sub={t("whySub")} />

        <ol className="mt-10 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {START_STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-2xl bg-card p-5 shadow-lg shadow-navy/5 ring-1 ring-border sm:p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-card-foreground sm:text-lg">{t(s.title)}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {t(s.text)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="section-navy mt-10 rounded-3xl p-6 sm:mt-14 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("teamTitle")}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-light">{t("teamText")}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-5">
              {TEAM.map((m) => (
                <li
                  key={m.name}
                  className="overflow-hidden rounded-2xl bg-navy-light ring-1 ring-white/10"
                >
                  <img
                    src={m.src}
                    alt={m.name}
                    width={500}
                    height={667}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/4.2] h-auto w-full object-cover object-top"
                  />
                  <div className="p-3 sm:p-4">
                    <p className="font-bold leading-tight text-white">{m.name}</p>
                    <p className="mt-1 text-xs leading-snug text-slate-light sm:text-sm">
                      {t(m.role)}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-amber-light">{t(m.note)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {TRUST_BADGES.map((badge) => (
            <li
              key={badge.label}
              className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border"
            >
              <badge.icon className="h-4 w-4 text-amber" aria-hidden="true" />
              {t(badge.label)}
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("referencesTitle")}
        </p>
        <ul className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-8">
          {REFERENCES.map((ref) => (
            <li key={ref.name} className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-2xl shadow-lg shadow-navy/10 ring-1 ring-border sm:h-24 sm:w-24",
                  ref.tile,
                )}
              >
                <img
                  src={ref.src}
                  alt={ref.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-sm font-semibold leading-tight text-foreground">
                {ref.name}
              </span>
              {ref.note && (
                <span className="text-xs leading-snug text-muted-foreground">{t(ref.note)}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-14">
          <h3 className="text-balance text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("voicesTitle")}
          </h3>
          <ul className="mt-6 grid gap-3 sm:gap-5 md:grid-cols-3">
            {VOICES.map((v) => (
              <IconCard key={v.title} icon={v.icon} title={t(v.title)} text={t(v.text)} />
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-muted-foreground">{t("voicesNote")}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Zwischenaufruf                                                             */
/* ------------------------------------------------------------------------- */

/** Zwischenaufruf nach dem Vertrauensteil – führt ins selbe Formular. */
export function CallbackBanner() {
  const { t } = useLang();

  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20 md:pb-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl bg-amber/10 px-5 py-8 text-center ring-1 ring-amber/30 sm:px-12 sm:py-10 lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("cbTitle")}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground sm:text-lg">{t("cbText")}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
          <DemoButton track="banner_demo">{t("cbCta")}</DemoButton>
          <WhatsAppLink
            data-track="banner_whatsapp"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-base font-bold text-foreground transition-colors hover:bg-muted"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
            {t("waCta")}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Optionale Erweiterungen                                                    */
/* ------------------------------------------------------------------------- */

const MORE: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: Star, title: "more1Title", text: "more1Text" },
  { icon: Wifi, title: "more2Title", text: "more2Text" },
  { icon: CalendarCheck, title: "more3Title", text: "more3Text" },
  { icon: Globe, title: "more4Title", text: "more4Text" },
  { icon: Gift, title: "more5Title", text: "more5Text" },
];

/**
 * Cross-Selling, bewusst zurückhaltend: kleine Karten, jede als "Optional"
 * markiert, kein eigener Knopf. Das Hauptprodukt bleibt die Speisekarte. Das
 * Foto erscheint erst ab lg – auf dem Handy würde es den Abschnitt nur
 * verlängern.
 */
export function MoreSection() {
  const { t } = useLang();

  return (
    <section id="erweiterungen" className={cn("section-muted", SECTION)}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("moreTitle")} sub={t("moreSub")} />
        <div className="mt-10 grid items-center gap-10 sm:mt-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden overflow-hidden rounded-3xl shadow-2xl shadow-navy/15 ring-1 ring-border lg:block">
            <img
              src={qrScanUrl}
              alt={t("moreImgAlt")}
              width={1000}
              height={750}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MORE.map((m, i) => (
              <li
                key={m.title}
                className={cn(
                  "flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5",
                  // Fünf Karten in zwei Spalten: Die letzte füllt die Reihe.
                  i === MORE.length - 1 && "sm:col-span-2",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10">
                  <m.icon className="h-5 w-5 text-amber" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-card-foreground">{t(m.title)}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("moreBadge")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(m.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* ------------------------------------------------------------------------- */

const FAQ: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "faq1Q", a: "faq1A" },
  { q: "faq2Q", a: "faq2A" },
  { q: "faq3Q", a: "faq3A" },
  { q: "faq4Q", a: "faq4A" },
  { q: "faq5Q", a: "faq5A" },
  { q: "faq6Q", a: "faq6A" },
  { q: "faq7Q", a: "faq7A" },
  { q: "faq8Q", a: "faq8A" },
  { q: "faq9Q", a: "faq9A" },
  { q: "faq10Q", a: "faq10A" },
];

export function FaqSection() {
  const { t } = useLang();

  return (
    <section id="faq" className={SECTION}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={t("faqTitle")} />
        <Accordion
          type="single"
          collapsible
          className="mt-8 rounded-2xl bg-card px-5 shadow-lg shadow-navy/5 ring-1 ring-border sm:mt-10 sm:px-8"
        >
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="last:border-b-0">
              <AccordionTrigger
                data-track={`faq_${item.q.slice(3, -1)}`}
                className="py-4 text-left text-base font-semibold hover:no-underline sm:py-5"
              >
                {t(item.q)}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {t(item.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Feste Leiste                                                               */
/* ------------------------------------------------------------------------- */

/**
 * Feste Kontaktleiste am unteren Rand.
 *
 * Auf dem Handy über die volle Breite (Anrufen, WhatsApp, Demo anfragen), auf
 * dem Desktop als kleine schwebende Leiste unten rechts (WhatsApp, Demo) – am
 * Rechner ruft kaum jemand an, dort würde die Nummer nur Platz kosten.
 *
 * Erscheint erst, wenn der Hero mit seinen eigenen Knöpfen aus dem Bild ist,
 * und verschwindet, sobald das Formular auftaucht – dort wäre sie doppelt und
 * würde Felder oder die Rechtslinks in der Fußzeile verdecken.
 */
export function StickyContactBar() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("kontakt");
    let frame = 0;

    const update = () => {
      frame = 0;
      const pastHero = hero ? hero.getBoundingClientRect().bottom < 0 : true;
      const beforeForm = form ? form.getBoundingClientRect().top > window.innerHeight : true;
      setVisible(pastHero && beforeForm);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const iconButton =
    "inline-flex h-12 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/25 text-[11px] font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/10";

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-all duration-300",
        "md:inset-x-auto md:right-6 md:bottom-6 md:rounded-2xl md:border md:p-2 md:shadow-2xl md:shadow-navy/30",
        visible ? "translate-y-0 md:opacity-100" : "translate-y-full md:translate-y-4 md:opacity-0",
      )}
    >
      <div className="flex gap-2">
        <a
          href={`tel:${PHONE_DIAL}`}
          onClick={trackCallClick}
          data-track="bar_call"
          className={cn(iconButton, "md:hidden")}
        >
          <Phone className="h-4 w-4 text-amber" aria-hidden="true" />
          {t("barCall")}
        </a>
        <WhatsAppLink data-track="bar_whatsapp" className={iconButton}>
          <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
          {t("waLabel")}
        </WhatsAppLink>
        <button
          type="button"
          onClick={requestDemo}
          data-track="bar_demo"
          className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-amber px-5 text-sm font-bold text-navy transition-colors hover:bg-amber-light active:bg-amber-dark"
        >
          {t("barCallback")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
