// packageA/pages/checkout/checkout.js
const app = getApp()
let util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_way: '微信支付',
    pay_ways: [{
        title: '微信支付',
        cls: 'pay-way1'
      },
      {
        title: '支付宝支付',
        cls: 'pay-way2'
      },
      {
        title: '货到付款',
        cls: 'pay-way3'
      },
    ],
    pros: [],
    total_amount: 0,
    product_amount: 0,
    dilivery_amount: 0,
    dilivery_amount_reduct: 0,
    server_amount: 0,
    coupon_amount: 0,
    dilivery_time: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let carts = app.globalData.carts
    let pros = Object.assign([], carts)
    this.setData({
      pros: pros
    })
    let _this = this
    wx.getStorage({
      key: 'dilivery_time',
      success: function(res) {
        let time = JSON.parse(res.data)
        _this.setData({
          dilivery_time: time.time
        })
				wx.setStorageSync('pay_way', '微信支付')
        _this.initPayAcount()
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  changePayWay(e) {
    let way = e.currentTarget.dataset.way
    this.setData({
      pay_way: way
    })
    wx.setStorage({
      key: 'pay_way',
      data: way,
    })
  },

  toPay() {
		let codes = util.getCode()
		//存储下单时间,收货码,订单编号
		wx.setStorageSync('place_order_time', util.formatTime(new Date()))
		wx.setStorageSync('dilivery_code', codes[0])
		wx.setStorageSync('order_no', codes[1])
		//存储费用信息（总额，配送费，配送费减免）
		let fee_detail = {
			dilivery_amount: this.data.dilivery_amount,
			dilivery_amount_reduct: this.data.dilivery_amount_reduct,
			total_amount : this.data.total_amount
		}
		wx.setStorageSync('fee_detail', JSON.stringify(fee_detail))
    wx.showLoading({
      title: '提交订单中...',
      mask: true
    })
    setTimeout(function() {
      wx.hideLoading()
      wx.redirectTo({
        url: '/packageA/pages/pay-order/pay-order',
      })
    }, 800)
  },

  initPayAcount() {
    let pros = this.data.pros
    let dilivery_time = this.data.dilivery_time
    let price = 0
    for (let pro of pros) {
      price += Number(pro.product_price * pro.num)
    }
    price = price.toFixed(1)
    this.setData({
      product_amount: price
    })
    if (dilivery_time < 21) {
      if (price > 50) {
        this.setData({
          dilivery_amount: 5,
          dilivery_amount_reduct: 5
        })
      } else {
        this.setData({
          dilivery_amount: 5,
          dilivery_amount_reduct: 0
        })
      }
    } else {
      this.setData({
        dilivery_amount: 10,
        dilivery_amount_reduct: 0
      })
    }
    let totalPrice = Number(this.data.product_amount) + Number(this.data.server_amount) + Number(this.data.dilivery_amount) - Number(this.data.dilivery_amount_reduct) - Number(this.data.coupon_amount)
    this.setData({
      total_amount: totalPrice.toFixed(1)
    })
  }
})