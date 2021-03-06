import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { useSignInNumberOfSteps } from 'features/auth/api'
import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { randomPassword } from 'libs/random'
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
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetPassword'>

let INITIAL_PASSWORD = ''

if (__DEV__ && env.SIGNUP_RANDOM_PASSWORD) {
  INITIAL_PASSWORD = randomPassword()
}

export const SetPassword: FunctionComponent<Props> = ({ route }) => {
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked

  const passwordInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)
  const numberOfSteps = useSignInNumberOfSteps()

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
              placeholder={t`Ton mot de passe`}
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
            <StepDots numberOfSteps={numberOfSteps} currentStep={2} />
          </StyledStepDots>
        </BottomCardContentContainer>
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

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})

const StyledStepDots = styled.View({ width: '100%', alignItems: 'center' })
