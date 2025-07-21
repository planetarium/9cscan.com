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
  GET_AVATAR_ADDRESSES: 'query GetAvatarAddresses',
  GET_AGENT: 'query GetAgent',
  GET_AVATARS_INFORMATION: 'query GetAvatarsInformation',
  GET_NCG: 'query GetNCG',
  GET_BLOCKS: 'query GetBlocks',
  GET_BLOCK: 'query GetBlock',
  GET_TRANSACTION: 'query GetTransaction',
  GET_TRANSACTIONS: 'query GetTransactions',
  GET_ACTION_TYPES: 'query GetActionTypes',
  GET_BLOCKS_FOR_STATS: 'query GetBlocksForStats',
  GET_WNCG_PRICE: 'query GetWNCGPrice',
  GET_AVATAR: 'query GetAvatar'
}), { virtual: true })

describe('GraphQL Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAvatarAddresses', () => {
    it('should fetch avatar addresses successfully', async () => {
      const mockData = {
        agent: {
          avatarAddresses: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' }
          ]
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getAvatarAddresses('test-address')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetAvatarAddresses')
        })
      )
      expect(result).toEqual(mockData.agent.avatarAddresses)
    })

    it('should return empty array when agent is null', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { agent: null } })
      })

      const result = await gqlClient.getAvatarAddresses('test-address')

      expect(result).toEqual([])
    })

    it('should handle errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(gqlClient.getAvatarAddresses('test-address')).rejects.toThrow('HTTP error! status: 500')
    })
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
  })

  describe('getAvatarsInformation', () => {
    it('should fetch avatars information successfully', async () => {
      const mockData = {
        avatar1: { address: 'addr1', name: 'Avatar1', level: 10 },
        avatar2: { address: 'addr2', name: 'Avatar2', level: 20 },
        avatar3: { address: 'addr3', name: 'Avatar3', level: 30 }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockData })
      })

      const result = await gqlClient.getAvatarsInformation('addr1', 'addr2', 'addr3')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('query GetAvatarsInformation')
        })
      )
      expect(result.avatar1).toBeInstanceOf(AvatarModel)
      expect(result.avatar2).toBeInstanceOf(AvatarModel)
      expect(result.avatar3).toBeInstanceOf(AvatarModel)
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
        },
        dailyRewardReceivedBlockIndex: 1000
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
}) 