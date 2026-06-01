import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://demo.prod.atracio.com",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});