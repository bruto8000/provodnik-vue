module.exports = {
    runtimeCompiler: true,

    devServer: {
      inline: true,
      // contentBase: '.',
      // host: "192.168.0.104",
      // public: "128.73.68.223:80",
      proxy: {
        '/vendor': {
          target: 'http://192.168.0.104',
        changeOrigin: true
        }
        },
      port: 8080,
      // disableHostCheck: true,
      hot: true,
      hotOnly: true,

    }
  }