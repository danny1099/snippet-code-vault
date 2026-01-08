import { withGTConfig } from "gt-next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withGTConfig(nextConfig, {
  loadTranslationsPath: "./src/lib/i18n/config/request.ts"
});
