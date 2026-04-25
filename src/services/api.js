import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://finance-api-huo4.onrender.com'
})