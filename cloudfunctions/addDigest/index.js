// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('adddigestcloud',event)
  // return {msg:'ok'}
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  await db.collection('digests').add({
    data: {
      ...event
    },
    success: res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    },
    fail: err => {
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}