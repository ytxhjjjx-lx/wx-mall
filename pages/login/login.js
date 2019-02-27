// pages/login/login.js
const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 控制提示条的显示隐藏
		picHide: false,
		phone: ''
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

	/* 
   * 手机号码输入框更改内容的时候同步data中的phone
   */
	changePhone(event) {
		let phone = event.detail.value
		this.setData({
			phone: phone
		})
	},
  /* 
   * 手机号码输入框聚焦的时候隐藏图片
   */
	picHidefocus() {
		this.setData({
			picHide: true
		})
	},
  /* 
   * 手机号码输入框失焦的时候显示图片（延迟1秒钟）
   */
	picHideBlur() {
		setTimeout(() => {
			this.setData({
				picHide: false
			})
		}, 500)
	},
	//登录
	loginFn () {
		let phone = this.data.phone
		if (util.checkPhone(phone)) {
			let url = `${api.host}/users?phone=${phone}`
			app.fetch(url).then(res => {
				if (res.length > 0) {
					res = res[0]
					app.globalData.userinfo = res
					// 写入缓存
					wx.setStorage({
						key: "userinfo",
						data: JSON.stringify(res)
					})
					// 登陆成功
					wx.showToast({
						title: '登陆成功',
						icon: 'success',
						duration: 800,
						mask: true,
						success() {
							setTimeout(() => {
								wx.switchTab({
									url: '/pages/index/index',
								})
							}, 800)
						}
					})
				} else {
					//注册用户
					let userObj = {
						phone: phone,
						// 初始化所选地址
						selectSite: {}
					}
					let url = `${api.host}/users`
					app.fetch(url, 'post', userObj).then(res => {
						app.globalData.userinfo = res
						return new Promise((resolve, reject) => {
							// 写入缓存
							wx.setStorage({
								key: "userinfo",
								data: JSON.stringify(res),
								success() {
									resolve()
								}
							})
						})
					}).then(res => {
						// 注册成功
						wx.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 800,
							mask: true,
							success() {
								setTimeout(() => {
									wx.switchTab({
										url: '/pages/index/index',
									})
								}, 800)
							}
						})
					})
				}
			})
		}
	}
})