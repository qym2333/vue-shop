module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/upload': {
        target: 'http://115.159.87.220:8888/api/private/v1/',
        changeOrigin: true
      },
      '/api': {
        target: 'http://115.159.87.220:8083'
      },
      '/get': {
        target: 'http://115.159.87.220:8083'
      }
    }
  }
}
