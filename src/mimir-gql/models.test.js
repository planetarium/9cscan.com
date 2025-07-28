import {
  WNCGPriceModel,
  AvatarAddressModel,
  AgentModel,
  AvatarModel,
  BlockModel,
  BlockObjectModel,
  TransactionModel,
  TransactionObjectModel,
  ActionModel,
  ActionTypeModel,
  PageInfoModel,
  PaginatedResponseModel,
  AvatarDataModel,
  RecipientModel,
  ExtractedActionValuesModel,
  InvolvedModel
} from './models'

describe('WNCGPriceModel', () => {
  it('should create WNCGPriceModel with valid data', () => {
    const data = {
      quote: {
        usd: {
          marketCap: 1000000,
          price: 1.5,
          percentChange24h: 5.2
        }
      }
    }
    
    const model = new WNCGPriceModel(data)
    
    expect(model.marketCap).toBe(1000000)
    expect(model.price).toBe(1.5)
    expect(model.percentChange24h).toBe(5.2)
  })

  it('should handle missing data gracefully', () => {
    const model = new WNCGPriceModel({})
    
    expect(model.marketCap).toBe(0)
    expect(model.price).toBe(0)
    expect(model.percentChange24h).toBe(0)
  })

  it('should handle null data gracefully', () => {
    const model = new WNCGPriceModel(null)
    
    expect(model.marketCap).toBe(0)
    expect(model.price).toBe(0)
    expect(model.percentChange24h).toBe(0)
  })

  it('should return correct JSON structure', () => {
    const data = {
      quote: {
        usd: {
          marketCap: 1000000,
          price: 1.5,
          percentChange24h: 5.2
        }
      }
    }
    
    const model = new WNCGPriceModel(data)
    const json = model.toJSON()
    
    expect(json).toEqual({
      quote: {
        usd: {
          marketCap: 1000000,
          price: 1.5,
          percentChange24h: 5.2
        }
      }
    })
  })
})

describe('AvatarAddressModel', () => {
  it('should create AvatarAddressModel with valid data', () => {
    const data = { key: 'test-key', value: 'test-value' }
    const model = new AvatarAddressModel(data)
    
    expect(model.key).toBe('test-key')
    expect(model.value).toBe('test-value')
  })

  it('should handle missing data gracefully', () => {
    const model = new AvatarAddressModel({})
    
    expect(model.key).toBe('')
    expect(model.value).toBe('')
  })
})

describe('AgentModel', () => {
  it('should create AgentModel with valid data', () => {
    const data = {
      address: 'agent-address',
      monsterCollectionRound: 1,
      version: 2,
      avatarAddresses: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ]
    }
    
    const model = new AgentModel(data)
    
    expect(model.address).toBe('agent-address')
    expect(model.monsterCollectionRound).toBe(1)
    expect(model.version).toBe(2)
    expect(model.avatarAddresses).toHaveLength(2)
    expect(model.avatarAddresses[0]).toBeInstanceOf(AvatarAddressModel)
    expect(model.avatarAddresses[1]).toBeInstanceOf(AvatarAddressModel)
  })

  it('should handle missing data gracefully', () => {
    const model = new AgentModel({})
    
    expect(model.address).toBe('')
    expect(model.monsterCollectionRound).toBe(0)
    expect(model.version).toBe(0)
    expect(model.avatarAddresses).toEqual([])
  })
})

describe('AvatarModel', () => {
  it('should create AvatarModel with valid data', () => {
    const data = {
      address: 'avatar-address',
      name: 'TestAvatar',
      level: 50,
      agentAddress: 'agent-address',
      blockIndex: 1000,
      characterId: 1,
      combinationSlotAddresses: ['slot1', 'slot2'],
      ear: 1,
      exp: 1000,
      hair: 2,
      lens: 3,
      rankingMapAddress: 'ranking-address',
      tail: 4,
      updatedAt: '2023-01-01',
      version: 1
    }
    
    const model = new AvatarModel(data)
    
    expect(model.address).toBe('avatar-address')
    expect(model.name).toBe('TestAvatar')
    expect(model.level).toBe(50)
    expect(model.agentAddress).toBe('agent-address')
    expect(model.blockIndex).toBe(1000)
    expect(model.characterId).toBe(1)
    expect(model.combinationSlotAddresses).toEqual(['slot1', 'slot2'])
    expect(model.ear).toBe(1)
    expect(model.exp).toBe(1000)
    expect(model.hair).toBe(2)
    expect(model.lens).toBe(3)
    expect(model.rankingMapAddress).toBe('ranking-address')
    expect(model.tail).toBe(4)
    expect(model.updatedAt).toBe('2023-01-01')
    expect(model.version).toBe(1)
  })

  it('should handle missing data gracefully', () => {
    const model = new AvatarModel({})
    
    expect(model.address).toBe('')
    expect(model.name).toBe('')
    expect(model.level).toBe(0)
    expect(model.combinationSlotAddresses).toEqual([])
  })
})

describe('BlockObjectModel', () => {
  it('should create BlockObjectModel with valid data', () => {
    const data = {
      hash: 'block-hash',
      index: 1000,
      miner: 'miner-address',
      stateRootHash: 'state-root-hash',
      timestamp: '2023-01-01T00:00:00Z',
      txCount: 10
    }
    
    const model = new BlockObjectModel(data)
    
    expect(model.hash).toBe('block-hash')
    expect(model.index).toBe(1000)
    expect(model.miner).toBe('miner-address')
    expect(model.stateRootHash).toBe('state-root-hash')
    expect(model.timestamp).toBe('2023-01-01T00:00:00Z')
    expect(model.txCount).toBe(10)
  })
})

describe('BlockModel', () => {
  it('should create BlockModel with valid data', () => {
    const data = {
      id: 'block-id',
      object: {
        hash: 'block-hash',
        index: 1000,
        miner: 'miner-address'
      }
    }
    
    const model = new BlockModel(data)
    
    expect(model.id).toBe('block-id')
    expect(model.object).toBeInstanceOf(BlockObjectModel)
    expect(model.object.hash).toBe('block-hash')
  })

  it('should handle missing object gracefully', () => {
    const model = new BlockModel({ id: 'block-id' })
    
    expect(model.id).toBe('block-id')
    expect(model.object).toBeNull()
  })
})

describe('ActionModel', () => {
  it('should create ActionModel with valid data', () => {
    const data = {
      raw: 'raw-action-data',
      typeId: 'action-type-id',
      values: { key1: 'value1', key2: 'value2' }
    }
    
    const model = new ActionModel(data)
    
    expect(model.raw).toBe('raw-action-data')
    expect(model.typeId).toBe('action-type-id')
    expect(model.values).toEqual({ key1: 'value1', key2: 'value2' })
  })
})

describe('TransactionObjectModel', () => {
  it('should create TransactionObjectModel with valid data', () => {
    const data = {
      id: 'tx-id',
      nonce: 1,
      publicKey: 'public-key',
      signature: 'signature',
      signer: 'signer-address',
      timestamp: '2023-01-01T00:00:00Z',
      txStatus: 'SUCCESS',
      updatedAddresses: ['addr1', 'addr2'],
      actions: [
        { raw: 'action1', typeId: 'type1', values: {} },
        { raw: 'action2', typeId: 'type2', values: {} }
      ]
    }
    
    const model = new TransactionObjectModel(data)
    
    expect(model.id).toBe('tx-id')
    expect(model.nonce).toBe(1)
    expect(model.publicKey).toBe('public-key')
    expect(model.signature).toBe('signature')
    expect(model.signer).toBe('signer-address')
    expect(model.timestamp).toBe('2023-01-01T00:00:00Z')
    expect(model.txStatus).toBe('SUCCESS')
    expect(model.updatedAddresses).toEqual(['addr1', 'addr2'])
    expect(model.actions).toHaveLength(2)
    expect(model.actions[0]).toBeInstanceOf(ActionModel)
    expect(model.actions[1]).toBeInstanceOf(ActionModel)
  })
})

describe('TransactionModel', () => {
  it('should create TransactionModel with valid data', () => {
    const data = {
      blockHash: 'block-hash',
      blockIndex: 1000,
      blockTimestamp: '2023-01-01T00:00:00Z',
      id: 'tx-id',
      object: {
        id: 'tx-id',
        signer: 'signer-address'
      },
      extractedActionValues: {
        avatarAddress: 'avatar-address',
        sender: 'sender-address',
        typeId: 'action-type'
      },
      involved: {
        type: 'SIGNED',
        address: 'test-address'
      }
    }
    
    const model = new TransactionModel(data)
    
    expect(model.blockHash).toBe('block-hash')
    expect(model.blockIndex).toBe(1000)
    expect(model.blockTimestamp).toBe('2023-01-01T00:00:00Z')
    expect(model.id).toBe('tx-id')
    expect(model.object).toBeInstanceOf(TransactionObjectModel)
    expect(model.extractedActionValues).toBeInstanceOf(ExtractedActionValuesModel)
    expect(model.involved).toBeInstanceOf(InvolvedModel)
  })

  it('should handle missing extractedActionValues and involved gracefully', () => {
    const data = {
      blockHash: 'block-hash',
      blockIndex: 1000,
      id: 'tx-id',
      object: {
        id: 'tx-id',
        signer: 'signer-address'
      }
    }
    
    const model = new TransactionModel(data)
    
    expect(model.blockHash).toBe('block-hash')
    expect(model.blockIndex).toBe(1000)
    expect(model.id).toBe('tx-id')
    expect(model.object).toBeInstanceOf(TransactionObjectModel)
    expect(model.extractedActionValues).toBeNull()
    expect(model.involved).toBeNull()
  })
})

describe('ActionTypeModel', () => {
  it('should create ActionTypeModel with valid data', () => {
    const data = { id: 'action-type-id' }
    const model = new ActionTypeModel(data)
    
    expect(model.id).toBe('action-type-id')
  })

  it('should handle missing data gracefully', () => {
    const model = new ActionTypeModel({})
    
    expect(model.id).toBe('')
  })
})

describe('PageInfoModel', () => {
  it('should create PageInfoModel with valid data', () => {
    const data = {
      hasNextPage: true,
      hasPreviousPage: false
    }
    
    const model = new PageInfoModel(data)
    
    expect(model.hasNextPage).toBe(true)
    expect(model.hasPreviousPage).toBe(false)
  })

  it('should handle missing data gracefully', () => {
    const model = new PageInfoModel({})
    
    expect(model.hasNextPage).toBe(false)
    expect(model.hasPreviousPage).toBe(false)
  })
})

describe('PaginatedResponseModel', () => {
  it('should create PaginatedResponseModel with valid data', () => {
    const data = {
      items: [
        { id: '1', name: 'Item1' },
        { id: '2', name: 'Item2' }
      ],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false
      }
    }
    
    const model = new PaginatedResponseModel(data, AvatarModel)
    
    expect(model.items).toHaveLength(2)
    expect(model.items[0]).toBeInstanceOf(AvatarModel)
    expect(model.items[1]).toBeInstanceOf(AvatarModel)
    expect(model.pageInfo).toBeInstanceOf(PageInfoModel)
    expect(model.pageInfo.hasNextPage).toBe(true)
  })

  it('should handle missing data gracefully', () => {
    const model = new PaginatedResponseModel({}, AvatarModel)
    
    expect(model.items).toEqual([])
    expect(model.pageInfo).toBeNull()
  })
})

describe('AvatarDataModel', () => {
  it('should create AvatarDataModel with valid data', () => {
    const data = {
      avatar: {
        address: 'avatar-address',
        name: 'TestAvatar',
        level: 50
      },
      dailyRewardReceivedBlockIndex: 1000
    }
    
    const model = new AvatarDataModel(data)
    
    expect(model.avatar).toBeInstanceOf(AvatarModel)
    expect(model.avatar.address).toBe('avatar-address')
    expect(model.dailyRewardReceivedBlockIndex).toBe(1000)
  })

  it('should handle missing avatar gracefully', () => {
    const model = new AvatarDataModel({ dailyRewardReceivedBlockIndex: 1000 })
    
    expect(model.avatar).toBeNull()
    expect(model.dailyRewardReceivedBlockIndex).toBe(1000)
  })

  it('should handle missing data gracefully', () => {
    const model = new AvatarDataModel({})
    
    expect(model.avatar).toBeNull()
    expect(model.dailyRewardReceivedBlockIndex).toBe(0)
  })
}) 

describe('RecipientModel', () => {
  it('should create RecipientModel with valid data', () => {
    const data = { amount: '100', recipient: 'test-recipient' }
    const model = new RecipientModel(data)
    
    expect(model.amount).toBe('100')
    expect(model.recipient).toBe('test-recipient')
  })

  it('should handle missing data gracefully', () => {
    const model = new RecipientModel({})
    
    expect(model.amount).toBe('')
    expect(model.recipient).toBe('')
  })
})

describe('ExtractedActionValuesModel', () => {
  it('should create ExtractedActionValuesModel with valid data', () => {
    const data = {
      avatarAddress: 'avatar-address',
      fungibleAssetValues: ['asset1', 'asset2'],
      involvedAddresses: ['addr1', 'addr2'],
      involvedAvatarAddresses: ['avatar1', 'avatar2'],
      sender: 'sender-address',
      typeId: 'action-type',
      recipients: [
        { amount: '100', recipient: 'recipient1' },
        { amount: '200', recipient: 'recipient2' }
      ]
    }
    const model = new ExtractedActionValuesModel(data)
    
    expect(model.avatarAddress).toBe('avatar-address')
    expect(model.fungibleAssetValues).toEqual(['asset1', 'asset2'])
    expect(model.involvedAddresses).toEqual(['addr1', 'addr2'])
    expect(model.involvedAvatarAddresses).toEqual(['avatar1', 'avatar2'])
    expect(model.sender).toBe('sender-address')
    expect(model.typeId).toBe('action-type')
    expect(model.recipients).toHaveLength(2)
    expect(model.recipients[0]).toBeInstanceOf(RecipientModel)
    expect(model.recipients[1]).toBeInstanceOf(RecipientModel)
  })

  it('should handle missing data gracefully', () => {
    const model = new ExtractedActionValuesModel({})
    
    expect(model.avatarAddress).toBe('')
    expect(model.fungibleAssetValues).toEqual([])
    expect(model.involvedAddresses).toEqual([])
    expect(model.involvedAvatarAddresses).toEqual([])
    expect(model.sender).toBe('')
    expect(model.typeId).toBe('')
    expect(model.recipients).toEqual([])
  })
})

describe('InvolvedModel', () => {
  it('should create InvolvedModel with valid data', () => {
    const data = { type: 'SIGNED', address: 'test-address' }
    const model = new InvolvedModel(data)
    
    expect(model.type).toBe('SIGNED')
    expect(model.address).toBe('test-address')
  })

  it('should handle missing data gracefully', () => {
    const model = new InvolvedModel({})
    
    expect(model.type).toBe('')
    expect(model.address).toBe('')
  })
}) 