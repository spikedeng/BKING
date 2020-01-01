// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('getdigestcontent', event)
  const result = await cloud.database().collection(event.scene === 'mailbox'||event.scene==='refine'?'refines':'digests').doc(event.digestId).get()

  return {
    ...result.data
  }
}