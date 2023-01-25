import React, { memo, useCallback, useContext, useMemo } from 'react'
import { Platform } from 'react-native'
import { checkNotifications, RESULTS } from 'react-native-permissions'

import { AskNotificiationsModal } from 'features/notifications/pages/AskNotificationsModal'
import { storage } from 'libs/storage'
import { useModal } from 'ui/components/modals/useModal'

interface PushNotificationsContextValue {
  isPushNotificationsModalVisible: boolean
  showPushNotificationsModalForFirstTime: () => Promise<void>
}

const PushNotificationsContext = React.createContext<PushNotificationsContextValue>({
  isPushNotificationsModalVisible: false,
  showPushNotificationsModalForFirstTime: async () => {
    return
  },
})

const PUSH_NOTIFICATIONS_STORAGE_KEY = 'has_seen_push_notifications_modal_once'

export const PushNotificationsWrapper = memo(function PushNotificationsWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const {
    visible: isPushNotificationsModalVisible,
    showModal: showPushNotificationsModal,
    hideModal: hidePushNotificationsModal,
  } = useModal(false)

  const showPushNotificationsModalForFirstTime = useCallback(async () => {
    const firstTime = !(await storage.readObject(PUSH_NOTIFICATIONS_STORAGE_KEY))
    const permissionNotGranted = (await checkNotifications()).status !== RESULTS.GRANTED
    const canMakeNotificationsChoice =
      Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 33)

    if (firstTime && permissionNotGranted && canMakeNotificationsChoice) {
      showPushNotificationsModal()
      await storage.saveObject(PUSH_NOTIFICATIONS_STORAGE_KEY, true)
    }
  }, [showPushNotificationsModal])

  const value = useMemo(
    () => ({
      isPushNotificationsModalVisible,
      showPushNotificationsModalForFirstTime,
    }),
    [isPushNotificationsModalVisible, showPushNotificationsModalForFirstTime]
  )

  return (
    <PushNotificationsContext.Provider value={value}>
      {children}
      <AskNotificiationsModal
        visible={isPushNotificationsModalVisible}
        onHideModal={hidePushNotificationsModal}
      />
    </PushNotificationsContext.Provider>
  )
})

export function usePushNotificationsContext(): PushNotificationsContextValue {
  return useContext(PushNotificationsContext)
}
