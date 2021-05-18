module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    // "**/test/**/*.test.(ts|js)"
    // "**/test/**/login.test.(ts|js)",
    // "**/test/**/user.test.(ts|js)"
    // "**/test/**/contact.test.(ts|js)",
    "**/test/**/message.test.(ts|js)",
    // "**/test/**/database.test.(ts|js)"
  ],
  testEnvironment: "node",
  maxWorkers: 1,
  maxConcurrency: 1,
  testTimeout: 20000
};
