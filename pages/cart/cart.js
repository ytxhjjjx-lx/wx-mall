// pages/cart/cart.js
const app = getApp()
// 引入api
let api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSelect: true,
    receive_time: '',
    //送货时间列表
    receive_time_list: [
			{
				title: '30分钟送达',
				time: 'limit',
				select: false
			},
			{
				title: '今天15:00-16:00',
				time: '15',
				select: false
			},
			{
				title: '今天16:00-17:00',
				time: '16',
				select: false
			},
			{
				title: '今天17:00-18:00',
				time: '17',
				select: false
			},
			{
				title: '今天18:00-19:00',
				time: '18',
				select: false
			},
			{
				title: '',
				time: '0',
				select: false
			},
			{
				title: '明天09:00-10:00',
				time: '9',
				select: false
			},
			{
				title: '明天10:00-11:00',
				time: '10',
				select: false
			},
			{
				title: '明天11:00-12:00',
				time: '11',
				select: false
			},
			{
				title: '明天12:00-13:00',
				time: '12',
				select: false
			},
			{
				title: '明天14:00-15:00',
				time: '14',
				select: false
			},
			{
				title: '明天15:00-16:00',
				time: '15',
				select: false
			},
			{
				title: '明天16:00-17:00',
				time: '16',
				select: false
			},
			{
				title: '明天17:00-18:00',
				time: '17',
				select: false
			},
			{
				title: '明天18:00-19:00',
				time: '18',
				select: false
			},
			{
				title: '明天19:00-20:00',
				time: '19',
				select: false
			},
			{
				title: '明天20:00-21:00',
				time: '20',
				select: false
			},
			{
				title: '明天21:00-22:00',
				time: '21',
				select: false
			},
			{
				title: '',
				time: '0',
				select: false
			},
			{
				title: '后天09:00-10:00',
				time: '9',
				select: false
			},
			{
				title: '后天10:00-11:00',
				time: '10',
				select: false
			},
			{
				title: '后天11:00-12:00',
				time: '11',
				select: false
			},
			{
				title: '后天12:00-13:00',
				time: '12',
				select: false
			},
			{
				title: '后天14:00-15:00',
				time: '14',
				select: false
			},
			{
				title: '后天15:00-16:00',
				time: '15',
				select: false
			},
			{
				title: '后天16:00-17:00',
				time: '16',
				select: false
			},
			{
				title: '后天17:00-18:00',
				time: '17',
				select: false
			},
			{
				title: '后天18:00-19:00',
				time: '18',
				select: false
			},
			{
				title: '后天19:00-20:00',
				time: '19',
				select: false
			},
			{
				title: '后天20:00-21:00',
				time: '20',
				select: false
			},
			{
				title: '后天21:00-22:00',
				time: '21',
				select: false
			},
    ],
    //收货备注
    receive_remark: '',
    carts: [],
		totalPrice: 0,
		checkedAll: true,
		linkman: '',
		site: '',
		phone: '',
		sex: 'male'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
		this.checkLoginState()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
		let userinfo = app.globalData.userinfo
		this.setData({
			linkman: userinfo.selectSite.linkman,
			phone: userinfo.selectSite.phone,
			site: userinfo.selectSite.site + ' ' + userinfo.selectSite.detailSite,
			sex: userinfo.selectSite.sex
		})
		this.checkLoginState()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //选择送货时间
  chooseTime(event) {
    // 获取点击的时间
    let time = event.currentTarget.dataset.time;
    if (time !== '0' && time !== 'limit') {
      this.setData({
        receive_time: time,
        showSelect: true
      })
    } else {
      this.setData({
        showSelect: true
      })
    }
  },
  choose_time() {
    let bol = this.data.showSelect;
    this.setData({
      showSelect: !bol
    })
  },
  focusInput(event) {
    event.detail.height = 90;
  },
  blurInput(event) {
    this.setData({
      receive_remark: event.detail.value
    })
  },

	//切换勾选状态
	changeChecked (event) {
		let id = event.target.dataset.id;
		let carts = this.data.carts;
		for (let pro of carts) {
			if (id == pro.id) {
				pro.checked = !pro.checked;
				app.fetch(api.host + '/carts/' + id, 'put', {
					product_id: pro.product_id,
					userId: pro.userId,
					product_img: pro.product_img,
					product_name: pro.product_name,
					product_price: pro.product_price,
					checked: pro.checked,
					num: pro.num
				})
			}
		}
		let checkAllBol = true;
		for (let i = 0; i < carts.length; i++) {
			if (!carts[i].checked) {
				checkAllBol = false;
			}
		}
		//判断是否全部勾选
		this.setData({
			carts: carts,
			checkedAll: checkAllBol
		})
	},

	subProduct (e) {
		let pro = e.currentTarget.dataset.pro
		app.subCart(pro)
			.then(res => {
				let carts = app.globalData.carts
				this.setData({
					carts: carts
				})
			})
	},

	addProduct (e) {
		let pro = e.currentTarget.dataset.pro
		app.addCart(pro)
			.then(res => {
				let carts = app.globalData.carts
				this.setData({
					carts: carts
				})
			})
	},

	//全选
	changeCheckedAll () {
		let carts = this.data.carts;
		let bol = this.data.checkedAll;
		bol = !bol;
		for (let i=0; i<carts.length; i++) {
			carts[i].checked = bol;
			app.fetch(api.host + '/carts/' + carts[i].id, 'put', {
				product_id: carts[i].product_id,
				userId: carts[i].userId,
				product_img: carts[i].product_img,
				product_name: carts[i].product_name,
				product_price: carts[i].product_price,
				checked: carts[i].checked,
				num: carts[i].num
			})
		}
		this.setData({
			checkedAll: bol,
			carts: carts
		})
	},

	//判断登录状态
	checkLoginState () {
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
					} else if (res.cancel) {
						//取消, 回到首页
						wx.switchTab({
							url: '/pages/index/index'
						})
					}
				}
			})
		} else {
			let carts = app.globalData.carts
			let totalPrice = 0;
			for (let pro of carts) {
				totalPrice += pro.product_price * pro.num;
			}
			var checkAllBol = true
			for (var i = 0; i < carts.length; i++) {
				if (!carts[i].checked) {
					checkAllBol = false
				}
			}
			this.setData({
				carts: carts,
				totalPrice: totalPrice.toFixed(1),
				receive_time: '30分钟送达',
				checkedAll: checkAllBol
			})
		}
	}
})