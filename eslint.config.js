// File: eslint.config.js

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  // Global configurations
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  
  // Base JavaScript rules
  pluginJs.configs.recommended,
  
  // React-specific rules, including JSX support
  ...fixupConfigRules(pluginReactConfig),
  
  // Custom rules and settings
  {
    settings: {
      react: {
        version: "detect" // Automatically detects the React version
      }
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true // Enable JSX parsing
        }
      }
    },
    rules: {
      // --- React Specific Rules ---
      "react/react-in-jsx-scope": "off", // Not needed with modern React/Vite
      "react/jsx-uses-react": "off",     // Not needed with modern React/Vite
      "react/prop-types": "off",         // Optional: disable if you're not using PropTypes

      // --- General Code Quality Rules ---
      "no-unused-vars": ["warn", { "args": "none" }], // Warns about unused variables
      "no-console": "warn",                          // Warns about console.log statements
      "indent": ["warn", 2],                         // Enforces 2-space indentation
      "quotes": ["warn", "single"],                  // Enforces single quotes
      "semi": ["warn", "always"],                    // Enforces semicolons at the end of lines
      "eqeqeq": "error",                           // Enforces the use of === and !==
    }
  }
];