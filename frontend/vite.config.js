import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@aptos-labs/ts-sdk": "@aptos-labs/ts-sdk",
    },
  },
  optimizeDeps: {
    include: ["poseidon-lite"],
    exclude: [
      "@aptos-labs/ts-sdk",
      "@telegram-apps/bridge",
      "@wallet-standard/core",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
