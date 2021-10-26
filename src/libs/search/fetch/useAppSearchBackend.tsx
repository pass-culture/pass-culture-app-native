import { useAppSettings } from 'features/auth/settings'

export const useAppSearchBackend = () => {
  const { data: settings } = useAppSettings()
  // This is to make sure we do not have to force the update of the application
  // once we remove `useAppSearch` from the /settings endpoint.
  const isAppSearchBackend = settings?.useAppSearch ?? false

  return { enabled: !!settings, isAppSearchBackend }
}
