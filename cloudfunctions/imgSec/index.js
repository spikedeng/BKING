// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    content,
    type
  } = event
  let value = Buffer.from(content, 'base64');
  let data = {
    media: {
      contentType: 'image/' + type,
      value
    }
  }
  let code = 0
  try {
    await cloud.openapi.security.imgSecCheck(data)
  } catch (err) {
    code = err.errCode
  }
  return {
    code
  }
}