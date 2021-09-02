import { useAppSettings } from 'features/auth/settings'

import { env } from './env'

export const WEBAPP_V1_URL = `https://${env.WEBAPP_V1_DOMAIN}`
export const WEBAPP_V2_URL = `https://${env.WEBAPP_V2_DOMAIN}`

export function useWebAppUrl(): string | undefined {
  const { data: settings } = useAppSettings()
  if (!settings) {
    return undefined
  }
  if (settings.isWebappV2Enabled) {
    return WEBAPP_V2_URL
  }
  return WEBAPP_V1_URL
}
