// client/store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    authToken: null,
    userId: null, // Add userId to store user's ID
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
    },
    setUserId(state, userId) {
      state.userId = userId; // Mutation to set the user's ID
    },
    clearAuthToken(state) {
      state.authToken = null;
    },
    clearUserId(state) {
      state.userId = null; // Mutation to clear the user's ID
    },
  },
  actions: {
    login({ commit }, { token, userId }) {
      commit('setAuthToken', token);
      commit('setUserId', userId); // Dispatch action to set user ID
    },
    logout({ commit }) {
      commit('clearAuthToken');
      commit('clearUserId'); // Dispatch action to clear user ID
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.authToken,
    getUserId: (state) => state.userId, // Getter to retrieve user ID
  },
});
