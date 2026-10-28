import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "de" | "en";

const STORAGE_KEY = "blitzscan-lang";

export const translations = {
  de: {
    langToggleLabel: "Switch to English",
    langToggleText: "EN",
    logoAria: "BlitzScan – Zur Startseite",
    eyebrow: "Reservierungssystem für die Gastronomie",
    h1: "Online-Reservierungen ohne Provision – in 48 Stunden live.",
    heroSub:
      "Wir richten Ihr Reservierungssystem persönlich ein – inklusive Buchungs-Widget für Ihre Website. Ihre Gäste buchen rund um die Uhr, Sie behalten den Überblick.",
    heroChip1: "29 € / Monat",
    heroChip2: "0 % Provision",
    heroChip3: "Monatlich kündbar",
    heroCta: "Kostenlosen Rückruf anfordern",
    scrollAria: "Zum Kontaktformular scrollen",
    f1Title: "In 48h live.",
    f1Text:
      "Wir richten Tische, Floorplan und Buchungs-Widget für Sie ein. Schon nach zwei Tagen können Ihre Gäste online reservieren.",
    f2Title: "0 % Provision.",
    f2Text:
      "29 € im Monat – egal, wie viele Gäste bei Ihnen reservieren. Keine Gebühr pro Gast, keine versteckten Kosten.",
    f3Title: "Persönlich statt Selbstbedienung.",
    f3Text:
      "Sie müssen nichts selbst einrichten – das machen wir. Und danach sind wir telefonisch für Sie da, nicht per Ticketsystem.",
    stepsTitle: "So starten Sie",
    stepsSub: "Vom ersten Kontakt bis zur ersten Online-Buchung – die meiste Arbeit liegt bei uns.",
    s1Title: "Kurz melden",
    s1Text:
      "Ein Anruf, eine WhatsApp oder das Formular genügt. Wir eröffnen Ihr Konto und senden Ihnen die Zugangsdaten für Ihr Kundenportal.",
    s2Title: "Gemeinsam einrichten",
    s2Text:
      "Ihr Ansprechpartner nimmt sich Zeit für Sie und übernimmt die Einrichtung – ohne Zusatzkosten.",
    s3Title: "Auf Ihren Betrieb abstimmen",
    s3Text:
      "Tische, Floorplan, Öffnungs- und Schließzeiten passen wir an Ihren Alltag an. Das Buchungsformular kommt auf Ihre Website – oder Sie nutzen einen direkten Buchungslink.",
    s4Title: "Online buchbar",
    s4Text:
      "Ihre Gäste reservieren rund um die Uhr. Die Einweisung bekommen Sie am Telefon – oder bei Ihnen vor Ort, wenn Ihr Restaurant in unserer Nähe liegt.",
    portalTitle: "Ihr Reservierungsportal",
    portalSub: "Alle Reservierungen an einem Ort – übersichtlich und ohne Schulung verständlich.",
    portalTab1: "Timeline",
    portalTab2: "Floorplan",
    portalTab3: "Gästesicht",
    portalCap1:
      "Alle Reservierungen des Tages auf einen Blick – nach Tisch und Uhrzeit. Telefonische Buchungen tragen Sie mit einem Klick selbst ein.",
    portalCap2:
      "Ihr Restaurant, wie es wirklich ist: Sie sehen sofort, welcher Tisch frei, reserviert oder belegt ist.",
    portalCap3:
      "So buchen Ihre Gäste: Personenzahl, Datum und Uhrzeit wählen, Namen und E-Mail eintragen – fertig. Hell oder dunkel, passend zum Design Ihrer Website. Danach kommt sofort die Bestätigung per E-Mail – mit Storno-Link.",
    portalAlt5:
      "Bestätigungs-E-Mail an den Gast mit Datum, Uhrzeit, Personenzahl und Knopf zum Stornieren",
    portalAlt3:
      "Buchungsformular für Gäste im hellen Design mit Personenzahl, Datum, Uhrzeiten und Kontaktfeldern",
    portalAlt4:
      "Buchungsformular für Gäste im dunklen Design mit Personenzahl, Datum, Uhrzeiten und Kontaktfeldern",
    portalAlt1: "Timeline-Ansicht im BlitzScan-Kundenportal mit den Reservierungen eines Tages",
    portalAlt2:
      "Floorplan-Ansicht im BlitzScan-Kundenportal mit freien, reservierten und belegten Tischen",
    featuresTitle: "Alles drin, was Sie brauchen",
    ft1Title: "Automatische Bestätigung",
    ft1Text:
      "Ihre Gäste erhalten sofort eine Bestätigungs-E-Mail – mit Link, über den sie selbst stornieren können.",
    ft2Title: "Keine Überbuchungen",
    ft2Text:
      "Online, am Telefon oder spontan an der Tür – alle Buchungen landen im selben Reservierungsbuch. Das System kennt Ihre Kapazitäten, vergibt online automatisch den passenden Tisch und lässt keine Doppelbelegung zu.",
    ft7Title: "Mehr Google-Bewertungen",
    ft7Text:
      "Nach dem Besuch bekommt Ihr Gast automatisch eine E-Mail mit dem Link zu Ihrer Google-Bewertung – Sie müssen niemanden ansprechen.",
    ft3Title: "Interaktiver Floorplan",
    ft3Text:
      "Maßgeschneiderte Tischlayouts, Kombinationen und Kapazitäten, die zu Ihrem Restaurant passen.",
    ft4Title: "Analytik & Berichte",
    ft4Text: "Belegung, No-Show-Rate und Einblicke in Ihre Gäste – in Echtzeit.",
    ft5Title: "Sie behalten die Kontrolle",
    ft5Text:
      "Öffnungszeiten für Reservierungen, aktive Tische und Schließtage stellen Sie jederzeit selbst im Kundenportal ein.",
    costTitle: "Rechnen Sie nach",
    costSub:
      "Bei Provisionsmodellen zahlen Sie für jede Reservierung. Bei BlitzScan zahlen Sie einen festen Monatspreis – egal, wie voll Ihr Restaurant ist.",
    calcReservations: "Online-Reservierungen pro Monat",
    calcFee: "Gebühr pro Reservierung bei einem Provisionsmodell",
    calcBefore: "Mit Provisionsmodell pro Monat",
    calcAfter: "Mit BlitzScan pro Monat",
    calcSaving: "Ihre Ersparnis pro Jahr",
    calcNote:
      "Beispielrechnung mit 1,50 € pro Reservierung, einem häufigen Wert bei Provisionsmodellen. Die Gebühren der einzelnen Anbieter weichen ab. Stellen Sie Ihre eigene Anzahl ein. Alle Preise netto.",
    priceLabel: "BlitzScan Reservierungssystem",
    pricePer: "/ Monat zzgl. MwSt.",
    priceI1: "0 % Provision, keine Gebühr pro Gast",
    priceI2: "Persönliche Einrichtung & Widget-Einbau",
    priceI3: "Direkter Buchungslink für Google, Instagram & WhatsApp",
    priceI4: "Bestätigungs-E-Mails mit Storno-Link",
    priceI5: "Floorplan, Analytik & Kundenportal",
    priceI6: "Persönlicher Ansprechpartner am Telefon",
    priceI7: "Monatlich kündbar",
    priceI8: "DSGVO-konform, Server in Deutschland",
    priceCta: "Jetzt starten",
    compareTitle: "Provision oder Festpreis?",
    compareSub: "So unterscheidet sich BlitzScan von Provisionsmodellen.",
    compareColOld: "Provisionsmodell",
    compareColNew: "BlitzScan",
    cmp1Label: "Kosten pro Reservierung",
    cmp1Old: "Gebühr für jede Reservierung",
    cmp1New: "0 €",
    cmp2Label: "Monatliche Kosten",
    cmp2Old: "Steigen mit jeder Buchung",
    cmp2New: "29 € fest (netto)",
    cmp3Label: "Einrichtung",
    cmp3Old: "Meist selbst erledigen",
    cmp3New: "Wir richten alles ein",
    cmp4Label: "Vertragsbindung",
    cmp4Old: "Oft lange Laufzeiten",
    cmp4New: "Monatlich kündbar",
    cmp5Label: "Ansprechpartner",
    cmp5Old: "Hotline oder Ticketsystem",
    cmp5New: "Persönlich am Telefon",
    trustTitle: "Ihr persönlicher Gastro-Partner aus Köln",
    trustText:
      "Im Gegensatz zu anonymen Großkonzernen sind wir persönlich für Sie da – am Telefon statt im Ticketsystem. Wir verstehen die Gastronomie und bieten Ihnen Software, die Ihrem Team Arbeit abnimmt, statt neue zu schaffen.",
    trustBadge1: "DSGVO-konform",
    trustBadge2: "Server in Deutschland",
    trustBadge3: "Persönlich aus Köln",
    referencesTitle: "Diese Betriebe arbeiten bereits mit BlitzScan",
    faqTitle: "Häufige Fragen",
    faq1Q: "Was kostet BlitzScan genau?",
    faq1A:
      "29 € im Monat zzgl. MwSt. – egal, wie viele Gäste bei Ihnen reservieren. Es gibt keine Provision und keine Gebühr pro Gast. Einrichtung und Widget-Einbau sind inklusive.",
    faq2Q: "Wie schnell bin ich live?",
    faq2A:
      "In der Regel innerhalb von 48 Stunden nach unserem ersten Gespräch. Ihr Betrieb läuft in der Zeit ganz normal weiter.",
    faq3Q: "Muss ich technisch etwas können?",
    faq3A:
      "Nein. Wir richten Tische, Floorplan und Öffnungszeiten gemeinsam mit Ihnen ein und bauen das Buchungsformular auf Ihrer Website ein. Danach zeigen wir Ihnen alles – am Telefon oder bei Ihnen vor Ort.",
    faq4Q: "Wie trage ich telefonische Reservierungen ein?",
    faq4A:
      "Mit einem Klick im Kundenportal. So landen Online-, Telefon- und Walk-in-Buchungen im selben Reservierungsbuch, und das System verhindert Doppelbelegungen.",
    faq5Q: "Ich habe keine eigene Website. Geht das trotzdem?",
    faq5A:
      "Ja. Sie erhalten einen direkten Buchungslink, den Sie in Ihr Google-Profil, auf Instagram oder in WhatsApp stellen können.",
    faq6Q: "Bekommen meine Gäste eine Bestätigung?",
    faq6A:
      "Ja. Jeder Gast erhält automatisch eine Bestätigungs-E-Mail mit einem Link, über den er seine Reservierung selbst stornieren kann.",
    faq7Q: "Wie lange bin ich an den Vertrag gebunden?",
    faq7A:
      "BlitzScan ist monatlich kündbar. Wir wollen Sie mit gutem Service halten, nicht mit einem langen Vertrag.",
    faq8Q: "Kann ich Öffnungszeiten und Tische selbst ändern?",
    faq8A:
      "Ja. Öffnungszeiten für Reservierungen, aktive Tische und Schließtage stellen Sie jederzeit selbst in Ihrem Kundenportal ein. Oder Sie rufen uns an, und wir erledigen das für Sie.",
    faq9Q: "Kann ich später weitere Funktionen dazunehmen?",
    faq9A:
      "Ja. BlitzScan bietet auch digitale Speisekarten, ein Kellner-System und Online-Bestellungen – alles im selben Kundenportal.",
    faq10Q: "Wo liegen meine Daten und die meiner Gäste?",
    faq10A:
      "Auf Servern in Deutschland. BlitzScan arbeitet DSGVO-konform – die Daten Ihrer Gäste gehören Ihnen und werden nicht an Dritte weitergegeben.",
    formTitle: "Lassen Sie uns über Ihre Reservierungen sprechen.",
    formSub:
      "Tragen Sie sich ein. Wir rufen Sie innerhalb von 2 Stunden zurück – auch am Wochenende – und zeigen Ihnen, wie BlitzScan in Ihrem Restaurant funktioniert.",
    formPerk1: "Kostenlos & unverbindlich",
    formPerk2: "Rückruf in 2 Stunden",
    formPerk3: "Monatlich kündbar",
    formAlt: "Lieber direkt schreiben?",
    formAltLink: "Per WhatsApp anfragen",
    formTrust: "DSGVO-konform · Server in Deutschland",
    barCall: "Anrufen",
    barCallback: "Rückruf anfordern",
    cbTitle: "Keine Zeit zum Lesen? Wir rufen Sie an.",
    cbText:
      "In einem kurzen Gespräch klären wir, ob BlitzScan zu Ihrem Restaurant passt – kostenlos und unverbindlich.",
    cbCta: "Rückruf anfordern",
    waCta: "Per WhatsApp schreiben",
    waLabel: "WhatsApp",
    waMessage: "Hallo BlitzScan, ich interessiere mich für Ihr Reservierungssystem.",
    restaurantLabel: "Name des Restaurants",
    restaurantPlaceholder: "z. B. Restaurant Lumière",
    contactLabel: "Ansprechpartner",
    contactPlaceholder: "Vor- und Nachname",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+49 221 12345678",
    submit: "Kostenlosen Rückruf anfordern",
    submitting: "Wird gesendet…",
    toastSuccess: "Vielen Dank! Wir rufen Sie innerhalb von 2 Stunden zurück.",
    toastError: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    errorTitle: "Ihre Anfrage konnte nicht gesendet werden.",
    errorText: "Bitte versuchen Sie es erneut oder rufen Sie uns direkt an:",
    consentText: "Mit dem Absenden stimmen Sie unserer",
    consentLink: "Datenschutzerklärung",
    consentAfter: " zu.",
    cookieTitle: "Cookies und Messung",
    cookieText:
      "Mit Ihrer Zustimmung messen wir über Google Ads und Google Analytics, wie unsere Anzeige und diese Seite ankommen. Dafür werden Cookies gesetzt und Daten an Google übermittelt. Ohne Zustimmung passiert nichts. Mehr in der",
    cookieAccept: "Akzeptieren",
    cookieDecline: "Ablehnen",
    cookieSettings: "Cookie-Einstellungen",
    privacy: "Datenschutz",
    emailLabel: "E-Mail",
    emailOptional: "optional",
    emailPlaceholder: "name@restaurant.de",
    emailHint: "Falls wir Sie telefonisch nicht erreichen, schreiben wir Ihnen.",
    errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    imprint: "Impressum",
    backToPage: "Zurück zur Seite",
    legalFallback: "Der Rechtstext wird geladen. Falls nichts erscheint:",
    legalOpenDirect: "Rechtstext direkt öffnen",
    errRestaurant: "Bitte geben Sie den Restaurantnamen ein.",
    errContact: "Bitte geben Sie einen Ansprechpartner ein.",
    errRealName: "Bitte geben Sie einen echten Namen ein.",
    errPhone: "Bitte geben Sie eine gültige Telefonnummer ein.",
    errPhoneDigits: "Bitte geben Sie eine Telefonnummer mit mindestens 5 Ziffern ein.",
    thanksTitle: "Vielen Dank!",
    thanksText:
      "Wir haben Ihre Anfrage erhalten und rufen Sie innerhalb von 2 Stunden zurück – auch am Wochenende.",
    thanksMore: "Für mehr Informationen über alle unsere Dienstleistungen:",
    backHome: "Zurück zur Startseite",
  },
  en: {
    langToggleLabel: "Auf Deutsch wechseln",
    langToggleText: "DE",
    logoAria: "BlitzScan – Back to start page",
    eyebrow: "Reservation system for restaurants",
    h1: "Online reservations without commission – live in 48 hours.",
    heroSub:
      "We set up your reservation system personally – including a booking widget for your website. Your guests book around the clock, you keep the overview.",
    heroChip1: "€29 / month",
    heroChip2: "0% commission",
    heroChip3: "Cancel monthly",
    heroCta: "Request a free callback",
    scrollAria: "Scroll to the contact form",
    f1Title: "Live within 48h.",
    f1Text:
      "We set up your tables, floorplan and booking widget for you. After just two days, your guests can reserve online.",
    f2Title: "0% commission.",
    f2Text:
      "€29 per month – no matter how many guests book with you. No fee per guest, no hidden costs.",
    f3Title: "Personal, not self-service.",
    f3Text:
      "You don't have to set anything up – we do it for you. And afterwards we are there for you by phone, not via a ticket system.",
    stepsTitle: "How to get started",
    stepsSub: "From first contact to first online booking – we do most of the work.",
    s1Title: "Get in touch",
    s1Text:
      "A call, a WhatsApp message or the form is all it takes. We open your account and send you the login for your customer portal.",
    s2Title: "Set up together",
    s2Text: "Your contact person takes the time for you and handles the setup – at no extra cost.",
    s3Title: "Tailored to your restaurant",
    s3Text:
      "We match tables, floorplan, opening and closing times to your daily routine. The booking form goes on your website – or you use a direct booking link.",
    s4Title: "Bookable online",
    s4Text:
      "Your guests can book around the clock. You get a walkthrough by phone – or at your restaurant if it's nearby.",
    portalTitle: "Your reservation portal",
    portalSub: "All reservations in one place – clear and easy to understand without training.",
    portalTab1: "Timeline",
    portalTab2: "Floorplan",
    portalTab3: "Guest view",
    portalCap1:
      "All of the day's reservations at a glance – by table and time. Add phone bookings yourself with one click.",
    portalCap2:
      "Your restaurant as it really is: see at once which table is free, reserved or occupied.",
    portalCap3:
      "How your guests book: pick party size, date and time, enter name and email – done. Light or dark, matching your website's design. A confirmation email follows right away – with a cancel link.",
    portalAlt5:
      "Confirmation email to the guest with date, time, party size and a button to cancel",
    portalAlt3:
      "Guest booking form in a light design with party size, date, time slots and contact fields",
    portalAlt4:
      "Guest booking form in a dark design with party size, date, time slots and contact fields",
    portalAlt1: "Timeline view in the BlitzScan customer portal showing one day's reservations",
    portalAlt2:
      "Floorplan view in the BlitzScan customer portal with free, reserved and occupied tables",
    featuresTitle: "Everything you need",
    ft1Title: "Automatic confirmation",
    ft1Text:
      "Your guests instantly receive a confirmation email – with a link to cancel the booking themselves.",
    ft2Title: "No overbooking",
    ft2Text:
      "Online, by phone or walk-in – every booking lands in the same reservation book. The system knows your capacity, assigns the right table automatically for online bookings and never allows double bookings.",
    ft7Title: "More Google reviews",
    ft7Text:
      "After the visit, your guest automatically gets an email with the link to your Google review – you don't have to ask anyone.",
    ft3Title: "Interactive floorplan",
    ft3Text: "Custom table layouts, combinations and capacities that fit your restaurant.",
    ft4Title: "Analytics & reports",
    ft4Text: "Occupancy, no-show rate and guest insights – in real time.",
    ft5Title: "You stay in control",
    ft5Text:
      "Set reservation hours, active tables and closing days yourself at any time in the customer portal.",
    costTitle: "Do the maths",
    costSub:
      "With commission models you pay for every reservation. With BlitzScan you pay a fixed monthly price – however full your restaurant is.",
    calcReservations: "Online reservations per month",
    calcFee: "Fee per reservation with a commission model",
    calcBefore: "With a commission model per month",
    calcAfter: "With BlitzScan per month",
    calcSaving: "Your savings per year",
    calcNote:
      "Example calculation with €1.50 per reservation, a common amount for commission models. Fees vary by provider. Set your own number of reservations. All prices excl. VAT.",
    priceLabel: "BlitzScan reservation system",
    pricePer: "/ month excl. VAT",
    priceI1: "0% commission, no fee per guest",
    priceI2: "Personal setup & widget installation",
    priceI3: "Direct booking link for Google, Instagram & WhatsApp",
    priceI4: "Confirmation emails with cancel link",
    priceI5: "Floorplan, analytics & customer portal",
    priceI6: "Personal contact by phone",
    priceI7: "Cancel monthly",
    priceI8: "GDPR-compliant, servers in Germany",
    priceCta: "Get started now",
    compareTitle: "Commission or fixed price?",
    compareSub: "How BlitzScan differs from commission models.",
    compareColOld: "Commission model",
    compareColNew: "BlitzScan",
    cmp1Label: "Cost per reservation",
    cmp1Old: "Fee for every reservation",
    cmp1New: "€0",
    cmp2Label: "Monthly cost",
    cmp2Old: "Rises with every booking",
    cmp2New: "€29 fixed (excl. VAT)",
    cmp3Label: "Setup",
    cmp3Old: "Mostly do it yourself",
    cmp3New: "We set everything up",
    cmp4Label: "Contract",
    cmp4Old: "Often long terms",
    cmp4New: "Cancel monthly",
    cmp5Label: "Contact",
    cmp5Old: "Hotline or ticket system",
    cmp5New: "Personal, by phone",
    trustTitle: "Your personal restaurant partner from Cologne",
    trustText:
      "Unlike anonymous corporations, we are personally there for you – on the phone instead of in a ticket system. We understand hospitality and give you software that takes work off your team instead of creating more.",
    trustBadge1: "GDPR-compliant",
    trustBadge2: "Servers in Germany",
    trustBadge3: "Personal, from Cologne",
    referencesTitle: "These businesses already work with BlitzScan",
    faqTitle: "Frequently asked questions",
    faq1Q: "What exactly does BlitzScan cost?",
    faq1A:
      "€29 per month excl. VAT – no matter how many guests book with you. There is no commission and no fee per guest. Setup and widget installation are included.",
    faq2Q: "How quickly will I be live?",
    faq2A:
      "Usually within 48 hours of our first call. Your restaurant keeps running as normal in the meantime.",
    faq3Q: "Do I need technical skills?",
    faq3A:
      "No. We set up tables, floorplan and opening hours together with you and embed the booking form on your website. Then we show you everything – by phone or at your restaurant.",
    faq4Q: "How do I enter phone reservations?",
    faq4A:
      "With one click in the customer portal. Online, phone and walk-in bookings all land in the same reservation book, and the system prevents double bookings.",
    faq5Q: "I don't have a website. Does it still work?",
    faq5A:
      "Yes. You get a direct booking link you can add to your Google profile, Instagram or WhatsApp.",
    faq6Q: "Do my guests get a confirmation?",
    faq6A:
      "Yes. Every guest automatically receives a confirmation email with a link to cancel the reservation themselves.",
    faq7Q: "How long am I tied to the contract?",
    faq7A:
      "BlitzScan can be cancelled monthly. We want to keep you with good service, not with a long contract.",
    faq8Q: "Can I change opening hours and tables myself?",
    faq8A:
      "Yes. Set reservation hours, active tables and closing days yourself at any time in your customer portal. Or call us and we'll do it for you.",
    faq9Q: "Can I add more features later?",
    faq9A:
      "Yes. BlitzScan also offers digital menus, a waiter system and online ordering – all in the same customer portal.",
    faq10Q: "Where are my and my guests' data stored?",
    faq10A:
      "On servers in Germany. BlitzScan is GDPR-compliant – your guests' data belongs to you and is never passed on to third parties.",
    formTitle: "Let's talk about your reservations.",
    formSub:
      "Leave your details. We will call you back within 2 hours – weekends included – and show you how BlitzScan works in your restaurant.",
    formPerk1: "Free & no obligation",
    formPerk2: "Callback within 2 hours",
    formPerk3: "Cancel monthly",
    formAlt: "Prefer to write?",
    formAltLink: "Message us on WhatsApp",
    formTrust: "GDPR-compliant · Servers in Germany",
    barCall: "Call",
    barCallback: "Request callback",
    cbTitle: "No time to read? We'll call you.",
    cbText:
      "In a short call we find out whether BlitzScan fits your restaurant – free and without obligation.",
    cbCta: "Request a callback",
    waCta: "Message us on WhatsApp",
    waLabel: "WhatsApp",
    waMessage: "Hello BlitzScan, I'm interested in your reservation system.",
    restaurantLabel: "Restaurant name",
    restaurantPlaceholder: "e.g. Restaurant Lumière",
    contactLabel: "Contact person",
    contactPlaceholder: "First and last name",
    phoneLabel: "Phone number",
    phonePlaceholder: "+49 221 12345678",
    submit: "Request a free callback",
    submitting: "Sending…",
    toastSuccess: "Thank you! We will call you back within 2 hours.",
    toastError: "Sending failed. Please try again or give us a call.",
    errorTitle: "Your request could not be sent.",
    errorText: "Please try again or call us directly:",
    consentText: "By submitting you agree to our",
    consentLink: "privacy policy",
    consentAfter: ".",
    cookieTitle: "Cookies and measurement",
    cookieText:
      "With your consent we use Google Ads and Google Analytics to measure how our ad and this page perform. This sets cookies and sends data to Google. Nothing happens without your consent. More in the",
    cookieAccept: "Accept",
    cookieDecline: "Decline",
    cookieSettings: "Cookie settings",
    privacy: "Privacy policy",
    emailLabel: "Email",
    emailOptional: "optional",
    emailPlaceholder: "name@restaurant.com",
    emailHint: "If we cannot reach you by phone, we will write to you.",
    errEmail: "Please enter a valid email address.",
    imprint: "Legal notice",
    backToPage: "Back to the page",
    legalFallback: "The legal text is loading. If nothing appears:",
    legalOpenDirect: "Open the legal text directly",
    errRestaurant: "Please enter the restaurant name.",
    errContact: "Please enter a contact person.",
    errRealName: "Please enter a real name.",
    errPhone: "Please enter a valid phone number.",
    errPhoneDigits: "Please enter a phone number with at least 5 digits.",
    thanksTitle: "Thank you!",
    thanksText:
      "We have received your request and will call you back within 2 hours – weekends included.",
    thanksMore: "For more information about all our services:",
    backHome: "Back to start page",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["de"];

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "de") {
      setLangState(stored);
    } else if (!navigator.language.toLowerCase().startsWith("de")) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === "de" ? "en" : "de"),
      t: (key) => translations[lang][key],
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

export function LangToggle({ className }: { className?: string }) {
  const { t, toggleLang } = useLang();
  return (
    <button
      type="button"
      onClick={toggleLang}
      data-track="lang_toggle"
      aria-label={t("langToggleLabel")}
      className={className}
    >
      {t("langToggleText")}
    </button>
  );
}
