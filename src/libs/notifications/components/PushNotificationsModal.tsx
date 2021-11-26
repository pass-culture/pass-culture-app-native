import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorLocationPointerDeprecated } from 'ui/svg/icons/BicolorLocationPointer_deprecated'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

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
    title={t`Paramètres de notifications`}
    visible={visible}
    onCloseIconPress={onDismiss}
    testIdSuffix="notifications-permission-modal">
    <React.Fragment>
      <BicolorLocationPointerDeprecated
        size={140}
        color={ColorsEnum.GREY_DARK}
        color2={ColorsEnum.GREY_DARK}
      />
      <Spacer.Column numberOfSpaces={2} />
      <InformationText>
        {t`Reste informé des actualités du pass Culture en activant les notifications.`}
      </InformationText>
      <Spacer.Column numberOfSpaces={4} />

      <InformationText>
        {t`Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de ton appareil.`}
      </InformationText>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        title={t`Autoriser les notifications`}
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
