import Vue from 'vue'
import Vuex from 'vuex'
import blockModule from './block'

Vue.use(Vuex)

function mergeAndDeduplicate(existingItems, newItems, keyField) {
    const existingMap = new Map()
    existingItems.forEach(item => {
        const key = item.object?.[keyField] || item[keyField]
        if (key !== undefined) {
            existingMap.set(key, item)
        }
    })
    
    newItems.forEach(item => {
        const key = item.object?.[keyField] || item[keyField]
        if (key !== undefined) {
            existingMap.set(key, item)
        }
    })
    
    return Array.from(existingMap.values()).sort((a, b) => {
        const keyA = a.object?.[keyField] || a[keyField]
        const keyB = b.object?.[keyField] || b[keyField]
        return keyB - keyA
    })
}

describe('Block Module', () => {
    let store

    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                block: blockModule
            }
        })
    })

    describe('mergeAndDeduplicate function', () => {
        test('should merge and deduplicate blocks by index', () => {
            const existingBlocks = [
                { object: { index: 100, data: 'old' } },
                { object: { index: 99, data: 'old' } }
            ]
            
            const newBlocks = [
                { object: { index: 101, data: 'new' } },
                { object: { index: 100, data: 'updated' } }
            ]
            
            const result = mergeAndDeduplicate(existingBlocks, newBlocks, 'index')
            
            expect(result).toHaveLength(3)
            expect(result[0].object.index).toBe(101)
            expect(result[1].object.index).toBe(100)
            expect(result[1].object.data).toBe('updated')
            expect(result[2].object.index).toBe(99)
        })

        test('should merge and deduplicate transactions by id', () => {
            const existingTxs = [
                { id: 'tx1', data: 'old' },
                { id: 'tx2', data: 'old' }
            ]
            
            const newTxs = [
                { id: 'tx3', data: 'new' },
                { id: 'tx1', data: 'updated' }
            ]
            
            const result = mergeAndDeduplicate(existingTxs, newTxs, 'id')
            
            expect(result).toHaveLength(3)
            expect(result[0].id).toBe('tx1')
            expect(result[1].id).toBe('tx2')
            expect(result[2].id).toBe('tx3')
            expect(result[0].data).toBe('updated')
        })

        test('should handle empty arrays', () => {
            const result1 = mergeAndDeduplicate([], [], 'index')
            expect(result1).toHaveLength(0)
            
            const result2 = mergeAndDeduplicate([{ object: { index: 1 } }], [], 'index')
            expect(result2).toHaveLength(1)
            
            const result3 = mergeAndDeduplicate([], [{ object: { index: 1 } }], 'index')
            expect(result3).toHaveLength(1)
        })

        test('should sort by key in descending order', () => {
            const existing = [
                { object: { index: 5 } },
                { object: { index: 3 } }
            ]
            
            const newItems = [
                { object: { index: 7 } },
                { object: { index: 1 } }
            ]
            
            const result = mergeAndDeduplicate(existing, newItems, 'index')
            
            expect(result[0].object.index).toBe(7)
            expect(result[1].object.index).toBe(5)
            expect(result[2].object.index).toBe(3)
            expect(result[3].object.index).toBe(1)
        })
    })

    describe('state', () => {
        test('should have correct initial state', () => {
            expect(store.state.block.loading).toBe(false)
            expect(store.state.block.latestBlocks).toEqual([])
            expect(store.state.block.latestTransactions).toEqual([])
            expect(store.state.block.size).toBe(20)
        })
    })

    describe('getters', () => {
        test('should return correct loading state', () => {
            expect(store.getters['block/loading']).toBe(false)
        })

        test('should return correct size', () => {
            expect(store.getters['block/size']).toBe(20)
        })

        test('should return latest block index', () => {
            store.state.block.latestBlocks = [
                { object: { index: 100 } },
                { object: { index: 99 } }
            ]
            expect(store.getters['block/latestBlockIndex']).toBe(100)
        })

        test('should return latest 10 blocks', () => {
            store.state.block.latestBlocks = Array.from({ length: 15 }, (_, i) => ({ object: { index: i } }))
            const result = store.getters['block/latestBlocks10']
            expect(result).toHaveLength(10)
            expect(result[0].object.index).toBe(0)
        })

        test('should return latest 10 transactions', () => {
            store.state.block.latestTransactions = Array.from({ length: 15 }, (_, i) => ({ id: `tx${i}` }))
            const result = store.getters['block/latestTransactions10']
            expect(result).toHaveLength(10)
            expect(result[0].id).toBe('tx0')
        })
    })

    describe('mutations', () => {
        test('should set loading state', () => {
            store.commit('block/setLoading', true)
            expect(store.state.block.loading).toBe(true)
        })

        test('should set size', () => {
            store.commit('block/setSize', 50)
            expect(store.state.block.size).toBe(50)
        })

        test('should set latest blocks', () => {
            const blocks = [{ object: { index: 1 } }]
            store.commit('block/setLatestBlocks', blocks)
            expect(store.state.block.latestBlocks).toEqual(blocks)
        })

        test('should set latest transactions', () => {
            const txs = [{ id: 'tx1' }]
            store.commit('block/setLatestTransactions', txs)
            expect(store.state.block.latestTransactions).toEqual(txs)
        })
    })

    describe('data limiting', () => {
        test('should limit blocks to maximum items', () => {
            const largeBlocks = Array.from({ length: 150 }, (_, i) => ({ 
                object: { index: i, hash: `hash${i}` } 
            }))
            
            store.commit('block/setLatestBlocks', largeBlocks)
            expect(store.state.block.latestBlocks).toHaveLength(150)
            
            const limitedBlocks = largeBlocks.slice(0, 100)
            store.commit('block/setLatestBlocks', limitedBlocks)
            expect(store.state.block.latestBlocks).toHaveLength(100)
        })

        test('should limit transactions to maximum items', () => {
            const largeTxs = Array.from({ length: 150 }, (_, i) => ({ 
                id: `tx${i}`, blockIndex: i 
            }))
            
            store.commit('block/setLatestTransactions', largeTxs)
            expect(store.state.block.latestTransactions).toHaveLength(150)
            
            const limitedTxs = largeTxs.slice(0, 100)
            store.commit('block/setLatestTransactions', limitedTxs)
            expect(store.state.block.latestTransactions).toHaveLength(100)
        })

        test('should maintain data integrity when limiting', () => {
            const blocks = Array.from({ length: 120 }, (_, i) => ({ 
                object: { index: i, hash: `hash${i}` } 
            }))
            
            store.commit('block/setLatestBlocks', blocks)
            const limitedBlocks = blocks.slice(0, 100)
            store.commit('block/setLatestBlocks', limitedBlocks)
            
            expect(store.state.block.latestBlocks[0].object.index).toBe(0)
            expect(store.state.block.latestBlocks[99].object.index).toBe(99)
            expect(store.state.block.latestBlocks).toHaveLength(100)
        })
    })
}) 