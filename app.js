//app.js
let api = require('./utils/api.js');

App({
  onLaunch: function() {
    // 读取保存在本地的用户信息
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      // 提取该用户的购物车，收藏夹，收货地址等信息
      userinfo = JSON.parse(userinfo)
      this.globalData.userinfo = userinfo
      // 此处提取购物车数据可能无法同步到首页展示（网络延迟）
      // this.getCarts(userinfo.id)
      this.getAddresses(userinfo.id)
      this.getFavorites(userinfo.id)
			this.getOrders(userinfo.id)
    }
  },
  onShow: function() {

  },
  globalData: {
    computedCategories: [],
    // 用户信息
    userinfo: {},
    // 购物车数据
    carts: [],
    // 收货地址数据
    addresses: [],
    // 收藏夹数据
    favorites: [],
		//订单
		orders: [],
		//用户所选收货地址
		selectedSite: {},
		//所选城市对象
		selectedCity: {},
		// 是否从select-site页面进入add-site页
		selectSiteBol: false,
		//购物车商品数量(用于购物车tab图标显示)
		cart_count: 0
  },

  /* 
   * 获取商品数据
   */
  getComputedCategories(cb) {
		wx.showLoading({
			title: '加载数据中...',
			mask: true
		})
		let categories = []
		let products = []
		this.fetch(api.host + '/categories')
			.then(res => {
				if (res.length > 0) {
					categories = res
					return this.fetch(api.host + '/products')
				}
			})
			.then(res => {
				if (res.length > 0) {
					products = res
					wx.hideLoading()
					for (let i = 0; i < products.length; i++) {
						for (let j = 0; j < categories.length; j++) {
							// 归类商品
							if (categories[j].id === products[i].categoryId) {
								categories[j].products.push(products[i])
							}
						}
					}
					let carts = this.globalData.carts
					let userInfo = this.globalData.userinfo
					if (userInfo.id) {
						// 若已登录，则与购物车数据同步(此处获取购物车数据，确保首页加载拿到同步后的数据)
						this.getCarts(userInfo.id).then(res => {
							if (res.length > 0) {
								for (let i = 0; i < categories.length; i++) {
									let products = categories[i].products
									for (let j = 0; j < products.length; j++) {
										for (let z = 0; z < res.length; z++) {
											if (products[j].id === res[z].product_id) {
												products[j].num = res[z].num
												break
											}
										}
									}
								}
								this.globalData.computedCategories = categories
								cb(categories)
							}
						}) 
						// 提取该用户收藏夹，收货地址,订单等信息
						this.getAddresses(userInfo.id)
						this.getFavorites(userInfo.id)
						this.getOrders(userInfo.id)
					} else {
						//未登录，显示归类后的未同步的数据（仅供查看）
						this.globalData.computedCategories = categories
						cb(categories)
					}
				}
			})
  },

  //刷新商品数据
  resetProductNum(product) {
    let computedCategories = this.globalData.computedCategories
    return new Promise((resolve, reject) => {
      label: for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === product.product_id) {
            products[j].num = product.num
            break label
          }
        }
      }
      resolve(computedCategories)
    })
  },

  /* 
   * 添加到购物车
   * @param object product 商品对象
   * @return arr   computedCategories 同步后的商品列表
   */
  addCart(pro) {
    return new Promise((resolve, reject) => {
      let carts = this.globalData.carts
      let userinfo = this.globalData.userinfo
      //假设未添加过该商品
      let addBol = true
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].product_id == pro.product_id) {
          addBol = false
          //更新数量
          carts[i].num++
            let url = `${api.host}/carts/${carts[i].id}`
          this.fetch(url, 'put', {
              product_id: carts[i].product_id,
              userId: carts[i].userId,
              product_img: carts[i].product_img,
              product_name: carts[i].product_name,
              product_price: carts[i].product_price,
              checked: carts[i].checked,
              num: carts[i].num
            }).then(res => {
              if (res.id > 0) {
                // 更新成功
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 800,
                  mask: true,
                })
								this.refreshCart(carts)
                this.resetProductNum(res)
                  .then(resetedProducts => {
                    resolve(resetedProducts)
                  })
              }
            })
          break
        }
      }
      if (addBol) {
        //添加
        let productObj = {
          product_id: pro.id,
          userId: userinfo.id,
          product_img: pro.imgs.min,
          product_name: pro.name,
          product_price: pro.price,
          checked: true, //默认勾选
          num: 1
        }
        let url = `${api.host}/carts`
        this.fetch(url, 'post', productObj).then(res => {
          if (res.id > 0) {
            carts.push(res)
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 800,
              mask: true,
            })
						this.refreshCart(carts)
            this.resetProductNum(res)
              .then(resetedProducts => {
                resolve(resetedProducts)
              })
          }
        })
      }
    })
  },

  /* 
   * 减少商品
   */
  subCart(product) {
    return new Promise((resolve, reject) => {
      let carts = this.globalData.carts
      let cartObj = {}
      let index = 0
      for (let i = 0; i < carts.length; i++) {
        if (product.product_id === carts[i].product_id) {
          index = i
          cartObj = carts[i]
          if (carts[i].num > 1) {
            //减少数量
            carts[i].num--
              let url = `${api.host}/carts/${carts[i].id}`
            this.fetch(url, 'put', {
              product_id: carts[i].product_id,
              userId: carts[i].userId,
              product_img: carts[i].product_img,
              product_name: carts[i].product_name,
              product_price: carts[i].product_price,
              checked: carts[i].checked,
              num: carts[i].num
            }).then(res => {
              if (res.id > 0) {
                wx.showToast({
                  title: '减少成功',
                  duration: 800,
                  mask: true
                })
								this.refreshCart(carts)
                this.resetProductNum(res).then(res => {
                  resolve()
                })
              }
            })
          } else {
            //删除商品
            this.fetch(api.host + '/carts/' + cartObj.id, 'DELETE')
              .then(res => {
                wx.showToast({
                  title: '删除成功',
                  duration: 800,
                  mask: true
                })
                cartObj.num--
								this.resetProductNum(cartObj).then(res => {
									// 从购物车列表中移除
									carts.splice(index, 1)
									this.refreshCart(carts)
									resolve()
								})
              })
          }
        }
      }
    })
  },

  //获取用户购物车数据
  getCarts(id) {
    let url = `${api.host}/carts?userId=${id}`
    return new Promise((resolve, reject) => {
      this.fetch(url).then(res => {
				this.refreshCart(res)
        resolve(res)
      })
    })
  },

  //获取用户收货地址数据
  getAddresses(id) {
    let url = `${api.host}/addresses?userId=${id}`
    this.fetch(url).then(res => {
      this.globalData.addresses = res
    })
  },

  //获取用户收藏夹数据
  getFavorites(id) {
    let url = `${api.host}/favorites?userId=${id}`
    this.fetch(url).then(res => {
      this.globalData.favorites = res
    })
  },

	//获取用户订单信息
	getOrders(id) {
		let url = `${api.host}/orders?userId=${id}`
		this.fetch(url).then(res => {
			this.globalData.orders = res
		})
	},

	//更新全局购物车数量
	refreshCart (carts) {
		this.globalData.carts = carts
		let num = 0
		for (let pro of carts) {
			if (pro.checked) {
				num += pro.num
			}
		}
		this.globalData.cart_count = num
		//更新tabbar数量图标
		if (num <= 0) {
			wx.removeTabBarBadge({
				index: 2
			})
		} else {
			wx.setTabBarBadge({
				index: 2,
				text: String(num),
			})
		}
	},

  /* 
   * 封装的请求方法
   * @param string url 请求的接口地址
   * @param string method 请求的方法
   * @param object data   请求携带的数据
   */
  fetch(url, method = "GET", data = {}) {
    return new Promise((resolve, reject) => {
      // console.log(url)
      wx.request({
        url: url,
        data: data,
        method: method,
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject('请求失败')
        }
      })
    })
  }
})