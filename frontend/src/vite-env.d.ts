/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // сюда потом можно будет добавлять другие переменные, если появятся
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}