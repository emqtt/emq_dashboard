import Vue from 'vue'
import { USER_LOGIN, USER_LOGOUT } from '../mutation-types'


const state = JSON.parse(sessionStorage.getItem('user')) ||
  JSON.parse(localStorage.getItem('user')) || {}

const actions = {
  [USER_LOGIN]({ commit }, payload) {
    if (payload.remember) {
      localStorage.setItem('user', JSON.stringify(payload.user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(payload.user))
    }
    commit(USER_LOGIN, payload.user)
  },
  [USER_LOGOUT]({ commit }) {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    commit(USER_LOGOUT)
  },
}

const mutations = {
  [USER_LOGIN](moduleState, user) {
    Object.assign(moduleState, user)
  },
  [USER_LOGOUT](moduleState) {
    Object.keys(moduleState).forEach(key => Vue.delete(moduleState, key))
  },
}


export default {
  state,
  actions,
  mutations,
}
