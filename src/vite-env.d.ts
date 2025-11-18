/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Fix TypeScript JSX errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}