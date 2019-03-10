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
        time: 'limit'
      },
      {
        title: '今天15:00-16:00',
        time: '15',
      },
      {
        title: '今天16:00-17:00',
        time: '16',
      },
      {
        title: '今天17:00-18:00',
        time: '17',
      },
      {
        title: '今天18:00-19:00',
        time: '18',

      },
      {
        title: '',
        time: '0',

      },
      {
        title: '明天09:00-10:00',
        time: '9',

      },
      {
        title: '明天10:00-11:00',
        time: '10',

      },
      {
        title: '明天11:00-12:00',
        time: '11',

      },
      {
        title: '明天12:00-13:00',
        time: '12',

      },
      {
        title: '明天14:00-15:00',
        time: '14',

      },
      {
        title: '明天15:00-16:00',
        time: '15',

      },
      {
        title: '明天16:00-17:00',
        time: '16',

      },
      {
        title: '明天17:00-18:00',
        time: '17',

      },
      {
        title: '明天18:00-19:00',
        time: '18',

      },
      {
        title: '明天19:00-20:00',
        time: '19',

      },
      {
        title: '明天20:00-21:00',
        time: '20',

      },
      {
        title: '明天21:00-22:00',
        time: '21',

      },
      {
        title: '',
        time: '0',

      },
      {
        title: '后天09:00-10:00',
        time: '9',

      },
      {
        title: '后天10:00-11:00',
        time: '10',

      },
      {
        title: '后天11:00-12:00',
        time: '11',

      },
      {
        title: '后天12:00-13:00',
        time: '12',

      },
      {
        title: '后天14:00-15:00',
        time: '14',

      },
      {
        title: '后天15:00-16:00',
        time: '15',

      },
      {
        title: '后天16:00-17:00',
        time: '16',

      },
      {
        title: '后天17:00-18:00',
        time: '17',

      },
      {
        title: '后天18:00-19:00',
        time: '18',

      },
      {
        title: '后天19:00-20:00',
        time: '19',

      },
      {
        title: '后天20:00-21:00',
        time: '20',

      },
      {
        title: '后天21:00-22:00',
        time: '21',

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
    sex: 'male',
		//是否选择了地址
		has_site: false
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
		if (userinfo.selectSite.id) {
			this.setData({
				linkman: userinfo.selectSite.linkman,
				phone: userinfo.selectSite.phone,
				site: userinfo.selectSite.site + ' ' + userinfo.selectSite.detailSite,
				sex: userinfo.selectSite.sex,
				has_site: true
			})
		} else {
			this.setData({
				has_site: false
			})
		}
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
    let item = event.currentTarget.dataset.time;
    if (item.time !== '0') {
      this.setData({
        receive_time: item.title,
        showSelect: true
      })
      wx.setStorage({
        key: 'dilivery_time',
        data: JSON.stringify(item),
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

	bindinput(event) {
		let val = event.detail.value
    this.setData({
      receive_remark: event.detail.value
    })
		wx.setStorageSync('remark', val)
  },

  //切换勾选状态
  changeChecked(event) {
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
		app.refreshCart(carts)
  },

  subProduct(e) {
    let pro = e.currentTarget.dataset.pro
    app.subCart(pro)
      .then(res => {
        let carts = app.globalData.carts
        this.setData({
          carts: carts
        })
      })
  },

  addProduct(e) {
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
  changeCheckedAll() {
    let carts = this.data.carts;
    let bol = this.data.checkedAll;
    bol = !bol;
    for (let i = 0; i < carts.length; i++) {
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
		app.refreshCart(carts)
  },

  //判断登录状态
  checkLoginState() {
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
        checkedAll: checkAllBol
      })
      let _this = this
      wx.getStorage({
        key: 'dilivery_time',
        success: function(res) {
          let time = JSON.parse(res.data)
					_this.setData({
						receive_time: time.title
					})
        },
				fail: function(res){
					wx.setStorageSync('dilivery_time', JSON.stringify({
						title: '30分钟送达',
						time: 'limit'
					})),
					_this.setData({
						receive_time: '30分钟送达'
					})
				},
				complete: function() {
					wx.setStorageSync('remark', '')
				}
      })
    }
  },

	toSite () {
		wx.redirectTo({
			url: '/packageA/pages/site/site',
		})
	}
})