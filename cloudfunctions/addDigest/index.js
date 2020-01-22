// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('adddigestcloud', event)
  // return {msg:'ok'}
  const wxContext = cloud.getWXContext()
  const {
    content,
    uploadedImagePath
  } = event
  let checkcode = 0
  try {
    await cloud.openapi.security.msgSecCheck({
      content
    })
  } catch (err) {
    checkcode = err.errCode
  }
  // try {
  //   checkcode = await cloud.openapi.security.imgSecCheck({
  //     content
  //   })
  // } catch (err) {
  //   checkcode = err.errCode
  // }
  console.log('check', checkcode)
  if (checkcode !== 0) return {
    msg: '信息不合法'
  }

  
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
    digestId: resp._id,
    msg: '保存成功'
  }
}