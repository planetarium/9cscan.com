export class WNCGPriceModel {
  constructor(data) {
    this.quote = data?.quote || {}
    this.usd = this.quote?.usd || {}
  }

  get marketCap() {
    return this.usd.marketCap || 0
  }

  get price() {
    return this.usd.price || 0
  }

  get percentChange24h() {
    return this.usd.percentChange24h || 0
  }

  toJSON() {
    return {
      quote: {
        usd: {
          marketCap: this.marketCap,
          price: this.price,
          percentChange24h: this.percentChange24h
        }
      }
    }
  }
}

export class AvatarAddressModel {
  constructor(data) {
    this.key = data?.key || ''
    this.value = data?.value || ''
  }
}

export class AgentModel {
  constructor(data) {
    this.address = data?.address || ''
    this.monsterCollectionRound = data?.monsterCollectionRound || 0
    this.version = data?.version || 0
    this.avatarAddresses = (data?.avatarAddresses || []).map(addr => new AvatarAddressModel(addr))
  }
}

export class AvatarModel {
  constructor(data) {
    this.address = data?.address || ''
    this.name = data?.name || ''
    this.level = data?.level || 0
    this.agentAddress = data?.agentAddress || ''
    this.blockIndex = data?.blockIndex || 0
    this.characterId = data?.characterId || 0
    this.combinationSlotAddresses = data?.combinationSlotAddresses || []
    this.ear = data?.ear || 0
    this.exp = data?.exp || 0
    this.hair = data?.hair || 0
    this.lens = data?.lens || 0
    this.rankingMapAddress = data?.rankingMapAddress || ''
    this.tail = data?.tail || 0
    this.updatedAt = data?.updatedAt || ''
    this.version = data?.version || 0
  }
}

export class BlockModel {
  constructor(data) {
    this.id = data?.id || ''
    this.object = data?.object ? new BlockObjectModel(data.object) : null
  }
}

export class BlockObjectModel {
  constructor(data) {
    this.hash = data?.hash || ''
    this.index = data?.index || 0
    this.miner = data?.miner || ''
    this.stateRootHash = data?.stateRootHash || ''
    this.timestamp = data?.timestamp || ''
    this.txCount = data?.txCount || 0
  }
}

export class RecipientModel {
  constructor(data) {
    this.amount = data?.amount || ''
    this.recipient = data?.recipient || ''
  }
}

export class ExtractedActionValuesModel {
  constructor(data) {
    this.avatarAddress = data?.avatarAddress || ''
    this.fungibleAssetValues = data?.fungibleAssetValues || []
    this.involvedAddresses = data?.involvedAddresses || []
    this.involvedAvatarAddresses = data?.involvedAvatarAddresses || []
    this.sender = data?.sender || ''
    this.typeId = data?.typeId || ''
    this.recipients = (data?.recipients || []).map(recipient => new RecipientModel(recipient))
  }
}

export class InvolvedModel {
  constructor(data) {
    this.type = data?.type || ''
    this.address = data?.address || ''
  }
}

export class TransactionModel {
  constructor(data) {
    this.blockHash = data?.blockHash || ''
    this.blockIndex = data?.blockIndex || 0
    this.blockTimestamp = data?.blockTimestamp || ''
    this.id = data?.id || ''
    this.object = data?.object ? new TransactionObjectModel(data.object) : null
    this.extractedActionValues = data?.extractedActionValues ? new ExtractedActionValuesModel(data.extractedActionValues) : null
    this.involved = data?.involved ? new InvolvedModel(data.involved) : null
  }
}

export class TransactionObjectModel {
  constructor(data) {
    this.id = data?.id || ''
    this.nonce = data?.nonce || 0
    this.publicKey = data?.publicKey || ''
    this.signature = data?.signature || ''
    this.signer = data?.signer || ''
    this.timestamp = data?.timestamp || ''
    this.blockTimestamp = data?.blockTimestamp || ''
    this.txStatus = data?.txStatus || ''
    this.updatedAddresses = data?.updatedAddresses || []
    this.actions = (data?.actions || []).map(action => new ActionModel(action))
  }
}

export class ActionModel {
  constructor(data) {
    this.raw = data?.raw || ''
    this.typeId = data?.typeId || ''
    this.values = data?.values || {}
  }
}

export class ActionTypeModel {
  constructor(data) {
    this.id = data?.id || ''
  }
}

export class PageInfoModel {
  constructor(data) {
    this.hasNextPage = data?.hasNextPage ? Boolean(data.hasNextPage) : false
    this.hasPreviousPage = data?.hasPreviousPage ? Boolean(data.hasPreviousPage) : false
  }
}

export class PaginatedResponseModel {
  constructor(data, itemModelClass) {
    this.items = (data?.items || []).map(item => new itemModelClass(item))
    this.pageInfo = data?.pageInfo ? new PageInfoModel(data.pageInfo) : null
  }
}

export class AvatarDataModel {
  constructor(data) {
    this.avatar = data?.avatar ? new AvatarModel(data.avatar) : null
    this.dailyRewardReceivedBlockIndex = data?.dailyRewardReceivedBlockIndex || null
  }
} 