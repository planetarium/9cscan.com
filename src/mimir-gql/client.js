import * as queries from './queries'
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

const API_HOST = process.env.VUE_APP_API_HOST || 'http://localhost:5000/graphql'

const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(API_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
    }

    return result.data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}



export const gqlClient = {
  async getAvatarAddresses(address) {
    try {
      const data = await makeGraphQLRequest(queries.GET_AVATAR_ADDRESSES, { address })
      return data.agent?.avatarAddresses || []
    } catch (error) {
      console.error('Error fetching avatar addresses:', error)
      throw error
    }
  },

  async getAgent(agentAddress) {
    try {
      const data = await makeGraphQLRequest(queries.GET_AGENT, { agentAddress })
      return data.agent ? new AgentModel(data.agent) : null
    } catch (error) {
      console.error('Error fetching agent:', error)
      throw error
    }
  },

  async getAvatarsInformation(avatarAddress1, avatarAddress2, avatarAddress3) {
    try {
      const data = await makeGraphQLRequest(queries.GET_AVATARS_INFORMATION, {
        avatarAddress1,
        avatarAddress2,
        avatarAddress3
      })
      return {
        avatar1: data.avatar1 ? new AvatarModel(data.avatar1) : null,
        avatar2: data.avatar2 ? new AvatarModel(data.avatar2) : null,
        avatar3: data.avatar3 ? new AvatarModel(data.avatar3) : null
      }
    } catch (error) {
      console.error('Error fetching avatars information:', error)
      throw error
    }
  },

  async getNCG(address) {
    try {
      const data = await makeGraphQLRequest(queries.GET_NCG, { address })
      return data.balance
    } catch (error) {
      console.error('Error fetching NCG balance:', error)
      throw error
    }
  },

  async getBlocks(skip, take) {
    try {
      const data = await makeGraphQLRequest(queries.GET_BLOCKS, { skip, take })
      return new PaginatedResponseModel(data.blocks, BlockModel)
    } catch (error) {
      console.error('Error fetching blocks:', error)
      throw error
    }
  },

  async getBlock(index) {
    try {
      const data = await makeGraphQLRequest(queries.GET_BLOCK, { index })
      return data.block ? new BlockModel(data.block) : null
    } catch (error) {
      console.error('Error fetching block:', error)
      throw error
    }
  },

  async getTransaction(txId) {
    try {
      const data = await makeGraphQLRequest(queries.GET_TRANSACTION, { txId })
      return data.transaction ? new TransactionModel(data.transaction) : null
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  },

  async getTransactions(skip, take, filters = {}) {
    try {
      const variables = { skip, take, ...filters }
      const data = await makeGraphQLRequest(queries.GET_TRANSACTIONS, variables)
      return new PaginatedResponseModel(data.transactions, TransactionModel)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  async getActionTypes() {
    try {
      const data = await makeGraphQLRequest(queries.GET_ACTION_TYPES)
      return data.actionTypes.map(actionType => new ActionTypeModel(actionType))
    } catch (error) {
      console.error('Error fetching action types:', error)
      throw error
    }
  },

  async getBlocksForStats(skip, take) {
    try {
      const data = await makeGraphQLRequest(queries.GET_BLOCKS_FOR_STATS, { skip, take })
      return data.blocks
    } catch (error) {
      console.error('Error fetching blocks for stats:', error)
      throw error
    }
  },

  async getWNCGPrice() {
    try {
      const data = await makeGraphQLRequest(queries.GET_WNCG_PRICE)
      return new WNCGPriceModel(data.wncgPrice)
    } catch (error) {
      console.error('Error fetching WNCG price:', error)
      throw error
    }
  },

  async getAvatar(avatarAddress) {
    try {
      const data = await makeGraphQLRequest(queries.GET_AVATAR, { avatarAddress })
      return new AvatarDataModel(data)
    } catch (error) {
      console.error('Error fetching avatar:', error)
      throw error
    }
  }
}

export default gqlClient 