const { readFile, writeFile } = require('fs')
const request = require('axios')

const { appID, appsecret } = require('../config')
const api = require('../api')
const menu = require('./menu')

class Wechat {
  getAccessToken() {
    const url = `${api.accessToken}&appid=${appID}&secret=${appsecret}`
    return new Promise((resolve, reject) => {
      request({ url, method: 'GET' })
        .then(res => {
          // 重新赋值凭据的过期时间：当前时间 + (7200 - 5分钟) * 1000
          res.data.expires_in = Date.now() + (res.data.expires_in - 300) * 1000
          resolve(res.data)
        })
        .catch(err => {
          reject('getAccessToken method error: ' + err)
        })
    })
  }

  saveAccessToken(data) {
    data = JSON.stringify(data)
    return new Promise((resolve, reject) => {
      // 将凭据保存为一个文件
      writeFile('accessToken.txt', data, err => {
        if (err) return reject('saveAccessToken method error: ' + err)
        resolve()
      })
    })
  }

  readAccessToken() {
    return new Promise((resolve, reject) => {
      readFile('accessToken.txt', (err, data) => {
        if (err) return reject('readAccessToken method error: ' + err)
        // 将读取的 Buffer 数据转化为 json 字符串
        data = data.toString()
        // 将 json 字符串转化为对象
        data = JSON.parse(data)
        resolve(data)
      })
    })
  }

  isValidAccessToken(data) {
    // 过滤非法的数据
    if (!data || !data.access_token || !data.expires_in) return false
    // 判断凭据是否过期
    // if (data.expires_in > Date.now()) {
    //   // 如果凭据的过期时间大于当前时间，说明没有过期
    //   return true
    // } else {
    //   // 如果凭据的过期时间小于当前时间，说明过期了
    //   return false
    // }
    // 简写方式
    return data.expires_in > Date.now()
  }

  // 用来获取没有过期的 access_token
  fetchAccessToken() {
    // 优化操作，优化不去执行读取文件操作
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      // 说明 this 有凭据和过期时间，并且凭据未过期
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }

    return this.readAccessToken()
      .then(async res => {
        // 判断凭据是否过期
        if (this.isValidAccessToken(res)) {
          // 没有过期，直接使用
          return Promise.resolve(res)
        } else {
          // 重新发送请求获取凭据
          const data = await this.getAccessToken()
          // 保存下来
          await this.saveAccessToken(data)
          // 将请求回来的凭据返回出去
          return Promise.resolve(data)
        }
      })
      .catch(async err => {
        console.log(err)
        // 重新发送请求获取凭据
        const data = await this.getAccessToken()
        // 保存下来
        await this.saveAccessToken(data)
        // 将请求回来的凭据返回出去
        return Promise.resolve(data)
      })
      .then(res => {
        // 将其请求回来的凭据和过期时间挂载到 this 上
        this.access_token = res.access_token
        this.expires_in = res.expires_in
        // 指定 fetchAccessToken 方法返回值
        return Promise.resolve(res)
      })
  }

  // 创建菜单
  createMenu(data) {
    return new Promise((resolve, reject) => {
      this.fetchAccessToken().then(res => {
        const url = `${api.menu.create}?access_token=${res.access_token}`
        request({ url, method: 'POST', data })
          .then(res => resolve(res.data))
          .catch(err => reject('createMenu method error: ' + err))
      })
    })
  }

  // 删除菜单
  deleteMenu() {
    return new Promise((resolve, reject) => {
      this.fetchAccessToken().then(res => {
        const url = `${api.menu.delete}?access_token=${res.access_token}`
        request({ url, method: 'GET' })
          .then(res => resolve(res.data))
          .catch(err => reject('deleteMenu method error: ' + err))
      })
    })
  }

  // 获取菜单的配置
  getMenu() {
    return new Promise((resolve, reject) => {
      this.fetchAccessToken().then(res => {
        const url = `${api.menu.get}?access_token=${res.access_token}`
        request({ url, method: 'GET' })
          .then(res => resolve(res.data))
          .catch(err => reject('getMenu method error: ' + err))
      })
    })
  }
}

;(async () => {
  const wechatApi = new Wechat()
  const res = await wechatApi.createMenu(menu)
  console.log(res)
})()

module.exports = Wechat
