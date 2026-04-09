import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { WebShareModalProps } from 'features/share/types'
// We are in a .web file, with a specific behavior depending on the device
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
// eslint-disable-next-line no-restricted-imports
import {
  isDesktopDeviceDetectOnWeb,
  isMacOsDeviceDetectOnWeb,
  isMobileDeviceDetectOnWeb,
} from 'libs/react-device-detect'
import { SocialButton } from 'libs/share/SocialButton'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Ul } from 'ui/components/Ul'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { SMSFilled } from 'ui/svg/icons/SMSFilled'
import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'
import { getSpacingString } from 'ui/theme'

export const WebShareModal = ({
  visible,
  headerTitle,
  shareContent,
  dismissModal,
}: WebShareModalProps) => {
  const { subject, body, url } = shareContent
  const { designSystem } = useTheme()
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
          encodeURIComponent(body),
      },
    },
    {
      label: 'X',
      icon: Twitter,
      externalNav: {
        url: `https://twitter.com/intent/tweet?text=${body}&url=${encodeURIComponent(url)}`,
      },
    },
    {
      label: 'WhatsApp',
      icon: WhatsApp,
      externalNav: {
        url:
          (isDesktopDeviceDetectOnWeb
            ? 'https://api.whatsapp.com/send?text='
            : 'whatsapp://send?text=') + encodeURIComponent(`${body}\n${url}`),
      },
    },
    {
      label: 'Telegram',
      icon: Telegram,
      externalNav: {
        url: isDesktopDeviceDetectOnWeb
          ? `https://telegram.me/share/msg?url=${encodeURIComponent(url)}&text=${body}`
          : 'tg://msg?text=' + encodeURIComponent(`${body}\n${url}`),
      },
    },
  ]

  const onCopyPress = () =>
    copyToClipboard({
      textToCopy: url,
      snackBarMessage: 'Le lien a été copié dans le presse-papier\u00a0!',
      onCopy: dismissModal,
    })

  const chooseContact = 'Veuillez choisir un contact'

  return (
    <AppModal
      visible={visible}
      title={headerTitle}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Container>
        <StyledSeparator marginBottom={designSystem.size.spacing.l} />
        <NonSocialButtonsContainer>
          <NonSocialButtonsItem>
            <Button
              variant="tertiary"
              color="neutral"
              wording="Copier"
              accessibilityLabel="Copier le lien"
              icon={Duplicate}
              onPress={onCopyPress}
            />
          </NonSocialButtonsItem>
          <NonSocialButtonsItem>
            <ExternalTouchableLink
              as={Button}
              variant="tertiary"
              color="neutral"
              externalNav={{
                url: `mailto:?subject=${subject || body}&body=${encodeURIComponent(
                  `${body}\n${url}`
                )}`,
              }}
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
                  as={Button}
                  variant="tertiary"
                  color="neutral"
                  externalNav={{
                    url: `sms:${chooseContact}?&body=${body}: ${encodeURIComponent(url)}`,
                  }}
                  wording="SMS"
                  accessibilityLabel="Ouvrir l’application de message"
                  icon={SMSFilled}
                />
              </NonSocialButtonsItem>
            ) : null
          }
        </NonSocialButtonsContainer>
        <StyledSeparator marginBottom={designSystem.size.spacing.xl} />
        <SocialButtonsContainer>
          {socialButtonProps.map((props) => (
            <Li key={props.label}>
              <SocialButton {...props} />
            </Li>
          ))}
        </SocialButtonsContainer>
        <Button wording="Annuler" onPress={dismissModal} fullWidth />
      </Container>
    </AppModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const StyledSeparator = styled(Separator.Horizontal)<{ marginBottom: number }>(
  ({ theme, marginBottom }) => ({
    marginTop: theme.designSystem.size.spacing.l,
    marginBottom,
  })
)
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

const SocialButtonsContainer = styled(Ul)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))',
  gap: `${getSpacingString(6)} 0px`,
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
