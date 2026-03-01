module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: process.env.API_TARGET || "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
      sass: {
        additionalData: "",
        sassOptions: {
          quietDeps: true,
        },
      },
      scss: {
        sassOptions: {
          quietDeps: true,
        },
      },
    },
  },
};
