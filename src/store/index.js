// client/store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    authToken: null,
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
    },
    clearAuthToken(state) {
      state.authToken = null;
    },
  },
  actions: {
    // You can add actions for login, logout, etc.
  },
  getters: {
    isAuthenticated: (state) => !!state.authToken,
  },
});
