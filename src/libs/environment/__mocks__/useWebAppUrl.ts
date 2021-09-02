import { useWebAppUrl as actualUseWebAppUrl } from '../useWebAppUrl'

import { env } from './envFixtures'

export const useWebAppUrl: typeof actualUseWebAppUrl = () => env.WEBAPP_URL

export const WEBAPP_V2_URL = `https://${env.WEBAPP_V2_DOMAIN}`
