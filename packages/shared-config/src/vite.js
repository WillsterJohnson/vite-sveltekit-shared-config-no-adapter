import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export const viteConfig = defineConfig({
  plugins: [sveltekit()],
});
