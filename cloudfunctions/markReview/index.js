// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    digestId
  } = event
  const lightCl = cloud.database().collection('lights')
  const lightQuery = await lightCl.where({
    digestId
  }).get()
  if (!lightQuery.data.length) {
    await lightCl.add({
      data: {
        operation: 'off',
        digestId,
        OPENID: wxContext.OPENID,
        createTime: cloud.database().serverDate(),
      }
    })
    const _ = cloud.database().command
    await cloud.database().collection('users').where({
      OPENID: wxContext.OPENID
    }).update({
      data: {
        lights: _.inc(1)
      }
    })
  }
  return {

  }
}