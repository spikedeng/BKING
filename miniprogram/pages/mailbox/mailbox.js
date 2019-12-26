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
      success: function(res) {
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
  onLoad: function(options) {

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
    this.getMessages()
    const page = this
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        console.log('loginsucc', res);
        getApp().globalData = { ...res.result
        }
        page.setData({
          lightsCount: getApp().globalData.lights
        })
      }
    })

  },

  async getMessages() {
    let dataBeforeFormatter = []
    let messagesRes = await wx.cloud.callFunction({
      name: 'myMessages'
    })
    dataBeforeFormatter = dataBeforeFormatter.concat(messagesRes.result)
    if (getApp().globalData.isCommittee) {
      let refinesRes = await wx.cloud.database().collection('refines').where({
        published: false
      }).get()
      const refineMessages = refinesRes.data.map(item=>{
        const { createTime, digestId } = item
        return {
          ...item,
          createTime,
          content: '你有一条投稿需要审阅, 投稿Id:' + digestId.slice(digestId.length - 6, digestId.length - 1),
          digestId
        }
      })
      dataBeforeFormatter = dataBeforeFormatter.concat(refineMessages)
    }
    console.log('finaldata', dataBeforeFormatter)
    dataBeforeFormatter.sort((a,b)=>{
      return b.createTime.getTime() - a.createTime.getTime()
    })
    const messageList = dataBeforeFormatter.map(item => {
      return {
        ...item,
        date: new Date(item.createTime).format('MM月dd日 hh:mm')
      }
    })
    this.setData({
      messageList
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})