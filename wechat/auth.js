const sha1 = require('sha1')

const config = require('../config')
const reply = require('./reply')
const { getXMLData, parseXML, formatData } = require('../utils/util')

module.exports = () => {
  return async (ctx, next) => {
    const { signature, echostr, timestamp, nonce } = ctx.request.query
    const { token } = config

    const sha1Str = sha1([timestamp, nonce, token].sort().join(''))

    if (ctx.method === 'GET') {
      // 验证消息来源于微信服务器
      if (sha1Str !== signature) return ctx.body = 'error'
      ctx.body = echostr
    } else if (ctx.method === 'POST') {
      if (sha1Str !== signature) return ctx.body = 'error'
      const xmlData = await getXMLData(ctx.req)
      const jsData = await parseXML(xmlData)
      const message = formatData(jsData)
      const replyMessage = await reply(message)
      ctx.body = replyMessage
    } else {
      ctx.body = 'error'
    }
  }
}