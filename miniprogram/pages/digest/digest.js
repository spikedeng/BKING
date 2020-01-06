// miniprogram/pages/digest/digest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    // content: '在古希腊，一方的霸主与另一方霸主进行战争时，分别从属于两方的同盟国的军队也要参加。这种时候右翼的地位较为崇高，因而由本国的军队所占据，越往左翼地位越低，用来布置弱小同盟国的援军，对手也用同样的方法布阵。因此双方的右翼军队都努力击破对方的左翼军队，问题在于哪一方的右翼能够更快击破敌人的左翼，并乘胜席卷敌人的右翼。中国春秋时代的战争与此完全相同，右翼(右拒、右军)经常是地位崇高的位置。唯独本是蛮夷之国的楚国风俗与中原不同，主力置于左翼，因此中原诸国在与楚交战时必须考虑到这一点。',÷
    image: '../../images/demoimage-gqsd.png',
    origin: '',
    editing: 'true',
    textareaValue: '',
    contentFocusing: false,
    originFocusing: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('digestoptions', options)
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel && eventChannel.on)
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log(data)

        this.setData({
          ...data.data
        })
      })
  },

  onImageSelect() {
    const page = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const [path] = res.tempFilePaths
        const pathAry = path.split('/')
        console.log('pathary', pathAry);
        wx.showNavigationBarLoading()
        wx.cloud.uploadFile({
          cloudPath: pathAry[pathAry.length - 1], // 上传至云端的路径
          filePath: path, // 小程序临时文件路径
          success(res) {
            // 返回文件 ID
            console.log('cloudfileuploadsucc', res, this)
            page.setData({
              uploadedImagePath: res.fileID
            })
          },
          complete: res => {
            wx.hideNavigationBarLoading()
          }
        })

      }
    })
  },

  onTapMainButton() {
    console.log('tapmainbutton')
    const page = this
    const {
      content,
      uploadedImagePath,
      origin
    } = this.data
    wx.showActionSheet({
      itemList: ['保存', '保存并投稿'],
      success(res) {
        console.log(res)
        wx.cloud.callFunction({
          name: 'addDigest',
          data: {
            content,
            uploadedImagePath,
            origin
          },
          success: res => {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '保存失败',
            })
            console.error('[云函数] [digests] 调用失败：', err)
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

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

  },

  onContentChange(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onOriginChange(e) {
    this.setData({
      origin: e.detail.value
    })
  },

  onOriginFocusing() {
    this.setData({
      originFocusing: true
    })
  },

  onOriginBlue() {
    this.setData({
      originFocusing: false
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