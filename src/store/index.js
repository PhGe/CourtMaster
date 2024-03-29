// client/store.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

let API_BASE_URL = 'https://court-master-e4c0d72c16c5.herokuapp.com';

if (process.env.NODE_ENV === 'production' && process.env.API_BASE_URL) {
  API_BASE_URL = process.env.API_BASE_URL;
}

export default createStore({
  state: {
    authToken: null,
    userId: null,
    username: null,
    userrole: null,
    availableTimeSlots: [],
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
    },
    setUserId(state, userId) {
      state.userId = userId;
      console.log('Userid set in Vuex store:', userId);
    },
    setUsername(state, username) {
      state.username = username; // Set username mutation
      console.log('Username set in Vuex store:', username);
    },
    setUserrole(state, userrole) {
      state.userrole = userrole; // Set username mutation
      console.log('Username set in Vuex store:', userrole);
    },
    clearAuthToken(state) {
      state.authToken = null;
    },
    clearUserId(state) {
      state.userId = null;
    },
    clearUsername(state) {
      state.username = null;
    },
    clearUserrole(state) {
      state.userrole = null;
    },
    setAvailableTimeSlots(state, timeSlots) {
      state.availableTimeSlots = timeSlots;
      console.log('Available time slots set:', timeSlots);
    },
  },
  actions: {
    async login({ commit }, { token, userId, username }) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/role/${userId}`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        console.log(data)
        const userrole = data.role;
        console
      commit('setAuthToken', token);
      commit('setUserId', userId);
      commit('setUsername', username); // Dispatch action to set the username
      commit('setUserrole', userrole);
    } catch (error) {
      console.error('Error during login:', error);
    }
    },
    logout({ commit }) {
      commit('clearAuthToken');
      commit('clearUserId');
      commit('clearUsername'); // Dispatch action to clear the username
      commit('clearUserrole'); // Dispatch action to clear the username
    },
    updateAvailableTimeSlots({ commit }, timeSlots) {
      commit('setAvailableTimeSlots', timeSlots);
      console.log('Available time slots updated:', timeSlots);
    },
    
  },
  getters: {
    isAuthenticated: (state) => !!state.authToken,
    getUserId: (state) => state.userId,
    getUsername: (state) => state.username,
    getAvailableTimeSlots: (state) => state.availableTimeSlots,
    getUserRole: (state) => state.userrole,
  },
  plugins: [createPersistedState()],
});