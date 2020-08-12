import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/global.css'
Vue.prototype.axios = axios
// http://119.23.53.78:8888/api/private/v1/login?username=admin&password=123456
// http://timemeetyou.com:8889/api/private/v1/
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})
Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
