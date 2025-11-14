module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: ["node_modules/(?!(react-native|@react-native|expo|@expo|expo-.*|@expo-.*)/)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};
