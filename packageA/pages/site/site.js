// packageA/pages/site/site.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {
			"phone": "15779289474",
			"selectSite": {
				"linkman": "李响1",
				"sex": "male",
				"phone": "15779289475",
				"city": "深圳市",
				"site": "灵芝园-52栋",
				"detailSite": "1210",
				"userId": 2,
				"x": 113.915603,
				"y": 22.572292,
				"id": 1
			},
			"id": 2
		},
		sites: [
			{
				"linkman": "李响1",
				"sex": "male",
				"phone": "15779289475",
				"city": "深圳市",
				"site": "灵芝园-52栋",
				"detailSite": "1210",
				"userId": 2,
				"x": 113.915603,
				"y": 22.572292,
				"id": 1
			},
			{
				"linkman": "李响2",
				"sex": "female",
				"phone": "15779289476",
				"city": "南京市",
				"site": "南京市江宁区人民政府",
				"detailSite": "1110",
				"userId": 2,
				"x": 118.846379,
				"y": 31.959307,
				"id": 2
			},
			{
				"linkman": "李响3",
				"sex": "male",
				"phone": "15779289477",
				"city": "广州市",
				"site": "广州银行ATM(越新支行)",
				"detailSite": "1002",
				"userId": 2,
				"x": 113.261205,
				"y": 23.121402,
				"id": 3
			},
		]
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

	//切换选择的地址
	changeSelectedSite (e) {
		let site = e.currentTarget.dataset.site
		let userInfo = this.data.userInfo
		userInfo.selectSite = site
		this.setData({
			userInfo: userInfo
		})
		//跳转到购物车页面
	},

})