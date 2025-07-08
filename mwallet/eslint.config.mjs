import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/out/**"]
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser }
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    plugins: {
      prettier: pluginPrettier,
      "react-hooks": pluginReactHooks
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          trailingComma: "none",
          bracketSameLine: true,
          jsxSingleQuote: false,
          bracketSpacing: true
        }
      ],
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
]);
