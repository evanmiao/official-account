const { parseString } = require('xml2js')

module.exports = {
  getXMLData(req) {
    return new Promise((resolve, reject) => {
      // 请求数据以流的方式传输
      let data = ''
      // 绑定 data 事件接收数据并拼接
      req.on('data', userData => data += userData)
      // 数据传输完毕
      req.on('end', () => resolve(data))
    })
  },
  parseXML(xml) {
    return new Promise((resolve, reject) => {
      // 解析 xml 数据
      parseString(xml, { trim: true }, (err, data) => {
        if (err) return reject('parseXML方法出了问题：' + err)
        resolve(data)
      })
    })
  },
  formatData(data) {
    const xml = data.xml, message = {}
    // 验证数据合法
    if (typeof xml === 'object') {
      for (const key in xml) {
        const value = xml[key]
        // 过滤空数据和空数组
        if (Array.isArray(value) && value.length > 0) {
          message[key] = value[0]
        }
      }
      return message
    }
  }
}