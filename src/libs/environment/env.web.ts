import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'
import { Environment } from 'libs/environment/schema'

export const env: Environment = parseBooleanVariables({
  ...process.env,
  API_BASE_URL: __DEV__ ? '' : (process.env.API_BASE_URL as string),
})
