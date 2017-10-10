import Vue from 'vue'
import { CURRENT_NODE } from '../mutation-types'

// const node = {
//   nodeName: '',
//   nodes: [],
// }

const actions = {
  [CURRENT_NODE]({ commit }, payload) {
    commit(CURRENT_NODE, payload.node)
  },
}

const mutations = {
  [CURRENT_NODE](state, payload) {
    if (!state || !payload) {
      return
    }
    Object.keys(payload).forEach((item) => {
      Vue.set(state, item, payload[item])
    })
  },
}


export default {
  mutations,
  actions,
}
