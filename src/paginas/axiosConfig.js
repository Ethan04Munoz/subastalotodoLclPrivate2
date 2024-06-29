import axios from 'axios'

const instance = axios.create({
  //baseURL: 'https://subastalotodoback-production.up.railway.app',
  //baseURL: 'https://fluent-radar-408018.uw.r.appspot.com',
  //baseURL: 'http://localhost:4000',
  withCredentials: true
})

export default instance
