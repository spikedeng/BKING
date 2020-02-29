// pages/refine/refine.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    digestsArray: [],
    loading: false,
    pageNum: 1
  },
  onNewButton() {
    wx.navigateTo({
      url: '/pages/digest/digest',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          editing: true,
          scene: 'booknote',
          creating: true
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
        } else if (res.tapIndex === 0) {
          wx.cloud.callFunction({
            name: 'applyRefine',
            data: {
              digestId
            },
            success(res) {
              console.log('applySucc', res)
              wx.showToast({
                title: res.result.message,
              })
              page.loadMyNotes()
            },
            fail(res) {
              console.log(res)
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
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: "myBooknotes",
      data: {
        pageNum: page.data.pageNum
      },
      success: res => {
        let digestsArray = res.result.map(item => {
          return {
            ...item,
            date: new Date(item.createTime).format('MM月dd日 hh:mm'),
            briefId: item.digestId.slice(item.digestId.length - 6, item.digestId.length - 1)
          }
        })
        if (page.data.pageNum > 1)
          digestsArray = page.data.digestsArray.concat(digestsArray)
        page.setData({
          digestsArray
        });
        console.log("mybooknote", res);
      },
      fail: err => {
        console.error("[云函数] [sum] 调用失败：", err);
      },
      complete: res => {
        this.setData({
          loading: false
        })
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
    let globalData = getApp().globalData
    if (globalData.afterBrowse === true) {
      globalData.afterBrowse = false
    } else {
      setTimeout(() => {
        this.data.pageNum = 1
        this.loadMyNotes()

      }, 500)
    }
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
  onReachBottom: function() {
    const page = this
    this.data.pageNum += 1
    page.loadMyNotes()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: ' '
    }
  }
});