// packageA/pages/product-item/product-item.js
let app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		productInfo: {},
		id: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let id = options.id
		this.setData({
			id: Number(id)
		})
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
		this.getComputedCategories()
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

	getComputedCategories() {
		let id = this.data.id
		let computedCategories = app.globalData.computedCategories
		if (computedCategories.length > 0) {
			label:
			for (let i = 0; i < computedCategories.length; i++) {
				let products = computedCategories[i].products
				for (let j = 0; j < products.length; j++) {
					if (products[j].id === id) {
						// console.log(products[j])
						this.setData({
							productInfo: products[j]
						})
						break label
					}
				}
			}
		}
	},

	subCart() {
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
			let product = this.data.productInfo
			// 追加product_id属性
			product.product_id = product.id
			app.subCart(product)
				.then(res => {
					this.getComputedCategories()
				})
		}
	},
 
	addCart() {
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
			let product = this.data.productInfo
			// 追加product_id(商品id)属性
			product.product_id = product.id
			app.addCart(product)
				.then(res => {
					this.getComputedCategories()
				})
		}
	}
})