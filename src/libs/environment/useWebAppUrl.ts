import { useAppSettings } from 'features/auth/settings'

import { env } from './env'

export function useWebAppUrl(): string | undefined {
  const { data: settings } = useAppSettings()
  if (!settings) {
    return undefined
  }
  if (settings.isWebappV2Enabled) {
    return `https://${env.WEBAPP_V2_DOMAIN}`
  }
  return env.WEBAPP_URL
}
