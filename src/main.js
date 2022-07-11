import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import _ from 'underscore'
import $ from 'jquery'
import axios from 'axios'
import moment from 'moment'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'
import store from './store'
import Event from './store/event'
import utils from './utils'
import BigNumber from "bignumber.js"
import CSV from "./utils/csvToJson"

window.setIntervalImmediately = function(func, interval) {
  func();
  return setInterval(func, interval)
}
window.BigNumber = BigNumber
window._ = _
window.$ = $
window.axios = axios
window.moment = moment
moment.locale('en-gb', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s:  '%d secs',
    ss: '%d secs',
    m:  '%d min',
    mm: '%d mins',
    h:  '%d hr',
    hh: '%d hrs',
    d:  '%d day',
    dd: '%d days',
    M:  '%d month',
    MM: '%d months',
    y:  '%d year',
    yy: '%d years'
  }
});
window.utils = utils
window.Event = Event
moment.locale('en-gb')
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.prototype.BigNumber = BigNumber
Vue.prototype.moment = moment
for (let name in utils) {
  Vue.prototype[name] = utils[name]
}
new Vue({
  vuetify: new Vuetify({
    theme: {
      options: {
        customProperties: true,
        variations: true
      },
      themes: {
        light: {
          bg: {
            base: '#191919',
            lighten1: '#2e2e2e'
          },
          inputbg: {
            base: '#1d1e1f'
          },
          text: {
            base: '#6e6e73',
            lighten1: '#9999a0',
            lighten2: '#b7b7bb',
          },
          primary: {
            base: '#2A8BA9'
          },
          point: {
            base: '#f6a14c',
          },
          pointred: {
            base: '#ff4142',
            lighten1: '#ff3a40'
          },
          pointblue: {
            base: '#3E2A8C',
            darken1: '#2c1e65',
            darken2: '#1b123f',
          },
          pointyellow: {
            base: '#f0b90b',
          },
          pointlink: {
            base: '#1d9bf0',
            lighten1: '#8ed1ff'
          }
        }
      }
    },
    icons: {
      iconfont: 'mdi',
    }
  }),
  router,
  store,
  render: h => h(App),
}).$mount('#app')
