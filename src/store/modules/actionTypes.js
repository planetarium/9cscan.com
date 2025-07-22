import { gqlClient } from '../../mimir-gql/client'

const state = {
  actionTypes: [],
  loading: false,
  error: null
}

const mutations = {
  setActionTypes(state, actionTypes) {
    state.actionTypes = actionTypes
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  }
}

const actions = {
  async initActionTypes({ commit, dispatch }) {
    commit('setLoading', true)
    commit('setError', null)
    
    try {
      const actionTypes = await gqlClient.getActionTypes()
      commit('setActionTypes', actionTypes)
    } catch (error) {
      console.error('Failed to load action types:', error)
      commit('setActionTypes', [])
      commit('setError', error)
    } finally {
      commit('setLoading', false)
    }
  }
}

const getters = {
  actionTypes: state => state.actionTypes,
  actionTypeIds: state => state.actionTypes.map(actionType => actionType.id),
  isLoading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 