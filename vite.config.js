// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  base: "/OpenFansite/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        right: resolve(__dirname, "right.html"),
        eoefans: resolve(__dirname, "eoefans-picture.html"),
        videos: resolve(__dirname, "legacy-video.html"),
      },
      output: {
        manualChunks: {
          'infinite-scroll': ['infinite-scroll'],
          'masonry-layout': ['masonry-layout'],
          webfontloader: ['webfontloader'],
        }
      }
    },
  },
});
