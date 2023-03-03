// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
export default defineConfig({
  base: "/OpenFansite/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        eoefans: resolve(__dirname, "eoefans-picture.html"),
        videos: resolve(__dirname, "legacy-video.html"),
      },
      output: {
        manualChunks: {
          "infinite-scroll": ["infinite-scroll"],
          "masonry-layout": ["masonry-layout"],
          webfontloader: ["webfontloader"],
        },
      },
    },
  },
});
