module.exports = {
  button: [{
    type: 'click',
    name: '首页',
    key: '首页'
  }, {
    name: '二级菜单',
    sub_button: [{
      type: 'view',
      name: '博客',
      url: 'https://evanmiao.com/'
    }, {
      type: 'scancode_waitmsg',
      name: '扫码带提示',
      key: '扫码带提示'
    }, {
      type: 'scancode_push',
      name: '扫码推事件',
      key: '扫码推事件'
    }, {
      type: 'pic_sysphoto',
      name: '系统拍照发图',
      key: '系统拍照发图'
    }, {
      type: 'pic_photo_or_album',
      name: '拍照或者相册发图',
      key: '拍照或者相册发图'
    }]
  }]
}
