// packageA/pages/payOrder/pay-order.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		order_no: '',
		dilivery_time: '',
		place_order_time: '',
		dilivery_code: '',
		pay_way: '',
		pros: [],
		userinfo: {},
		dilivery_amount: 0,
		dilivery_amount_reduct: 0,
		total_amount: 0,
		order_state: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let carts = app.globalData.carts
		let userinfo = app.globalData.userinfo
		this.setData({
			pros: carts,
			order_no: wx.getStorageSync("order_no"),
			dilivery_code: wx.getStorageSync("dilivery_code"),
			place_order_time: wx.getStorageSync("place_order_time"),
			pay_way: wx.getStorageSync("pay_way"),
			dilivery_time: JSON.parse(wx.getStorageSync("dilivery_time")),
			userinfo: userinfo
		})
		let fee_detail = wx.getStorageSync('fee_detail')	
		this.setData({
			dilivery_amount: JSON.parse(fee_detail).dilivery_amount,
			dilivery_amount_reduct: JSON.parse(fee_detail).dilivery_amount_reduct,
			total_amount: JSON.parse(fee_detail).total_amount
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	toPay () {
		this.setData({
			order_state: true
		})
		wx.showToast({
			title: '支付成功!',
			mask: true,
			duration: 800
		})
	},

	toMyOrder () {

	},

	cancelOrder () {
		wx.showModal({
			title: '提示',
			content: '确定取消订单吗？',
			success(res) {
				if (res.confirm) {
					//删除订单，跳转至购物车页面
					wx.switchTab({
						url: '/pages/cart/cart',
					})
				} else if (res.cancel) {}
			}
		})
	}
})