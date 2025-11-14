module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            "@mobile": "./src",
            "@cakify/ui": "../../packages/ui/src",
            "@cakify/types": "../../packages/types/src"
          }
        }
      ]
    ]
  };
};
