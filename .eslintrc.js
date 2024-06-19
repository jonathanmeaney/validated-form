module.exports = {
  parser: "@babel/eslint-parser",
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    jest: true,
  },
};
