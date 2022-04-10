import Vue from 'vue'
import Vuex from 'vuex'
import ebook from '@/store/modules/ebook'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ebook
  }
})
