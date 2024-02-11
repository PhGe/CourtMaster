// client/store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    authToken: null,
    userId: null,
    username: null, // Initialize username state property
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
    clearAuthToken(state) {
      state.authToken = null;
    },
    clearUserId(state) {
      state.userId = null;
    },
    clearUsername(state) {
      state.username = null;
    },
    setAvailableTimeSlots(state, timeSlots) {
      state.availableTimeSlots = timeSlots;
      console.log('Available time slots set:', timeSlots);
    },
  },
  actions: {
    login({ commit }, { token, userId, username }) {
      commit('setAuthToken', token);
      commit('setUserId', userId);
      commit('setUsername', username); // Dispatch action to set the username
    },
    logout({ commit }) {
      commit('clearAuthToken');
      commit('clearUserId');
      commit('clearUsername'); // Dispatch action to clear the username
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
  },
});