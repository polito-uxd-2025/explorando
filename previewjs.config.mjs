import { defineConfig } from "@previewjs/config";
import next from "@previewjs/config-helper-nextjs";

export default defineConfig({
  plugins: [next()],
});