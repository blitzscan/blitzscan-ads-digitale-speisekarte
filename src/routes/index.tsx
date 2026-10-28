import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Headset,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import {
  CallbackBanner,
  ComparisonSection,
  CostSection,
  FaqSection,
  PortalSection,
  StepsSection,
  StickyContactBar,
  TrustSection,
  WhatsAppLink,
  scrollToForm,
} from "@/components/landing-sections";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/lead";
import { LangToggle, useLang, translations, type Lang } from "@/lib/i18n";
import { PHONE_DIAL, PHONE_DISPLAY } from "@/lib/site";
import { trackCallClick, trackFormStart, trackLead } from "@/lib/tracking";
import logoUrl from "@/assets/blitzscan-logo.png";

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

export const Route = createFileRoute("/")({
  component: ReservierungssystemLanding,
  head: () => ({
    meta: [
      { title: "Reservierungssystem für Restaurants: 29 €/Monat, 0 % Provision | BlitzScan" },
      {
        name: "description",
        content:
          "Online-Reservierungen für Ihr Restaurant – in 48 Stunden live, 29 € im Monat, ohne Provision pro Gast. Persönlich eingerichtet von Ihrem Partner aus Köln.",
      },
      {
        property: "og:title",
        content: "Reservierungssystem für Restaurants: 29 €/Monat, 0 % Provision | BlitzScan",
      },
      {
        property: "og:description",
        content:
          "Online-Reservierungen für Ihr Restaurant – in 48 Stunden live, 29 € im Monat, ohne Provision pro Gast. Persönlich eingerichtet von Ihrem Partner aus Köln.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ReservierungssystemLanding() {
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
      {/* 1. Hero Section */}
      <section
        id="top"
        className="section-navy relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <a
          href={import.meta.env.BASE_URL}
          data-track="hero_logo"
          className="absolute left-5 top-5 z-10 rounded-xl bg-white p-1.5 shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-[1.02] sm:left-6 sm:top-6"
          aria-label={t("logoAria")}
        >
          <img
            src={logoUrl}
            alt="BlitzScan"
            className="h-12 w-auto sm:h-14"
            width="56"
            height="56"
          />
        </a>

        <LangToggle className="absolute right-5 top-5 z-10 inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:top-6" />

        <div className="mx-auto max-w-3xl">
          <span className="mb-5 inline-block rounded-full bg-amber/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber">
            {t("eyebrow")}
          </span>
          {/* hyphens-auto: "Reservierungssystem" ist auf 360 px sonst breiter als die Zeile. */}
          <h1 className="text-balance hyphens-auto text-[2rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("h1")}
          </h1>
          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-light sm:text-xl md:mt-8">
            {t("heroSub")}
          </p>
          {/* Der Preis gehört über die Falz: Er ist das stärkste Argument
              gegen die Provisionsmodelle und bei keinem Wettbewerber so niedrig. */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {(["heroChip1", "heroChip2", "heroChip3"] as const).map((key) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-white"
              >
                <Check className="h-4 w-4 text-amber" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={scrollToForm}
              data-track="hero_callback"
              className="inline-flex h-14 w-full max-w-xs items-center justify-center rounded-xl bg-amber px-8 text-base font-bold text-navy shadow-lg shadow-amber/20 transition-all duration-200 hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] active:bg-amber-dark sm:w-auto"
            >
              {t("heroCta")}
            </button>
            {/* Zweitrangig gestaltet (nur Umriss, kein Amber): Wer lieber tippt,
                soll zum Formular geführt werden, wer es eilig hat, kann anrufen. */}
            <a
              href={`tel:${PHONE_DIAL}`}
              onClick={trackCallClick}
              data-track="hero_call"
              className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Phone className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <button
          onClick={scrollToForm}
          data-track="hero_scroll"
          aria-label={t("scrollAria")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-light transition-colors hover:text-white"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </section>

      {/* 2. Die drei Versprechen */}
      <section id="vorteile" className="scroll-mt-4 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-10">
          <FeatureCard icon={Clock} title={t("f1Title")} text={t("f1Text")} />
          <FeatureCard icon={ShieldCheck} title={t("f2Title")} text={t("f2Text")} />
          <FeatureCard icon={Headset} title={t("f3Title")} text={t("f3Text")} />
        </div>
      </section>

      {/* Wer noch kein System hat, will erst sehen, was er bekommt, und dann, was
          es kostet: Portal vor Preis. Die Hintergründe wechseln dabei von selbst
          (weiß, grau, Marineblau, weiß). */}
      <PortalSection />
      <CostSection />
      <StepsSection />
      <CallbackBanner />
      <ComparisonSection />
      <TrustSection />
      <FaqSection />

      {/* Lead Capture Form Section */}
      <section id="kontakt" className="scroll-mt-4 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl bg-card p-8 shadow-xl shadow-navy/5 ring-1 ring-border sm:p-10">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
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
              className="relative mt-10 space-y-5"
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
                  className="inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-amber decoration-2 underline-offset-4 transition-colors hover:text-amber-dark"
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

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-lg shadow-navy/5 ring-1 ring-border transition-transform duration-200 hover:-translate-y-1 sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10">
        <Icon className="h-7 w-7 text-amber" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-card-foreground">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
