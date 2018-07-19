module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/webframework-examples/vue/' : '/',
    devServer: {
        proxy: 'http://localhost:7001'
    }
  }