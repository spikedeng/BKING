// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

async function onAdd({onAddSuccess}) {
  console.debug('onaddtest')

  return await db.collection('counters').add({
    data: {
      count: 1,
      picture: 'lldsdfadfsll'
    }
  })
}

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log('event',event)
  console.log('context',context)
//  const dbResult = await db.collection('counters').add({
//     data: {
//       count: 1,
//       picture: 'lldsdfadfsll'
//     },
//     success: res => {
//       // 在返回结果中会包含新创建的记录的 _id

//       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
//     },
//     fail: err => {
//       console.error('[数据库] [新增记录] 失败：', err)
    
//     }})

// console.log('dbresult', dbResult)
const wxContext = cloud.getWXContext()


return {
  event,
  openid: wxContext.OPENID,
  appid: wxContext.APPID,
  unionid: wxContext.UNIONID,
  env: wxContext.ENV,
}
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息

}
