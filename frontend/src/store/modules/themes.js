import Vue from 'vue'
import { THEMES_SWITCH } from '../mutation-types'

const themes = localStorage.getItem('themes') || 'dark-themes'

window.document.body.setAttribute('class', themes)

const actions = {
  [THEMES_SWITCH]({ commit }, payload) {
    localStorage.setItem('themes', payload.themes)
    window.document.body.setAttribute('class', payload.themes)
    commit(THEMES_SWITCH, payload)
  },
}

const mutations = {
  [THEMES_SWITCH](state, payload) {
    // Object.assign(state, payload)
    Vue.set(state, 'themes', payload.themes)
  },
}


export default {
  themes,
  actions,
  mutations,
}
