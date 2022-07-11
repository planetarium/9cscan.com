import api from "../../api"
function flatDynamoObject(obj, key) {
    if (obj[key].hasOwnProperty("N")) {
        obj[key] = Number(obj[key]["N"])
    } else if (obj[key].hasOwnProperty("S")) {
        obj[key] = obj[key]["S"]
    } else if (obj[key].hasOwnProperty("L")) {
        for (let i = 0; i < obj[key]["L"].length; i++) {
            flatDynamoObject(obj[key]["L"], i)
        }
        obj[key] = obj[key]["L"]
    }
}
const LATEST_TX_SIZE = 50
export default {
    namespaced: true,
    state() {
        return {
            loading: false,
            latestBlocks: [],
            latestTransactions: [],
            syncTx: false,
            size: 20
        }
    },
    getters: {
        loading: state => state.loading,
        size: state => state.size,
        latestBlockIndex: state => state.latestBlocks[0]?.index || 0,
        latestBlocks10: state => state.latestBlocks.slice(0, 10),
        latestTransactions10: state => state.latestTransactions.slice(0, 10),
        latestBlocks: state => state.latestBlocks.slice(0, state.size),
        latestBlocksBefore: state => state.latestBlocks.length >= state.size && state.latestBlocks[state.size - 1].index || null,
        latestTransactions: state => state.latestTransactions.slice(0, state.size),
        latestTransactionsBefore: state => {
            let txs = state.latestTransactions.slice(0, state.size)
            if (txs.length > 0) {
                let lastBlockIndex = _.last(txs).blockIndex
                let count = txs.filter(tx => tx.blockIndex == lastBlockIndex).length
                return lastBlockIndex + '/' + count
            }
        },
        latestBlocksFull: state => state.latestBlocks,
        totalTxs: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.transactionCount).reduce((a,b) => a+b) || 0,
        avgTx: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.transactionCount).reduce((a,b) => a+b)/state.latestBlocks.length || 0,
        avgDifficulty: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.difficulty).reduce((a,b) => a+b)/state.latestBlocks.length || 0,
        avgBlockTime: state => {
            let totalTerm = 0
            for (let i = 0; i < state.latestBlocks.length - 2; i++) {
                let term = new Date(state.latestBlocks[i].timestamp) - new Date(state.latestBlocks[i + 1].timestamp)
                totalTerm += term
            }
            return ((totalTerm / (state.latestBlocks.length - 1)) / 1000).toFixed(2)
        },
    },
    mutations: {
        setSize(state, size) {
            state.size = size
        },
        setSyncTx(state, sync) {
            state.syncTx = sync
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setLatestBlocks(state, blocks) {
            state.latestBlocks = blocks
        },
        async setLatestTransactions(state, txs) {
            setTimeout(async () => {
                for (let i = txs.length - 1; i >= 0; i--) {
                    let tx = txs[i]
                    if (!state.latestTransactions.find(t => t.id == tx.id)) {
                        state.latestTransactions.unshift(tx)
                        if (state.latestTransactions.length > LATEST_TX_SIZE) {
                            state.latestTransactions.pop()
                        }
                        if (i < 6) {
                            await new Promise(resolve => setTimeout(resolve, 60))
                        }
                    }
                }
                if (state.latestTransactions.length > LATEST_TX_SIZE) {
                    state.latestTransactions = state.latestTransactions.slice(0, LATEST_TX_SIZE)
                }
            }, 1)
        },
        addLatestBlock(state, block) {
            if (!state.latestBlocks.find(b => b.index == block.index)) {
                state.latestBlocks.unshift(block)
                state.latestBlocks = _.sortBy(state.latestBlocks, b => -b['index']).slice(0, 100)
            }
        }
    },
    actions: {
        async init({state, commit, dispatch}) {
            commit('setLoading', true)
            let {blocks} = await api.getBlocks({limit: 100})
            let {transactions} = await api.getTransactions({limit: state.size})
            commit('setLoading', false)

            commit('setLatestBlocks', blocks)
            commit('setLatestTransactions', transactions)
            dispatch('initWS')

        },
        initWS({state, commit, dispatch}) {
            let socket = new WebSocket(process.env.VUE_APP_WS_ENDPOINT)
            socket.onopen = () => {
                console.log('WS Connected')
            }
            socket.onmessage = ({data}) => {
                let block = JSON.parse(data)
                for (let key of Object.keys(block)) {
                    flatDynamoObject(block, key)
                }
                if (block['index']) {
                    if (state.syncTx) {
                        api.getTransactions({limit: state.size}).then(data => {
                            commit('setLatestTransactions', data.transactions)
                            commit('addLatestBlock', block)
                        })
                    } else {
                        commit('addLatestBlock', block)
                    }
                }
            }
            clearInterval(window.socketTimer)
            window.socketTimer = setInterval(() => {
                if (socket.readyState == socket.OPEN) {
                    socket.send('ping')
                } else {
                    dispatch('init')
                }
            }, 20000)
        },
        setSize({commit}, size) {
            commit('setSize', size)
        },
        syncTx({state, commit, dispatch}, onoff) {
            dispatch('refreshLatestTxs')
            commit('setSyncTx', onoff)
        },
        refreshLatestTxs({state, commit}) {
            api.getTransactions({limit: Math.max(LATEST_TX_SIZE, state.size)}).then(data => {
                commit('setLatestTransactions', data.transactions)
            })
        },
        loadBlock({state}, index) {
            return api.getBlock(index)
        },
        loadTransaction({state}, id) {
            return api.getTransaction(id)
        },
        loadTransactionStatus({state}, id) {
            return api.getTransactionStatus(id)
        },
        loadAccountTransactions({state}, address) {
            return api.getAccountTransactions(address)
        }
    }
}
