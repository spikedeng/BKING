// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    digestId
  } = event
  const digestData = await cloud.database().collection('refines').doc(digestId).get()
  console.log('digestData', digestData)
  const {
    OPENID,
    uploadedImagePath
  } = digestData.data
  const digestIdTxt = digestId.slice(digestId.length - 6, digestId.length - 1)

  await cloud.callFunction({
    name: 'addMessage',
    data: {
      OPENID,
      content: `恭喜投稿${digestIdTxt}被选为精选`,
      digestId,
      uploadedImagePath
    }
  })
  const _ = cloud.database().command

  const userQuery = await cloud.database().collection('users').where({
    OPENID
  }).update({
    data: {
      lights: _.inc(20)
    }
  })

  return {
    success: true
  }
}