import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { RingingBell } from 'ui/svg/RingingBell'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  onDismiss: () => void
  visible: boolean
  onRequestPermission: () => void
}

export const PushNotificationsModal: React.FC<Props> = ({
  onDismiss,
  visible,
  onRequestPermission,
}) => (
  <AppInformationModal
    title="Paramètres de notifications"
    visible={visible}
    onCloseIconPress={onDismiss}
    testIdSuffix="notifications-permission-modal">
    <React.Fragment>
      <BicolorLocationPointer />
      <Spacer.Column numberOfSpaces={10} />
      <InformationText>
        Reste informé des actualités du pass Culture en activant les notifications.
      </InformationText>
      <Spacer.Column numberOfSpaces={4} />

      <InformationText>
        Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de ton appareil.
      </InformationText>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Autoriser les notifications"
        onPress={() => {
          analytics.logOpenNotificationSettings()
          onRequestPermission()
        }}
      />
    </React.Fragment>
  </AppInformationModal>
)

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const BicolorLocationPointer = styled(RingingBell).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
