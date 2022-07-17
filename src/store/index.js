import Vue from 'vue'
import Vuex from 'vuex'
import ebook from '@/store/modules/ebook'
import home from '@/store/modules/home'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ebook,
    home
  }
})
