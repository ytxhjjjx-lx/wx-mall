//index.js
//获取应用实例
const app = getApp()
// 引入api
let api = require('../../utils/api.js')

Page({
  data: {
    // 轮播
    banner: [],
    categories: []
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
		wx.redirectTo({
			url: '/packageA/pages/site/site',
		})
    //提取商品数据（已登录拿到同步后的数据）
    let computedCategories = app.globalData.computedCategories
    if (computedCategories.length > 0) {
      this.setData({
        categories: computedCategories
      })
    } else {
      app.getComputedCategories(computedCategories => {
        this.setData({
          categories: computedCategories
        })
      })
    }
    // 获取轮播数据
    wx.request({
      url: api.host + '/bannar',
      success: (res) => {
        this.setData({
          banner: res.data
        })
      }
    })
  },

  onShow() {
    //提取商品数据（已登录拿到同步后的数据）
    app.getComputedCategories(computedCategories => {
      this.setData({
        categories: computedCategories
      })
    })
  },


  addCart(e) {
    let pro = e.currentTarget.dataset.pro
    let userinfo = app.globalData.userinfo
    if (!(userinfo.id)) {
      wx.showModal({
        title: '提示',
        content: '你还未登录!',
        success(res) {
          if (res.confirm) {
            //确定
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    } else {
      //追加product_id属性，方便同步数据时判断（购物车商品数据已有该属性）
      pro.product_id = pro.id
      app.addCart(pro).then(computedCategories => {
        // 添加到购物车后更新本地商品的num属性
        this.setData({
          categories: computedCategories
        })
      })
    }
  }
})