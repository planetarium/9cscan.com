import { gqlClient } from './client'
import {
  WNCGPriceModel,
  AgentModel,
  AvatarModel,
  BlockModel,
  TransactionModel,
  ActionTypeModel,
  PaginatedResponseModel,
  AvatarDataModel
} from './models'

const mockFetch = jest.fn()

global.fetch = mockFetch

jest.mock('./queries', () => ({
  GET_AGENT: 'query GetAgent',
  GET_NCG: 'query GetNCG',
  GET_BLOCKS: 'query GetBlocks',
  GET_BLOCK: 'query GetBlock',
  GET_TRANSACTION: 'query GetTransaction',
  GET_TRANSACTIONS: 'query GetTransactions',
  GET_TRANSACTIONS_INCLUDE_INVOLVED_ADDRESS: 'query GetTransactionsIncludeInvolvedAddress',
  GET_TRANSACTIONS_INCLUDE_INVOLVED_AVATAR_ADDRESS: 'query GetTransactionsIncludeInvolvedAvatarAddress',
  GET_ACTION_TYPES: 'query GetActionTypes',
  GET_BLOCKS_FOR_STATS: 'query GetBlocksForStats',
  GET_WNCG_PRICE: 'query GetWNCGPrice',
  GET_AVATAR: 'query GetAvatar',
  GET_DAILY_REWARD_RECEIVED_BLOCK_INDEX: 'query GetDailyRewardReceivedBlockIndex'
}), { virtual: true })

describe('GraphQL Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAgent', () => {
    it('should fetch agent successfully', async () => {
      const mockData = {
        agent: {
          address: 'agent-address',
          monsterCollectionRound: 1,
          version: 1
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getAgent('agent-address')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetAgent')
        })
      )
      expect(result).toBeInstanceOf(AgentModel)
      expect(result.address).toBe('agent-address')
    })

    it('should return null when agent is not found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { agent: null } })
      })

      const result = await gqlClient.getAgent('agent-address')

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(gqlClient.getAgent('agent-address')).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('getTransactionsIncludeInvolvedAddress', () => {
    it('should fetch transactions with involved address successfully', async () => {
      const mockData = {
        transactions: {
          items: [
            {
              id: 'tx1',
              blockIndex: 100,
              object: {
                signer: 'test-address',
                actions: []
              }
            }
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getTransactionsIncludeInvolvedAddress(0, 10, { signer: 'test-address' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetTransactionsIncludeInvolvedAddress')
        })
      )
      expect(result).toBeInstanceOf(PaginatedResponseModel)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toBeInstanceOf(TransactionModel)
    })

    it('should handle errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(gqlClient.getTransactionsIncludeInvolvedAddress(0, 10, { signer: 'test-address' })).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('getTransactionsIncludeInvolvedAvatarAddress', () => {
    it('should fetch transactions with involved avatar address successfully', async () => {
      const mockData = {
        transactions: {
          items: [
            {
              id: 'tx1',
              blockIndex: 100,
              object: {
                signer: 'test-address',
                actions: []
              }
            }
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getTransactionsIncludeInvolvedAvatarAddress(0, 10, { avatarAddress: 'test-avatar' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetTransactionsIncludeInvolvedAvatarAddress')
        })
      )
      expect(result).toBeInstanceOf(PaginatedResponseModel)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toBeInstanceOf(TransactionModel)
    })

    it('should handle errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(gqlClient.getTransactionsIncludeInvolvedAvatarAddress(0, 10, { avatarAddress: 'test-avatar' })).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('getNCG', () => {
    it('should fetch NCG balance successfully', async () => {
      const mockData = { balance: '1000' }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getNCG('test-address')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetNCG')
        })
      )
      expect(result).toBe('1000')
    })
  })

  describe('getBlocks', () => {
    it('should fetch blocks successfully', async () => {
      const mockData = {
        blocks: {
          items: [
            { id: '1', object: { hash: 'hash1', index: 1 } },
            { id: '2', object: { hash: 'hash2', index: 2 } }
          ],
          pageInfo: { hasNextPage: true, hasPreviousPage: false }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getBlocks(0, 10)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetBlocks')
        })
      )
      expect(result).toBeInstanceOf(PaginatedResponseModel)
    })
  })

  describe('getBlock', () => {
    it('should fetch block successfully', async () => {
      const mockData = {
        block: {
          id: '1',
          object: { hash: 'hash1', index: 1, miner: 'miner1' }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getBlock(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetBlock')
        })
      )
      expect(result).toBeInstanceOf(BlockModel)
    })
  })

  describe('getTransaction', () => {
    it('should fetch transaction successfully', async () => {
      const mockData = {
        transaction: {
          blockHash: 'hash1',
          blockIndex: 1,
          object: { id: 'tx1', nonce: 1, signer: 'signer1' }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getTransaction('tx1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetTransaction')
        })
      )
      expect(result).toBeInstanceOf(TransactionModel)
    })
  })

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockData = {
        transactions: {
          items: [
            { id: 'tx1', object: { id: 'tx1', nonce: 1 } },
            { id: 'tx2', object: { id: 'tx2', nonce: 2 } }
          ],
          pageInfo: { hasNextPage: true, hasPreviousPage: false }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getTransactions(0, 10)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetTransactions')
        })
      )
      expect(result).toBeInstanceOf(PaginatedResponseModel)
    })

    it('should fetch transactions with filters', async () => {
      const mockData = {
        transactions: {
          items: [],
          pageInfo: { hasNextPage: false, hasPreviousPage: false }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      await gqlClient.getTransactions(0, 10, { signer: 'test-signer' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test-signer')
        })
      )
    })
  })

  describe('getActionTypes', () => {
    it('should fetch action types successfully', async () => {
      const mockData = {
        actionTypes: [
          { id: 'action1' },
          { id: 'action2' }
        ]
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getActionTypes()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetActionTypes')
        })
      )
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(ActionTypeModel)
    })
  })

  describe('getBlocksForStats', () => {
    it('should fetch blocks for stats successfully', async () => {
      const mockData = {
        blocks: {
          items: [
            { object: { index: 1, timestamp: '2023-01-01', txCount: 10 } },
            { object: { index: 2, timestamp: '2023-01-02', txCount: 15 } }
          ]
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getBlocksForStats(0, 10)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetBlocksForStats')
        })
      )
      expect(result).toEqual(mockData.blocks)
    })
  })

  describe('getWNCGPrice', () => {
    it('should fetch WNCG price successfully', async () => {
      const mockData = {
        wncgPrice: {
          quote: {
            usd: {
              marketCap: 1000000,
              price: 1.5,
              percentChange24h: 5.2
            }
          }
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getWNCGPrice()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetWNCGPrice')
        })
      )
      expect(result).toBeInstanceOf(WNCGPriceModel)
      expect(result.marketCap).toBe(1000000)
      expect(result.price).toBe(1.5)
      expect(result.percentChange24h).toBe(5.2)
    })

    it('should handle GraphQL errors', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          errors: [{ message: 'GraphQL error' }]
        })
      })

      await expect(gqlClient.getWNCGPrice()).rejects.toThrow('GraphQL errors: [{"message":"GraphQL error"}]')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(gqlClient.getWNCGPrice()).rejects.toThrow('Network error')
    })
  })

  describe('getAvatar', () => {
    it('should fetch avatar successfully', async () => {
      const mockData = {
        avatar: {
          address: 'avatar-address',
          name: 'Test Avatar',
          level: 10
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getAvatar('avatar-address')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetAvatar')
        })
      )
      expect(result).toBeInstanceOf(AvatarDataModel)
    })
  })

  describe('getDailyRewardReceivedBlockIndex', () => {
    it('should fetch daily reward received block index successfully', async () => {
      const mockData = {
        dailyRewardReceivedBlockIndex: 1000
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getDailyRewardReceivedBlockIndex('avatar-address')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetDailyRewardReceivedBlockIndex')
        })
      )
      expect(result).toBe(1000)
    })

    it('should return null when daily reward received block index is not available', async () => {
      const mockData = {
        dailyRewardReceivedBlockIndex: null
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getDailyRewardReceivedBlockIndex('avatar-address')

      expect(result).toBeNull()
    })

    it('should return null when network error occurs', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await gqlClient.getDailyRewardReceivedBlockIndex('avatar-address')

      expect(result).toBeNull()
    })
  })
}) 