import { env } from './envFixtures'
import { useWebAppUrl as actualUseWebAppUrl } from '../useWebAppUrl'

export const useWebAppUrl: typeof actualUseWebAppUrl = () => env.WEBAPP_URL
