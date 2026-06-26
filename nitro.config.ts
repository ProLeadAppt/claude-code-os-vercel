// Nitro config for Vercel. Auto-detected from VERCEL=1, but pinning the
// preset makes it bulletproof and lets us tune Vercel-specific behaviour
// (e.g. memory, regions) without redeclaring the plugin in vercel.json.

import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "vercel",
  // Fluid Compute is on by default — leave the rest alone.
});