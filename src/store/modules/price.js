import api from "../../api"
export default {
    namespaced: true,
    state() {
        return {
            WNCG: {},
        }
    },
    getters: {
        WNCG: state => state.WNCG,
        WncgMarketCap: state => state.WNCG.quote && state.WNCG.quote.USD && state.WNCG.quote.USD.market_cap || 0,
        WncgPrice: state => state.WNCG.quote && state.WNCG.quote.USD && state.WNCG.quote.USD.price || 0,
        WncgChange24h: state => state.WNCG.quote && state.WNCG.quote.USD && state.WNCG.quote.USD.percent_change_24h || 0,
    },
    mutations: {
        setWNCG(state, data) {
            state.WNCG = data
        },
    },
    actions: {
        async init({state, commit, dispatch}) {
            let data = await api.getPrice()
            commit('setWNCG', data)
            setTimeout(() => {
                dispatch('init')
            }, 60000)
        }
    }
}
