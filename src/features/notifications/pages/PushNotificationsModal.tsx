import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorLocationPointer as DefaultBicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
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

const BicolorLocationPointer = styled(DefaultBicolorLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
  size: 85, // Special case where theme.icons.sizes is not used
}))``
