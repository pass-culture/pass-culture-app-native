import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

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
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Close } from 'ui/svg/icons/Close'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'
import { getSpacingString, Spacer } from 'ui/theme'

import { WebShareModalProps } from './types'

export const WebShareModal = ({
  visible,
  headerTitle,
  shareContent,
  dismissModal,
}: WebShareModalProps) => {
  const { message, url } = shareContent

  const socialButtonProps = [
    {
      label: t`Facebook`,
      icon: Facebook,
      onPress: () =>
        window.open(
          'https://www.facebook.com/sharer/sharer.php?' +
            'u=' +
            encodeURIComponent(url) +
            '&quote=' +
            encodeURIComponent(message)
        ),
    },
    {
      label: t`Twitter`,
      icon: Twitter,
      onPress: () => window.open(`https://twitter.com/intent/tweet?text=${message}&url=${url}`),
    },
    {
      label: t`WhatsApp`,
      icon: WhatsApp,
      onPress: () =>
        window.open(
          (isDesktopDeviceDetectOnWeb
            ? 'https://api.whatsapp.com/send?text='
            : 'whatsapp://send?text=') + encodeURIComponent(message + '\n' + url)
        ),
    },
    {
      label: t`Telegram`,
      icon: Telegram,
      onPress: () =>
        window.open(
          isDesktopDeviceDetectOnWeb
            ? `https://telegram.me/share/msg?url=${url}&text=${message}`
            : `tg://msg?text=${message}`
        ),
    },
  ]
  return (
    <AppModal
      visible={visible}
      title={headerTitle}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Container>
        <Spacer.Column numberOfSpaces={3} />
        <Separator />
        <Spacer.Column numberOfSpaces={3} />
        <NonSocialButtonsContainer>
          <NonSocialButton
            title={t`Copier`}
            icon={Duplicate}
            onPress={() => navigator.clipboard.writeText(url)}
          />
          <NonSocialButton
            title="E-mail"
            icon={EmailFilled}
            onPress={() => window.open('mailto:' + '' + '?subject=' + message + '&body=' + url)}
          />
          {
            // A message app is only available on mobile or on MacOS device
            isMobileDeviceDetectOnWeb || isMacOsDeviceDetectOnWeb ? (
              <NonSocialButton
                title="SMS"
                icon={EmailFilled}
                onPress={() => {
                  location.href = `sms:${t`Veuillez choisir un contact`}?&body=${message}: ${url}`
                }}
              />
            ) : null
          }
        </NonSocialButtonsContainer>
        <Spacer.Column numberOfSpaces={3} />
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <SocialButtonsContainer>
          {socialButtonProps.map((props) => (
            <SocialButton key={props.label} {...props} />
          ))}
        </SocialButtonsContainer>
        <Spacer.Column numberOfSpaces={8} />
        <CancelButton title={t`Annuler`} onPress={dismissModal} />
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
})

const NonSocialButton = styled(ButtonTertiaryBlack)({
  width: '33%',
})

const SocialButtonsContainer = styled.View({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))',
  gap: `${getSpacingString(6)} 0px`,
  width: '100%',
})

const CancelButton = styled(ButtonPrimary)({
  maxWidth: 240,
})
