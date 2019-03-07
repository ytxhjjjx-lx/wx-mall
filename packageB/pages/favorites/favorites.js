// packageA/pages/favorites/favorites.js
let app = getApp()
let api = require('../../../utils/api.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		editBol: false,
		selectAllBol: false,
		favorPros: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let favorPros = app.globalData.favorites
		favorPros = favorPros.map(pro => {
			pro.selected = false
			return pro
		})
		this.setData({
			favorPros: favorPros
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

	editFavorPro (event) {
		let editBol = this.data.editBol
		this.setData({
			editBol: !editBol
		})
	},

	selectPro (event) {
		let id = event.currentTarget.dataset.id
		let favorPros = this.data.favorPros
		let editBol = this.data.editBol
		let selectAllBol = this.data.selectAllBol
		let isSelectAll = true
		if (editBol) {
			for (let pro of this.data.favorPros) {
				if (pro.id == id) {
					pro.selected = !pro.selected
				}
				if (!pro.selected) {
					isSelectAll = false
				}
			}
		}
		this.setData({
			favorPros: favorPros,
			selectAllBol: isSelectAll
		})
	},

	checkAll () {
		let favorPros = this.data.favorPros
		let selectAllBol = this.data.selectAllBol
		selectAllBol = !selectAllBol
		for (var i = 0; i < favorPros.length; i++) {
			if (selectAllBol) {
				favorPros[i].selected = true
			} else {
				favorPros[i].selected = false
			}
		}
		this.setData({
			favorPros: favorPros,
			selectAllBol: selectAllBol
		})
	},

	deleteFavorPro () {
		let favorPros = this.data.favorPros
		let deletePros = favorPros.filter(pro => pro.selected)
		console.log(favorPros, deletePros)
		let count = 0
		for (let i=0; i<deletePros.length; i++) {
			for (let j = 0; j < favorPros.length; j++) {
				if (favorPros[j].id == deletePros[i].id) {
					favorPros.splice(j, 1)
				}
			}
			//删除收藏商品
			app.fetch(api.host + '/favorites/' + deletePros[i].id, 'delete').then(res => {
				if (res) {
					count++
					if (count == deletePros.length) {
						app.globalData.favorites = favorPros
						this.setData({
							favorPros: favorPros,
							selectAllBol: false
						})
						// 取消收藏成功
						wx.showToast({
							title: '取消收藏成功',
							icon: 'success',
							duration: 800,
							mask: true,
						})
					}
				}
			})
		}
	},

	toIndex () {
		wx.switchTab({
			url: '/index',
		})
	}
})