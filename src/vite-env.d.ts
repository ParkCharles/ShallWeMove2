/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROVER_URL: string
  readonly VITE_REDIRECT_URL: string
  readonly VITE_OPENID_PROVIDER_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_PACKAGE_ID: string
  readonly VITE_API_URL: string
  // ... other env variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
