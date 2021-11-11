import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import { ElIcon } from 'element-plus'
import './assets/fonts/iconfont.css'
import axios from 'axios'


const app =  createApp(App)
app.config.globalProperties.$http = axios;
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')  
  return config
})

app.use(router)
app.use(ElementPlus)
// app.use(ElIcon)

app.mount('#app')

