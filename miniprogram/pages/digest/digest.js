// miniprogram/pages/digest/digest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '在古希腊，一方的霸主与另一方霸主进行战争时，分别从属于两方的同盟国的军队也要参加。这种时候右翼的地位较为崇高，因而由本国的军队所占据，越往左翼地位越低，用来布置弱小同盟国的援军，对手也用同样的方法布阵。因此双方的右翼军队都努力击破对方的左翼军队，问题在于哪一方的右翼能够更快击破敌人的左翼，并乘胜席卷敌人的右翼。中国春秋时代的战争与此完全相同，右翼(右拒、右军)经常是地位崇高的位置。唯独本是蛮夷之国的楚国风俗与中原不同，主力置于左翼，因此中原诸国在与楚交战时必须考虑到这一点。',
    image: '../../images/demoimage-gqsd.png',
    origin: '—宫崎市定·宫崎市定中国史'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('digestoptions', options)
    const eventChannel = this.getOpenerEventChannel()
    if(eventChannel)
    eventChannel.on('acceptDataFromOpenerPage', (data)=> {
      console.log(data)

      this.setData({
        ...data.data
      })
    })
  },

  onTapMainButton(){
    console.log('tapmainbutton')
  }
,
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