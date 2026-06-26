// Production-only Vite config for Vercel deployments.
//
// Local dev (bun run dev) continues to use vite.config.ts (the original
// 4,677-line config) which has the loopback middleware, Hermes CLI probing,
// and the live-data.json hot-reload surface that powers the local dashboard.
//
// This file is only loaded when Vercel runs `vite build -c vite.config.prod.ts`
// (set in vercel.json). It uses the same plugins as vite.config.ts MINUS the
// 4,000+ lines of `configureServer` middleware that only makes sense locally,
// and adds Nitro so Vercel can compile the app into Vercel Functions.
//
// Why Nitro? Vercel's official TanStack Start integration runs through Nitro
// (https://vercel.com/docs/frameworks/full-stack/tanstack-start). Nitro auto-
// detects the Vercel deployment target during build and emits Vercel Functions
// that the platform runs as the SSR handler. Without it, Vercel falls back to
// @vercel/static-build which serves a folder with no index.html → 404.

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // No `server: { entry: "server" }` here — Nitro replaces the SSR
      // entrypoint on Vercel. The local Cloudflare-style src/server.ts
      // handler is bypassed for this build target only.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    react(),
    nitro(),
  ],
  resolve: {
    alias: { "@": resolve(process.cwd(), "src") },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
});