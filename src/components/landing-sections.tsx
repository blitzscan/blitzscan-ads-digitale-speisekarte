/**
 * Die Abschnitte der Landingpage zwischen Hero und Formular.
 *
 * Reihenfolge und Zweck: Das Portal zeigt zuerst, dass es ein echtes Produkt
 * gibt, danach folgt der Preis als stärkstes Argument. Der Ablauf nimmt die
 * Angst vor Aufwand, Vergleich und Referenzen bauen Vertrauen auf, das FAQ
 * räumt die letzten Einwände ab. Alles endet in derselben Handlung: Kontakt.
 *
 * Jeder Knopf trägt ein `data-track="…"`. Die Kennung (Ort_Zweck) wird beim
 * Klick an Google gemeldet, siehe src/lib/tracking.ts. Neue Knöpfe bekommen
 * einfach ebenfalls eines.
 */
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Check,
  ChartColumn,
  Handshake,
  LayoutGrid,
  Lock,
  MailCheck,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Server,
  Settings2,
  SlidersHorizontal,
  Star,
  UserPlus,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLang, type TranslationKey } from "@/lib/i18n";
import { FEE_PER_RESERVATION, PHONE_DIAL, PRICE_MONTHLY, whatsappUrl } from "@/lib/site";
import { trackCallClick, trackWhatsAppClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import timelineUrl from "@/assets/portal-timeline.webp";
import floorplanUrl from "@/assets/portal-floorplan.webp";
import widgetLightUrl from "@/assets/portal-widget-hell.webp";
import widgetDarkUrl from "@/assets/portal-widget-dunkel.webp";
import widgetEmailUrl from "@/assets/portal-widget-email.webp";
import shahoUrl from "@/assets/kunde-shaho.webp";
import pizzaLabUrl from "@/assets/kunde-pizza-lab-napoli.webp";
import atrinUrl from "@/assets/kunde-atrin.webp";
import hotelNeumarktUrl from "@/assets/kunde-hotel-neumarkt.webp";

type Icon = React.ComponentType<{ className?: string }>;

export function scrollToForm() {
  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
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

function SectionHeading({ title, sub, dark }: { title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2
        className={cn(
          "text-balance text-3xl font-bold tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "text-balance mx-auto mt-4 text-lg leading-relaxed",
            dark ? "text-slate-light" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

const STEPS: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: UserPlus, title: "s1Title", text: "s1Text" },
  { icon: Handshake, title: "s2Title", text: "s2Text" },
  { icon: Settings2, title: "s3Title", text: "s3Text" },
  { icon: Rocket, title: "s4Title", text: "s4Text" },
];

export function StepsSection() {
  const { t } = useLang();

  return (
    <section id="ablauf" className="scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("stepsTitle")} sub={t("stepsSub")} />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl bg-card p-7 shadow-lg shadow-navy/5 ring-1 ring-border"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-base font-bold text-white">
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-amber" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-card-foreground">{t(step.title)}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{t(step.text)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type PortalImage = {
  alt: TranslationKey;
  src: string;
  width: number;
  height: number;
};

type PortalView = {
  id: "timeline" | "floorplan" | "widget";
  tab: TranslationKey;
  caption: TranslationKey;
  /** Spalten nebeneinander, die Bilder darin untereinander. */
  columns: PortalImage[][];
};

// Die ersten beiden zeigen das Portal des Wirts, "widget" das Buchungsformular
// der Gäste – zwei Designs, damit sichtbar wird, dass es sich der Website anpasst.
// Links das helle Formular mit der Bestätigungs-Mail darunter, rechts das lange
// dunkle: Beide Seiten sind so ungefähr gleich hoch.
const PORTAL_VIEWS: [PortalView, ...PortalView[]] = [
  {
    id: "timeline",
    tab: "portalTab1",
    caption: "portalCap1",
    columns: [[{ alt: "portalAlt1", src: timelineUrl, width: 1400, height: 841 }]],
  },
  {
    id: "floorplan",
    tab: "portalTab2",
    caption: "portalCap2",
    columns: [[{ alt: "portalAlt2", src: floorplanUrl, width: 1400, height: 846 }]],
  },
  {
    id: "widget",
    tab: "portalTab3",
    caption: "portalCap3",
    columns: [
      [
        { alt: "portalAlt3", src: widgetLightUrl, width: 803, height: 805 },
        { alt: "portalAlt5", src: widgetEmailUrl, width: 706, height: 692 },
      ],
      [{ alt: "portalAlt4", src: widgetDarkUrl, width: 500, height: 1066 }],
    ],
  },
];

const FEATURES: { icon: Icon; title: TranslationKey; text: TranslationKey }[] = [
  // "Keine Überbuchungen" zuerst: Das spürt der Gastronom jeden Abend.
  { icon: CalendarCheck, title: "ft2Title", text: "ft2Text" },
  { icon: MailCheck, title: "ft1Title", text: "ft1Text" },
  { icon: Star, title: "ft7Title", text: "ft7Text" },
  { icon: LayoutGrid, title: "ft3Title", text: "ft3Text" },
  { icon: ChartColumn, title: "ft4Title", text: "ft4Text" },
  { icon: SlidersHorizontal, title: "ft5Title", text: "ft5Text" },
];

export function PortalSection() {
  const { t } = useLang();
  const [active, setActive] = useState<PortalView["id"]>("timeline");
  const view = PORTAL_VIEWS.find((v) => v.id === active) ?? PORTAL_VIEWS[0];

  return (
    <section id="portal" className="section-muted scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("portalTitle")} sub={t("portalSub")} />

        <div className="mt-10 flex justify-center">
          <div role="tablist" className="inline-flex rounded-xl bg-muted p-1">
            {PORTAL_VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                id={`portal-tab-${v.id}`}
                aria-selected={v.id === active}
                aria-controls="portal-panel"
                data-track={`portal_tab_${v.id}`}
                onClick={() => setActive(v.id)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                  v.id === active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(v.tab)}
              </button>
            ))}
          </div>
        </div>

        <figure
          id="portal-panel"
          role="tabpanel"
          aria-labelledby={`portal-tab-${view.id}`}
          className="mt-8"
        >
          {/* Mehrere Spalten (Gästesicht) stehen ab md nebeneinander, auf dem
              Handy untereinander mit begrenzter Breite. */}
          <div
            className={cn(
              "grid items-start gap-6",
              // 1.042fr statt gleich breiter Spalten: So sind die zwei Bilder links
              // zusammen genauso hoch wie das lange rechts, ohne dass sich der
              // Abstand dazwischen dehnen muss. Gilt für diese drei Screenshots.
              view.columns.length > 1 &&
                "mx-auto max-w-3xl md:grid-cols-[1.042fr_1fr] md:items-stretch",
            )}
          >
            {view.columns.map((column) => (
              <div
                key={column[0]?.src}
                className={cn(
                  "flex flex-col gap-6",
                  // justify-between: Die Spalten sind gleich hoch, das erste Bild
                  // schließt oben ab, das letzte unten – so enden beide Seiten
                  // bündig, egal wie hoch die Screenshots sind.
                  view.columns.length > 1 && "mx-auto w-full max-w-md justify-between md:max-w-none",
                )}
              >
                {column.map((img) => (
                  <div
                    key={img.src}
                    className="overflow-hidden rounded-2xl bg-card shadow-2xl shadow-navy/10 ring-1 ring-border"
                  >
                    <img
                      src={img.src}
                      alt={t(img.alt)}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <figcaption className="text-balance mx-auto mt-5 max-w-2xl text-center leading-relaxed text-muted-foreground">
            {t(view.caption)}
          </figcaption>
        </figure>

        <h3 className="mt-20 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("featuresTitle")}
        </h3>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sechs Karten: zwei volle Reihen zu je drei. Bei einer anderen Zahl
              bleibt am Ende eine Lücke – dann lieber eine Karte ergänzen oder
              streichen. */}
          {FEATURES.map((f) => (
            <li
              key={f.title}
              className="flex gap-4 rounded-2xl bg-card p-6 shadow-lg shadow-navy/5 ring-1 ring-border"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10">
                <f.icon className="h-5 w-5 text-amber" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-card-foreground">{t(f.title)}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.text)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PRICE_ITEMS: TranslationKey[] = [
  "priceI1",
  "priceI2",
  "priceI3",
  "priceI4",
  "priceI5",
  "priceI6",
  "priceI7",
  "priceI8",
];

/**
 * Kostenrechner und Preiskarte.
 *
 * Die Gebühr der Provisionsmodelle ist fest (FEE_PER_RESERVATION), der
 * Besucher stellt nur die Zahl seiner Reservierungen ein. Die Zahl ist als
 * Beispiel gekennzeichnet (calcNote), nicht als Preis eines bestimmten
 * Anbieters: Die Tarife unterscheiden sich, und vergleichende Werbung muss
 * nachprüfbar sein.
 */
export function CostSection() {
  const { t, lang } = useLang();
  const [reservations, setReservations] = useState(150);

  const locale = lang === "de" ? "de-DE" : "en-GB";
  const euro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const euroCents = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  const number = new Intl.NumberFormat(locale);

  const before = reservations * FEE_PER_RESERVATION;
  const saving = Math.max(0, (before - PRICE_MONTHLY) * 12);

  return (
    <section id="preis" className="section-navy scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("costTitle")} sub={t("costSub")} dark />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="rounded-3xl bg-navy-light p-7 ring-1 ring-white/10 sm:p-10 lg:col-span-3">
            <Slider
              id="calc-reservations"
              label={t("calcReservations")}
              value={reservations}
              display={number.format(reservations)}
              min={10}
              max={600}
              step={10}
              onChange={setReservations}
            />
            <div className="mt-8 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-white">{t("calcFee")}</span>
              <span className="shrink-0 text-xl font-bold text-amber-light">
                {euroCents.format(FEE_PER_RESERVATION)}
              </span>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5">
                <dt className="text-sm text-slate-light">{t("calcBefore")}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{euro.format(before)}</dd>
              </div>
              <div className="rounded-2xl bg-white/5 p-5">
                <dt className="text-sm text-slate-light">{t("calcAfter")}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{euro.format(PRICE_MONTHLY)}</dd>
              </div>
              <div className="rounded-2xl bg-amber/15 p-5 ring-1 ring-amber/40 sm:col-span-2">
                <dt className="text-sm font-semibold text-amber-light">{t("calcSaving")}</dt>
                <dd className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {euro.format(saving)}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-slate-light">{t("calcNote")}</p>
          </div>

          <div className="flex flex-col rounded-3xl bg-card p-7 text-card-foreground shadow-2xl shadow-black/20 sm:p-10 lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber">
              {t("priceLabel")}
            </p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tracking-tight">
                {euro.format(PRICE_MONTHLY)}
              </span>
              <span className="text-muted-foreground">{t("pricePer")}</span>
            </p>
            <ul className="mt-8 space-y-3">
              {PRICE_ITEMS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
                  <span className="leading-snug">{t(key)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <button
                type="button"
                onClick={scrollToForm}
                data-track="price_callback"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-amber px-6 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] active:bg-amber-dark"
              >
                {t("priceCta")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  className,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-white">
          {label}
        </label>
        <output htmlFor={id} className="shrink-0 text-xl font-bold text-amber-light">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer accent-amber"
      />
    </div>
  );
}

const COMPARISON: { label: TranslationKey; old: TranslationKey; new: TranslationKey }[] = [
  { label: "cmp1Label", old: "cmp1Old", new: "cmp1New" },
  { label: "cmp2Label", old: "cmp2Old", new: "cmp2New" },
  { label: "cmp3Label", old: "cmp3Old", new: "cmp3New" },
  { label: "cmp4Label", old: "cmp4Old", new: "cmp4New" },
  { label: "cmp5Label", old: "cmp5Old", new: "cmp5New" },
];

/**
 * Vergleich gegen "Provisionsmodell", nicht gegen einen Anbieter beim Namen:
 * Vergleichende Werbung muss nachprüfbar sein (§ 6 UWG), und die Tarife der
 * Plattformen unterscheiden sich im Detail.
 */
export function ComparisonSection() {
  const { t } = useLang();

  return (
    <section id="vergleich" className="section-muted scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={t("compareTitle")} sub={t("compareSub")} />
        {/* Raster mit Tabellen-Rollen statt <table>: Auf dem Handy rückt die
            Zeilenbeschriftung über die beiden Werte, sonst sind drei Spalten
            auf 360 px zu eng. */}
        <div
          role="table"
          aria-label={t("compareTitle")}
          className="mt-12 overflow-hidden rounded-2xl bg-card text-sm shadow-lg shadow-navy/5 ring-1 ring-border sm:text-base"
        >
          <div role="row" className="grid grid-cols-2 border-b sm:grid-cols-[30%_1fr_1fr]">
            <div role="columnheader" className="hidden p-5 sm:block">
              <span className="sr-only">–</span>
            </div>
            <div
              role="columnheader"
              className="bg-destructive/15 p-4 font-semibold text-destructive sm:p-5"
            >
              {t("compareColOld")}
            </div>
            <div
              role="columnheader"
              className="bg-green-600/15 p-4 font-bold text-green-800 sm:p-5"
            >
              {t("compareColNew")}
            </div>
          </div>
          {COMPARISON.map((row) => (
            <div
              key={row.label}
              role="row"
              className="grid grid-cols-2 border-b last:border-b-0 sm:grid-cols-[30%_1fr_1fr]"
            >
              <div
                role="rowheader"
                className="col-span-2 bg-muted/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:col-span-1 sm:bg-transparent sm:p-5 sm:text-base sm:normal-case sm:tracking-normal sm:text-foreground"
              >
                {t(row.label)}
              </div>
              <div
                role="cell"
                className="flex items-start gap-2 bg-destructive/10 px-3.5 py-3 text-foreground/80 sm:p-5"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                {t(row.old)}
              </div>
              <div
                role="cell"
                className="flex items-start gap-2 bg-green-600/10 px-3.5 py-3 font-semibold text-foreground sm:p-5"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                {t(row.new)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REFERENCES = [
  { name: "Café Restaurant by Shaho", src: shahoUrl, tile: "bg-black" },
  { name: "Pizza Lab Napoli", src: pizzaLabUrl, tile: "bg-white p-2" },
  { name: "Atrin Kebab Restaurant", src: atrinUrl, tile: "bg-white p-1.5" },
  { name: "Kölner Hotel am Neumarkt", src: hotelNeumarktUrl, tile: "bg-white p-2" },
];

/**
 * "Server in Deutschland" stützt sich auf das Hosting bei IONOS – bei einem
 * Wechsel des Anbieters diesen Punkt (und faq10A, priceI8, formTrust) prüfen.
 */
const TRUST_BADGES: { icon: Icon; label: TranslationKey }[] = [
  { icon: Lock, label: "trustBadge1" },
  { icon: Server, label: "trustBadge2" },
  { icon: MapPin, label: "trustBadge3" },
];

export function TrustSection() {
  const { t } = useLang();

  return (
    <section id="warum" className="scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("trustTitle")}
        </h2>
        <p className="text-balance mx-auto mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {t("trustText")}
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {TRUST_BADGES.map((badge) => (
            <li
              key={badge.label}
              className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border"
            >
              <badge.icon className="h-4 w-4 text-amber" aria-hidden="true" />
              {t(badge.label)}
            </li>
          ))}
        </ul>

        <p className="mt-16 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("referencesTitle")}
        </p>
        <ul className="mt-6 flex flex-wrap items-start justify-center gap-10">
          {REFERENCES.map((ref) => (
            <li key={ref.name} className="flex w-32 flex-col items-center gap-3">
              <div
                className={cn(
                  "h-24 w-24 overflow-hidden rounded-2xl shadow-lg shadow-navy/10 ring-1 ring-border",
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
              <span className="text-sm font-semibold text-foreground">{ref.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

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
    <section id="faq" className="section-muted scroll-mt-4 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={t("faqTitle")} />
        <Accordion
          type="single"
          collapsible
          className="mt-10 rounded-2xl bg-card px-6 shadow-lg shadow-navy/5 ring-1 ring-border sm:px-8"
        >
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="last:border-b-0">
              <AccordionTrigger
                data-track={`faq_${item.q.slice(3, -1)}`}
                className="py-5 text-base font-semibold hover:no-underline"
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

/**
 * Zwischenaufruf nach dem Produkt-Einblick – für alle, die nicht bis zum
 * Formular lesen wollen. Wer hier klickt, landet trotzdem im selben Formular.
 */
export function CallbackBanner() {
  const { t } = useLang();

  return (
    <section className="px-6 pb-20 md:pb-28">
      <div className="section-navy mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-3xl px-7 py-10 text-center shadow-2xl shadow-navy/20 sm:px-12 lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("cbTitle")}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-light">{t("cbText")}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
          <button
            type="button"
            onClick={scrollToForm}
            data-track="banner_callback"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-amber px-7 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light active:scale-[0.98] active:bg-amber-dark"
          >
            {t("cbCta")}
          </button>
          <WhatsAppLink
            data-track="banner_whatsapp"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
            {t("waCta")}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}

/**
 * Feste Kontaktleiste am unteren Rand.
 *
 * Auf dem Handy über die volle Breite (Anrufen, WhatsApp, Rückruf), auf dem
 * Desktop als kleine schwebende Leiste unten rechts (WhatsApp, Rückruf) – am
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
          onClick={scrollToForm}
          data-track="bar_callback"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-amber px-5 text-sm font-bold text-navy transition-colors hover:bg-amber-light active:bg-amber-dark"
        >
          {t("barCallback")}
        </button>
      </div>
    </div>
  );
}
