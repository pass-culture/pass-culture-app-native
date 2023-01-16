import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { navigateToHome, usePreviousRoute } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/firebase/analytics'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { padding, Spacer, Typo } from 'ui/theme'

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

  const leftIconProps = disableGoBack
    ? {
        leftIconAccessibilityLabel: undefined,
        leftIcon: undefined,
        onLeftIconPress: undefined,
      }
    : {
        leftIconAccessibilityLabel: 'Revenir en arrière',
        leftIcon: ArrowPrevious,
        onLeftIconPress: goBack,
      }

  return (
    <BottomContentPage>
      <ModalHeader
        title="Confirme ton e-mail"
        rightIconAccessibilityLabel="Abandonner l’inscription"
        rightIcon={Close}
        onRightIconPress={onClose}
        {...leftIconProps}
      />
      <EmailSentModalContent>
        <Description>
          <Typo.Body>Clique sur le lien reçu à l’adresse&nbsp;:</Typo.Body>
          <CenteredText>
            <Typo.Body>{route.params.email}</Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              Nous devons vérifier tes informations&nbsp;: l’email peut prendre quelques minutes
              pour arriver.
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              Si tu rencontres des difficultés, tu peux consulter notre centre d’aide.
            </Typo.Body>
          </CenteredText>
          <ExternalTouchableLink
            as={ButtonTertiaryPrimary}
            wording="Consulter notre centre d’aide"
            externalNav={contactSupport.forSignupConfirmationEmailNotReceived}
            onBeforeNavigate={analytics.logHelpCenterContactSignupConfirmationEmailSent}
            icon={ExternalSite}
          />
        </Description>
        <Spacer.Column numberOfSpaces={3} />
        <OpenInboxButton />
      </EmailSentModalContent>
    </BottomContentPage>
  )
}

const EmailSentModalContent = styled.View(({ theme }) => ({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

const Description = styled.View({
  alignItems: 'center',
})

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})
