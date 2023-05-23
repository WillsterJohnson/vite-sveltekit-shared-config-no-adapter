import path from "node:path";
import fs from "node:fs";

const SHARED = `//SHARED
import { viteConfig } from "shared-config/vite";

export default viteConfig;
`;

const LOCAL = `//LOCAL
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
});
`;

const VITE_CONF_PATH = path.join(process.cwd(), "apps", "appname", "vite.config.ts");

const content = fs.readFileSync(VITE_CONF_PATH, "utf-8");

if (content.startsWith("//LOCAL")) {
  fs.writeFileSync(VITE_CONF_PATH, SHARED);
} else {
  fs.writeFileSync(VITE_CONF_PATH, LOCAL);
}
