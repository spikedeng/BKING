// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const {
    pageNum = 1
  } = event
  const resp = await db.collection('digests')
  .orderBy('createTime', 'desc')
  .where({
    OPENID: wxContext.OPENID
    }).limit(10).skip((pageNum - 1) * 10).get()
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