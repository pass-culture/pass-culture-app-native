import React, { FunctionComponent } from 'react'
import { Keyboard, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/constants'
import { PreValidationSignupStep } from 'features/auth/enums'
import { ProgressBar } from 'features/auth/pages/signup/ProgressBar/ProgressBar'
import { QuitSignupModal } from 'features/auth/pages/signup/QuitSignupModal/QuitSignupModal'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

import { AcceptCgu } from './AcceptCgu/AcceptCgu'
import { SetBirthday } from './SetBirthday/SetBirthday'
import { SetEmail } from './SetEmail/SetEmail'
import { SetPassword } from './SetPassword/SetPassword'

type SignupStepConfig = {
  name: PreValidationSignupStep
  headerTitle: string
  Component: React.FunctionComponent<PreValidationSignupStepProps>
  tracker?: () => Promise<void>
}

const SIGNUP_STEP_CONFIG: SignupStepConfig[] = [
  {
    name: PreValidationSignupStep.Email,
    headerTitle: 'Crée-toi un compte',
    Component: SetEmail,
    tracker: analytics.logContinueSetEmail,
  },
  {
    name: PreValidationSignupStep.Password,
    headerTitle: 'Mot de passe',
    Component: SetPassword,
    tracker: analytics.logContinueSetPassword,
  },
  {
    name: PreValidationSignupStep.Birthday,
    headerTitle: 'Date de naissance',
    Component: SetBirthday,
    tracker: analytics.logContinueSetBirthday,
  },
  {
    name: PreValidationSignupStep.CGU,
    headerTitle: 'CGU & Données',
    Component: AcceptCgu,
  },
]

export const SignupForm: FunctionComponent = () => {
  const [stepIndex, setStepIndex] = React.useState(0)
  const stepConfig = SIGNUP_STEP_CONFIG[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex + 1 === SIGNUP_NUMBER_OF_STEPS
  const helmetTitle = `Étape ${
    stepIndex + 1
  } sur ${SIGNUP_NUMBER_OF_STEPS} - Inscription | pass Culture`

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabNavConfig('Profile'))

  function goToPreviousStep() {
    setStepIndex((prevStepIndex) => Math.max(0, prevStepIndex - 1))
  }
  function goToNextStep() {
    setStepIndex((prevStepIndex) => Math.min(SIGNUP_NUMBER_OF_STEPS, prevStepIndex + 1))
  }

  const headerHeight = useGetHeaderHeight()

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function showQuitSignupModal() {
    analytics.logQuitSignup(stepConfig.Component.name)
    Keyboard.dismiss()
    showFullPageModal()
  }

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <PageHeaderWithoutPlaceholder
        title="Inscription"
        shouldDisplayCloseButton={!isFirstStep}
        onClose={showQuitSignupModal}
        onGoBack={goBackAndLeaveSignup}>
        <ProgressBar totalStep={SIGNUP_NUMBER_OF_STEPS} currentStep={stepIndex + 1} />
      </PageHeaderWithoutPlaceholder>
      <ScrollView>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={8} />
        {/* To remove when adding real implem */}
        <Typo.Body>Lorem Ipsum</Typo.Body>
        <Typo.Body>Lorem Ipsum</Typo.Body>
        <Typo.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Typo.Body>
        <ButtonContainer>
          <StyledButton wording="Previous Step" onPress={goToPreviousStep} disabled={isFirstStep} />
          <StyledButton wording="Next Step" onPress={goToNextStep} disabled={isLastStep} />
        </ButtonContainer>
        <FakeContent />
      </ScrollView>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={stepConfig.name}
      />
      <BlurHeaderContainer height={headerHeight}>
        <BlurHeader />
      </BlurHeaderContainer>
    </React.Fragment>
  )
}

const StyledButton = styledButton(ButtonTertiaryBlack)({
  width: '45%',
  margin: getSpacing(2),
})

const ButtonContainer = styled.View({
  flexDirection: 'row',
  margin: getSpacing(2),
  justifyContent: 'center',
})

const FakeContent = styled.View({
  height: 800,
})

const BlurHeaderContainer = styled.View<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
