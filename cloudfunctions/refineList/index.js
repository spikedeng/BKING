// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const {
    pageNum = 1
  } = event
  const resp = await db.collection('refines')
    .orderBy('createTime', 'desc')
    .where({
      published: true
    }).limit(10).skip((pageNum - 1) * 10).get()
  const result = resp.data.map(item => {
    const {
      content,
      origin,
      uploadedImagePath: image,
      lights,
      createTime,
      _id: digestId
    } = item
    return {
      content,
      origin,
      image,
      lights,
      createTime,
      digestId
    }
  })
  return result
}