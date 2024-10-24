import React from 'react'
import { View } from 'react-native'

import { YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { SubscriptionSuccessModal } from 'features/subscription/components/modals/SubscriptionSuccessModal'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { useMapSubscriptionHomeIdsToThematic } from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { useThematicSubscription } from 'features/subscription/helpers/useThematicSubscription'
import { NotificationsLoggedOutModal } from 'features/subscription/NotificationsLoggedOutModal'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { storage } from 'libs/storage'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { SubscribeButtonWithTooltip } from './SubscribeButtonWithTooltip'

interface Props {
  homeId: string
}

export const SubscribeButtonWithModals = ({ homeId }: Props) => {
  const { showSuccessSnackBar } = useSnackBarContext()
  const { user, isLoggedIn } = useAuthContext()
  const thematic = useMapSubscriptionHomeIdsToThematic(homeId)

  const {
    visible: isNotificationsModalVisible,
    showModal: showNotificationsModal,
    hideModal: hideNotificationsModal,
  } = useModal(false)
  const {
    visible: isUnsubscribingModalVisible,
    showModal: showUnsubscribingModal,
    hideModal: hideUnsubscribingModal,
  } = useModal(false)
  const {
    visible: isSubscriptionSuccessModalVisible,
    showModal: showSubscriptionSuccessModal,
    hideModal: hideSubscriptionSuccessModal,
  } = useModal(false)
  const {
    visible: visibleLoggedOutModal,
    showModal: showLoggedOutModal,
    hideModal: hideLoggedOutModal,
  } = useModal(false)

  const onUpdateSubscriptionSuccess = async (thematic: SubscriptionTheme) => {
    if (!thematic) return
    const hasSubscribedTimes =
      (await storage.readObject<number>('times_user_subscribed_to_a_theme')) ?? 0
    if (hasSubscribedTimes < 3) {
      showSubscriptionSuccessModal()
      await storage.saveObject('times_user_subscribed_to_a_theme', hasSubscribedTimes + 1)
    } else {
      showSuccessSnackBar({
        message: `Tu suis le thème “${mapSubscriptionThemeToName[thematic]}”\u00a0! Tu peux gérer tes alertes depuis ton profil.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const {
    isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated,
    updateSubscription,
    updateSettings,
  } = useThematicSubscription({
    user,
    homeId,
    thematic,
    onUpdateSubscriptionSuccess,
  })

  const onUnsubscribeConfirmationPress = () => {
    updateSubscription()
    hideUnsubscribingModal()
  }

  const onSubscribeButtonPress = () => {
    if (!isLoggedIn) {
      showLoggedOutModal()
    } else if (!isAtLeastOneNotificationTypeActivated) {
      showNotificationsModal()
    } else if (isSubscribeButtonActive) {
      showUnsubscribingModal()
    } else {
      updateSubscription()
    }
  }

  if (!thematic || user?.status?.statusType === YoungStatusType.non_eligible) return null

  return (
    <View>
      <SubscribeButtonWithTooltip
        active={isSubscribeButtonActive}
        onPress={onSubscribeButtonPress}
      />

      <NotificationsSettingsModal
        visible={isNotificationsModalVisible}
        dismissModal={hideNotificationsModal}
        title={`S’abonner au thème “${mapSubscriptionThemeToName[thematic]}”`}
        description="Pour recevoir toute l’actu de ce thème, tu dois, au choix&nbsp;:"
        onPressSaveChanges={updateSettings}
      />
      <UnsubscribingConfirmationModal
        visible={isUnsubscribingModalVisible}
        dismissModal={hideUnsubscribingModal}
        theme={thematic}
        onUnsubscribePress={onUnsubscribeConfirmationPress}
      />
      <SubscriptionSuccessModal
        visible={isSubscriptionSuccessModalVisible}
        dismissModal={hideSubscriptionSuccessModal}
        theme={thematic}
      />
      <NotificationsLoggedOutModal
        visible={visibleLoggedOutModal}
        dismissModal={hideLoggedOutModal}
        from="ThematicHome"
      />
    </View>
  )
}
