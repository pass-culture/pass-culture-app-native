import React, { FunctionComponent } from 'react'

import { VenueResponse, YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UnsubscribingConfirmationModal } from 'features/subscription/components/modals/UnsubscribingConfirmationModal'
import { ThematicSubscriptionBlock } from 'features/subscription/components/ThematicSubscriptionBlock'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { useThematicSubscription } from 'features/subscription/helpers/useThematicSubscription'
import { NotificationsLoggedOutModal } from 'features/subscription/NotificationsLoggedOutModal'
import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { mapActivityToCategory } from 'features/venue/helpers/mapActivityToCategory'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

interface Props {
  venue: Omit<VenueResponse, 'isVirtual'>
}

export const VenueThematicSection: FunctionComponent<Props> = ({ venue }: Props) => {
  const thematic = venue.activity ? mapActivityToCategory[venue.activity] : null
  const [hasUserSubscribed, setHasUserSubscribed] = React.useState(false)
  const { user, isLoggedIn } = useAuthContext()

  const { showSuccessSnackBar } = useSnackBarContext()
  const {
    visible: visibleLoggedOutModal,
    showModal: showLoggedOutModal,
    hideModal: hideLoggedOutModal,
  } = useModal(false)
  const {
    visible: visibleNotificationsSettingsModal,
    showModal: showNotificationsSettingsModal,
    hideModal: hideNotificationsSettingsModal,
  } = useModal(false)
  const {
    visible: isUnsubscribingModalVisible,
    showModal: showUnsubscribingModal,
    hideModal: hideUnsubscribingModal,
  } = useModal(false)

  const onUpdateSubscriptionSuccess = async (thematic: SubscriptionTheme) => {
    showSuccessSnackBar({
      message: `Tu suis le thème “${mapSubscriptionThemeToName[thematic]}”\u00a0! Tu peux gérer tes alertes depuis ton profil.`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const {
    isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated,
    updateSubscription,
    updateSettings,
  } = useThematicSubscription({
    user,
    onUpdateSubscriptionSuccess,
    thematic,
    venueId: venue.id.toString(),
  })

  const onSubscribePress = () => {
    setHasUserSubscribed(true)
    if (!isLoggedIn) {
      showLoggedOutModal()
    } else if (!isAtLeastOneNotificationTypeActivated) {
      showNotificationsSettingsModal()
    } else if (isSubscribeButtonActive) {
      showUnsubscribingModal()
    } else {
      updateSubscription()
    }
  }

  const onUnsubscribeConfirmationPress = () => {
    updateSubscription()
    hideUnsubscribingModal()
  }

  if (
    !thematic ||
    (isSubscribeButtonActive && !hasUserSubscribed) ||
    user?.status?.statusType === YoungStatusType.non_eligible
  )
    return null

  return (
    <SectionWithDivider visible gap={6}>
      <ThematicSubscriptionBlock
        thematic={thematic}
        isSubscribeButtonActive={isSubscribeButtonActive}
        onSubscribePress={onSubscribePress}
      />
      <NotificationsLoggedOutModal
        visible={visibleLoggedOutModal}
        dismissModal={hideLoggedOutModal}
        from="venue"
      />
      <NotificationsSettingsModal
        visible={visibleNotificationsSettingsModal}
        dismissModal={hideNotificationsSettingsModal}
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
    </SectionWithDivider>
  )
}
