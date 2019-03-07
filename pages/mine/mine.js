// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.checkLoginState()
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
		this.checkLoginState()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

	logout() {
		//清空本地缓存
		wx.clearStorage({
			success: function (res) {
				if (res.errMsg == 'clearStorage:ok'){
					wx.redirectTo({
						url: '/pages/login/login'
					})
				}
			}
		})
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
			this.setData({
				phone: userinfo.phone
			})
		}
	}
})