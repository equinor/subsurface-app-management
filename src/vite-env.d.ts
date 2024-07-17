/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  [key: string]: string | boolean;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
  VITE_NAME?: string;
  VITE_API_URL?: string;
  VITE_ENVIRONMENT_NAME?: string;
}
