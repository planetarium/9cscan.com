import Vue from 'vue'
import Vuex from 'vuex'
import Block from './modules/block'
import Price from './modules/price'
import ActionTypes from './modules/actionTypes'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        Block,
        Price,
        ActionTypes,
    },
    state: {},
    mutations: {},
    actions: {}
})
