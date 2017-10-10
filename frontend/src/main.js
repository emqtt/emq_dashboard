import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import { Loading, Message } from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'
import lang from './common/lang'
import { getLocalStorage } from './common/storage'


Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(Loading)

Vue.prototype.$message = Message

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

const i18n = new VueI18n({
  locale: getLocalStorage('language') || 'en',  // default language
  messages: lang,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
})
