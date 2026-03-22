// const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
module.exports = {
  // devServer: {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, '../../../cert/localhost-key.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, '../../../cert/localhost.pem')),
  //   },
  //   port: 8080,
  // },
  productionSourceMap: false,
  lintOnSave: false,
  transpileDependencies: [
    'quasar'
  ],
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  configureWebpack: config => {
    config.entry.app = [path.join(__dirname,'main.js')]

    if (config.resolveLoader.alias === undefined) {
      config.resolveLoader.alias = {}
    }
    config.resolveLoader['alias']['replace-module-names-loader'] = path.join(__dirname, 'module-loader.js')

    config.module.rules.unshift({
      test: /\.js$/,
      use: [{ loader: 'replace-module-names-loader' }],
    })

    config.module.rules.push({
      test: /[\\\/]modernizr\.js$/,
      use: [
        {
          loader: "imports-loader",
          options: { wrapper: "window" },
        },
        // 'imports-loader?this=>window',
        'exports-loader?window.Modernizr'
      ]
    })

    for (const key in config.plugins) {
      if (config.plugins[key] instanceof HtmlWebpackPlugin) {
        config.plugins[key] = new HtmlWebpackPlugin({
          templateContent: () => {
            let templateContent = fs.readFileSync(path.join(__dirname, '../templates/Index.html'))
            return templateContent.toString().replace(new RegExp('{{.*}}', 'g'), '')
          }
        })
      }
    }

    config.plugins.unshift(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    )
  },
}
