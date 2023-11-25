const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // Merge the publicPath configuration here
  outputDir: 'dist' // Merge other configurations here
});
