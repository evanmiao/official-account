const template = require('./template')

module.exports = async message => {
  const options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: Date.now(),
    msgType: 'text'
  }

  // 设置回复用户消息的具体内容
  let content = ''

  // 判断用户发送消息的类型和内容，决定返回什么消息给用户
  if (message.MsgType === 'text') {
    if (message.Content === '1') {
      content = '回复文本消息'
    } else if (message.Content === '2') {
      // 回复图文消息
      content = [{
        title: '个人博客',
        description: '前端',
        picUrl: 'https://cn.vuejs.org/images/logo.png',
        url: 'https://evanmiao.com'
      }, {
        title: 'Vue.js',
        description: 'Vue 官网',
        picUrl: 'https://cn.vuejs.org/images/logo.png',
        url: 'https://cn.vuejs.org/'
      }]
      options.msgType = 'news'
    } else if (message.Content.match('爱')) {
      // 模糊匹配，只要包含爱
      content = '我爱你'
    } else {
      content = '您在说啥，我听不懂'
    }
  } else if (message.MsgType === 'image') {
    content = '您的图片地址为：' + message.PicUrl
  } else if (message.MsgType === 'voice') {
    content = '语音识别结果：' + message.Recognition
  } else if (message.MsgType === 'video') {
    content = '接受了视频消息'
  } else if (message.MsgType === 'shortvideo') {
    content = '接受了小视频消息'
  } else if (message.MsgType === 'location') {
    content = `纬度：${message.Location_X}
经度：${message.Location_Y}
缩放大小：${message.Scale}
详情：${message.Label}`
  } else if (message.MsgType === 'link') {
    content = `标题：${message.Title}
描述：${message.Description}
网址：${message.Url}`
  } else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      // 用户订阅事件
      content = '欢迎您的订阅'
      if (message.EventKey) {
        // 扫描带参数的二维码的订阅事件
        content = '二维码订阅'
      }
    } else if (message.Event === 'SCAN') {
      // 已经关注了公众号，在扫描带参数二维码进入公众号
      content = '已经关注了公众号，在扫描带参数二维码进入公众号'
    } else if (message.Event === 'unsubscribe') {
      // 用户取消关注
      console.log('无情取关')
    } else if (message.Event === 'LOCATION') {
      // 用户进行会话时，上报一次地理位置消息
      content = `纬度：${message.Latitude}
经度：${message.Longitude}
精度：${message.Precision}`
    } else if (message.Event === 'CLICK') {
      content = '点击了菜单'
    } else if (message.Event === 'VIEW') {
      // 用户点击菜单，跳转到其他链接
      console.log('用户点击菜单，跳转到其他链接')
    }
  }

  // 将最终回复消息内容添加到options中
  options.content = content
  // 将最终的xml数据返回出去
  return template(options)
}
