/**
 * created by lifenglei 20190919
 */

import * as types from '../mutation-types'

const state = {
  userInfo: {}
}
const getters = {
  getUserInfo: state => state.userInfo
}
const actions = {
  setUserInfo({commit}, userInfo) {
    commit(types.SET_USERINFO, userInfo)
  }
}
const mutations = {
  [types.SET_USERINFO](state, userInfo) {}
}
export default {
  state,
  getters,
  mutations,
  actions
}
