// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const resp = await db.collection('digests')
  .orderBy('createTime', 'desc')
  .where({
    OPENID: wxContext.OPENID
  }).get()
  const result = resp.data.map(item => {
    const {
      content,
      origin,
      createTime,
      uploadedImagePath: image,
      _id: digestId
    } = item
    return {
      content,
      origin,
      image,
      createTime,
      digestId
    }
  })
  return result
}