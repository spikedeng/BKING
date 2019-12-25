// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  console.log('event', event)
  console.log('context', context)

  const wxContext = cloud.getWXContext()
  const {
    OPENID,
    APPID,
    UNIONID,
    env
  } = wxContext
  const users = await db.collection('users')
  const sameUser = await users.where({
    OPENID
  }).get()
  console.log('sameuser', sameUser)
  const userDataAry = sameUser.data
  if (userDataAry.length == 0) {
    const result = await users.add({
      data: {
        OPENID,
        APPID,
        UNIONID,
        lights: 0,
        isCommittee: true,
      }
    })
    console.log('useraddresult', result)
    return {
      OPENID,
      lights: 0,
      isComittee: true
    }
  } else {
    const {
      OPENID,
      lights,
      isCommittee
    } = userDataAry[0]
    return {
      OPENID,
      lights,
      isCommittee
    }
  }

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息

}