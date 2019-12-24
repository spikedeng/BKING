// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  await cloud.database().collection('messages').where({OPENID: _.exists(true)}).remove()
  await cloud.database().collection('refines').where({OPENID: _.exists(true)}).remove()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}