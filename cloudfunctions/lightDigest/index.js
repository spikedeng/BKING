// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    digestId,
    operation
  } = event
  const _ = cloud.database().command
  const digest = cloud.database().collection('refines').doc(digestId)
  const digestData = await digest.get()
  const {
    published,
    lights,
    OPENID
  } = digestData.data
  const needPublish = published === false && lights === 3 && operation === 'on'
  if (needPublish) {
    const digestIdTxt = digestId.slice(digestId.length - 6, digestId.length - 1)
    console.log('param', OPENID, digestId)
    cloud.callFunction({
      name: 'addMessage',
      data: {
        OPENID,
        content: `恭喜ID${digestIdTxt}的投稿被选为精选！`,
        digestId
      }
    })
  }
  const lightresp = await digest.update({
    data: {
      lights: _.inc(operation === 'off' ? -1 : 1),
      published: needPublish ? true : published
    }
  })


  await cloud.callFunction({
    name: 'addLight',
    data: {
      operation,
      digestId,
      OPENID: wxContext.OPENID
    }
  })
  console.log('lightResp', lightresp)
  return {
    success: true,
    message: '点亮成功'
  }
}