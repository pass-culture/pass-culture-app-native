import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FC } from 'react'

import { REDACTOR_SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { CardContent, Paragraphe } from 'features/auth/components/signupComponents'
import { contactSupport } from 'features/auth/support.services'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export const AcceptRedactorCgu: FC = () => {
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'AcceptRedactorCgu'>>()
  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function subscribe() {
    // TODO(PC-9925) request /native/v1/institutional-project-redactor-account
    navigate('RedactorSignupConfirmationEmailSent', { email: params.email })
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`CGU & Données`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <BottomCardContentContainer>
          <CardContent>
            <Spacer.Column numberOfSpaces={5} />
            <Paragraphe>
              <Typo.Body>{t`En cliquant sur “Accepter et s’inscrire”, vous acceptez nos `}</Typo.Body>
              <ExternalLink
                text={t`Conditions Générales d'Utilisation`}
                url={env.CGU_LINK}
                color={ColorsEnum.PRIMARY}
                testID="external-link-cgu"
              />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Body>{t` ainsi que notre `}</Typo.Body>
              <ExternalLink
                text={t`Politique de confidentialité.`}
                color={ColorsEnum.PRIMARY}
                url={env.PRIVACY_POLICY_LINK}
                testID="external-link-privacy-policy"
              />
            </Paragraphe>
            <Spacer.Column numberOfSpaces={5} />
            <Paragraphe>
              <Typo.Body>
                {t`Pour en savoir plus sur la gestion de vos données personnelles et exercer vos droits vous pouvez :`}
              </Typo.Body>
            </Paragraphe>
            <ButtonTertiary
              title={t`Contacter le support`}
              onPress={contactSupport.forGenericQuestion}
              icon={Email}
            />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonPrimary title={t`Accepter et s’inscrire`} onPress={subscribe} />
            <Spacer.Column numberOfSpaces={5} />
            <StepDots
              numberOfSteps={REDACTOR_SIGNUP_NUMBER_OF_STEPS}
              currentStep={REDACTOR_SIGNUP_NUMBER_OF_STEPS}
            />
          </CardContent>
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="cgu-quit-signup"
        signupStep={SignupSteps.RedactorCGU}
        isRedactor={true}
      />
    </React.Fragment>
  )
}
