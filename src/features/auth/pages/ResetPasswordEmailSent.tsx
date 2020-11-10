import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Alert, Linking } from 'react-native'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Background } from 'ui/svg/Background'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ColorsEnum, getSpacing, padding, Spacer, Typo } from 'ui/theme'

const SUPPORT_EMAIL_ADDRESS = 'support@passculture.app'

type Props = StackScreenProps<RootStackParamList, 'ResetPasswordEmailSent'>

export const ResetPasswordEmailSent: FunctionComponent<Props> = ({ navigation, route }) => {
  function onBackNavigation() {
    Alert.alert('TODO => PC-4356')
  }

  async function contactSupport() {
    const url = `mailto:${SUPPORT_EMAIL_ADDRESS}`
    const canOpen = await Linking.canOpenURL(url)

    if (canOpen) {
      Linking.openURL(url)
    }
  }

  function onClose() {
    navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }

  return (
    <React.Fragment>
      <Background />
      <StyledFakeModal>
        <ModalHeader
          title={_(t`E-mail envoyé !`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={onBackNavigation}
          rightIcon={Close}
          onRightIconPress={onClose}
        />
        <ModalContent>
          <Description>
            <Typo.Body>{_(t`Clique sur le lien reçu à l'adresse :`)}</Typo.Body>
            <Typo.Body>{route.params.userEmail}</Typo.Body>
            <Spacer.Column numberOfSpaces={5} />
            <CenteredText>
              <Typo.Body>
                {_(t`L'e-mail peut prendre jusqu'à 24h pour arriver. Pense à vérifier tes spams !`)}
              </Typo.Body>
            </CenteredText>
            <Spacer.Column numberOfSpaces={5} />
            <Typo.Body>{_(t`S'il n'arrive pas tu peux :`)}</Typo.Body>
            <ButtonTertiary
              title={_(t`Contacter le support`)}
              onPress={contactSupport}
              icon={Email}
            />
            <Spacer.Column numberOfSpaces={6} />
          </Description>
          <ButtonPrimary
            title={_(t`Consulter mes e-mails`)}
            onPress={openInbox}
            icon={ExternalSite}
          />
        </ModalContent>
      </StyledFakeModal>
    </React.Fragment>
  )
}

const ModalContent = styled.View({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
})

const Description = styled.View({
  alignItems: 'center',
})

const CenteredText = styled.Text({
  textAlign: 'center',
})

const StyledFakeModal = styled.View({
  position: 'absolute',
  bottom: 0,
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: 300,
  width: '100%',
  borderTopStartRadius: getSpacing(4),
  borderTopEndRadius: getSpacing(4),
  padding: getSpacing(5),
})
