import Vue from 'vue'
import Vuex from 'vuex'
import actionTypes from './actionTypes'

Vue.use(Vuex)

jest.mock('../../mimir-gql/client', () => ({
  gqlClient: {
    getActionTypes: jest.fn()
  }
}))

import { gqlClient } from '../../mimir-gql/client'

describe('ActionTypes Store Module', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ActionTypes: actionTypes
      }
    })
    jest.clearAllMocks()
  })

  describe('State', () => {
    test('should have initial state', () => {
      expect(store.state.ActionTypes.actionTypes).toEqual([])
      expect(store.state.ActionTypes.loading).toBe(false)
      expect(store.state.ActionTypes.error).toBe(null)
    })
  })

  describe('Mutations', () => {
    test('setActionTypes should update actionTypes', () => {
      const actionTypes = [{ id: 'action1' }, { id: 'action2' }]
      store.commit('ActionTypes/setActionTypes', actionTypes)
      expect(store.state.ActionTypes.actionTypes).toEqual(actionTypes)
    })

    test('setLoading should update loading state', () => {
      store.commit('ActionTypes/setLoading', true)
      expect(store.state.ActionTypes.loading).toBe(true)
    })

    test('setError should update error state', () => {
      const error = new Error('Test error')
      store.commit('ActionTypes/setError', error)
      expect(store.state.ActionTypes.error).toBe(error)
    })
  })

  describe('Actions', () => {
    test('initActionTypes should load action types successfully', async () => {
      const mockActionTypes = [
        { id: 'action1' },
        { id: 'action2' },
        { id: 'action3' }
      ]
      gqlClient.getActionTypes.mockResolvedValue(mockActionTypes)

      await store.dispatch('ActionTypes/initActionTypes')

      expect(gqlClient.getActionTypes).toHaveBeenCalledTimes(1)
      expect(store.state.ActionTypes.actionTypes).toEqual(mockActionTypes)
      expect(store.state.ActionTypes.loading).toBe(false)
      expect(store.state.ActionTypes.error).toBe(null)
    })

    test('initActionTypes should handle errors', async () => {
      const error = new Error('API Error')
      gqlClient.getActionTypes.mockRejectedValue(error)

      await store.dispatch('ActionTypes/initActionTypes')

      expect(gqlClient.getActionTypes).toHaveBeenCalledTimes(1)
      expect(store.state.ActionTypes.actionTypes).toEqual([])
      expect(store.state.ActionTypes.loading).toBe(false)
      expect(store.state.ActionTypes.error).toBe(error)
    })
  })

  describe('Getters', () => {
    test('actionTypes should return action types', () => {
      const actionTypes = [{ id: 'action1' }, { id: 'action2' }]
      store.commit('ActionTypes/setActionTypes', actionTypes)
      expect(store.getters['ActionTypes/actionTypes']).toEqual(actionTypes)
    })

    test('actionTypeIds should return action type IDs', () => {
      const actionTypes = [{ id: 'action1' }, { id: 'action2' }]
      store.commit('ActionTypes/setActionTypes', actionTypes)
      expect(store.getters['ActionTypes/actionTypeIds']).toEqual(['action1', 'action2'])
    })

    test('isLoading should return loading state', () => {
      store.commit('ActionTypes/setLoading', true)
      expect(store.getters['ActionTypes/isLoading']).toBe(true)
    })

    test('error should return error state', () => {
      const error = new Error('Test error')
      store.commit('ActionTypes/setError', error)
      expect(store.getters['ActionTypes/error']).toBe(error)
    })
  })
}) 