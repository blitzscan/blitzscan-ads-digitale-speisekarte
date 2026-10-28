/// <reference types="vite/client" />

/**
 * Eigene VITE_-Variablen hier eintragen.
 *
 * Vite ersetzt `import.meta.env.VITE_…` beim Bauen textuell – der Zugriff muss
 * deshalb mit Punkt geschrieben werden. Ohne diese Deklaration verbietet
 * TypeScript (noPropertyAccessFromIndexSignature) genau diese Schreibweise.
 */
interface ImportMetaEnv {
  /** Vollständige URL des Kontakt-Endpunkts; nur für die lokale Entwicklung nötig. */
  readonly VITE_LEAD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
