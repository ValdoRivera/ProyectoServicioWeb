// jest.config.js
module.exports = {
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/src/test", "<rootDir>/test"],
  moduleFileExtensions: ["js", "json"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
};
