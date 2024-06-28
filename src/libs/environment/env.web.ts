import { parseEnvironment } from 'libs/environment/parseEnvironment'
import { Environment } from 'libs/environment/schema'

export const env: Environment = parseEnvironment({
  ...process.env,
  // API_BASE_URL: __DEV__ ? '' : (process.env.API_BASE_URL as string),
  API_BASE_URL: '',
})
