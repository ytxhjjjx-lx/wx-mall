// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSelect: true,
    receive_time: '',
    //送货时间列表
    receive_time_list: [
      '今天',
      '30分钟送达',
      '15:00-16:00',
      '16:00-17:00',
      '17:00-18:00',
      '18:00-19:00',
      '明天',
      '明天 09:00-10:00',
      '明天 10:00-11:00',
      '明天 11:00-12:00',
      '明天 12:00-13:00',
      '后天',
      '后天 09:00-10:00',
      '后天 10:00-11:00',
      '后天 11:00-12:00',
      '明天 12:00-13:00',
    ],
    //收货备注
    receive_remark: '',
    carts: [{
        "product_id": 109,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/ef79f2&text=蒋娜",
        "product_name": "通每场",
        "product_price": 30.2,
        "checked": true,
        "num": 6,
        "id": 2
      },
      {
        "product_id": 70,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/7998f2&text=傅军",
        "product_name": "则北农界动",
        "product_price": 40.3,
        "checked": true,
        "num": 4,
        "id": 3
      },
      {
        "product_id": 16,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/f279d3&text=孔杰",
        "product_name": "反就建被",
        "product_price": 31.4,
        "checked": true,
        "num": 2,
        "id": 4
      },
      {
        "product_id": 29,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/f279a1&text=常军",
        "product_name": "相几因几始",
        "product_price": 78.7,
        "checked": true,
        "num": 4,
        "id": 5
      },
      {
        "product_id": 34,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/f2d379&text=黄明",
        "product_name": "市何全是包统种团政",
        "product_price": 35.9,
        "checked": true,
        "num": 3,
        "id": 6
      },
      {
        "product_id": 32,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/7983f2&text=孔芳",
        "product_name": "写建活把称斯对局料",
        "product_price": 63.7,
        "checked": true,
        "num": 1,
        "id": 7
      },
      {
        "product_id": 55,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/f2b579&text=夏霞",
        "product_name": "越太值约广心县很",
        "product_price": 26.1,
        "checked": true,
        "num": 1,
        "id": 8
      },
      {
        "product_id": 37,
        "userId": 1,
        "product_img": "http://dummyimage.com/80x80/f279f2&text=何芳",
        "product_name": "满即查设张",
        "product_price": 68.1,
        "checked": true,
        "num": 2,
        "id": 9
      },
    ],
		totalPrice: 0,
		checkedAll: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
		let carts = this.data.carts;
		let totalPrice = this.data.totalPrice;
		for (let pro of carts) {
			totalPrice += pro.product_price * pro.num;
		}
		this.setData({
			totalPrice: totalPrice.toFixed(1),
      receive_time: '30分钟送达',
    })
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
    if (time !== '今天' && time !== '明天' && time !== '后天') {
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
			}
		}
		let checkAllBol = true;
		let totalPrice = Number(this.data.totalPrice);
		totalPrice = 0;
		for (let i = 0; i < carts.length; i++) {
			if (!carts[i].checked) {
				checkAllBol = false;
			} else {
				totalPrice += (carts[i].product_price * carts[i].num);
			}
		}
		totalPrice = totalPrice.toFixed(1);
		//判断是否全部勾选
		this.setData({
			carts: carts,
			checkedAll: checkAllBol,
			totalPrice: totalPrice
		})
	},
	subProduct () {

	},
	addProduct () {

	},
	//全选
	changeCheckedAll () {
		let carts = this.data.carts;
		let bol = this.data.checkedAll;
		let totalPrice = Number(this.data.totalPrice);
		bol = !bol;
		totalPrice = 0;
		for (let i=0; i<carts.length; i++) {
			if (bol) {
				totalPrice += (carts[i].product_price * carts[i].num);
			} else {
				totalPrice = 0;
			}
			carts[i].checked = bol;
		}
		totalPrice = totalPrice.toFixed(1);
		this.setData({
			checkedAll: bol,
			carts: carts,
			totalPrice: totalPrice
		})
	}
})