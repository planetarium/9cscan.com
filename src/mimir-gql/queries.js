export const GET_AGENT = `
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

export const GET_NCG = `
  query GetNCG($address: Address!) {
    balance(address: $address, currencyTicker: "NCG")
  }
`

export const GET_BLOCKS = `
  query GetBlocks($skip: Int!, $take: Int!, $miner: Address) {
    blocks(skip: $skip, take: $take, filter: { miner: $miner }) {
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

export const GET_BLOCK = `
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

export const GET_TRANSACTION = `
  query GetTransaction($txId: String!) {
    transaction(txId: $txId) {
      blockHash
      blockIndex
      blockTimestamp
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
        blockTimestamp
      }
      extractedActionValues {
        avatarAddress
        fungibleAssetValues
        involvedAddresses
        involvedAvatarAddresses
        sender
        typeId
        recipients {
          amount
          recipient
        }
      }
    }
  }
`

export const GET_TRANSACTIONS = `
  query GetTransactions($skip: Int!, $take: Int!, $blockIndex: Long, $actionTypeId: String) {
    transactions(
      skip: $skip
      take: $take
      filter: {
        blockIndex: $blockIndex
        actionTypeId: $actionTypeId
        includeInvolvedAddress: false
        includeInvolvedAvatarAddress: false
      }
    ) {
      items {
        blockHash
        blockIndex
        blockTimestamp
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
          blockTimestamp
        }
        extractedActionValues {
          avatarAddress
          fungibleAssetValues
          involvedAddresses
          involvedAvatarAddresses
          sender
          typeId
          recipients {
            amount
            recipient
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

export const GET_TRANSACTIONS_INCLUDE_INVOLVED_ADDRESS = `
  query GetTransactionsIncludeInvolvedAddress($skip: Int!, $take: Int!, $blockIndex: Long, $actionTypeId: String, $signer: Address) {
    transactions(
      skip: $skip
      take: $take
      filter: {
        blockIndex: $blockIndex
        signer: $signer
        actionTypeId: $actionTypeId
        includeInvolvedAddress: true
        includeInvolvedAvatarAddress: false
      }
    ) {
      items {
        blockHash
        blockIndex
        blockTimestamp
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
          blockTimestamp
        }
        extractedActionValues {
          avatarAddress
          fungibleAssetValues
          involvedAddresses
          involvedAvatarAddresses
          sender
          typeId
          recipients {
            amount
            recipient
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

export const GET_TRANSACTIONS_INCLUDE_INVOLVED_AVATAR_ADDRESS = `
  query GetTransactionsIncludeInvolvedAvatarAddress($skip: Int!, $take: Int!, $blockIndex: Long, $actionTypeId: String, $avatarAddress: Address) {
    transactions(
      skip: $skip
      take: $take
      filter: {
        blockIndex: $blockIndex
        actionTypeId: $actionTypeId
        avatarAddress: $avatarAddress
        includeInvolvedAddress: false
        includeInvolvedAvatarAddress: true
      }
    ) {
      items {
        blockHash
        blockIndex
        blockTimestamp
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
          blockTimestamp
        }
        extractedActionValues {
          avatarAddress
          fungibleAssetValues
          involvedAddresses
          involvedAvatarAddresses
          sender
          typeId
          recipients {
            amount
            recipient
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

export const GET_ACTION_TYPES = `
  query GetActionTypes {
    actionTypes {
      id
    }
  }
`

export const GET_BLOCKS_FOR_STATS = `
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

export const GET_WNCG_PRICE = `
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

export const GET_AVATAR = `
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