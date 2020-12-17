import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, padding, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ route }) => {
  const { navigate, goBack } = useNavigation<UseNavigationType>()

  function onClose() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={_(t`Confirme ton e\u2011mail`)}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <ModalContent>
        <Description>
          <Typo.Body>{_(t`Clique sur le lien reçu à l'adresse :`)}</Typo.Body>
          <Typo.Body>{route.params.email}</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {_(t`L'e-mail peut prendre quelques minutes à arriver. Pense à vérifier tes spams !`)}
            </Typo.Body>
          </CenteredText>
          <CenteredText>
            <Typo.Body>{_(t`Si l'e-mail n'arrive pas, tu peux : `)}</Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <ButtonTertiary
            title={_(t`Contacter le support`)}
            onPress={contactSupport}
            icon={Email}
          />
        </Description>
        <Spacer.Column numberOfSpaces={7} />
        <ButtonPrimary
          title={_(t`Consulter mes e-mails`)}
          onPress={openInbox}
          icon={ExternalSite}
        />
      </ModalContent>
    </BottomContentPage>
  )
}

const ModalContent = styled.View({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
  maxWidth: getSpacing(125),
})

const Description = styled.View({
  alignItems: 'center',
})

const CenteredText = styled.Text({
  textAlign: 'center',
})
