import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ isSsrBuild, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = new URL(env.VITE_SITE_URL?.trim() || "https://xn----dtbqehb7a0af8al4b.xn--90ais");

  return {
    base: `${siteUrl.pathname.replace(/\/+$/, "")}/`,
    plugins: [react()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      copyPublicDir: !isSsrBuild,
    },
  };
});
