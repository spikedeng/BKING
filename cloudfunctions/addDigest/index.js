// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('adddigestcloud',event)
  // return {msg:'ok'}
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const resp = await db.collection('digests').add({
    data: {
      ...event,
      OPENID: wxContext.OPENID,
      createTime: db.serverDate()
    }
  })
  console.log('adddigestcloud', resp)
  return {
    digestId: resp._id
  }
}