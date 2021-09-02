import { useWebAppUrl as actualUseWebAppUrl } from '../useWebAppUrl'

import { env } from './envFixtures'

export const useWebAppUrl: typeof actualUseWebAppUrl = () => `https://${env.WEBAPP_V1_DOMAIN}`
