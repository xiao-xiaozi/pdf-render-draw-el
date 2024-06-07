import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import topLevelAwait from "vite-plugin-top-level-await";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [],
  resolve: {
    // alias: [
    //   {
    //     "@": path.resolve(__dirname, "./src"),
    //   },
    // ],
  },
  plugins:[
    vue(),
    // fix: Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
    // detail: https://github.com/mozilla/pdf.js/issues/17245
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: i => `__tla_${i}`,
    })
  ]
});
