import React, { FunctionComponent, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { Close } from 'ui/svg/icons/Close'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  theme: SubscriptionTheme
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
  dismissModal,
  theme,
  onPressSaveChanges,
}) => {
  const [settings, setSettings] = useState({ allowEmails: false, allowPush: false })

  return (
    <AppModal
      visible={visible}
      title={`S’abonner au thème “${mapSubscriptionThemeToName[theme]}”`}
      rightIconAccessibilityLabel="Ne pas s’abonner"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <Typo.Body>Pour recevoir toute l’actu de ce thème, tu dois, au choix&nbsp;:</Typo.Body>

        <Spacer.Column numberOfSpaces={6} />

        <SectionWithSwitch
          title="Autoriser l’envoi d’e-mails"
          icon={EmailFilled}
          active={settings.allowEmails}
          toggle={() =>
            setSettings((prevState) => ({ ...prevState, allowEmails: !prevState.allowEmails }))
          }
        />
        {Platform.OS !== 'web' && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={6} />

            <SectionWithSwitch
              title="Autoriser les notifications"
              icon={StyledBellFilled}
              active={settings.allowPush}
              toggle={() =>
                setSettings((prevState) => ({ ...prevState, allowPush: !prevState.allowPush }))
              }
            />
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={6} />

        <StyledCaption>Tu pourras gérer tes alertes depuis ton profil.</StyledCaption>

        <Spacer.Column numberOfSpaces={6} />

        <ButtonPrimary
          wording="Valider"
          onPress={() => {
            dismissModal()
            onPressSaveChanges(settings)
          }}
        />
        <Spacer.Column numberOfSpaces={6} />

        <ButtonTertiaryBlack
          wording="Tout refuser et ne pas recevoir d’actus"
          icon={Invalidate}
          onPress={dismissModal}
        />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledBellFilled = styled(BellFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
