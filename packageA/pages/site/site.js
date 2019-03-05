// packageA/pages/site/site.js
const app = getApp()
let api = require('../../../utils/api.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userinfo: {},
		sites: []
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
		let sites = app.globalData.addresses
		this.setData({
			sites: sites,
			userinfo: app.globalData.userinfo
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

	//切换选择的地址
	changeSelectedSite (e) {
		let site = e.currentTarget.dataset.site
		let userinfo = this.data.userinfo
		userinfo.selectSite = site
		this.setData({
			userinfo: userinfo
		})
		app.globalData.userinfo = userinfo
		let userObj = {
			phone: userinfo.phone,
			id: userinfo.id,
			selectSite: userinfo.selectSite
		}
		app.fetch(api.host + '/users/' + userinfo.id, 'put', userObj)
		.then(res => {
			let userObj = res
			return new Promise((resolve, reject) => {
				//更新存储数据
				wx.setStorage({
					key: 'userinfo',
					data: JSON.stringify(userObj),
					success() {
						resolve()
					}
				})
			})			
		}).then(res => {
			//跳转到购物车页面
			wx.switchTab({
				url: '/pages/cart/cart',
			})
		})		
	},

})