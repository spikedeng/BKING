// miniprogram/pages/digest/digest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // content: '',
    content: '',
    image: '',
    origin: '',
    scene: 'refine',
    editing: false,
    textareaValue: '',
    contentFocusing: false,
    originFocusing: false,
    bulbLighted: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('digestoptions', options)
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel && eventChannel.on)
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log('event', data)
        if (data.scene === 'mailbox')
          this.loadDigest(data.digestId, data.scene)
        else
          this.setData({
            ...data
          })
      })
  },

  loadDigest(digestId, scene) {
    wx.cloud.callFunction({
      name: 'getDigestContent',
      data: {
        digestId,
        scene
      }
    }).then(res => {
      console.log('digestcontent', digestId)
      this.setData({
        ...res.result
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

  onTapLightBulb() {
    const page = this
    const {
      bulbLighted,
      digestId
    } = this.data
    const operation = bulbLighted ? 'off' : 'on'
    wx.cloud.callFunction({
      name: 'lightDigest',
      data: {
        digestId,
        operation
      }
    }).then(res => {
      console.log('lightbulb', res)
      page.setData({
        bulbLighted: bulbLighted ? false : true,
        lights: page.data.lights + (bulbLighted? -1:+1)
      })
    })

  },

  onTapMainButton() {
    console.log('tapmainbutton')
    const page = this
    const sceneAction = {
      'booknotecreate': {
        itemList: ['保存并投稿', '保存']
      },
      'booknoteview': {
        itemList: ['投稿', '删除']
      }
    }
    const {
      scene,
      editing
    } = this.data
    const scenekey = scene + (editing ? 'create' : 'view')
    console.log('scenekey', scenekey, scene, editing)
    wx.showActionSheet({
      itemList: sceneAction[scenekey].itemList,
      success(res) {
        console.log(res)
        if (scenekey === 'booknoteview') {
          if (res.tapIndex === 1) {
            page.deleteDigest()
          }
        } else if (scenekey === 'booknotecreate') {
          if (res.tapIndex === 1) {
            page.saveDigest()
          } else if (res.tapIndex === 0) {
            page.saveDigest(true)

          }
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },

  deleteDigest() {
    const {
      digestId
    } = this.data
    wx.cloud.callFunction({
      name: 'removeDigest',
      data: {
        digestId
      },
      success(res) {
        console.log('deleteSucc', res)
        wx.navigateBack({

        })
      }
    })
  },

  saveDigest(applyAlong) {
    const page = this
    const {
      content,
      uploadedImagePath,
      origin
    } = this.data
    wx.cloud.callFunction({
      name: 'addDigest',
      data: {
        content,
        uploadedImagePath,
        origin
      },
      success: res => {
        console.log('saveDigest', res)
        if (applyAlong) {
          page.applyRefine(res.result.digestId)
        } else
          wx.showToast({
            title: '保存成功',
            success(res) {
              wx.navigateBack({

              })
            }
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

  applyRefine(digestId) {
    const page = this
    wx.cloud.callFunction({
      name: 'applyRefine',
      data: {
        digestId: digestId
      },
      success(res) {
        console.log('applySucc', res)
        wx.showToast({
          title: res.result.message,
          success(res) {
            wx.navigateBack()
          }
        })
      },
      fail(res) {
        console.log('applyfail', res)
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
    this.configLightStatus()
  },

  async configLightStatus () {
    const page = this
    const result = await wx.cloud.database({ env: wx.cloud.DYNAMIC_CURRENT_ENV}).collection('lights').where({
        OPENID: getApp().globalData.OPENID,
        digestId: page.data.digestId
      }).get()
    console.log('lightstatus', result.data[0].operation)
    if (result.data.length) {
      const lightData = result.data[0]
      page.setData({
        bulbLighted: lightData.operation === 'on'
      })
    }
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