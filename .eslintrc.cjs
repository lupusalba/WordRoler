// ESLint: sane defaults for TS+React
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-refresh"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/consistent-type-imports": "warn"
  },
  ignorePatterns: ["dist", "node_modules"]
};
