import mContacts from '../mocks/contact'
import mHistory from '../mocks/history'
import mReply from '../mocks/reply'
import global from './global'

import wepy from 'wepy'

export default {
  getRandomReply(id) { // 获取随便的回答
    let template = mReply[id]
    if (!template) {
      template = mReply['other']
    }
    let index = Math.random() * template.length >> 0
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(template[index])
      })
    })
  },
  getContact() { // 获取联系人
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mContacts)
      })
    })
  },
  getUserInfo () {
    return new Promise((resolve, reject) => {
      let cache = global.getUserInfo()
      if (cache) {
        resolve(cache)
      } else {
        wepy.login().then((res) => {
          wepy.getUserInfo().then((res) => {
            console.log('getuserinfo success')
            console.log(res)
            global.setUserInfo(res.userInfo)
            resolve(res.userInfo)
          }).catch(reject)
        }).catch(reject)
      }
    })
  },
  getHistory(id) { // 获取历史对话
    let history = wepy.getStorageSync('_wechat_history_') || mHistory
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let sorted = history.sort((a, b) => a.time - b.time)
        if (!id) {
          resolve(this.leftJoin(sorted, mContacts))
        } else {
          resolve(this.leftJoin(sorted.filter((v) => v.from === id || v.to === id), mContacts))
        }
      })
    })
  },
  getMessageList() { // 获取消息列表
    let history = wepy.getStorageSync('_wechat_history_') || mHistory
    return new Promise((resolve, reject) => {
      let distince = []
      let rst = []
      let sorted = history.sort((a, b) => b.time - a.time)
      sorted.forEach((v) => {
        if (v.from !== 'me' && distince.indexOf(v.from) === -1) {
          distince.push(v.from)
        }
        if (v.to !== 'me' && distince.indexOf(v.to) === -1) {
          distince.push(v.to)
        }
      })
      distince.forEach((v) => {
        let pmsg = sorted.filter((msg) => msg.to === v || msg.from === v)
        let lastmsg = pmsg.length ? pmsg[0].msg : ''
        rst.push({
          id: v,
          lastmsg: lastmsg
        })
      })
      setTimeout(() => {
        resolve(this.leftJoin(rst, mContacts))
      })
    })
  },
  leftJoin(original, contacts) { // 好友的名称和头像
    let contactObj = global.getContact()
    let rst = []
    original.forEach((v) => {
      if (!v.id) {
        v.id = (v.from !== 'me') ? v.from : v.to
      }
      if (v.id) {
        if (v.id !== 'me') {
          v.name = contactObj[v.id].name
          v.icon = `../mocks/users/${contactObj[v.id].id}.png`
        }
        rst.push(v)
      }
    })
    return rst
  },
  sendMsg(to, msg, type = 'text') { // 发送信息
    return this.msg('me', to, msg, type)
  },
  replyMsg(frm, msg, type = 'text') {
    return this.msg(frm, 'me', msg, type)
  },
  msg(frm, to, msg, type = 'text') {
    let history = wepy.getStorageSync('_wechat_history_') || mHistory
    let msgObj = {
      to: to,
      msg: msg,
      type: type,
      from: frm,
      time: +new Date()
    }
    history.push(msgObj)
    return new Promise((resolve, reject) => {
      wepy.setStorage({key: '_wechat_history', data: history}).then(() => {
        resolve(msgObj)
      }).catch(reject)
    })
  },
  clearMsg(id) {
    return wepy.clearStorage()
  }
}
