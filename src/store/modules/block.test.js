import blockModule from './block'
import { gqlClient } from '../../mimir-gql/client'

jest.mock('../../mimir-gql/client', () => ({
  gqlClient: {
    getBlocks: jest.fn(),
    getTransactions: jest.fn(),
    getBlock: jest.fn(),
    getTransaction: jest.fn()
  }
}))

describe('Block Store Module', () => {
  let state
  let commit
  let dispatch

  beforeEach(() => {
    state = blockModule.state()
    commit = jest.fn()
    dispatch = jest.fn()
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    
    global.window = {
      pollingTimer: null
    }
    global.clearInterval = jest.fn()
    global.setInterval = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('state', () => {
    it('should have initial state', () => {
      expect(state.loading).toBe(false)
      expect(state.latestBlocks).toEqual([])
      expect(state.latestTransactions).toEqual([])
      expect(state.syncTx).toBe(false)
      expect(state.size).toBe(20)
    })
  })

  describe('mutations', () => {
    it('should set size', () => {
      blockModule.mutations.setSize(state, 50)
      expect(state.size).toBe(50)
    })

    it('should set sync tx', () => {
      blockModule.mutations.setSyncTx(state, true)
      expect(state.syncTx).toBe(true)
    })

    it('should set loading', () => {
      blockModule.mutations.setLoading(state, true)
      expect(state.loading).toBe(true)
    })

    it('should set latest blocks', () => {
      const blocks = [{ index: 1 }, { index: 2 }]
      blockModule.mutations.setLatestBlocks(state, blocks)
      expect(state.latestBlocks).toEqual(blocks)
    })


  })

  describe('getters', () => {
    beforeEach(() => {
      state.latestBlocks = [
        { object: { index: 3, txCount: 10, difficulty: 100, timestamp: '2023-01-01T10:00:00Z' } },
        { object: { index: 2, txCount: 15, difficulty: 150, timestamp: '2023-01-01T09:00:00Z' } },
        { object: { index: 1, txCount: 5, difficulty: 200, timestamp: '2023-01-01T08:00:00Z' } }
      ]
      state.latestTransactions = [
        { id: 'tx1', blockIndex: 3 },
        { id: 'tx2', blockIndex: 2 },
        { id: 'tx3', blockIndex: 1 }
      ]
    })

    it('should return loading state', () => {
      state.loading = true
      expect(blockModule.getters.loading(state)).toBe(true)
    })

    it('should return size', () => {
      state.size = 50
      expect(blockModule.getters.size(state)).toBe(50)
    })

    it('should return latest block index', () => {
      expect(blockModule.getters.latestBlockIndex(state)).toBe(3)
    })

    it('should return latest blocks 10', () => {
      const result = blockModule.getters.latestBlocks10(state)
      expect(result).toHaveLength(3)
      expect(result[0].object.index).toBe(3)
    })

    it('should return latest transactions 10', () => {
      const result = blockModule.getters.latestTransactions10(state)
      expect(result).toHaveLength(3)
      expect(result[0].id).toBe('tx1')
    })

    it('should return latest blocks with size limit', () => {
      state.size = 2
      const result = blockModule.getters.latestBlocks(state)
      expect(result).toHaveLength(2)
    })

    it('should return latest transactions with size limit', () => {
      state.size = 2
      const result = blockModule.getters.latestTransactions(state)
      expect(result).toHaveLength(2)
    })

    it('should calculate total transactions', () => {
      expect(blockModule.getters.totalTxs(state)).toBe(30)
    })

    it('should calculate average transactions', () => {
      expect(blockModule.getters.avgTx(state)).toBe(10)
    })

    it('should calculate average difficulty', () => {
      expect(blockModule.getters.avgDifficulty(state)).toBe(150)
    })

    it('should calculate average block time', () => {
      const result = blockModule.getters.avgBlockTime(state)
      expect(typeof result).toBe('string')
      expect(parseFloat(result)).toBeGreaterThan(0)
    })

    it('should return 0 for empty blocks', () => {
      state.latestBlocks = []
      expect(blockModule.getters.totalTxs(state)).toBe(0)
      expect(blockModule.getters.avgTx(state)).toBe(0)
      expect(blockModule.getters.avgDifficulty(state)).toBe(0)
    })
  })

  describe('actions', () => {
    it('should initialize successfully', async () => {
      const mockBlocksResponse = {
        items: [
          { object: { index: 1, hash: 'hash1' } },
          { object: { index: 2, hash: 'hash2' } }
        ]
      }
      const mockTransactionsResponse = {
        items: [
          { object: { id: 'tx1', blockIndex: 1 } },
          { object: { id: 'tx2', blockIndex: 2 } }
        ]
      }

      gqlClient.getBlocks.mockResolvedValue(mockBlocksResponse)
      gqlClient.getTransactions.mockResolvedValue(mockTransactionsResponse)

      await blockModule.actions.init({ state, commit, dispatch })

      expect(commit).toHaveBeenCalledWith('setLoading', true)
      expect(commit).toHaveBeenCalledWith('setLoading', false)
      expect(commit).toHaveBeenCalledWith('setLatestBlocks', [
        { object: { index: 1, hash: 'hash1' } },
        { object: { index: 2, hash: 'hash2' } }
      ])
      expect(commit).toHaveBeenCalledWith('setLatestTransactions', [
        { object: { id: 'tx1', blockIndex: 1 } },
        { object: { id: 'tx2', blockIndex: 2 } }
      ])
      expect(dispatch).toHaveBeenCalledWith('startPolling')
    })

    it('should handle initialization error', async () => {
      gqlClient.getBlocks.mockRejectedValue(new Error('API Error'))

      await blockModule.actions.init({ state, commit, dispatch })

      expect(commit).toHaveBeenCalledWith('setLoading', true)
      expect(commit).toHaveBeenCalledWith('setLoading', false)
    })

    it('should set size', () => {
      blockModule.actions.setSize({ commit }, 50)
      expect(commit).toHaveBeenCalledWith('setSize', 50)
    })

    it('should sync transactions', () => {
      blockModule.actions.syncTx({ state, commit, dispatch }, true)
      expect(commit).toHaveBeenCalledWith('setSyncTx', true)
    })

    it('should start polling', () => {
      const mockBlocksResponse = {
        items: [
          { object: { index: 2 } },
          { object: { index: 1 } }
        ]
      }
      const mockTransactionsResponse = {
        items: [
          { object: { id: 'tx1' } },
          { object: { id: 'tx2' } }
        ]
      }

      gqlClient.getBlocks.mockResolvedValue(mockBlocksResponse)
      gqlClient.getTransactions.mockResolvedValue(mockTransactionsResponse)

      state.latestBlocks = [{ object: { index: 1 } }]
      state.syncTx = true

      blockModule.actions.startPolling({ state, commit, dispatch })

      expect(global.clearInterval).toHaveBeenCalledWith(null)
      expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 8000)
    })

    it('should load block', async () => {
      const mockBlock = {
        object: { index: 1, hash: 'hash1' }
      }

      gqlClient.getBlock.mockResolvedValue(mockBlock)

      const result = await blockModule.actions.loadBlock({ state }, 1)

      expect(result).toEqual({ object: { index: 1, hash: 'hash1' } })
    })

    it('should load transaction', async () => {
      const mockTransaction = {
        object: { id: 'tx1', blockIndex: 1 }
      }

      gqlClient.getTransaction.mockResolvedValue(mockTransaction)

      const result = await blockModule.actions.loadTransaction({ state }, 'tx1')

      expect(result).toEqual({ object: { id: 'tx1', blockIndex: 1 } })
    })

    it('should load account transactions', async () => {
      const mockResponse = {
        items: [
          { object: { id: 'tx1', signer: 'address1' } },
          { object: { id: 'tx2', signer: 'address1' } }
        ]
      }

      gqlClient.getTransactions.mockResolvedValue(mockResponse)

      const result = await blockModule.actions.loadAccountTransactions({ state }, 'address1')

      expect(result).toEqual([
        { object: { id: 'tx1', signer: 'address1' } },
        { object: { id: 'tx2', signer: 'address1' } }
      ])
      expect(gqlClient.getTransactions).toHaveBeenCalledWith(0, 50, { signer: 'address1' })
    })

    it('should handle load block error', async () => {
      gqlClient.getBlock.mockRejectedValue(new Error('Block not found'))

      await expect(blockModule.actions.loadBlock({ state }, 999)).rejects.toThrow('Block not found')
    })

    it('should handle load transaction error', async () => {
      gqlClient.getTransaction.mockRejectedValue(new Error('Transaction not found'))

      await expect(blockModule.actions.loadTransaction({ state }, 'invalid-tx')).rejects.toThrow('Transaction not found')
    })

    it('should handle load account transactions error', async () => {
      gqlClient.getTransactions.mockRejectedValue(new Error('API Error'))

      await expect(blockModule.actions.loadAccountTransactions({ state }, 'address1')).rejects.toThrow('API Error')
    })
  })
}) 