import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: false,
    };
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});
