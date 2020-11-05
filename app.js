const Koa = require('koa')
const app = new Koa()

const auth = require('./wechat/auth')

app.use(auth())

app.listen(3000)