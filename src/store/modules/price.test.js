import priceModule from './price'
import { gqlClient } from '../../mimir-gql/client'
import { WNCGPriceModel } from '../../mimir-gql/models'

jest.mock('../../mimir-gql/client', () => ({
  gqlClient: {
    getWNCGPrice: jest.fn()
  }
}))

describe('Price Store Module', () => {
  let state
  let commit
  let dispatch

  beforeEach(() => {
    state = priceModule.state()
    commit = jest.fn()
    dispatch = jest.fn()
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('state', () => {
    it('should have initial WNCG state', () => {
      expect(state.WNCG).toEqual({})
    })
  })

  describe('mutations', () => {
    it('should set WNCG data', () => {
      const mockData = new WNCGPriceModel({
        quote: {
          usd: {
            marketCap: 1000000,
            price: 1.5,
            percentChange24h: 5.2
          }
        }
      })
      
      priceModule.mutations.setWNCG(state, mockData)
      expect(state.WNCG).toEqual(mockData)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state.WNCG = new WNCGPriceModel({
        quote: {
          usd: {
            marketCap: 1000000,
            price: 1.5,
            percentChange24h: 5.2
          }
        }
      })
    })

    it('should return WNCG data', () => {
      const result = priceModule.getters.WNCG(state)
      expect(result).toEqual(state.WNCG)
    })

    it('should return market cap', () => {
      const result = priceModule.getters.WncgMarketCap(state)
      expect(result).toBe(1000000)
    })

    it('should return price', () => {
      const result = priceModule.getters.WncgPrice(state)
      expect(result).toBe(1.5)
    })

    it('should return 24h change', () => {
      const result = priceModule.getters.WncgChange24h(state)
      expect(result).toBe(5.2)
    })

    it('should return 0 when data is missing', () => {
      state.WNCG = new WNCGPriceModel({})
      
      expect(priceModule.getters.WncgMarketCap(state)).toBe(0)
      expect(priceModule.getters.WncgPrice(state)).toBe(0)
      expect(priceModule.getters.WncgChange24h(state)).toBe(0)
    })

    it('should return 0 when quote is missing', () => {
      state.WNCG = new WNCGPriceModel({ quote: null })
      
      expect(priceModule.getters.WncgMarketCap(state)).toBe(0)
      expect(priceModule.getters.WncgPrice(state)).toBe(0)
      expect(priceModule.getters.WncgChange24h(state)).toBe(0)
    })

    it('should return 0 when usd is missing', () => {
      state.WNCG = new WNCGPriceModel({ quote: { usd: null } })
      
      expect(priceModule.getters.WncgMarketCap(state)).toBe(0)
      expect(priceModule.getters.WncgPrice(state)).toBe(0)
      expect(priceModule.getters.WncgChange24h(state)).toBe(0)
    })
  })

  describe('actions', () => {
    it('should fetch WNCG price and commit data', async () => {
      const mockData = new WNCGPriceModel({
        quote: {
          usd: {
            marketCap: 1000000,
            price: 1.5,
            percentChange24h: 5.2
          }
        }
      })
      
      gqlClient.getWNCGPrice.mockResolvedValue(mockData)

      await priceModule.actions.init({ state, commit, dispatch })

      expect(gqlClient.getWNCGPrice).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('setWNCG', mockData)
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error')
      gqlClient.getWNCGPrice.mockRejectedValue(error)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await priceModule.actions.init({ state, commit, dispatch })

      expect(gqlClient.getWNCGPrice).toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch WNCG price:', error)

      consoleSpy.mockRestore()
    })

    it('should schedule next update after 60 seconds', async () => {
      gqlClient.getWNCGPrice.mockResolvedValue(new WNCGPriceModel({}))

      await priceModule.actions.init({ state, commit, dispatch })

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60000)

      const setTimeoutCallback = setTimeout.mock.calls[0][0]
      setTimeoutCallback()

      expect(dispatch).toHaveBeenCalledWith('init')
    })
  })
}) 