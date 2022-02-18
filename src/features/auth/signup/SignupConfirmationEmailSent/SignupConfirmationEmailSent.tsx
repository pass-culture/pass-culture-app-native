import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import {
  CenteredText,
  Description,
  EmailSentModalContent,
} from 'features/auth/components/signupComponents'
import { contactSupport, supportUrl } from 'features/auth/support.services'
import { navigateToHome, usePreviousRoute } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { Spacer, Typo } from 'ui/theme'
import { A } from 'ui/web/link/A'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  const previousRoute = usePreviousRoute()
  /* Note : we have issues with previously successfully valided ReCAPTCHA not being able
  to redo the challenge, so we block the user from going back to ReCAPTCHA screen */
  const disableGoBack = previousRoute?.name === 'AcceptCgu'

  function onClose() {
    navigateToHome()
  }

  function onConsultHelpSupport() {
    analytics.logHelpCenterContactSignupConfirmationEmailSent()
    contactSupport.forSignupConfirmationEmailNotReceived()
  }

  const leftIconProps = disableGoBack
    ? {
        leftIconAccessibilityLabel: undefined,
        leftIcon: undefined,
        onLeftIconPress: undefined,
      }
    : {
        leftIconAccessibilityLabel: t`Revenir en arrière`,
        leftIcon: ArrowPrevious,
        onLeftIconPress: goBack,
      }
  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Confirme ton e-mail`}
        rightIconAccessibilityLabel={t`Abandonner l'inscription`}
        rightIcon={Close}
        onRightIconPress={onClose}
        {...leftIconProps}
      />
      <EmailSentModalContent>
        <Description>
          <Typo.Body>{t`Clique sur le lien reçu à l'adresse\u00a0:`}</Typo.Body>
          <CenteredText>
            <Typo.Body>{route.params.email}</Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {t`Nous devons vérifier tes informations\u00a0: l'email peut prendre quelques minutes pour arriver.`}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>{t`Si tu rencontres des difficultés, tu peux consulter notre centre d'aide.`}</Typo.Body>
          </CenteredText>
          <A href={supportUrl.forSignupConfirmationEmailNotReceived}>
            <ButtonTertiary
              wording={t`Consulter notre centre d'aide`}
              onPress={onConsultHelpSupport}
              icon={Email}
            />
          </A>
        </Description>
        <Spacer.Column numberOfSpaces={3} />
        <OpenInboxButton />
      </EmailSentModalContent>
    </BottomContentPage>
  )
}
