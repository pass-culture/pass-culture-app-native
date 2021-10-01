import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'

import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { StyledInput, StyledStepDots } from 'features/auth/components/signupComponents'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { randomPassword } from 'libs/random'
import { accessibilityAndTestId } from 'tests/utils'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetPassword'>

let INITIAL_PASSWORD = ''

if (__DEV__ && env.SIGNUP_RANDOM_PASSWORD) {
  INITIAL_PASSWORD = randomPassword()
}

export const SetPassword: FunctionComponent<Props> = ({ route }) => {
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetEmail')

  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked

  const passwordInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function submitPassword() {
    navigate('SetBirthday', { email, isNewsletterChecked, password })
  }

  function showQuitSignupModal() {
    passwordInput.current && passwordInput.current.blur()
    showFullPageModal()
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton mot de passe`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIconAccessibilityLabel={t`Abandonner l'inscription`}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{t`Mot de passe`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            autoFocus={true}
            onChangeText={setPassword}
            placeholder={t`Ton mot de passe`}
            onSubmitEditing={Platform.OS === 'web' ? submitPassword : undefined}
            ref={passwordInput}
            {...accessibilityAndTestId('Entrée pour le mot de passe')}
          />
          <PasswordSecurityRules password={password} />
        </StyledInput>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={t`Continuer`}
          onPress={submitPassword}
          disabled={!isPasswordCorrect(password)}
        />
        <Spacer.Column numberOfSpaces={5} />
        <StyledStepDots>
          <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={2} />
        </StyledStepDots>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="password-quit-signup"
        signupStep={SignupSteps.Password}
      />
    </React.Fragment>
  )
}
