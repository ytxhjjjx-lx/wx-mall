// packageA/pages/select-site/select-site.js
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')
let qqmapsdk
const app = getApp()
let api = require('../../../utils/api.js')
let util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    searchResults: [],
    posi_list: [],
    selectCity: '',
		selectedCity: {},
    x: '',
    y: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XH7BZ-NHS3D-NUS43-HSIMH-26SMO-YLBUE'
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
    app.globalData.selectSiteBol = true
    let selectedSite = app.globalData.selectedSite
		let selectedCity = app.globalData.selectedCity
    this.setData({
      selectCity: selectedSite.city,
			selectedCity: selectedCity
    })
    //设置地图
    this.initSiteList(selectedSite)
		.then(res => {
			if (res.data.length > 0) {
				this.setData({
					posi_list: res.data
				})
			} else {
				this.setData({
					posi_list: []
				})
				// 未搜索到结果
				wx.showToast({
					title: '搜索地区失败',
					icon: 'fail',
					duration: 800,
					mask: true,
				})
			}
		})
    this.setMap(selectedSite)
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

  selectSite(event) {
    let item = event.currentTarget.dataset.item
    let tempSiteObj = {
      site: item.title,
      detailSite: item.address,
      x: item.location.lng,
      y: item.location.lat
    }
    //更新selectedSite
    app.globalData.selectedSite = Object.assign(app.globalData.selectedSite, tempSiteObj)
    wx.navigateBack()
  },

  //搜索地址
  searchSite: util.debounce(700, function(event) {
    let val = event.detail.value
    if (val !== '') {
      this.getSug(val)
        .then(res => {
          if (res.data.length > 0) {
            this.setData({
              searchResults: res.data
            })
          }
        })
    } else {
      this.setData({
        searchResults: []
      })
    }
  }),

  //根据所选地址检索周边地址初始化地址列表
  initSiteList(selectedSite) {
		let region
		let selectedCity = this.data.selectedCity
		if (selectedSite.site == '') {
			region = selectedCity.name
		} else {
			region = selectedSite.site
		}
    return new Promise((resolve, reject) => {
      qqmapsdk.search({
        //默认搜索周边娱乐场所
        keyword: 'fun',
				//搜索关键词,没有传入地址则使用城市的默认地址
        region: region, 
        location: selectedSite.y + ',' + selectedSite.x, //设置周边搜索中心点
        address_format: 'short',
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res);
        }
      })
    })
  },

  //获取搜索地址列表数据
  getSug(keyword) {
    let selectCity = this.data.selectCity
    return new Promise((resolve, reject) => {
      qqmapsdk.getSuggestion({
        keyword: keyword,
        //设置城市名，限制关键词所示的地域范围
        region: selectCity,
        success: function(res) {
					// console.log(res.data)
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        }
      })
    })
  },

  setMap(selectedSite) {
		//没有地址传入则用该城市默认地址做标记
		let region
		let selectedCity = this.data.selectedCity
		if (selectedSite.site == '') {
			region = selectedCity.name
		} else {
			region = selectedSite.site
		}
    let markers = [{
      id: 0,
      latitude: selectedSite.y,
      longitude: selectedSite.x,
      // 标记点旁边增加标签
      label: {
				content: region,
        color: '#e64f1a',
        fontSize: 14,
        textAlign: 'left'
      },
      iconPath: '/images/marker_red.png',
      height: 35,
      width: 30
    }]
    this.setData({
      markers: markers,
      y: selectedSite.y,
      x: selectedSite.x,
    })
  },

  markertap(e) {
    console.log(e.markerId)
  }
})