import { gqlClient } from './client'

const mockRequest = jest.fn()

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: mockRequest
  })),
  gql: jest.fn((query) => query)
}))

describe('GraphQL Client', () => {
  beforeEach(() => {
    mockRequest.mockClear()
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getAvatarAddresses('test-address')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetAvatarAddresses')]),
        { address: 'test-address' }
      )
      expect(result).toEqual(mockData.agent.avatarAddresses)
    })

    it('should return empty array when agent is null', async () => {
      mockRequest.mockResolvedValue({ agent: null })

      const result = await gqlClient.getAvatarAddresses('test-address')

      expect(result).toEqual([])
    })

    it('should handle errors', async () => {
      const error = new Error('Network error')
      mockRequest.mockRejectedValue(error)

      await expect(gqlClient.getAvatarAddresses('test-address')).rejects.toThrow('Network error')
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getAgent('agent-address')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetAgent')]),
        { agentAddress: 'agent-address' }
      )
      expect(result).toEqual(mockData.agent)
    })
  })

  describe('getAvatarsInformation', () => {
    it('should fetch avatars information successfully', async () => {
      const mockData = {
        avatar1: { address: 'addr1', name: 'Avatar1', level: 10 },
        avatar2: { address: 'addr2', name: 'Avatar2', level: 20 },
        avatar3: { address: 'addr3', name: 'Avatar3', level: 30 }
      }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getAvatarsInformation('addr1', 'addr2', 'addr3')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetAvatarsInformation')]),
        {
          avatarAddress1: 'addr1',
          avatarAddress2: 'addr2',
          avatarAddress3: 'addr3'
        }
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('getNCG', () => {
    it('should fetch NCG balance successfully', async () => {
      const mockData = { balance: '1000' }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getNCG('test-address')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetNCG')]),
        { address: 'test-address' }
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getBlocks(0, 10)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetBlocks')]),
        { skip: 0, take: 10 }
      )
      expect(result).toEqual(mockData.blocks)
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getBlock(1)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetBlock')]),
        { index: 1 }
      )
      expect(result).toEqual(mockData.block)
    })
  })

  describe('getTransaction', () => {
    it('should fetch transaction successfully', async () => {
      const mockData = {
        transaction: {
          blockHash: 'block-hash',
          blockIndex: 1,
          firstActionTypeId: 'action-type',
          object: { id: 'tx-id', signer: 'signer' }
        }
      }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getTransaction('tx-id')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetTransaction')]),
        { txId: 'tx-id' }
      )
      expect(result).toEqual(mockData.transaction)
    })
  })

  describe('getTransactions', () => {
    it('should fetch transactions successfully', async () => {
      const mockData = {
        transactions: {
          items: [
            { id: '1', blockIndex: 1, firstActionTypeId: 'action1' },
            { id: '2', blockIndex: 2, firstActionTypeId: 'action2' }
          ],
          pageInfo: { hasNextPage: true, hasPreviousPage: false }
        }
      }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getTransactions(0, 10)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetTransactions')]),
        { skip: 0, take: 10 }
      )
      expect(result).toEqual(mockData.transactions)
    })

    it('should fetch transactions with filters', async () => {
      const mockData = {
        transactions: {
          items: [],
          pageInfo: { hasNextPage: false, hasPreviousPage: false }
        }
      }
      mockRequest.mockResolvedValue(mockData)

      const filters = {
        blockIndex: 100,
        actionTypeId: 'test-action',
        avatarAddress: 'avatar-addr',
        signer: 'signer-addr'
      }

      await gqlClient.getTransactions(0, 10, filters)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetTransactions')]),
        { skip: 0, take: 10, ...filters }
      )
    })
  })

  describe('getActionTypes', () => {
    it('should fetch action types successfully', async () => {
      const mockData = {
        actionTypes: [
          { id: 'action1' },
          { id: 'action2' },
          { id: 'action3' }
        ]
      }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getActionTypes()

      expect(mockRequest).toHaveBeenCalledWith(expect.arrayContaining([expect.stringContaining('query GetActionTypes')]))
      expect(result).toEqual(mockData.actionTypes)
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getBlocksForStats(0, 10)

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetBlocksForStats')]),
        { skip: 0, take: 10 }
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
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getWNCGPrice()

      expect(mockRequest).toHaveBeenCalledWith(expect.arrayContaining([expect.stringContaining('query GetWNCGPrice')]))
      expect(result).toEqual(mockData.wncgPrice)
    })
  })

  describe('getAvatar', () => {
    it('should fetch avatar successfully', async () => {
      const mockData = {
        avatar: {
          address: 'avatar-addr',
          name: 'TestAvatar',
          level: 50,
          agentAddress: 'agent-addr'
        },
        dailyRewardReceivedBlockIndex: 1000
      }
      mockRequest.mockResolvedValue(mockData)

      const result = await gqlClient.getAvatar('avatar-addr')

      expect(mockRequest).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('query GetAvatar')]),
        { avatarAddress: 'avatar-addr' }
      )
      expect(result).toEqual({
        avatar: mockData.avatar,
        dailyRewardReceivedBlockIndex: mockData.dailyRewardReceivedBlockIndex
      })
    })
  })
}) 