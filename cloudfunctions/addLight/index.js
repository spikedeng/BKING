// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  // return {msg:'ok'}
  const wxContext = cloud.getWXContext()
  console.log('addlightscloud', event, wxContext.OPENID)

  const db = cloud.database()
  const lightsCol = db.collection('lights')
  const lightRec = await lightsCol.where({
    OPENID: event.OPENID,
    digestId: event.digestId
  }).get()
  console.log('lightrec', lightRec)
  if (lightRec.data.length) {
    const {_id} = lightRec.data[0]
    await lightsCol.doc(_id).update({
      data: {
        ...event
      }
    })
  } else {
    const resp = await lightsCol.add({
      data: {
        ...event,
        OPENID: event.OPENID,
        createTime: db.serverDate()
      }
    })
    console.log('addlightresp', resp)
    return {
      success: true,
      message: '增加点赞记录' + resp._id
    }
  }

}