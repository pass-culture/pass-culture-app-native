import { useAppSettings } from 'features/auth/settings'

export const useAppSearchBackend = () => {
  const { data: settings } = useAppSettings()
  // This is to make sure we do not have to force the update of the application
  // once we remove `useAppSearch` from the /settings endpoint. By that time,
  // App Search will be the default search backend
  const isAppSearchBackend = settings?.useAppSearch ?? true

  return { enabled: !!settings, isAppSearchBackend }
}
