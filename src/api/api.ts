import { Configuration } from './gen'
import { DefaultApi } from './gen/api'

const configuration: Configuration = {
  basePath: 'http://localhost:5001', //env.API_BASE_URL,
}

export const api = new DefaultApi(configuration)
