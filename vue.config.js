const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://transfermarkt-api.fly.dev',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
