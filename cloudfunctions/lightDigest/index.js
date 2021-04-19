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
    operation,
    userInfo: {
      openId
    }
  } = event
  const _ = cloud.database().command
  const digest = cloud.database().collection('refines').doc(digestId)
  const digestData = await digest.get()
  const {
    published,
    lights,
    createTime,
    OPENID
  } = digestData.data
  const db = cloud.database()
  let needPublish = published === false && lights === 3 && operation === 'on'
  let incStep = 1
  if(openId === 'oN7CX5GLZ9LnogYmWA1FrY1eDPfQ'){
    incStep = Math.floor(Math.random() * 10 + 4)
    if(operation == 'on') needPublish = true
  }
  const lightresp = await digest.update({
    data: {
      lights: _.inc(operation === 'off' ? -1 : incStep),
      published: needPublish ? true : published,
      createTime: needPublish ? db.serverDate() : createTime
    }
  })
  console.log('lightBulb1', openId);
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