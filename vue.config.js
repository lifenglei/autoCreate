const path = require('path')
const fs = require('fs')
require('events').EventEmitter.defaultMaxListeners = 0 // 改变单个 EventEmitter 实例的限制
console.log(process.env.NODE_ENV)
const devHost = fs.existsSync(path.join(__dirname, './dev-host.js'))
  ? require('./dev-host')
  : (() => {
      console.warn('在开发环境需新建devHost文件, 详见 README.md, 生产环境请忽略')
      return {}
    })()
const mHost = devHost.mHost 
const mCookie = devHost.mCookie
module.exports = {
  baseUrl: process.env.VUE_APP_STATIC,
  outputDir: 'publish/mstatic/',
  assetsDir: 'staticSource', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  indexPath: path.join(__dirname, 'publish-view/app/project.html'),
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', '.less'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, 'src')
      },
      symlinks: false // 使用npm link
    },
    externals: {
    
    }
  },
  devServer: {
    port: 3000,
    hot: true,
    disableHostCheck: true, // 解决 图片403 forbidden
    // 配置所有的接口代理
    proxy: {
      '/api': {
        target: mHost,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].favicon = path.resolve(__dirname, 'public/o2.ico')
      return args
    })
  }
}
