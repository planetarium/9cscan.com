import { GraphQLClient } from 'graphql-request'
import { gql } from 'graphql-request'

let client

const createClient = () => {
  if (!client) {
    client = new GraphQLClient(process.env.VUE_APP_API_HOST || 'http://localhost:5000/graphql')
  }
  return client
}

const GET_AVATAR_ADDRESSES = gql`
  query GetAvatarAddresses($address: Address!) {
    agent(address: $address) {
      avatarAddresses {
        key
        value
      }
    }
  }
`

const GET_AGENT = gql`
  query GetAgent($agentAddress: Address!) {
    agent(address: $agentAddress) {
      address
      monsterCollectionRound
      version
      avatarAddresses {
        key
        value
      }
    }
  }
`

const GET_AVATARS_INFORMATION = gql`
  fragment AvatarFields on AvatarState {
    address
    name
    level
  }

  query GetAvatarsInformation(
    $avatarAddress1: Address!
    $avatarAddress2: Address!
    $avatarAddress3: Address!
  ) {
    avatar1: avatar(address: $avatarAddress1) {
      ...AvatarFields
    }

    avatar2: avatar(address: $avatarAddress2) {
      ...AvatarFields
    }
    avatar3: avatar(address: $avatarAddress3) {
      ...AvatarFields
    }
  }
`

const GET_NCG = gql`
  query GetNCG($address: Address!) {
    balance(address: $address, currencyTicker: "NCG")
  }
`

const GET_BLOCKS = gql`
  query GetBlocks($skip: Int!, $take: Int!) {
    blocks(skip: $skip, take: $take) {
      items {
        id
        object {
          hash
          index
          miner
          stateRootHash
          timestamp
          txCount
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const GET_BLOCK = gql`
  query GetBlock($index: Long!) {
    block(index: $index) {
      id
      object {
        hash
        index
        miner
        stateRootHash
        timestamp
        txCount
      }
    }
  }
`

const GET_TRANSACTION = gql`
  query GetTransaction($txId: String!) {
    transaction(txId: $txId) {
      blockHash
      blockIndex
      firstActionTypeId
      firstAvatarAddressInActionArguments
      firstNCGAmountInActionArguments
      object {
        id
        nonce
        publicKey
        signature
        signer
        timestamp
        txStatus
        updatedAddresses
        actions {
          raw
          typeId
          values
        }
      }
    }
  }
`

const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $skip: Int!
    $take: Int!
    $blockIndex: Long
    $actionTypeId: String
    $avatarAddress: Address
    $signer: Address
  ) {
    transactions(
      skip: $skip
      take: $take
      filter: {
        blockIndex: $blockIndex
        firstActionTypeId: $actionTypeId
        firstAvatarAddressInActionArguments: $avatarAddress
        signer: $signer
      }
    ) {
      items {
        blockHash
        blockIndex
        firstActionTypeId
        firstAvatarAddressInActionArguments
        firstNCGAmountInActionArguments
        id
        object {
          id
          nonce
          publicKey
          signature
          signer
          timestamp
          txStatus
          updatedAddresses
          actions {
            raw
            typeId
            values
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const GET_ACTION_TYPES = gql`
  query GetActionTypes {
    actionTypes {
      id
    }
  }
`

const GET_BLOCKS_FOR_STATS = gql`
  query GetBlocksForStats($skip: Int!, $take: Int!) {
    blocks(skip: $skip, take: $take) {
      items {
        object {
          index
          timestamp
          txCount
        }
      }
    }
  }
`

const GET_WNCG_PRICE = gql`
  query GetWNCGPrice {
    wncgPrice {
      quote {
        usd {
          marketCap
          price
          percentChange24h
        }
      }
    }
  }
`

const GET_AVATAR = gql`
  query GetAvatar($avatarAddress: Address!) {
    avatar(address: $avatarAddress) {
      address
      agentAddress
      blockIndex
      characterId
      combinationSlotAddresses
      ear
      exp
      hair
      lens
      level
      name
      rankingMapAddress
      tail
      updatedAt
      version
    }
    dailyRewardReceivedBlockIndex(address: $avatarAddress)
  }
`

export const gqlClient = {
  async getAvatarAddresses(address) {
    try {
      const data = await createClient().request(GET_AVATAR_ADDRESSES, { address })
      return data.agent?.avatarAddresses || []
    } catch (error) {
      console.error('Error fetching avatar addresses:', error)
      throw error
    }
  },

  async getAgent(agentAddress) {
    try {
      const data = await createClient().request(GET_AGENT, { agentAddress })
      return data.agent
    } catch (error) {
      console.error('Error fetching agent:', error)
      throw error
    }
  },

  async getAvatarsInformation(avatarAddress1, avatarAddress2, avatarAddress3) {
    try {
      const data = await createClient().request(GET_AVATARS_INFORMATION, {
        avatarAddress1,
        avatarAddress2,
        avatarAddress3
      })
      return {
        avatar1: data.avatar1,
        avatar2: data.avatar2,
        avatar3: data.avatar3
      }
    } catch (error) {
      console.error('Error fetching avatars information:', error)
      throw error
    }
  },

  async getNCG(address) {
    try {
      const data = await createClient().request(GET_NCG, { address })
      return data.balance
    } catch (error) {
      console.error('Error fetching NCG balance:', error)
      throw error
    }
  },

  async getBlocks(skip, take) {
    try {
      const data = await createClient().request(GET_BLOCKS, { skip, take })
      return data.blocks
    } catch (error) {
      console.error('Error fetching blocks:', error)
      throw error
    }
  },

  async getBlock(index) {
    try {
      const data = await createClient().request(GET_BLOCK, { index })
      return data.block
    } catch (error) {
      console.error('Error fetching block:', error)
      throw error
    }
  },

  async getTransaction(txId) {
    try {
      const data = await createClient().request(GET_TRANSACTION, { txId })
      return data.transaction
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  },

  async getTransactions(skip, take, filters = {}) {
    try {
      const variables = { skip, take, ...filters }
      const data = await createClient().request(GET_TRANSACTIONS, variables)
      return data.transactions
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  async getActionTypes() {
    try {
      const data = await createClient().request(GET_ACTION_TYPES)
      return data.actionTypes
    } catch (error) {
      console.error('Error fetching action types:', error)
      throw error
    }
  },

  async getBlocksForStats(skip, take) {
    try {
      const data = await createClient().request(GET_BLOCKS_FOR_STATS, { skip, take })
      return data.blocks
    } catch (error) {
      console.error('Error fetching blocks for stats:', error)
      throw error
    }
  },

  async getWNCGPrice() {
    try {
      const data = await createClient().request(GET_WNCG_PRICE)
      return data.wncgPrice
    } catch (error) {
      console.error('Error fetching WNCG price:', error)
      throw error
    }
  },

  async getAvatar(avatarAddress) {
    try {
      const data = await createClient().request(GET_AVATAR, { avatarAddress })
      return {
        avatar: data.avatar,
        dailyRewardReceivedBlockIndex: data.dailyRewardReceivedBlockIndex
      }
    } catch (error) {
      console.error('Error fetching avatar:', error)
      throw error
    }
  }
}

export default gqlClient 