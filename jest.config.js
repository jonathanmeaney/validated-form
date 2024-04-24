module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testEnvironment: "jsdom",
  setupFiles: ["./setup.js"],
};
