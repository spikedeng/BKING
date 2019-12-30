// pages/refine/refine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    digestsArray: [],
    pageNum: 1,
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
    this.loadRefineList()
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

  onTapDigestCard(e) {
    console.log('ontapdigestcard', e)
    const digest = e.currentTarget.dataset.digest
    wx.navigateTo({
      url: '/pages/digest/digest',
      events: {},
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          ...digest,
          editing: false,
          uploadedImagePath: digest.image,
          scene: 'refine'
        })
      }
    })
  },

  loadRefineList() {
    const page = this;
    wx.cloud.callFunction({
      name: "refineList",
      data: {
        pageNum: page.data.pageNum
      },
      success: res => {
        let digestsArray = res.result.map(item => {
          return {
            ...item,
            date: new Date(item.createTime).format('MM月dd日 hh:mm')
          }
        })
        if (page.data.pageNum > 1)
          digestsArray = page.data.digestsArray.concat(digestsArray)
        page.setData({
          digestsArray
        });
        console.log("refinelist", res);
      },
      fail: err => {}
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('reachbottom')
    const page = this
    this.data.pageNum += 1
    page.loadRefineList()
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