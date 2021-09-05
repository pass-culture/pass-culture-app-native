import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import {
  CenteredText,
  Description,
  EmailSentModalContent,
} from 'features/auth/components/signupComponents'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome, usePreviousRoute } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()
  /* Note : we have issues with previously successfully valided ReCAPTCHA not being able
  to redo the challenge, so we block the user from going back to ReCAPTCHA screen */
  const shouldBeAbleToGoBack = previousRoute?.name !== 'AcceptCgu'

  function onClose() {
    navigateToHome()
  }

  function onConsultHelpSupport() {
    analytics.logHelpCenterContactSignupConfirmationEmailSent()
    contactSupport.forSignupConfirmationEmailNotReceived()
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Confirme ton e-mail`}
        leftIcon={shouldBeAbleToGoBack ? ArrowPrevious : undefined}
        onLeftIconPress={shouldBeAbleToGoBack ? goBack : undefined}
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <EmailSentModalContent>
        <Description>
          <Typo.Body>{t`Clique sur le lien reçu à l'adresse :`}</Typo.Body>
          <CenteredText>
            <Typo.Body>{route.params.email}</Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {t`Nous devons vérifier tes informations : l'email peut prendre quelques minutes pour arriver.`}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>{t`Si tu rencontres des difficultés, tu peux consulter notre centre d'aide.`}</Typo.Body>
          </CenteredText>
          <ButtonTertiary
            title={t`Consulter notre centre d'aide`}
            onPress={onConsultHelpSupport}
            icon={Email}
          />
        </Description>
        <Spacer.Column numberOfSpaces={3} />
        <OpenInboxButton />
      </EmailSentModalContent>
    </BottomContentPage>
  )
}
