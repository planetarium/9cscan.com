import { gqlClient } from "../../mimir-gql/client"

function mergeAndDeduplicate(existingItems, newItems, uniqueField, sortField) {
    const existingMap = new Map()
    existingItems.forEach(item => {
        const key = item.object?.[uniqueField] || item[uniqueField]
        if (key !== undefined) {
            existingMap.set(key, item)
        }
    })
    
    newItems.forEach(item => {
        const key = item.object?.[uniqueField] || item[uniqueField]
        if (key !== undefined) {
            existingMap.set(key, item)
        }
    })
    
    return Array.from(existingMap.values()).sort((a, b) => {
        const keyA = a.object?.[sortField] || a[sortField]
        const keyB = b.object?.[sortField] || b[sortField]
        return keyB - keyA
    })
}

export default {
    namespaced: true,
    state() {
        return {
            loading: false,
            latestBlocks: [],
            latestTransactions: [],
            size: 20
        }
    },
    getters: {
        loading: state => state.loading,
        size: state => state.size,
        latestBlockIndex: state => state.latestBlocks[0]?.object?.index || 0,
        latestBlocks10: state => state.latestBlocks.slice(0, 10),
        latestTransactions10: state => state.latestTransactions.slice(0, 10),
        latestBlocks: state => state.latestBlocks.slice(0, state.size),
        latestTransactions: state => state.latestTransactions.slice(0, state.size),
        latestBlocksFull: state => state.latestBlocks,
        totalTxs: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.object?.txCount || 0).reduce((a,b) => a+b) || 0,
        avgTx: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.object?.txCount || 0).reduce((a,b) => a+b)/state.latestBlocks.length || 0,
        avgDifficulty: state => state.latestBlocks.length > 0 && state.latestBlocks.map(b => b.object?.difficulty || 0).reduce((a,b) => a+b)/state.latestBlocks.length || 0,
        avgBlockTime: state => {
            let totalTerm = 0
            for (let i = 0; i < state.latestBlocks.length - 2; i++) {
                let term = new Date(state.latestBlocks[i].object?.timestamp) - new Date(state.latestBlocks[i + 1].object?.timestamp)
                totalTerm += term
            }
            return ((totalTerm / (state.latestBlocks.length - 1)) / 1000).toFixed(2)
        },
    },
    mutations: {
        setSize(state, size) {
            state.size = size
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setLatestBlocks(state, blocks) {
            state.latestBlocks = blocks
        },
        setLatestTransactions(state, txs) {
            state.latestTransactions = txs
        },
    },
    actions: {
        async init({state, commit, dispatch}) {
            commit('setLoading', true)
            try {
                const blocksResponse = await gqlClient.getBlocks(0, 100)
                const transactionsResponse = await gqlClient.getTransactions(0, state.size)
                
                const blocks = blocksResponse.items
                const transactions = transactionsResponse.items
                
                commit('setLoading', false)
                commit('setLatestBlocks', blocks)
                commit('setLatestTransactions', transactions)
                dispatch('startPolling')
            } catch (error) {
                console.error('Failed to initialize block data:', error)
                commit('setLoading', false)
            }
        },
        startPolling({state, commit, dispatch}) {
            clearInterval(window.pollingTimer)
            window.pollingTimer = setInterval(async () => {
                try {
                    const blocksResponse = await gqlClient.getBlocks(0, 1)

                    if (state.latestBlockIndex >= blocksResponse.items[0].object.index) {
                        return
                    }
                    
                    const transactionsResponse = await gqlClient.getTransactions(0, blocksResponse.items[0].object.txCount)
                    
                    const newBlocks = blocksResponse.items
                    const newTransactions = transactionsResponse.items
                    
                    const mergedBlocks = mergeAndDeduplicate(state.latestBlocks, newBlocks, 'hash', 'index')
                    const mergedTransactions = mergeAndDeduplicate(state.latestTransactions, newTransactions, 'id', 'blockIndex')
                    
                    commit('setLatestBlocks', mergedBlocks)
                    commit('setLatestTransactions', mergedTransactions)
                } catch (error) {
                    console.error('Failed to poll data:', error)
                }
            }, 3500)
        },
        setSize({commit}, size) {
            commit('setSize', size)
        },


        async loadBlock({state}, index) {
            try {
                const block = await gqlClient.getBlock(index)
                return block
            } catch (error) {
                console.error('Failed to load block:', error)
                throw error
            }
        },
        async loadTransaction({state}, id) {
            try {
                const transaction = await gqlClient.getTransaction(id)
                return transaction
            } catch (error) {
                console.error('Failed to load transaction:', error)
                throw error
            }
        },
        async loadBlockTransactions({state}, index) {
            try {
                const response = await gqlClient.getTransactions(0, 50, { blockIndex: index })
                return response.items
            } catch (error) {
                console.error('Failed to load block transactions:', error)
                throw error
            }
        },
        async loadAccountTransactions({state}, address) {
            try {
                const response = await gqlClient.getTransactions(0, 50, { signer: address })
                return response.items
            } catch (error) {
                console.error('Failed to load account transactions:', error)
                throw error
            }
        }
    }
}
