// pages/refine/refine.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    digestsArray: []
  },
  onNewButton() {
    wx.navigateTo({
      url: '/pages/digest/digest',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          editing: true,
          scene: 'booknote'
        })
      }
    })
  },
  onLongTap(e) {
    const page = this
    const {
      digestId
    } = e.currentTarget.dataset.digest
    wx.showActionSheet({
      itemList: ['投稿', '删除'],
      success(res) {
        if (res.tapIndex === 1) {
          wx.cloud.callFunction({
            name: 'removeDigest',
            data: {
              digestId
            },
            success(res) {
              console.log('deleteSucc', res)
              page.loadMyNotes()
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
          scene: 'booknote',
          uploadedImagePath: digest.image
        })
      }
    })
  },

  loadMyNotes() {
    const page = this;
    wx.cloud.callFunction({
      name: "myBooknotes",
      data: {},
      success: res => {
        page.setData({
          digestsArray: res.result
        });
        console.log("mybooknote", res);
      },
      fail: err => {
        console.error("[云函数] [sum] 调用失败：", err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadMyNotes()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});