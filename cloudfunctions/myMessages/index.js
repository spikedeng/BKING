const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const resp = await db.collection('messages').orderBy('createTime', 'desc').where({
    OPENID: wxContext.OPENID
  }).get()
  const result = resp.data.map(item => {
    const {
      content,
      digestId,
      createTime
    } = item
    return {
      content,
      digestId,
      createTime
    }
  })
  return result
}