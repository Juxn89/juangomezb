import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party agent skills, vendored as-is
    ".agents/**",
    // Playwright output
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    // Plain Node scripts run with `node scripts/...`, so CommonJS is expected
    files: ["scripts/**/*.js"],
    rules: {"@typescript-eslint/no-require-imports": "off"},
  },
]);

export default eslintConfig;
