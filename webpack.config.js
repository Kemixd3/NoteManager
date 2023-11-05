module.exports = function (webpackEnv) {
  // ...
  return {
    // ...
    resolve: {
      // ...
      fallback: {
        // 👇️👇️👇️ add this 👇️👇️👇️
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
  };
};
