module.exports = {
  dependencies: {
    'react-native-gesture-handler': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-gesture-handler/android',
        },
      },
    },
  },
  project: {
    android: {
      sourceDir: './android',
      appName: 'HelloWorld',
    },
  },
};
