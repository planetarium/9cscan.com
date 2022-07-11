import Vue from 'vue'
import Vuex from 'vuex'
import Block from './modules/block'
import Price from './modules/price'
import Sheet from './modules/9csheet'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        Block,
        Price,
        Sheet
    },
    state: {},
    mutations: {},
    actions: {}
})
