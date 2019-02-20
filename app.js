//app.js
let api = require('./utils/api.js');

App({
  onLaunch: function () {
    let categories = [];
    let products = [];
    function getCategories() {
      return new Promise((re, rej) => {
        wx.request({
          url: api.host + '/categories',
          success: (res) => {
            categories = res.data
            re()
          }
        })
      })
    }
    //归类商品
    function classifyProducts(_this) {
      for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < categories.length; j++) {
          if (categories[j].id === products[i].categoryId) {
            categories[j].products.push(products[i])
          }
        }
      }
      _this.globalData.computedCategories = categories;
    }
    //请求数据
    getCategories().then(() => {
      wx.request({
        url: api.host + '/products',
        success: (res) => {
          let _this = this
          products = res.data
          classifyProducts(_this)
        }
      })
    })
  },
  onShow: function () {
    
  },
  globalData: {
    computedCategories: null
  }
})