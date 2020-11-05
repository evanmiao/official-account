const sha1 = require('sha1')

const config = require('../config')

module.exports = () => {
  return async (ctx, next) => {
    const { signature, echostr, timestamp, nonce } = ctx.request.query
    const { token } = config
  
    const sha1Str = sha1([timestamp, nonce, token].sort().join(''))
  
    if (sha1Str === signature) {
      ctx.body = echostr
    } else {
      ctx.body = 'error'
    }
  }
}