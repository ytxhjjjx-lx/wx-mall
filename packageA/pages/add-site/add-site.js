// packageA/pages/add-site/add-site.js
const app = getApp()
let api = require('../../../utils/api.js')
let util = require('../../../utils/util.js')
//是否添加地址
let addBol = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArr: [],
    sexArr: [{
        name: "male",
        value: "男",
        checked: "true"
      },
      {
        name: "female",
        value: "女"
      }
    ],
    sites: [],
    //选中的下标
    index: 0,
    key: 'city',
    sex: "male",
    city: '',
    phone: '',
    x: '',
    y: '',
    site: '',
    detailSite: '',
    linkman: '',
    //编辑地址通过该对象操作保存数据，添加地址通过以上参数操作保存数据
    selectedSite: {},
    userinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.siteId
    let userinfo = app.globalData.userinfo
		console.log(app.globalData.addresses)
    this.setData({
      userinfo: userinfo,
      sites: app.globalData.addresses
    })
    this.getCitys().then(res => {
      //编辑地址
      if (id) {
        addBol = false
        let sites = app.globalData.addresses
        let selectSite = {}
        for (let site of sites) {
          if (site.id == id) {
            selectSite = site
            app.globalData.selectedSite = site
          }
        }
        this.setData({
          selectedSite: selectSite,
        })
        let city = selectSite.city
        let sex = selectSite.sex
        let cityArr = this.data.cityArr
        let sexArr = this.data.sexArr
        let index = 0
        for (let i = 0; i < cityArr.length; i++) {
          if (city == cityArr[i].city) {
            app.globalData.selectedCity = cityArr[i]
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
        addBol = true
        //添加新地址
        let index = this.data.index
        let cityArr = this.data.cityArr
        //初始化城市坐标系数据信息
        this.init_xy_info(index, cityArr)
        this.setData({
          phone: app.globalData.userinfo.phone
        })
      }
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
    //从选择地址页进入
    if (app.globalData.selectSiteBol) {
      app.globalData.selectSiteBol = false
      let selectedSite = app.globalData.selectedSite
      if (addBol) {
        this.setData({
          site: selectedSite.site,
          detailSite: selectedSite.detailSite
        })
      } else {
        this.setData({
          selectedSite: selectedSite
        })
      }
    } else {
      //从地址列表页进入
    }
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

  // 获取支持的城市列表
  getCitys() {
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

  selectCity(e) {
    let index = Number(e.detail.value)
    let cityArr = this.data.cityArr
    this.init_xy_info(index, cityArr)
  },

  selectSex(e) {
    let val = e.detail.value
    app.globalData.selectedSite.sex = val
    this.setData({
      sex: val
    })
  },

  selectsite() {
    wx.navigateTo({
      url: '/packageA/pages/select-site/select-site'
    })
  },

  //保存地址
  addSite() {
    // 添加
    if (addBol) {
      if (this.data.linkman !== '' && util.checkPhone(this.data.phone) && this.data.city !== '' && this.data.site !== '' && this.data.detailSite !== '') {
        let url = api.host + '/addresses'
        let siteObj = {
          userId: this.data.userinfo.id,
          linkman: this.data.linkman,
          sex: this.data.sex,
          phone: this.data.phone,
          city: this.data.city,
          site: this.data.site,
          detailSite: this.data.detailSite,
          x: this.data.x,
          y: this.data.y
        }
        let sites = this.data.sites
        let userinfo = this.data.userinfo
        app.fetch(url, 'post', siteObj).then(res => {
          if (res.id) {
						this.resetSitesData(res, app.globalData.addresses)
						this.resetSitesData(res, sites)
            this.setData({
              sites: sites
            })
            //将该地址作为用户默认选择地址
            let url = api.host + '/users/' + userinfo.id
            let userObj = {
              phone: userinfo.phone,
              id: userinfo.id,
              selectSite: res
            }
            return app.fetch(url, 'put', userObj)
          }
        }).then(res => {
          if (res.id) {
            return new Promise((resolve, reject) => {
              app.globalData.userinfo = res
              userinfo = res
              this.setData({
                userinfo: userinfo
              })
              //更新存储数据
              wx.setStorage({
                key: 'userinfo',
                data: JSON.stringify(res),
								success() {
									resolve()
								}
              })
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 800,
                mask: true,
              })
            })
          }
        }).then(res => {
          wx.redirectTo({
            url: '/packageA/pages/site/site',
          })
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请填写完整的信息',
          success(res) {}
        })
      }
    } else {
      //修改
      let selectedSite = this.data.selectedSite
      let sites = this.data.sites
      let url = api.host + '/addresses/' + selectedSite.id
      app.fetch(url, 'put', selectedSite).then(res => {
        if (res.id) {
          for (let site of sites) {
            if (site.id == res.id) {
              site = res
            }
          }
          this.setData({
            sites: sites
          })
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 800,
            mask: true,
          })
        }
      })
    }
  },

  //初始化城市坐标系数据信息
  init_xy_info(index, cityArr) {
    app.globalData.selectedCity = cityArr[index]
    let city = cityArr[index].city
    let longitude = cityArr[index].longitude
    let latitude = cityArr[index].latitude
    let selectedSite = app.globalData.selectedSite
    selectedSite.city = city
    selectedSite.x = longitude
    selectedSite.y = latitude
    this.setData({
      index: index,
      city: city,
      x: longitude,
      y: latitude
    })
  },

  input_linkman(e) {
    let val = e.detail.value
    if (addBol) {
      this.setData({
        linkman: val
      })
    } else {
      let selectedSite = this.data.selectedSite
      selectedSite.linkman = val
      this.setData({
        selectedSite: selectedSite
      })
      this.resetGlobalSelectedSite(selectedSite)
    }
  },

  input_phone(e) {
    let val = e.detail.value
    if (addBol) {
      this.setData({
        phone: val
      })
    } else {
      let selectedSite = this.data.selectedSite
      selectedSite.phone = val
      this.setData({
        selectedSite: selectedSite
      })
      this.resetGlobalSelectedSite(selectedSite)
    }
  },

  input_deSite(e) {
    let val = e.detail.value
    if (addBol) {
      this.setData({
        detailSite: val
      })
    } else {
      let selectedSite = this.data.selectedSite
      selectedSite.detailSite = val
      this.setData({
        selectedSite: selectedSite
      })
      this.resetGlobalSelectedSite(selectedSite)
    }
  },

  resetGlobalSelectedSite(selectedSite) {
    app.globalData.selectedSite = selectedSite
  },

	//更新地址数据
	resetSitesData (siteObj, siteArr) {
		let addBol = true 
		for (let site of siteArr) {
			if (site.id == siteObj.id) {
				addBol = false
			}
		}
		if (addBol) {
			siteArr.push(siteObj)
		}
	}
})