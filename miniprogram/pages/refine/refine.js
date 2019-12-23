// pages/refine/refine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    digestsArray: [{
        content: '在古希腊，一方的霸主与另一方霸主进行战争时，分别从属于两方的同盟国的军队也要参加。这种时候右翼的地位较为崇高，因而由本国的军队所占据，越往左翼地位越低，用来布置弱小同盟国的援军，对手也用同样的方法布阵。因此双方的右翼军队都努力击破对方的左翼军队，问题在于哪一方的右翼能够更快击破敌人的左翼，并乘胜席卷敌人的右翼。中国春秋时代的战争与此完全相同，右翼(右拒、右军)经常是地位崇高的位置。唯独本是蛮夷之国的楚国风俗与中原不同，主力置于左翼，因此中原诸国在与楚交战时必须考虑到这一点。',
        image: '../../images/demoimage-gqsd.png',
        origin: '—宫崎市定·宫崎市定中国史'
      },
      {
        content: '在他一生中，他都同当时很有力量的商人有密切联系。在一定程度上，他也关心农民，主要是吠舍。他反对杀牲（牛），这有利于农业，而农业又主要是吠舍的职业。……另一方面又结交国王，国王奴隶主反对奴隶逃跑，他就禁止奴隶入教，这可以说是迎合国王。……他同淫女也打交道，在这些方面表现出不少的世故，表现出圆熟的交际手段。总之，释迦牟尼是一个性格比较复杂，有不少矛盾的人物。但他之所以成功，佛教之所以成为一个世界宗教，一方面说明它满足了一部分人民的宗教需要，同时同他这个教主有一套手段，也是分不开的。',
        image: '../../images/demoimage-jxltf.png',
        origin: '——季羡林《谈佛》'
      },
      {
        content: '不是没有人想解决这个问题，只是为了解决问题并长久保持和平需，要各方的配合。这是必不可少的。打着夺回圣地旗号的十字军最初的目的只是为了保证基督教徒朝圣圣地的自由和安全。所以只要实现这一点，十字军就应该已经达到目的。但是，随着双方敌对状态的持续，最初的手段变成了目的。也就是说，从最初要确保朝圣圣地的自由和安全，变成了要把穆斯林赶出巴勒斯坦。腓特烈二世就是要终结手段目的化的弊端，只是在那个时代，像他这样的人实在少之又少。不，以现在的眼光来看，“在那个时代”这个词或许换成“在任何时代”更为贴切。',
        image: '../../images/demoimage-szjdz.png',
        origin: '——盐野七生《文艺复兴是什么》'
      },

      {
        content: '被选中的三位美人走进画室后，从头到脚告诉我什么叫做好看。那天十几位面试的男女模特从电梯里涌出来，简直像一片移动的森林，都比我高。时装模特儿是物种的一项反常，一项意外，好像是对人类的冒犯。不知道上帝怎么想，至少他们发育后会让爹妈吃一惊：为什么他们的上臂或小腿会比我们长那么多？两位女孩蹲下看画时，那么幼小，起身站直，身高简直猖狂，就跟折拢的尺子忽然打开一样。男模特小王坐那儿摆姿势，不画他时，他睡着了，比醒着时还要英俊。',
        image: '../../images/demoimage-cdq.jpeg',
        origin: '—陈丹青《谈话的泥沼》'
      }
    ]
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

  onTapDigestCard(e) {
    console.log('ontapdigestcard', e)
    const digest = e.currentTarget.dataset.digest
    wx.navigateTo({
      url: '/pages/digest/digest',
      events: {},
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          ...digest, editing: false, uploadedImagePath: digest.image, scene: 'refine'
        })
      }
    })
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