// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // return {msg:'ok'}
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  await db.collection('messages').add({
    data: {
      ...event,
      createTime: db.serverDate()
    }
  })

  return {
    success: true,
    message: '消息发送成功'
  }
}