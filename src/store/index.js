import Vue from 'vue'
import Vuex from 'vuex'
import Block from './modules/block'
import Price from './modules/price'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        Block,
        Price,
    },
    state: {},
    mutations: {},
    actions: {}
})
