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
  //query content by digestId
  const digestResult = await cloud.database().collection('digests').where({
    _id: digestId
  }).get()
  const digestData = digestResult.data[0]


  //check if same digestId refine exists
  const refines = cloud.database().collection('refines')
  const existRefine = await refines.where({
    digestId
  }).get()
  if (existRefine.data.length > 0) return {
    success: false,
    message: '已经投过啦'
  }
  //add apply digest to refines queue
  const result = await refines.add({
    data: { ...digestData,
      OPENID: wxContext.OPENID,
      digestId,
      published: false,
      lights: 0,
      createTime: cloud.database().serverDate()
    }
  })
  console.log('addresult', result)
  //add messages to committee members

  // cloud.callFunction({
  //   name: 'notifyCommittee',
  //   data: {
  //     digestId
  //   }
  // })

  return {
    success: true,
    message: '投稿成功'
  }
}