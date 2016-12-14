var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var DashboardPlugin = require('webpack-dashboard/plugin')
var proxy = require('express-http-proxy')
var path = require('path')
var app = express()
var compiler = webpack(config)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

compiler.apply(new DashboardPlugin())

// serve pure static assets
app.use('/static', express.static(path.resolve(__dirname, '../static')))
// proxy
//app.use('/api', proxy('http://localhost:3000'))
app.use('/api', proxy('http://139.224.192.230:8089'))
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())
// serve webpack bundle output
app.use(devMiddleware)
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.listen(8080, function (err) {
  if (err) {
    return
  }
})