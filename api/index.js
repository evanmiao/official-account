const prefix = 'https://api.weixin.qq.com/cgi-bin'

module.exports = {
  accessToken: `${prefix}/token?grant_type=client_credential`,
  menu: {
    create: `${prefix}/menu/create`,
    delete: `${prefix}/menu/delete`,
    get: `${prefix}/menu/get`
  }
}
