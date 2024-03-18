module.exports = {
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  env: {
    browser: true,
    amd: true,
    node: true,
  },
};
