/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".spec.ts$",
  collectCoverageFrom: [
    "**/src/**",
    "!**/node_modules/**",
  ],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  }
};
