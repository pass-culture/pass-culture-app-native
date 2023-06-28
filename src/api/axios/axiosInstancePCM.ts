import axios from 'axios'
import { env } from 'libs/environment'

export const axiosInstancePCM = axios.create({
  baseURL: env.PCM_API_BASE_URL,
  headers: {
    Accept: '*/*',
  },
})
