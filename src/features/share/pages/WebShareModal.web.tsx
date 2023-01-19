import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { WebShareModalProps } from 'features/share/types'
// We are in a .web file, with a specific behavior depending on the device
// eslint-disable-next-line no-restricted-imports
import {
  isDesktopDeviceDetectOnWeb,
  isMobileDeviceDetectOnWeb,
  isMacOsDeviceDetectOnWeb,
} from 'libs/react-device-detect'
import { SocialButton } from 'libs/share/SocialButton'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Ul } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { SMSFilled } from 'ui/svg/icons/SMSFilled'
import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'
import { getSpacingString, Spacer } from 'ui/theme'

export const WebShareModal = ({
  visible,
  headerTitle,
  shareContent,
  dismissModal,
}: WebShareModalProps) => {
  const { showSuccessSnackBar } = useSnackBarContext()
  const { message, url = '' } = shareContent
  const socialButtonProps = [
    {
      label: 'Facebook',
      icon: Facebook,
      externalNav: {
        url:
          'https://www.facebook.com/sharer/sharer.php?' +
          'u=' +
          encodeURIComponent(url) +
          '&quote=' +
          encodeURIComponent(message),
      },
    },
    {
      label: 'Twitter',
      icon: Twitter,
      externalNav: { url: `https://twitter.com/intent/tweet?text=${message}&url=${url}` },
    },
    {
      label: 'WhatsApp',
      icon: WhatsApp,
      externalNav: {
        url:
          (isDesktopDeviceDetectOnWeb
            ? 'https://api.whatsapp.com/send?text='
            : 'whatsapp://send?text=') + encodeURIComponent(message + '\n' + url),
      },
    },
    {
      label: 'Telegram',
      icon: Telegram,
      externalNav: {
        url: isDesktopDeviceDetectOnWeb
          ? `https://telegram.me/share/msg?url=${url}&text=${message}`
          : `tg://msg?text=${encodeURIComponent(message + '\n' + url)}`,
      },
    },
  ]

  const onCopyPress = useCallback(() => {
    navigator.clipboard.writeText(url)
    showSuccessSnackBar({
      message: 'Le lien a été copié dans le presse-papier\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
    dismissModal()
  }, [dismissModal, showSuccessSnackBar, url])

  const chooseContact = 'Veuillez choisir un contact'

  return (
    <AppModal
      visible={visible}
      title={headerTitle}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Container>
        <Spacer.Column numberOfSpaces={3} />
        <Separator />
        <Spacer.Column numberOfSpaces={3} />
        <NonSocialButtonsContainer>
          <NonSocialButtonsItem>
            <ButtonTertiaryBlack
              wording="Copier"
              accessibilityLabel="Copier le lien"
              icon={Duplicate}
              onPress={onCopyPress}
            />
          </NonSocialButtonsItem>
          <NonSocialButtonsItem>
            <ExternalTouchableLink
              as={ButtonTertiaryBlack}
              externalNav={{ url: 'mailto:' + '' + '?subject=' + message + '&body=' + url }}
              wording="E-mail"
              accessibilityLabel="Ouvrir le gestionnaire mail"
              icon={EmailFilled}
            />
          </NonSocialButtonsItem>
          {
            // A message app is only available on mobile or on MacOS device
            isMobileDeviceDetectOnWeb || isMacOsDeviceDetectOnWeb ? (
              <NonSocialButtonsItem>
                <ExternalTouchableLink
                  as={ButtonTertiaryBlack}
                  externalNav={{ url: `sms:${chooseContact}?&body=${message}: ${url}` }}
                  wording="SMS"
                  accessibilityLabel="Ouvrir l’application de message"
                  icon={SMSFilled}
                />
              </NonSocialButtonsItem>
            ) : null
          }
        </NonSocialButtonsContainer>
        <Spacer.Column numberOfSpaces={3} />
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <SocialButtonsContainer>
          {socialButtonProps.map((props) => (
            <Li key={props.label}>
              <SocialButton {...props} />
            </Li>
          ))}
        </SocialButtonsContainer>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary wording="Annuler" onPress={dismissModal} mediumWidth />
      </Container>
    </AppModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const NonSocialButtonsContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
  flex: 1,
  flexBasis: 'auto',
})

const NonSocialButtonsItem = styled.View({
  flex: 1,
  justifyContent: 'center',
})

const SocialButtonsContainer = styled(Ul)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))',
  gap: `${getSpacingString(6)} 0px`,
  width: '100%',
})
