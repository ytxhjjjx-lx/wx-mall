// pages/category/category.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		categories: [],
		//激活的分类id
		activeCateId: 1,
		click: false,
		click1: false,
		//排序类型
		rankingKeys: ["综合排序", "价格最高", "价格最低"],	
		//激活的子分类关键字
		ChildCateKey: "全部分类",
		//激活的排序关键字
		rankKey: "综合排序",
		//激活的子分类
		activeChildCates: [],
		//激活的子分类下标
		activeChildCateIndex: 0,
		//激活的商品数据
		activeProducts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
		//提取整理后的分类数据
		let categories = app.globalData.computedCategories
		this.setData({
			categories: categories
		})
		console.log(categories)
		//初始化子分类
		let ChildCates = this.data.categories[this.data.activeCateId - 1].cids;
		this.setData({
			activeChildCates: ChildCates
		})
		//初始化商品列表
		this.changeActiveProducts()
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

	changeActiveCate(event) {
		// 获取点击分类的id
		let id = event.currentTarget.dataset.id;
		let ChildCates = this.data.categories[id - 1].cids;
		this.setData({
			activeCateId: id,
			ChildCateKey: '全部分类',
			rankKey: '综合排序',
			activeChildCates: ChildCates,
			activeChildCateIndex: 0,
			click: false,
			click1: false
		})
		//更新选择的商品
		this.changeActiveProducts()
	},
	//隐藏蒙版
	hideFilterItems() {
		this.setData({
			click: false,
			click1: false
		})
	},
	//切换为分类筛选
	chooseCategory: function () {
		if (this.data.click1) {
			this.setData({
				click1: false
			})
		} else {
			let bol = this.data.click
			this.setData({
				click: !bol
			})
		}
	},
	//切换为排序筛选
	chooseRanking: function () {
		if (this.data.click) {
			this.setData({
				click: false
			})
		} else {
			let bol = this.data.click1
			this.setData({
				click1: !bol
			})
		}
	},
	//切换激活的子分类
	changeActiveChildcate: function (event) {
		let index = event.currentTarget.dataset.index
		let ChildCateKey
		if (index === 0) {
			ChildCateKey = '全部分类'
		} else {
			let ChildCates = this.data.activeChildCates
			ChildCateKey = ChildCates[index - 1].name
		}
		this.setData({
			activeChildCateIndex: index,
			ChildCateKey: ChildCateKey
		})
		this.changeActiveProducts()
	},
	//切换激活的排序方式
	changeRanking: function (event) {
		let name = event.currentTarget.dataset.name
		this.setData({
			rankKey: name
		})
		this.changeActiveProducts()
	},
	changeActiveProducts: function () {
		let activeCateId = this.data.activeCateId
		let categories = this.data.categories
		//激活的分类对应的商品
		let products = categories[activeCateId - 1].products
		//根据子分类过滤商品
		let activeChildCateIndex = this.data.activeChildCateIndex
		if (activeChildCateIndex !== 0) {
			products = products.filter(item => item.cidIndex === activeChildCateIndex - 1)
		}
		//排序
		let rankKey = this.data.rankKey
		// 防止对原数组造成影响(保证原始的排序规则)
		let cloneProducts = products.slice(0)
		if (rankKey === '价格最低') {
			products = cloneProducts.sort((a, b) => a.price - b.price)
		} else if (rankKey === '价格最高') {
			products = cloneProducts.sort((a, b) => b.price - a.price)
		}
		
		this.setData({
			activeProducts: products
		})
	}
})