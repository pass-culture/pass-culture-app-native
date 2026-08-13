import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { RingingBell } from 'ui/svg/RingingBell'
import { Typo } from 'ui/theme'

type Props = {
  onDismiss: () => void
  visible: boolean
  onRequestPermission: () => void
}

export const PushNotificationsModal: React.FC<Props> = ({
  onDismiss,
  visible,
  onRequestPermission,
}) => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  return (
    <AppInformationModal
      title="Paramètres de notifications"
      visible={visible}
      onCloseIconPress={onDismiss}
      testIdSuffix="notifications-permission-modal">
      <React.Fragment>
        {enableNewVisionUi ? (
          <RemoteIllustration
            url={remoteIllustrationUrls.ringingBellSmall}
            backgroundColor="information04"
            size="s"
          />
        ) : (
          <BicolorLocationPointer />
        )}
        <InformationTextContainer gap={4}>
          <InformationText>
            Reste informé des actualités du pass Culture en activant les notifications.
          </InformationText>
          <InformationText>
            Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de ton appareil.
          </InformationText>
        </InformationTextContainer>
        <Button
          wording="Autoriser les notifications"
          onPress={() => {
            analytics.logOpenNotificationSettings()
            onRequestPermission()
          }}
        />
      </React.Fragment>
    </AppInformationModal>
  )
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const BicolorLocationPointer = styled(RingingBell).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const InformationTextContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxxl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
