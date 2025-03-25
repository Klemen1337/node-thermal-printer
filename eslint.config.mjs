import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-var": "warn",
      "semi": "warn",
      // "console-log": "warn",
      "no-case-declarations": "off",
      "global-require": "off",
      "radix": "off",
      "no-plusplus": "off",
      "no-useless-catch": "off",
      "no-unused-vars": "warn",
      "no-param-reassign": "off",
      "space-before-function-paren": "error",
      "class-methods-use-this": "off",
      "prefer-promise-reject-errors": "off",
      "no-throw-literal": "off",
      "eqeqeq": "off",
      "no-bitwise": "off",
      "no-restricted-syntax": "off",
      "no-control-regex": "off",
      "guard-for-in": "off",
      "max-len": [
        "error",
        140
      ]
    }
  }
];