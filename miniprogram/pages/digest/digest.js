// miniprogram/pages/digest/digest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // content: '',
    content: '',
    image: '',
    imgSecFailed: false,
    origin: '',
    scene: 'refine',
    editing: false,
    textareaValue: '',
    contentFocusing: false,
    originFocusing: false,
    bulbLighted: false,
    loading: false,
    buttonAnimate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('digestoptions', options)
    const {
      digestId,
      scene
    } = options
    if (digestId) {
      this.loadDigest(digestId, scene)
      this.configLightStatus(digestId)
      this.setData({
        digestId,
        scene,
        share: true
      })
    } else {
      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel && eventChannel.on)
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          console.log('event', data)
          this.setData({
            ...data
          }, () => {
            this.configLightStatus(data.digestId)
            if (data.scene === 'mailbox') {
              this.loadDigest(data.digestId, data.scene)
              this.markReview()
            }
          })
        })
    }

  },

  markReview() {
    const {
      digestId
    } = this.data
    wx.cloud.callFunction({
      name: 'markReview',
      data: {
        digestId
      }
    })
  },

  loadDigest(digestId, scene) {
    const page = this
    wx.cloud.callFunction({
      name: 'getDigestContent',
      data: {
        digestId,
        scene
      }
    }).then(res => {
      console.log('digestcontent', page.data.digestId, res)
      this.configLightStatus()
      this.setData({
        ...res.result
      })
    })
  },

  onImageSelect() {
    const page = this
    if (!this.data.editing) {
      wx.previewImage({
        urls: [this.data.uploadedImagePath],
      })
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const [path] = res.tempFilePaths
          wx.showNavigationBarLoading()
          page.imgcheck(path)
        }
      })
    }
  },

  uploadImage(path) {
    const page = this
    const pathAry = path.split('/')
    wx.cloud.uploadFile({
      cloudPath: pathAry[pathAry.length - 1], // 上传至云端的路径
      filePath: path, // 小程序临时文件路径
      success(res) {
        // 返回文件 ID
        console.log('cloudfileuploadsucc', res, page)
        page.setData({
          uploadedImagePath: res.fileID
        })
      },
      complete: res => {
        wx.hideNavigationBarLoading()
      }
    })
  },

  onTapLightBulb() {
    if (this.data.loading) return
    const page = this
    wx.vibrateShort()
    this.setData({
      loading: true
    })
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
      const {
        needPublish
      } = res.result
      if (needPublish) {
        wx.cloud.callFunction({
          name: 'rewardPublish',
          data: {
            digestId
          }
        })
      }
      page.setData({
        bulbLighted: bulbLighted ? false : true,
        loading: false,
        lights: page.data.lights + (bulbLighted ? -1 : +1)
      })
    }).catch(res => {
      page.setData({
        loading: false
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
          } else if (res.tapIndex === 0) {
            page.applyRefine(page.data.digestId)
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
    wx.setStorage({
      key: 'buttonAnimate',
      data: true,
    })
    this.setData({
      buttonAnimate: false
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

  imgcheck(path) {
    const page = this
    const typeArry = path.split('.')
    const type = typeArry[typeArry.length-1]
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath: path,
      encoding: 'base64',
      success: function (res) {
        wx.cloud.callFunction({
          name: 'imgSec',
          data: { content: res.data, type },
        }).then(res => {
          wx.hideNavigationBarLoading()
          if (res && res.result && res.result.code !== 0) {
            wx.showToast({
              title: '图片不合法',
              icon: 'none'
            })
            page.setData({
              imgSecFailed: true
            })
          } else {
            page.uploadImage(path)
          }
        }).complete(res=>{
          wx.hideNavigationBarLoading()
        })
      }
    });
  },

  saveDigest(applyAlong) {
    const page = this
    const {
      content,
      uploadedImagePath,
      origin
    } = this.data
    if (!content) {
      wx.showToast({
        title: '未填写内容',
      })
      return
    }
    wx.cloud.callFunction({
      name: 'addDigest',
      data: {
        content,
        uploadedImagePath,
        origin
      },
      success: res => {
        console.log('saveDigest', res)
        if (res.result.msg === '保存成功') {
          if (applyAlong) {
            page.applyRefine(res.result.digestId)
          } else {
            wx.showToast({
              title: '保存成功',
              success(res) {
                setTimeout(() => {
                  wx.navigateBack({

                  })
                }, 500)

              }
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.result.msg,
          })
        }
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
    const page = this
    if (this.data.scene !== 'mailbox') {
      console.log('configls1')
      this.configLightStatus()
    }
    const buttonAnimate = wx.getStorage({
      key: 'buttonAnimate',
      success: function(res) {
        console.log('buttonAnimate', res)
      },
      fail(res) {
        page.setData({
          buttonAnimate: true
        })
      }
    })
  },

  async configLightStatus(digestIdP) {
    const page = this
    const digestId = digestIdP || page.data.digestId
    const OPENID = getApp().globalData.OPENID
    if (!digestId || !OPENID) return
    console.log('configLightStatus', digestId, OPENID)
    const result = await wx.cloud.database({
      env: wx.cloud.DYNAMIC_CURRENT_ENV
    }).collection('lights').where({
      OPENID,
      digestId
    }).get()
    console.log('lightstatus', result.data)
    if (result.data.length === 1) {
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

  onOriginBlur() {
    this.setData({
      originFocusing: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // const {
    //   isCommittee
    // } = getApp().globalData
    // if (!isCommittee && scene === 'mailbox') return null
    const {
      digestId,
      scene,
      origin
    } = this.data
    return {
      imageUrl: this.data.uploadedImagePath,
      title: origin,
      path: `/pages/digest/digest?digestId=${digestId}&scene=${scene}`
    }
  }
})