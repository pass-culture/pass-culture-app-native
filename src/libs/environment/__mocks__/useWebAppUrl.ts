import { useWebAppUrl as actualUseWebAppUrl } from '../useWebAppUrl'

import { env } from './envFixtures'

export const useWebAppUrl: typeof actualUseWebAppUrl = () => env.WEBAPP_URL
