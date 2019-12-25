// miniprogram/pages/mailbox/mailbox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [
      
    ]
  },
  onTapMessage(e) {
    console.log('ontapdigestcard', e)
    const message = e.currentTarget.dataset.message
    wx.navigateTo({
      url: '/pages/digest/digest',
      events: {},
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          digestId: message.digestId,
          editing: false,
          scene: 'mailbox'
        })
      }
    })
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
    this.getMessages()
    this.setData({
      lightsCount: getApp().globalData.lights
    })
  },

  getMessages() {
     wx.cloud.callFunction({
      name: 'myMessages'
    }).then(res=>{
      console.log('myMessages', res)
      const messageList = res.result.map(item=>{
        return {
          ...item,
          date: new Date(item.createTime).format('MM月dd日 hh:mm')
        }
      })
      this.setData({
        messageList
      })
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})