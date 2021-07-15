import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { REDACTOR_SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { StyledInput, StyledStepDots } from 'features/auth/components/signupComponents'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { testID } from 'tests/utils'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export const SetRedactorPassword: FunctionComponent = () => {
  const [password, setPassword] = useState('')
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'SetRedactorPassword'>>()
  const email = params.email

  const passwordInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function submitPassword() {
    navigate('AcceptRedactorCgu', { email, password })
  }

  function showQuitSignupModal() {
    passwordInput.current && passwordInput.current.blur()
    showFullPageModal()
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Votre mot de passe`}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
        />
        <BottomCardContentContainer>
          <Spacer.Column numberOfSpaces={6} />
          <StyledInput>
            <Typo.Body>{t`Mot de passe`}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <PasswordInput
              value={password}
              autoFocus={true}
              onChangeText={setPassword}
              placeholder={t`Votre mot de passe`}
              ref={passwordInput}
              {...testID('Entrée pour le mot de passe')}
            />
          </StyledInput>
          <PasswordSecurityRules password={password} />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={t`Continuer`}
            onPress={submitPassword}
            disabled={!isPasswordCorrect(password)}
          />
          <Spacer.Column numberOfSpaces={5} />
          <StyledStepDots>
            <StepDots numberOfSteps={REDACTOR_SIGNUP_NUMBER_OF_STEPS} currentStep={2} />
          </StyledStepDots>
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="password-quit-signup"
        signupStep={SignupSteps.RedactorPassword}
        isRedactor={true}
      />
    </React.Fragment>
  )
}
