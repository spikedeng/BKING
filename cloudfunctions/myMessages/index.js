const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    pageNum = 1
  } = event
  const db = cloud.database()
  const resp = await db.collection('messages').orderBy('createTime', 'desc').where({
    OPENID: wxContext.OPENID
  }).limit(20).skip((pageNum - 1) * 20).get()
  const result = resp.data.map(item => {
    const {
      content,
      digestId,
      createTime,
      uploadedImagePath
    } = item
    return {
      content,
      digestId,
      createTime,
      uploadedImagePath
    }
  })
  return result
}