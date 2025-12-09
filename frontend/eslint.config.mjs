import nextConfig from "eslint-config-next/core-web-vitals.js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
  prettierConfig, // Disable ESLint rules that conflict with Prettier
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error", // Show Prettier errors as ESLint errors
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
