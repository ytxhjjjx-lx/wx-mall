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
  bindViewTap: function () {
  },
  onLoad: function () {
    //提取整理后的分类数据
    let categories = app.globalData.computedCategories
    this.setData({
      categories: categories
    })
    // 获取轮播数据
    wx.request({
      url: api.host + '/bannar',
      success: (res) => {
        this.setData({
          banner: res.data
        })
      }
    })
  }
})
