import Vue from 'vue'
import Vuex from 'vuex'
import Station from "./modules/station.module";
import Auth from "./modules/auth.module";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toast: null
  },
  mutations: {
    setToast: (state, payload) => {
      state.toast = null
      state.toast = payload
    }
  },
  getters: {
    getToast: state => state.toast
  },
  modules: {
    Station,
    Auth
  }
})
