import { env } from 'libs/environment'

import { Configuration } from './gen'
import { DefaultApi } from './gen/api'

const configuration: Configuration = {
  basePath: env.API_BASE_URL,
}

export const api = new DefaultApi(configuration)
