// packageA/pages/add-site/add-site.js
const app = getApp()
const api = require('../../../utils/api.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cityArr: [],
		sexArr: [
			{
				name: "male",
				value: "男",
				checked: "true"
			},
			{
				name: "female",
				value: "女"
			}
		],
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
		],
		//选中的下标
		index: 0,
		key: 'city',
		linkman: '',
		sex: "male",
		phone: '',
		city: '',
		site: '',
		detailSite: '',
		x: '',
		y: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let id = options.siteId
		this.getCitys().then(res => {
			//编辑地址
			if (id) {
				// let sites = app.globalData.addresses
				let sites = this.data.sites
				let selectSite = {}
				for (let site of sites) {
					if (site.id == id) {
						selectSite = site
					}
				}
				//初始化地址手机号为用户手机号
				this.setData({
					phone: selectSite.phone,
					linkman: selectSite.linkman,
					sex: selectSite.sex,
					city: selectSite.city,
					site: selectSite.site,
					detailSite: selectSite.detailSite,
					x: selectSite.x,
					y: selectSite.y,
				})
				let city = selectSite.city
				let sex = selectSite.sex
				let cityArr = this.data.cityArr
				let sexArr = this.data.sexArr
				let index = 0
				for (let i = 0; i < cityArr.length; i++) {
					if (city == cityArr[i].city) {
						index = i
					}
				}
				for (let i = 0; i < sexArr.length; i++) {
					if (sex == sexArr[i].name) {
						sexArr[i].checked = 'true'
					}
				}
				this.setData({
					index: index,
					sexArr: sexArr
				})
			} else {
				//添加地址
				let userinfo = app.globalData.userinfo
				this.setData({
					phone: userinfo.phone
				})
			}
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

	// 获取支持的城市列表
	getCitys () {
		let citys = this.data.cityArr
		return app.fetch(api.host + '/citys')
			.then(res => {
				if (res.length > 0) {
					citys = res
					this.setData({
						cityArr: citys,
					})
				}
			})
	},

	selectCity (e) {
		let index = Number(e.detail.value)
		let city = this.data.cityArr[index].city
		this.setData({
			index: index,
			city: city
		})
	},

	bindPickerChange () {

	},

	addSite () {

	}
})