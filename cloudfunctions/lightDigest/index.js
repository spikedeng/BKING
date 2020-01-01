// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

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
  console.log('lightResp', lightresp, needPublish, lights, published, operation)
  return {
    success: true,
    needPublish,
    poster: OPENID,
    message: '点亮成功'
  }
}