// packageA/pages/product-item/product-item.js
let app = getApp()
// 引入api
let api = require('../../../utils/api.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		productInfo: {},
		id: 0,
		isFavored: false
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
		let favorPros = app.globalData.favorites
		let isFavored = this.data.isFavored
		if (computedCategories.length > 0) {
			label:
			for (let i = 0; i < computedCategories.length; i++) {
				let products = computedCategories[i].products
				for (let j = 0; j < products.length; j++) {
					if (products[j].id == id) {
						//判断是否已收藏
						for (let pro of favorPros) {
							if (pro.product_id == products[j].id) {
								isFavored = true
							}
						}
						this.setData({
							productInfo: products[j],
							isFavored: isFavored
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
	},

	favorPro (e) {
		let product = this.data.productInfo
		let url = `${api.host}/favorites`
		let userinfo = app.globalData.userinfo
		let favorPros = app.globalData.favorites
		let isFavored = this.data.isFavored
		let proObj = {}
		let index = 0
		if (userinfo.id) {
			if (isFavored) {
				for (let i=0; i<favorPros.length; i++) {
					if (favorPros[i].product_id == product.id) {
						proObj = favorPros[i]
						index = i
					}
				}
				//取消收藏
				app.fetch(url + '/' + proObj.id, 'delete').then(res => {
					favorPros.splice(index, 1)
					app.globalData.favorites = favorPros
					this.setData({
						isFavored: false
					})
					// 取消收藏成功
					wx.showToast({
						title: '取消收藏成功',
						icon: 'success',
						duration: 800,
						mask: true,
					})
				})
			} else {
				//收藏
				let proObj = {
					userId: userinfo.id,
					product_id: product.id,
					img: product.imgs.min,
					name: product.name,
					unit: product.unit,
					price: product.price
				}
				app.fetch(url, 'post', proObj).then(res => {
					if (res.id) {
						favorPros.push(res)
						app.globalData.favorites = favorPros
						this.setData({
							isFavored: true
						})
						// 收藏成功
						wx.showToast({
							title: '收藏成功',
							icon: 'success',
							duration: 800,
							mask: true,
						})
					}
				})
			}
		} else {
			wx.showModal({
				title: '提示',
				content: '你还未登录!',
				success(res) {
					if (res.confirm) {
						//确定
						wx.redirectTo({
							url: '/pages/login/login'
						})
					} else if (res.cancel) {}
				}
			})
		}
		
	}
})