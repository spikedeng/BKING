// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    digestId
  } = event
  const db = cloud.database()
  const committeesData = await db.collection('users').where({
    isCommittee: true
  }).orderBy('createTime', 'desc').get()
  const committees = committeesData.data
  // const messages = committees.map(item=>{
  //   return {
  //     OPENID: item.OPENID,
  //     content: '你有一条投稿需要审阅, 投稿Id:' + digestId.slice(digestId.length - 6, digestId.length - 1),
  //     digestId
  //   }
  // })
  // await db.collection('messages').add({
  //   data: messages
  // })
  if (committees.length) {
    for (let i = 0; i < 5; i++) {
      const addRes = await cloud.callFunction({
        name: 'addMessage',
        data: {
          OPENID: committees[i].OPENID,
          content: '你有一条投稿需要审阅, 投稿Id:' + digestId.slice(digestId.length - 6, digestId.length - 1),
          digestId
        }
      })
    }
  } else return {
    success: false,
    message: '无编委需要通知',
    digestId
  }

  return {
    success: true,
    message: '通知完毕',
    digestId
  }
}