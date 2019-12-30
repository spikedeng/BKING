// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { digestId } = event
  const db = cloud.database()
  const resp = await db.collection('digests').doc(digestId).remove()
  await db.collection('refines').where({digestId}).remove()
  return {
    ...resp
  }
}