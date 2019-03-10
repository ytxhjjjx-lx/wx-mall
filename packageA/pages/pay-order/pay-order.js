// packageA/pages/payOrder/pay-order.js
const app = getApp()
let api = require('../../../utils/api.js')

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
		order_state: false,
		//订单在数据表中的编号
		order_id: 0
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
		carts = carts.filter(cart => {
			return cart.checked
		})
		let userinfo = app.globalData.userinfo
		this.setData({
			pros: carts,
			order_no: wx.getStorageSync("order_no"),
			dilivery_code: wx.getStorageSync("dilivery_code"),
			place_order_time: wx.getStorageSync("place_order_time"),
			pay_way: wx.getStorageSync("pay_way"),
			dilivery_time: JSON.parse(wx.getStorageSync("dilivery_time")),
			userinfo: userinfo,
			order_id: wx.getStorageSync("order_id")
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

	//支付
	toPay () {
		this.setData({
			order_state: true
		})
		let order_id = this.data.order_id
		let orders = app.globalData.orders
		let url = api.host + '/orders/' + order_id
		app.fetch(url).then(res => {
			return new Promise((resolve, reject) => {
				resolve(res)
			})
		}).then(res => {
			//修改订单状态(全局)
			for (let order of orders) {
				if (order.id == res.id) {
					order.order_state = true
				}
			}
			app.globalData.orders = orders
			//修改订单状态(数据表)
			app.fetch(url ,'put', {
				place_order_time: res.place_order_time,
				order_state: true,
				remark: res.remark,
				userId: res.userId,
				products: res.products,
				orderNo: res.orderNo,
				userinfo: res.userinfo
			}).then(res => {
				if (res.id) {
					wx.showToast({
						title: '支付成功!',
						mask: true,
						duration: 800
					})
					setTimeout(() => {
						wx.redirectTo({
							url: '/packageB/pages/my-orders/my-orders',
						})
					}, 800)
				}
			})
		})
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
	},

	toMyOrder () {
		wx.redirectTo({
			url: '/packageB/pages/my-orders/my-orders',
		})
	}
})