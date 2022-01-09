import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'
import axios from 'axios'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.MAPS_API_KEY,
    libraries: 'places',
  },
})

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (401 === error.response.status) {
      store.commit(
        'setToast',
        {
          message: 'Session Expired. Please Login again.',
          type: 'red',
          show: true,
        },
        { root: true }
      )
      store.dispatch('Auth/signOut').then(() => {
        router.push('/login')
      })
    }
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
