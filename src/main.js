import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/lang'
import '@/assets/styles/icon.css'
// import './mock';
import './utils/boost';
import './utils/create-api';
import VueLazyload from 'vue-lazyload'
Vue.config.productionTip = false

// 配置项
Vue.use(VueLazyload, {
  preLoad: 1,
  // loading: 'dist/loading.gif',
  attempt: 1
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
