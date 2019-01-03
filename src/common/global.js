import mContacts from '../mocks/contact'

export default {
  getContact(v) { // 获取联系人
    if (this._contact) {
      return v ? this._contact : this._contact
    } else {
      let contactObj = {}
      mContacts.forEach((v) => {
        contactObj[v.id] = v
      })
      this._contact = contactObj
      return this.getContact(v)
    }
  },
  setContact(k, v) {
    if (v) {
      if (this._contact) {
        this._contact[k] = v
      } else {
        this._contact = {}
        this._contact = v
      }
    } else {
      this._contact = k
    }
  },
  getUserInfo() {
    return this._userInfo
  },
  setUserInfo(v) {
    this._userInfo = v
  }
}
