/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Definition von eigenen Variablen
  readonly VITE_API_URL: string;
  // readonly VITE_OTHER_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}