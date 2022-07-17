const { defineConfig } = require('@vue/cli-service')
// function Mock(app,url,data) {
//   app.get(url,(request,response)=> {
//     response.json(data);
//   })
// }

// const homeData = require('./src/mock/bookHome')
// const shelfData = require('./src/mock/bookShelf')
// const listData = require('./src/mock/bookList')
// const flatListData = require('./src/mock/bookFlatList')

module.exports = defineConfig({
  transpileDependencies: [],
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  // devServer: {
  //   before(app) {
  //     Mock(app,'/book/home',homeData);
  //     Mock(app,'/book/shelf',shelfData);
  //     Mock(app,'/book/list',listData);
  //     Mock(app,'/book/flat-list',flatListData);
      
  //   }
  // }
  configureWebpack: {
    performance: {
      hints:'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 524288*2,
    }
  }
})
