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

/**
 * Alle Texte der Landingpage "Digitale Speisekarte + Bestellen am Tisch".
 *
 * Nur Funktionen nennen, die es im Produkt gibt. Quelle für Aussagen zu
 * Einrichtung, Provision, Laufzeit, Bondruck und Kellnerbestellung ist
 * blitzscan.de (Preise-Seite, FAQ, Referenzen). Online-Zahlung wird bewusst
 * nicht als fertige Funktion versprochen (faq10A) – erst ändern, wenn sie für
 * Kunden produktiv freigegeben ist. Keine Aussagen zu Kassen, TSE, konkreten
 * Druckermodellen oder Preisen, solange nicht ausdrücklich bestätigt.
 */
export const translations = {
  de: {
    langToggleLabel: "Switch to English",
    langToggleText: "EN",
    logoAria: "BlitzScan – Zur Startseite",

    // Hero
    eyebrow: "Für Restaurants, Cafés und Bars",
    h1: "Digitale Speisekarte mit Bestellfunktion für Restaurants",
    heroSub:
      "Gäste scannen den QR-Code am Tisch und bestellen direkt über ihr Smartphone – ohne App. Speisekarte und Bestellungen verwalten Sie zentral im BlitzScan-Kundenportal.",
    heroChip1: "Speisekarte jederzeit selbst ändern",
    // Nur BlitzScans eigene Gebühr – über Zahlungsanbieter u. Ä. keine Aussage.
    heroChip2: "Keine BlitzScan-Provision pro Bestellung",
    heroChip3: "Persönlich eingerichtet, direkter Ansprechpartner",
    heroCta: "Kostenlose Demo anfragen",
    heroDemo: "Live-Demo ansehen",
    demoBadge: "Live-Demo zum Ausprobieren",
    demoTap: "Antippen und ausprobieren",
    demoFrameTitle: "Live-Demo: digitale Speisekarte mit Bestellfunktion",
    heroNote: "Kostenlos und unverbindlich.",
    heroCall: "Lieber direkt sprechen?",
    heroImgAlt:
      "Gast hält ein Smartphone mit der digitalen Speisekarte eines Restaurants und dem Knopf „Zur Bestellung“",
    heroBadge: "Ohne App – direkt im Browser",
    ticketLabel: "Neue Bestellung",
    ticketMeta: "Tisch 7 · gerade eben",
    ticketItem1: "2× Cheeseburger Classic",
    ticketItem2: "1× Caesar Salad",
    ticketItem3: "2× Apfelschorle",
    routeKitchen: "Küche",
    routeBar: "Bar",
    routeCounter: "Theke",

    // Problem
    probTitle: "Wo im Restaurantalltag Zeit verloren geht",
    prob1Title: "Gedruckte Karten veralten schnell",
    prob1Text: "Jede Preis- oder Angebotsänderung heißt: neu drucken oder mit alten Karten leben.",
    prob2Title: "Gäste warten auf die Bestellung",
    prob2Text:
      "Zu Stoßzeiten wissen Gäste längst, was sie möchten – und warten trotzdem auf den Service.",
    prob3Title: "Viele Wege für den Service",
    prob3Text:
      "Bestellung aufnehmen, zur Küche oder Bar bringen, nachfragen: Jeder Weg kostet Zeit.",
    prob4Title: "Eine PDF-Karte löst das nicht",
    prob4Text:
      "Eine PDF hinter dem QR-Code ist auf dem Handy mühsam zu lesen – und bestellen kann man damit nicht.",

    // So funktioniert es
    stepsTitle: "So bestellen Ihre Gäste am Tisch",
    stepsSub: "Vom QR-Code bis zur Bestellung in Küche oder Bar – in vier Schritten.",
    s1Title: "QR-Code scannen",
    s1Text: "Am Tisch steht ein Aufsteller mit QR-Code. Die Handykamera genügt.",
    s2Title: "Speisekarte öffnen",
    s2Text: "Ihre Karte öffnet sich im Browser – mit Fotos, Preisen und Allergenen. Ohne App.",
    s3Title: "Auswählen und bestellen",
    s3Text: "Der Gast legt Speisen und Getränke in den Warenkorb und schickt die Bestellung ab.",
    s4Title: "Bestellung kommt an",
    s4Text:
      "Sie sehen die Bestellung mit Tischnummer im Kundenportal – auf Wunsch auch als Bon in Küche, Bar oder an der Theke.",

    // Produkt: Speisekarte
    menuEyebrow: "Digitale Speisekarte",
    menuTitle: "Ihre Speisekarte. Jederzeit aktuell.",
    menuSub:
      "Preise, Gerichte und Kategorien ändern Sie selbst im BlitzScan-Kundenportal. Speichern – und Ihre Gäste sehen die Änderung sofort.",
    menuF1: "Preise und Gerichte selbst ändern",
    menuF2: "Ausverkauftes per Schalter ausblenden",
    menuF3: "Fotos, Beschreibungen und Allergene",
    menuF4: "Kategorien für Speisen und Getränke",
    menuF5: "Auf Wunsch mehrsprachig",
    menuF6: "„Service rufen“-Knopf für Gäste",
    menuBenefit: "Ändert sich ein Preis, müssen Sie keine neuen Karten drucken.",
    menuShotAlt:
      "Speisekarten-Editor im BlitzScan-Kundenportal mit Gerichten, Kategorien, Preisen und Aktiv-Schalter",
    menuShotCap:
      "Der Speisekarten-Editor im Kundenportal: Preis ändern, speichern – ausverkaufte Gerichte mit einem Schalter ausblenden.",

    // Produkt: Bestellen am Tisch
    orderEyebrow: "Bestellen am Tisch",
    orderTitle: "Gäste bestellen direkt vom Tisch",
    orderSub:
      "Die Bestellfunktion erweitert Ihre digitale Speisekarte: Gäste bestellen per Smartphone, Ihr Team sieht jede Bestellung sofort – mit Tischnummer.",
    orderShotAlt:
      "Bestellübersicht im BlitzScan-Kundenportal mit Tisch, Bestellnummer, Uhrzeit, Quelle und Betrag",
    orderShotCap:
      "Alle Bestellungen im Kundenportal – mit Tisch, Uhrzeit und Herkunft. Filtern und exportieren inklusive.",
    order1Title: "Weniger Laufwege",
    order1Text: "Gäste bestellen selbst – Ihr Service hat mehr Zeit für die Gäste.",
    order2Title: "Jede Bestellung mit Tisch",
    order2Text:
      "Bestellungen kommen strukturiert an: Tisch, Uhrzeit und alle Artikel auf einen Blick.",
    order3Title: "Bon in Küche, Bar oder Theke",
    order3Text:
      "Auf Wunsch werden Bestellungen automatisch am Bondrucker ausgegeben – abhängig von Ihrer Hardware.",
    order4Title: "Auch für Ihren Service",
    order4Text:
      "Ihr Team kann Bestellungen am Tisch per Handy oder Tablet aufnehmen. Alles landet in derselben Übersicht.",
    orderCta: "Kostenlose Demo anfragen",

    // Vergleich
    compareTitle: "Papierkarte, PDF oder BlitzScan?",
    compareSub:
      "Eine PDF hinter dem QR-Code ist schnell gemacht. Aber sie bleibt eine Papierkarte auf dem Bildschirm.",
    compareColPaper: "Papierkarte",
    compareColPdf: "PDF per QR",
    compareColNew: "BlitzScan",
    cmp1Label: "Preis ändern",
    cmp1Paper: "Neu drucken",
    cmp1Pdf: "Neue PDF hochladen",
    cmp1New: "Im Portal, sofort sichtbar",
    cmp2Label: "Auf dem Smartphone",
    cmp2Paper: "–",
    cmp2Pdf: "Zoomen und scrollen",
    cmp2New: "Fürs Handy gemacht",
    cmp3Label: "Gericht ausverkauft",
    cmp3Paper: "Gäste informieren",
    cmp3Pdf: "Neue PDF hochladen",
    cmp3New: "Per Schalter ausblenden",
    cmp4Label: "Bestellen",
    cmp4Paper: "Über den Service",
    cmp4Pdf: "Über den Service",
    cmp4New: "Am Tisch per Handy – oder über den Service",

    // Warum BlitzScan: Einrichtung und Ansprechpartner
    whyTitle: "Persönlich eingerichtet. Direkt erreichbar.",
    whySub:
      "BlitzScan ist kein Selbstbedienungs-Tool. Wir richten alles mit Ihnen ein und bleiben danach Ihr Ansprechpartner.",
    start1Title: "Kostenlose Demo",
    start1Text:
      "Wir zeigen Ihnen Speisekarte, Bestellung und Kundenportal und klären, was Ihr Betrieb braucht.",
    start2Title: "Wir richten alles ein",
    start2Text:
      "Sie schicken uns Ihre Speisekarte, die Fotos Ihrer Gerichte machen wir auf Wunsch selbst. Wir bauen die digitale Karte und erstellen QR-Codes und Tischaufsteller.",
    start3Title: "Einweisung und Start",
    start3Text:
      "Wir zeigen Ihrem Team alles Nötige. Danach erreichen Sie uns direkt – per Telefon oder WhatsApp.",
    teamTitle: "Ihre Ansprechpartner aus Köln",
    teamText:
      "Wir haben selbst als Kellner und Barkeeper gearbeitet und wissen, wie es im Service zugeht.",
    team1Role: "Mitgründer · Business Development",
    team1Note: "Erfahrung als Kellner",
    team2Role: "Mitgründer · Produkt & Technik",
    team2Note: "Erfahrung hinter der Bar",
    trustBadge1: "DSGVO-konform",
    trustBadge2: "Server in Deutschland",
    trustBadge3: "Keine lange Vertragsbindung",
    referencesTitle: "Diese Betriebe arbeiten bereits mit BlitzScan",
    refShaho: "Speisekarte & Bestellsystem mit Bondruck",
    refPizzaLab: "Digitale Speisekarte",
    refAtrin: "Digitale Menü-Displays",
    // Zusammenfassung der Rückmeldungen in unseren Worten – bewusst keine
    // wörtlichen Zitate mit Namen. Echte Zitate nur mit Freigabe des Kunden.
    voicesTitle: "Was unsere Kunden an uns schätzen",
    voice1Title: "Hilfsbereit, wenn es darauf ankommt",
    voice1Text:
      "Fragen und Änderungen klären wir schnell und persönlich – per Telefon oder WhatsApp.",
    voice2Title: "Digitalisierung, die wirklich hilft",
    voice2Text: "Die digitale Speisekarte macht den Alltag im Restaurant spürbar einfacher.",
    voice3Title: "Ein Schritt nach vorn",
    voice3Text: "Unsere Kunden sagen uns, dass BlitzScan ihren Betrieb voranbringt.",
    voicesNote: "Zusammengefasst aus den Rückmeldungen unserer Kunden.",

    // Zwischenaufruf
    cbTitle: "Am besten sehen Sie es sich selbst an.",
    cbText:
      "In einer kostenlosen Demo zeigen wir Ihnen Speisekarte, Bestellung und Kundenportal – und besprechen, was für Ihren Betrieb sinnvoll ist.",
    cbCta: "Kostenlose Demo anfragen",

    // Optionale Erweiterungen
    moreTitle: "Bei Bedarf erweiterbar",
    moreSub:
      "Speisekarte und Bestellung lassen sich mit weiteren BlitzScan-Bausteinen kombinieren – alles im selben Kundenportal.",
    moreBadge: "Optional",
    moreImgAlt: "Gast scannt den QR-Code auf einem Tischaufsteller mit dem Smartphone",
    more1Title: "Google-Bewertungen",
    more1Text: "Gäste direkt zum Bewertungslink Ihres Restaurants führen.",
    more2Title: "WLAN",
    more2Text: "WLAN-Zugang über die QR-Landingpage bereitstellen.",
    more3Title: "Reservierungen",
    more3Text: "Optional das BlitzScan-Reservierungssystem integrieren.",
    more4Title: "Restaurant-Website",
    more4Text: "Speisekarte und weitere Funktionen in eine moderne Restaurant-Website integrieren.",
    more5Title: "Kundenbindung",
    more5Text: "Aktionen, Gutscheine und weitere Funktionen zur Gästebindung ergänzen.",

    // FAQ
    faqTitle: "Häufige Fragen",
    faq1Q: "Brauchen Gäste eine App?",
    faq1A:
      "Nein. Der QR-Code öffnet die Speisekarte direkt im Browser des Smartphones – ohne Download und ohne Anmeldung.",
    faq2Q: "Wie aufwendig ist die Einrichtung für mich?",
    faq2A:
      "Gering. Sie schicken uns Ihre Speisekarte, den Rest übernehmen wir: auf Wunsch die Fotos Ihrer Gerichte, die digitale Karte, QR-Codes, Tischaufsteller und die Einweisung Ihres Teams.",
    faq3Q: "Kann ich Preise und Gerichte selbst ändern?",
    faq3A:
      "Ja. Im BlitzScan-Kundenportal ändern Sie Preise, Gerichte und Kategorien selbst. Ausverkaufte Gerichte blenden Sie mit einem Schalter aus und später wieder ein.",
    faq4Q: "Wo landen die Bestellungen?",
    faq4A:
      "In der Bestellübersicht im Kundenportal, mit Tischnummer und allen Artikeln. Auf Wunsch werden sie zusätzlich als Bon in Küche, Bar oder an der Theke gedruckt – das stimmen wir bei der Einrichtung ab.",
    faq5Q: "Können vorhandene Drucker angebunden werden?",
    faq5A:
      "Eine Druckeranbindung ist möglich. Ob Ihr vorhandener Drucker passt, hängt vom Gerät ab – das prüfen wir gemeinsam vor dem Start.",
    faq6Q: "Ersetzt das mein Servicepersonal?",
    faq6A:
      "Nein. Bestellen per Smartphone ist ein zusätzlicher Weg. Wer lieber beim Service bestellt, kann das weiterhin – und Ihr Team kann Bestellungen selbst per Handy oder Tablet erfassen.",
    faq7Q: "Was kostet BlitzScan?",
    faq7A:
      "Es gibt feste Monatspakete ohne versteckte Kosten. BlitzScan erhebt keine Provision pro Bestellung. Je nach Ausstattung können einmalige Kosten für Einrichtung und Hardware dazukommen. In der Demo erhalten Sie ein konkretes Angebot.",
    faq8Q: "Bin ich lange vertraglich gebunden?",
    faq8A: "Nein. Es gibt keine langen Mindestlaufzeiten.",
    faq9Q: "Kann ich zuerst nur mit der digitalen Speisekarte starten?",
    faq9A:
      "Ja. Speisekarte und Bestellfunktion sind einzelne Bausteine. Sie können mit der Speisekarte beginnen und die Bestellfunktion später ergänzen.",
    faq10Q: "Können Gäste auch online bezahlen?",
    faq10A:
      "Online-Zahlung ist derzeit keine Standardfunktion. Ob sie als Erweiterung für Ihren Betrieb in Frage kommt, besprechen wir gern in der Demo.",

    // Formular
    formTitle: "Digitale Speisekarte unverbindlich kennenlernen",
    formSub:
      "Hinterlassen Sie Ihre Kontaktdaten. Wir rufen Sie an, zeigen Ihnen das System und besprechen, welche Funktionen für Ihren Betrieb sinnvoll sind.",
    formPerk1: "Kostenlos & unverbindlich",
    formPerk2: "Persönliche Demo",
    formPerk3: "Keine lange Vertragsbindung",
    formAlt: "Lieber direkt schreiben?",
    formAltLink: "Per WhatsApp anfragen",
    formTrust: "DSGVO-konform · Server in Deutschland",
    barCall: "Anrufen",
    barCallback: "Demo anfragen",
    waCta: "Per WhatsApp schreiben",
    waLabel: "WhatsApp",
    waMessage:
      "Hallo BlitzScan, ich interessiere mich für die digitale Speisekarte mit Bestellfunktion.",
    restaurantLabel: "Name des Restaurants",
    restaurantPlaceholder: "z. B. Restaurant Lumière",
    contactLabel: "Ansprechpartner",
    contactPlaceholder: "Vor- und Nachname",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+49 221 12345678",
    submit: "Kostenlose Demo anfragen",
    submitting: "Wird gesendet…",
    toastSuccess: "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",
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
    errRestaurant: "Bitte geben Sie den Namen Ihres Restaurants ein.",
    errContact: "Bitte geben Sie Ihren Namen ein.",
    errRealName: "Bitte geben Sie einen echten Namen ein.",
    errPhone: "Bitte geben Sie eine gültige Telefonnummer ein.",
    errPhoneDigits: "Bitte geben Sie eine Telefonnummer mit mindestens 5 Ziffern ein.",
    thanksTitle: "Vielen Dank!",
    thanksText:
      "Wir haben Ihre Demo-Anfrage erhalten und melden uns in der Regel innerhalb von 24 Stunden telefonisch bei Ihnen, um einen Termin zu vereinbaren.",
    thanksMore: "Für mehr Informationen über alle unsere Dienstleistungen:",
    backHome: "Zurück zur Startseite",
  },
  en: {
    langToggleLabel: "Auf Deutsch wechseln",
    langToggleText: "DE",
    logoAria: "BlitzScan – Back to start page",

    eyebrow: "For restaurants, cafés and bars",
    h1: "Digital menu with ordering for restaurants",
    heroSub:
      "Guests scan the QR code on the table and order straight from their smartphone – no app. You manage menu and orders in one place in the BlitzScan customer portal.",
    heroChip1: "Change your menu yourself at any time",
    heroChip2: "No BlitzScan commission per order",
    heroChip3: "Personal setup, direct contact person",
    heroCta: "Request a free demo",
    heroDemo: "View live demo",
    demoBadge: "Live demo – try it out",
    demoTap: "Tap to try it",
    demoFrameTitle: "Live demo: digital menu with ordering",
    heroNote: "Free and without obligation.",
    heroCall: "Prefer to talk?",
    heroImgAlt:
      "Guest holding a smartphone showing a restaurant's digital menu with an “order” button",
    heroBadge: "No app – right in the browser",
    ticketLabel: "New order",
    ticketMeta: "Table 7 · just now",
    ticketItem1: "2× Cheeseburger Classic",
    ticketItem2: "1× Caesar Salad",
    ticketItem3: "2× Apple spritzer",
    routeKitchen: "Kitchen",
    routeBar: "Bar",
    routeCounter: "Counter",

    probTitle: "Where restaurants lose time every day",
    prob1Title: "Printed menus go out of date",
    prob1Text: "Every price or offer change means reprinting – or living with old menus.",
    prob2Title: "Guests wait to order",
    prob2Text: "At peak times guests know what they want – and still wait for service.",
    prob3Title: "Lots of walking for your staff",
    prob3Text: "Take the order, bring it to the kitchen or bar, follow up: every trip costs time.",
    prob4Title: "A PDF menu doesn't solve it",
    prob4Text:
      "A PDF behind the QR code is hard to read on a phone – and guests can't order with it.",

    stepsTitle: "How guests order at the table",
    stepsSub: "From the QR code to the order in kitchen or bar – in four steps.",
    s1Title: "Scan the QR code",
    s1Text: "A table stand with a QR code. The phone camera is all it takes.",
    s2Title: "Open the menu",
    s2Text: "Your menu opens in the browser – with photos, prices and allergens. No app.",
    s3Title: "Choose and order",
    s3Text: "The guest adds food and drinks to the basket and sends the order.",
    s4Title: "The order arrives",
    s4Text:
      "You see the order with its table number in the customer portal – and, if you like, as a ticket in kitchen, bar or at the counter.",

    menuEyebrow: "Digital menu",
    menuTitle: "Your menu. Always up to date.",
    menuSub:
      "You change prices, dishes and categories yourself in the BlitzScan customer portal. Save – and your guests see the change straight away.",
    menuF1: "Change prices and dishes yourself",
    menuF2: "Hide sold-out items with a switch",
    menuF3: "Photos, descriptions and allergens",
    menuF4: "Categories for food and drinks",
    menuF5: "Multilingual on request",
    menuF6: "“Call service” button for guests",
    menuBenefit: "When a price changes, you don't have to print new menus.",
    menuShotAlt:
      "Menu editor in the BlitzScan customer portal with dishes, categories, prices and an active switch",
    menuShotCap:
      "The menu editor in the customer portal: change a price, save – hide sold-out dishes with one switch.",

    orderEyebrow: "Order at the table",
    orderTitle: "Guests order straight from the table",
    orderSub:
      "Ordering extends your digital menu: guests order by smartphone and your team sees every order straight away – with the table number.",
    orderShotAlt:
      "Order overview in the BlitzScan customer portal with table, order number, time, source and amount",
    orderShotCap:
      "Every order in the customer portal – with table, time and source. Filtering and export included.",
    order1Title: "Less walking",
    order1Text: "Guests order themselves – your staff has more time for guests.",
    order2Title: "Every order with its table",
    order2Text: "Orders arrive structured: table, time and every item at a glance.",
    order3Title: "Tickets in kitchen, bar or counter",
    order3Text:
      "If you like, orders are printed automatically on a receipt printer – depending on your hardware.",
    order4Title: "For your staff too",
    order4Text:
      "Your team can take orders at the table by phone or tablet. Everything lands in the same overview.",
    orderCta: "Request a free demo",

    compareTitle: "Paper, PDF or BlitzScan?",
    compareSub:
      "A PDF behind a QR code is quick to set up. But it's still a paper menu on a screen.",
    compareColPaper: "Paper menu",
    compareColPdf: "PDF via QR",
    compareColNew: "BlitzScan",
    cmp1Label: "Change a price",
    cmp1Paper: "Reprint",
    cmp1Pdf: "Upload a new PDF",
    cmp1New: "In the portal, live at once",
    cmp2Label: "On a smartphone",
    cmp2Paper: "–",
    cmp2Pdf: "Zoom and scroll",
    cmp2New: "Made for phones",
    cmp3Label: "Dish sold out",
    cmp3Paper: "Tell guests",
    cmp3Pdf: "Upload a new PDF",
    cmp3New: "Hide with a switch",
    cmp4Label: "Ordering",
    cmp4Paper: "Via staff",
    cmp4Pdf: "Via staff",
    cmp4New: "At the table by phone – or via staff",

    whyTitle: "Set up personally. Directly reachable.",
    whySub:
      "BlitzScan is not a self-service tool. We set everything up with you and remain your contact afterwards.",
    start1Title: "Free demo",
    start1Text:
      "We show you menu, ordering and the customer portal and clarify what your business needs.",
    start2Title: "We set everything up",
    start2Text:
      "You send us your menu – if you like, we take the photos of your dishes ourselves. We build the digital menu and create QR codes and table stands.",
    start3Title: "Walkthrough and start",
    start3Text:
      "We show your team everything it needs. After that you reach us directly – by phone or WhatsApp.",
    teamTitle: "Your contacts in Cologne",
    teamText: "We have worked as waiters and bartenders ourselves and know what service is like.",
    team1Role: "Co-founder · Business development",
    team1Note: "Experience as a waiter",
    team2Role: "Co-founder · Product & technology",
    team2Note: "Experience behind the bar",
    trustBadge1: "GDPR-compliant",
    trustBadge2: "Servers in Germany",
    trustBadge3: "No long contract",
    referencesTitle: "These businesses already work with BlitzScan",
    refShaho: "Menu & ordering with ticket printing",
    refPizzaLab: "Digital menu",
    refAtrin: "Digital menu displays",
    voicesTitle: "What our customers value",
    voice1Title: "Helpful when it counts",
    voice1Text: "We sort out questions and changes quickly and personally – by phone or WhatsApp.",
    voice2Title: "Digitalisation that really helps",
    voice2Text: "The digital menu makes everyday restaurant work noticeably easier.",
    voice3Title: "A step forward",
    voice3Text: "Our customers tell us that BlitzScan moves their business forward.",
    voicesNote: "Summarised from our customers' feedback.",

    cbTitle: "Best to see it for yourself.",
    cbText:
      "In a free demo we show you menu, ordering and the customer portal – and discuss what makes sense for your business.",
    cbCta: "Request a free demo",

    moreTitle: "Expandable when you need it",
    moreSub:
      "Menu and ordering can be combined with other BlitzScan modules – all in the same customer portal.",
    moreBadge: "Optional",
    moreImgAlt: "Guest scanning the QR code on a table stand with a smartphone",
    more1Title: "Google reviews",
    more1Text: "Lead guests straight to your restaurant's review link.",
    more2Title: "Wi-Fi",
    more2Text: "Provide Wi-Fi access via the QR landing page.",
    more3Title: "Reservations",
    more3Text: "Optionally integrate the BlitzScan reservation system.",
    more4Title: "Restaurant website",
    more4Text: "Integrate the menu and other features into a modern restaurant website.",
    more5Title: "Guest loyalty",
    more5Text: "Add promotions, vouchers and other features that bring guests back.",

    faqTitle: "Frequently asked questions",
    faq1Q: "Do guests need an app?",
    faq1A:
      "No. The QR code opens the menu directly in the phone's browser – no download, no sign-up.",
    faq2Q: "How much work is the setup for me?",
    faq2A:
      "Very little. You send us your menu, we do the rest: photos of your dishes if you like, the digital menu, QR codes, table stands and a walkthrough for your team.",
    faq3Q: "Can I change prices and dishes myself?",
    faq3A:
      "Yes. In the BlitzScan customer portal you change prices, dishes and categories yourself. Sold-out dishes are hidden with a switch and shown again later.",
    faq4Q: "Where do the orders go?",
    faq4A:
      "Into the order overview in the customer portal, with table number and all items. If you like, they are also printed as tickets in kitchen, bar or at the counter – we agree on this during setup.",
    faq5Q: "Can existing printers be connected?",
    faq5A:
      "A printer connection is possible. Whether your existing printer works depends on the device – we check this together before the start.",
    faq6Q: "Does this replace my service staff?",
    faq6A:
      "No. Ordering by smartphone is an additional option. Guests who prefer to order with staff still can – and your team can take orders by phone or tablet itself.",
    faq7Q: "What does BlitzScan cost?",
    faq7A:
      "There are fixed monthly packages with no hidden costs. BlitzScan charges no commission per order. Depending on equipment, one-off costs for setup and hardware may apply. You get a concrete offer in the demo.",
    faq8Q: "Am I tied to a long contract?",
    faq8A: "No. There are no long minimum terms.",
    faq9Q: "Can I start with just the digital menu?",
    faq9A:
      "Yes. Menu and ordering are separate modules. You can start with the menu and add ordering later.",
    faq10Q: "Can guests also pay online?",
    faq10A:
      "Online payment is not a standard feature at the moment. Whether it could be an extension for your business is something we're happy to discuss in the demo.",

    formTitle: "Get to know the digital menu – no obligation",
    formSub:
      "Leave your contact details. We'll call you, show you the system and discuss which features make sense for your business.",
    formPerk1: "Free & no obligation",
    formPerk2: "Personal demo",
    formPerk3: "No long contract",
    formAlt: "Prefer to write?",
    formAltLink: "Message us on WhatsApp",
    formTrust: "GDPR-compliant · Servers in Germany",
    barCall: "Call",
    barCallback: "Request demo",
    waCta: "Message us on WhatsApp",
    waLabel: "WhatsApp",
    waMessage: "Hello BlitzScan, I'm interested in the digital menu with ordering.",
    restaurantLabel: "Restaurant name",
    restaurantPlaceholder: "e.g. Restaurant Lumière",
    contactLabel: "Contact person",
    contactPlaceholder: "First and last name",
    phoneLabel: "Phone number",
    phonePlaceholder: "+49 221 12345678",
    submit: "Request a free demo",
    submitting: "Sending…",
    toastSuccess: "Thank you! We'll be in touch shortly.",
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
    errRestaurant: "Please enter the name of your restaurant.",
    errContact: "Please enter your name.",
    errRealName: "Please enter a real name.",
    errPhone: "Please enter a valid phone number.",
    errPhoneDigits: "Please enter a phone number with at least 5 digits.",
    thanksTitle: "Thank you!",
    thanksText:
      "We have received your demo request and will usually call you within 24 hours to arrange a date.",
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
