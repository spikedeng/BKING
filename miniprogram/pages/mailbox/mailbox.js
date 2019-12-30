// miniprogram/pages/mailbox/mailbox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
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
    const page = this
    this.setData({
      loading: true
    })
    let dataBeforeFormatter = []
    const {
      isCommittee,
      OPENID
    } = getApp().globalData
    let messagesRes = await wx.cloud.callFunction({
      name: 'myMessages',
      data: {
        pageNum: page.data.pageNum
      }
    })
    dataBeforeFormatter = dataBeforeFormatter.concat(messagesRes.result)
    let refinesRes = await wx.cloud.database().collection('refines').orderBy('createTime', 'desc').where({
      published: false
    }).limit(10).skip((page.data.pageNum - 1) * 10).get()

    let refineMessages = refinesRes.data.map(item => {
      const {
        createTime,
        digestId
      } = item
      const briefId = digestId.slice(digestId.length - 6, digestId.length - 1)
      let content = '你有一条投稿需要审阅, 投稿Id:' + briefId
      if (item.OPENID === OPENID) {
        content = briefId + '稿件已送出，' + '还差' + (4 - item.lights) + '盏灯就能成为精选哦'
      }
      else if (!isCommittee && item.bulletin.length === 0)
        return -1000
      if(item.bulletin) content = item.bulletin
      return {
        ...item,
        createTime,
        content,
        digestId
      }
    })
    refineMessages = refineMessages.filter(item => item !== -1000)
    dataBeforeFormatter = dataBeforeFormatter.concat(refineMessages)


    let messageList = dataBeforeFormatter.map(item => {
      return {
        ...item,
        date: new Date(item.createTime).format('MM月dd日 hh:mm')
      }
    })
    if (page.data.pageNum > 1)
      messageList = page.data.messageList.concat(messageList)
    messageList.sort((a, b) => {
      const btime = new Date(b.createTime)
      const atime = new Date(a.createTime)
      return btime.getTime() - atime.getTime()
    })
    console.log('finaldata', messageList)
    this.setData({
      loading: false
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
    this.data.pageNum += 1
    this.getMessages()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: ' '
    }
  }
})