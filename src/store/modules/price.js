import { gqlClient } from "../../mimir-gql/client"
export default {
    namespaced: true,
    state() {
        return {
            WNCG: {},
        }
    },
    getters: {
        WNCG: state => state.WNCG,
        WncgMarketCap: state => state.WNCG.marketCap || 0,
        WncgPrice: state => state.WNCG.price || 0,
        WncgChange24h: state => state.WNCG.percentChange24h || 0,
    },
    mutations: {
        setWNCG(state, data) {
            state.WNCG = data
        },
    },
    actions: {
        async init({state, commit, dispatch}) {
            try {
                let data = await gqlClient.getWNCGPrice()
                commit('setWNCG', data)
            } catch (error) {
                console.error('Failed to fetch WNCG price:', error)
            }
            setTimeout(() => {
                dispatch('init')
            }, 60000)
        }
    }
}
