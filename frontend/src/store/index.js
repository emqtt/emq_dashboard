import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import node from './modules/node'
import themes from './modules/themes'

Vue.use(Vuex)


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    node,
    themes,
  },
})
