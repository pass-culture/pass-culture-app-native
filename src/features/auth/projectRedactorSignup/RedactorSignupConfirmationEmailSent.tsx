import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'

import {
  CenteredText,
  Description,
  EmailSentModalContent,
} from 'features/auth/components/signupComponents'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Spacer, Typo } from 'ui/theme'

export const RedactorSignupConfirmationEmailSent: FunctionComponent = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'RedactorSignupConfirmationEmailSent'>>()

  function onConsultHelpSupport() {
    analytics.logHelpCenterContactSignupConfirmationEmailSent()
    contactSupport.forSignupConfirmationEmailNotReceived()
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Confirmez votre e\u2011mail`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <EmailSentModalContent>
        <Description>
          <Typo.Body>{t`Cliquez sur le lien reçu à l'adresse :`}</Typo.Body>
          <Typo.Body>{params.email}</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {t`Nous devons vérifier vos informations : l'email peut prendre quelques minutes pour arriver.`}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>{t`Si vous rencontrez des difficultés, vous pouvez consulter notre centre d'aide.`}</Typo.Body>
          </CenteredText>
          <ButtonTertiary
            title={t`Consulter notre centre d'aide`}
            onPress={onConsultHelpSupport}
            icon={Email}
          />
        </Description>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary title={t`Consulter mes e-mails`} onPress={openInbox} icon={ExternalSite} />
      </EmailSentModalContent>
    </BottomContentPage>
  )
}
