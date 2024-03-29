import { useCallback, useEffect, useState } from 'react'
import { checkNotifications, PermissionStatus } from 'react-native-permissions'

import { useAppStateChange } from 'libs/appState'

export const usePushPermission = (
  updatePushPermissionFromSettings?: (permission: PermissionStatus) => void
) => {
  const [pushPermission, setPushPermission] = useState<PermissionStatus | undefined>(undefined)

  const refreshPermission = useCallback(async () => {
    const permission = await checkNotifications()
    setPushPermission(permission.status)
    return permission.status
  }, [])

  useEffect(() => {
    refreshPermission()
  }, [refreshPermission])

  useAppStateChange(
    async () => {
      const permission = await refreshPermission()
      updatePushPermissionFromSettings && updatePushPermissionFromSettings(permission)
    },
    () => undefined
  )

  return {
    pushPermission,
    refreshPermission,
  }
}
