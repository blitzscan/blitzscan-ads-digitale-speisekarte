import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertCircle,
  BellRing,
  Check,
  Lock,
  MessageCircle,
  Phone,
  PlayCircle,
  QrCode,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import {
  CallbackBanner,
  ComparisonSection,
  DemoButton,
  FaqSection,
  LiveDemoButton,
  LiveDemoPhone,
  MenuSection,
  MoreSection,
  OrderSection,
  ProblemSection,
  RouteChips,
  StepsSection,
  StickyContactBar,
  TrustSection,
  WhatsAppLink,
} from "@/components/landing-sections";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/lead";
import { LangToggle, useLang, translations, type Lang } from "@/lib/i18n";
import { DEMO_URL, PHONE_DIAL, PHONE_DISPLAY } from "@/lib/site";
import { trackCallClick, trackFormStart, trackLead } from "@/lib/tracking";
import logoUrl from "@/assets/blitzscan-logo.png";
import heroUrl from "@/assets/gast-speisekarte-am-tisch.webp";

const hasVowel = (s: string) => /[aeiouäöü]/i.test(s);

const isGibberish = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.length < 3) return true;

  const letters = normalized.replace(/[^a-zäöüß]/g, "");
  if (letters.length < 2) return true;

  if (/^(.)(\1)+$/.test(normalized)) return true;
  if (/(.)(\1){3,}/.test(normalized)) return true;
  if (/(.{2})(\1){2,}/.test(normalized)) return true;

  // Nur Tastenfolgen, die in keinem echten Wort vorkommen. Mittelstücke wie
  // "wert" (Schwert), "erty" (Liberty) oder "nm" (Weinmann, Steinmetz) fehlen
  // absichtlich: Sie würden reale Betriebe und Nachnamen abweisen. Ein bloßes
  // "nm" fängt schon die Mindestlänge ab, "qwertz" fängt "qwer".
  const keyboardMashes = [
    "asdf",
    "fdsa",
    "sdfg",
    "dfgh",
    "fghj",
    "ghjk",
    "qwer",
    "rewq",
    "rtyu",
    "tyui",
    "zxcv",
    "vcxz",
    "xcvb",
    "cvbn",
    "vbnm",
    "uiop",
    "poiu",
    "jklö",
    "lkjö",
  ];
  if (keyboardMashes.some((seq) => normalized.includes(seq))) return true;

  const distinctLetters = new Set(letters).size;
  if (!hasVowel(normalized) && distinctLetters < 4) return true;

  return false;
};

/**
 * Absichtlich nachsichtig: Die Adresse wird nur gebraucht, falls der Rückruf
 * nicht durchkommt. Eine strenge Prüfung würde hier mehr echte Anfragen
 * abweisen als Tippfehler abfangen.
 */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

const buildSchema = (lang: Lang) => {
  const t = translations[lang];
  const nameSchema = (message: string) =>
    z
      .string()
      .min(3, message)
      .refine((val) => !isGibberish(val), t.errRealName);

  return z.object({
    restaurantName: nameSchema(t.errRestaurant),
    contactPerson: nameSchema(t.errContact),
    phone: z
      .string()
      .min(6, t.errPhone)
      .refine((val) => val.replace(/\D/g, "").length >= 5, t.errPhoneDigits)
      .refine((val) => !/^(.)(\1){5,}$/.test(val.replace(/\D/g, "")), t.errPhone),
    // Freiwillig: Jedes zusätzliche Pflichtfeld kostet Abschlüsse, und bezahlter
    // Verkehr ist zu teuer, um ihn an einem Nebenfeld zu verlieren. Leer ist
    // also gültig – steht etwas drin, muss es eine Adresse sein.
    email: z
      .string()
      .trim()
      .refine((val) => val === "" || looksLikeEmail(val), t.errEmail),
  });
};

type FormData = z.infer<ReturnType<typeof buildSchema>>;

const META_TITLE = "Digitale Speisekarte & Bestellsystem für Restaurants | BlitzScan";
const META_DESCRIPTION =
  "Digitale Speisekarte mit Bestellfunktion für Restaurants. Gäste bestellen per QR-Code direkt am Tisch. Persönliche Einrichtung und direkter Support mit BlitzScan.";

/**
 * Endgültige Adresse der Seite, z. B. https://blitzscan.de/digitale-speisekarte/.
 *
 * Nur im Build für blitzscan.de bekannt (BASE_URL = Upload-Ordner). Im
 * Lovable-Build ist BASE_URL "/" – dann entfallen Canonical, og:url und
 * og:image, statt auf die Startseite von blitzscan.de zu zeigen.
 */
const PAGE_URL =
  import.meta.env.BASE_URL === "/" ? null : `https://blitzscan.de${import.meta.env.BASE_URL}`;

export const Route = createFileRoute("/")({
  component: DigitaleSpeisekarteLanding,
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESCRIPTION },
      { property: "og:title", content: META_TITLE },
      { property: "og:description", content: META_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "BlitzScan" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(PAGE_URL
        ? [
            { property: "og:url", content: PAGE_URL },
            // public/og-digitale-speisekarte.jpg, 1200 × 630
            { property: "og:image", content: `${PAGE_URL}og-digitale-speisekarte.jpg` },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: PAGE_URL ? [{ rel: "canonical", href: PAGE_URL }] : [],
  }),
});

function DigitaleSpeisekarteLanding() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const schema = useMemo(() => buildSchema(lang), [lang]);

  // Für die Mindest-Ausfülldauer im Backend: Bots senden praktisch sofort.
  const mountedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const [failMessage, setFailMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { restaurantName: "", contactPerson: "", phone: "", email: "" },
  });

  const onSubmit = async (data: FormData) => {
    setFailMessage(null);

    try {
      await submitLead({
        restaurant: data.restaurantName,
        contact_person: data.contactPerson,
        phone: data.phone,
        email: data.email,
        language: lang,
        website: honeypot.current?.value ?? "",
        elapsed_ms: Date.now() - mountedAt.current,
      });
    } catch (error) {
      // Eingaben stehen lassen: Der Besucher soll erneut absenden können,
      // ohne alles noch einmal zu tippen.
      const message = error instanceof Error ? error.message : "";
      setFailMessage(message || t("toastError"));
      toast.error(message || t("toastError"));
      return;
    }

    // Erst melden, wenn der Server bestätigt hat – sonst zählt Google Ads auch
    // Anfragen, die nie bei uns angekommen sind.
    trackLead();

    toast.success(t("toastSuccess"));
    reset();
    await navigate({ to: "/danke" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero: Was, für wen, wie – und der Weg zur Demo, alles über der Falz. */}
      <section
        id="top"
        className="section-navy relative overflow-hidden px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-28 md:pb-24 lg:flex lg:min-h-[100dvh] lg:items-center"
      >
        <a
          href={import.meta.env.BASE_URL}
          data-track="hero_logo"
          className="absolute left-4 top-4 z-10 rounded-xl bg-white p-1.5 shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.02] sm:left-6 sm:top-6"
          aria-label={t("logoAria")}
        >
          <img
            src={logoUrl}
            alt="BlitzScan"
            className="h-10 w-auto sm:h-14"
            width="56"
            height="56"
          />
        </a>

        <LangToggle className="absolute right-4 top-4 z-10 inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:top-6" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Auf dem Handy steht der Knopf direkt unter der Unterzeile, die drei
              Nutzenpunkte folgen darunter (order-last). So ist der Knopf auch auf
              360 × 740 ohne Scrollen sichtbar – trotz Cookie-Banner. Ab lg die
              übliche Reihenfolge: Nutzen, dann Knopf. */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-amber/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber sm:mb-5">
              {t("eyebrow")}
            </span>
            {/* hyphens-auto: "Bestellfunktion" ist auf 360 px sonst breiter als die Zeile. */}
            <h1 className="text-balance hyphens-auto text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t("h1")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-light sm:mt-5 sm:text-lg">
              {t("heroSub")}
            </p>
            <ul className="order-last mt-7 flex w-fit flex-col gap-2.5 text-left lg:order-none lg:mt-6">
              {(["heroChip1", "heroChip2", "heroChip3"] as const).map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2.5 text-[0.95rem] font-semibold text-white sm:text-base"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber">
                    <Check className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex w-full flex-col items-center sm:mt-8 lg:items-start">
              <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
                <DemoButton track="hero_demo" className="px-8">
                  {t("heroCta")}
                </DemoButton>
                {/* Zweitrangig gestaltet (nur Umriss). Scrollt zum Handy mit der
                    Live-Demo; ab lg steht das Handy ohnehin daneben, dort
                    entfällt der Knopf. Erscheint nur, wenn in src/lib/site.ts
                    eine geprüfte Demo-Adresse steht. */}
                <LiveDemoButton
                  data-track="hero_live_demo"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-base font-bold text-white transition-colors hover:bg-white/10 sm:h-14 sm:w-auto lg:hidden"
                >
                  <PlayCircle className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
                  {t("heroDemo")}
                </LiveDemoButton>
              </div>
              <p className="mt-2 text-sm text-slate-light">
                {t("heroNote")} {t("heroCall")}{" "}
                <a
                  href={`tel:${PHONE_DIAL}`}
                  onClick={trackCallClick}
                  data-track="hero_call"
                  className="inline-flex items-center gap-1 py-2 font-semibold whitespace-nowrap text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-amber"
                >
                  <Phone className="h-3.5 w-3.5 text-amber" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <ProblemSection />
      <StepsSection />
      <MenuSection />
      <OrderSection />
      <ComparisonSection />
      <TrustSection />
      <CallbackBanner />
      <MoreSection />
      <FaqSection />

      {/* Lead Capture Form Section */}
      {/* Auf dem Handy wenig Innenabstand: Die Felder sollen fast die volle
          Breite haben, sonst wird das Tippen fummelig. */}
      <section
        id="kontakt"
        className="section-muted scroll-mt-4 px-3 py-14 sm:px-6 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl bg-card px-5 py-8 shadow-xl shadow-navy/5 ring-1 ring-border sm:p-10">
            <div className="text-center">
              <h2 className="text-balance text-[1.75rem] font-bold leading-tight tracking-tight text-card-foreground sm:text-4xl">
                {t("formTitle")}
              </h2>
              <p className="text-balance mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("formSub")}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-foreground">
                {(["formPerk1", "formPerk2", "formPerk3"] as const).map((key) => (
                  <li key={key} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-amber" aria-hidden="true" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* onFocus steigt in React nach oben (wie focusin): Das erste Feld, egal
                welches, meldet "Formular begonnen". */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              onFocus={trackFormStart}
              className="relative mt-8 space-y-5 sm:mt-10"
              noValidate
            >
              {/* Honigtopf: für Menschen unsichtbar, für Bots verlockend. Nicht mit
                  display:none – manche Bots überspringen ausgeblendete Felder. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="lead-website">Website</label>
                <input
                  id="lead-website"
                  name="website"
                  type="text"
                  ref={honeypot}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Field
                id="restaurantName"
                label={t("restaurantLabel")}
                placeholder={t("restaurantPlaceholder")}
                autoComplete="organization"
                error={errors.restaurantName?.message}
                {...register("restaurantName")}
              />

              <Field
                id="contactPerson"
                label={t("contactLabel")}
                placeholder={t("contactPlaceholder")}
                autoComplete="name"
                error={errors.contactPerson?.message}
                {...register("contactPerson")}
              />

              <Field
                id="phone"
                type="tel"
                inputMode="tel"
                label={t("phoneLabel")}
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Field
                id="email"
                type="email"
                inputMode="email"
                label={t("emailLabel")}
                optionalLabel={t("emailOptional")}
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                hint={t("emailHint")}
                error={errors.email?.message}
                {...register("email")}
              />

              {failMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                >
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("errorTitle")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{failMessage}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("errorText")}{" "}
                      <a
                        href={`tel:${PHONE_DIAL}`}
                        onClick={trackCallClick}
                        data-track="form_error_call"
                        className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
                      >
                        {PHONE_DISPLAY}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                data-track="form_submit"
                disabled={isSubmitting}
                className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-amber px-6 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] active:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                {t("consentText")}{" "}
                <a
                  href={`${import.meta.env.BASE_URL}datenschutz`}
                  data-track="form_privacy"
                  className="underline decoration-1 underline-offset-2 transition-colors hover:text-foreground"
                >
                  {t("consentLink")}
                </a>
                {t("consentAfter")}
              </p>
            </form>

            <div className="mt-8 border-t pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("formAlt")}{" "}
                <WhatsAppLink
                  data-track="form_whatsapp"
                  className="inline-flex items-center gap-1.5 py-2 font-semibold text-foreground underline decoration-amber decoration-2 underline-offset-4 transition-colors hover:text-amber-dark"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                  {t("formAltLink")}
                </WhatsAppLink>
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                {t("formTrust")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <StickyContactBar />
    </main>
  );
}

/**
 * Ein Formularfeld mit Beschriftung, Fehlermeldung und optionalem Hinweis.
 *
 * Die Felder unterschieden sich vorher nur in drei Wörtern, teilten sich aber
 * zwei Dutzend Zeilen Klassennamen – als Bauteil bleibt das Formular lesbar.
 */
const Field = ({
  id,
  label,
  optionalLabel,
  hint,
  error,
  type = "text",
  ref,
  ...props
}: React.ComponentPropsWithRef<"input"> & {
  id: string;
  label: string;
  // `| undefined` ist hier nötig: Das Projekt läuft mit
  // exactOptionalPropertyTypes, und react-hook-form liefert für ein Feld ohne
  // Fehler genau diesen Wert.
  optionalLabel?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
}) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">
      {label}
      {optionalLabel && (
        <span className="ml-1.5 font-normal text-muted-foreground">({optionalLabel})</span>
      )}
    </label>
    <input
      id={id}
      type={type}
      ref={ref}
      aria-invalid={error ? true : undefined}
      aria-describedby={hint ? `${id}-hint` : undefined}
      className={cn(
        "w-full rounded-xl border bg-background px-4 py-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-amber focus:ring-2 focus:ring-amber/20",
        error
          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
          : "border-input",
      )}
      {...props}
    />
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {hint}
      </p>
    )}
    {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
  </div>
);

/** Bestell-Bon, wie er im Restaurant ankommt. */
function OrderTicket({ className }: { className?: string }) {
  const { t } = useLang();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-64 rounded-2xl bg-card p-4 text-left text-card-foreground shadow-2xl shadow-black/30 ring-1 ring-border",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber/15">
          <BellRing className="h-4.5 w-4.5 text-amber-dark" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">{t("ticketLabel")}</p>
          <p className="text-xs text-muted-foreground">{t("ticketMeta")}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 border-t pt-3 text-sm">
        <li>{t("ticketItem1")}</li>
        <li>{t("ticketItem2")}</li>
        <li>{t("ticketItem3")}</li>
      </ul>
      <RouteChips className="mt-3" />
    </div>
  );
}

/**
 * Produktbild im Hero.
 *
 * Mit DEMO_URL: die Live-Demo im Handy, direkt bedienbar – wie auf
 * blitzscan.de. Der Bon daneben zeigt, wo die Bestellung ankommt. Er
 * erscheint erst ab lg links neben dem Handy; auf dem Handy würde er die
 * bedienbare Demo verdecken.
 *
 * Ohne DEMO_URL: das Foto vom Gast mit der Speisekarte am Tisch plus Bon.
 */
function HeroVisual() {
  const { t } = useLang();

  if (DEMO_URL) {
    return (
      <div className="relative pt-4 lg:pt-0">
        <LiveDemoPhone className="lg:mr-0 lg:ml-auto" />
        <OrderTicket className="absolute bottom-12 -left-8 hidden w-56 lg:block xl:left-0 xl:w-64" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <img
          src={heroUrl}
          alt={t("heroImgAlt")}
          width={1000}
          height={750}
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy shadow-lg sm:left-4 sm:top-4">
          <QrCode className="h-3.5 w-3.5 text-amber-dark" aria-hidden="true" />
          {t("heroBadge")}
        </span>
      </div>

      <OrderTicket className="relative z-10 -mt-10 ml-auto mr-3 sm:mr-6 lg:absolute lg:-bottom-8 lg:-left-8 lg:m-0" />
    </div>
  );
}
