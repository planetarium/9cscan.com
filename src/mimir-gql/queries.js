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

export const GET_TRANSACTIONS = `
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