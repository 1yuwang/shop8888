import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
export function request() {
  axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/"
  })
}
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')  
  return config
})