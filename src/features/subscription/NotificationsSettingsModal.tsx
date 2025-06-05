import React, { FunctionComponent, useState } from 'react'
import { Linking, Platform } from 'react-native'
import styled from 'styled-components/native'

import { PushNotificationsModal } from 'features/notifications/pages/PushNotificationsModal'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { Close } from 'ui/svg/icons/Close'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  title: string
  description: string
  dismissModal: () => void
  onPressSaveChanges: ({
    allowEmails,
    allowPush,
  }: {
    allowEmails: boolean
    allowPush: boolean
  }) => void
}

export const NotificationsSettingsModal: FunctionComponent<Props> = ({
  visible,
  title,
  description,
  dismissModal,
  onPressSaveChanges,
}) => {
  const initialState = { allowEmails: false, allowPush: false }
  const [settings, setSettings] = useState(initialState)

  const {
    visible: isPushModalVisible,
    showModal: showPushModal,
    hideModal: hidePushModal,
  } = useModal(false)

  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'

  const togglePush = () => {
    if (isPushPermissionGranted) {
      setSettings((prevState) => ({ ...prevState, allowPush: !prevState.allowPush }))
    } else {
      showPushModal()
    }
  }

  const onRequestNotificationPermissionFromModal = () => {
    hidePushModal()
    Linking.openSettings()
  }

  const onDismiss = () => {
    setSettings(initialState)
    dismissModal()
  }

  return (
    <AppModal
      visible={visible}
      title={title}
      rightIconAccessibilityLabel="Ne pas s’abonner"
      rightIcon={Close}
      onRightIconPress={onDismiss}>
      <ModalContent gap={6}>
        <Typo.Body>{description}</Typo.Body>

        <SectionWithSwitch
          title="Autoriser l’envoi d’e-mails"
          icon={EmailFilled}
          active={settings.allowEmails}
          toggle={() =>
            setSettings((prevState) => ({ ...prevState, allowEmails: !prevState.allowEmails }))
          }
        />
        {Platform.OS === 'web' ? null : (
          <SectionWithSwitch
            title="Autoriser les notifications"
            icon={StyledBellFilled}
            active={settings.allowPush}
            toggle={togglePush}
          />
        )}

        <StyledBodyAccentXs>Tu pourras gérer tes alertes depuis ton profil.</StyledBodyAccentXs>

        <ButtonPrimary
          wording="Valider"
          disabled={
            Platform.OS === 'web'
              ? !settings.allowEmails
              : !settings.allowEmails && !settings.allowPush
          }
          onPress={() => {
            dismissModal()
            onPressSaveChanges(settings)
          }}
        />

        <ButtonTertiaryBlack
          wording="Tout refuser et ne pas recevoir d’actus"
          icon={Invalidate}
          onPress={onDismiss}
          inline
        />
      </ModalContent>
      <PushNotificationsModal
        visible={isPushModalVisible}
        onRequestPermission={onRequestNotificationPermissionFromModal}
        onDismiss={hidePushModal}
      />
    </AppModal>
  )
}

const ModalContent = styled(ViewGap)({
  width: '100%',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBellFilled = styled(BellFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
