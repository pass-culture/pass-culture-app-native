import { parseEnvironment } from 'libs/environment/parseEnvironment'
import { Environment } from 'libs/environment/schema'

export const env: Environment = parseEnvironment({
  ...process.env,
  API_BASE_URL: '',
})
