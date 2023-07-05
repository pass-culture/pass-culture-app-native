import React, { FunctionComponent, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { useSignUp } from 'features/auth/api/useSignUp'
import { ProgressBar } from 'features/auth/components/ProgressBar/ProgressBar'
import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/constants'
import { PreValidationSignupStep } from 'features/auth/enums'
import { QuitSignupModal } from 'features/auth/pages/signup/QuitSignupModal/QuitSignupModal'
import {
  Props as ConfirmationEmailSentProps,
  SignupConfirmationEmailSent,
} from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import {
  PreValidationSignupNormalStepProps,
  PreValidationSignupLastStepProps,
  SignupData,
} from 'features/auth/types'
import { navigateToHome } from 'features/navigation/helpers'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

import { AcceptCgu } from './AcceptCgu/AcceptCgu'
import { SetBirthday } from './SetBirthday/SetBirthday'
import { SetEmail } from './SetEmail/SetEmail'
import { SetPassword } from './SetPassword/SetPassword'

type SignupStepConfig = {
  name: PreValidationSignupStep
  Component:
    | React.FunctionComponent<PreValidationSignupNormalStepProps>
    | React.FunctionComponent<PreValidationSignupLastStepProps>
    | React.FunctionComponent<ConfirmationEmailSentProps>
  accessibilityTitle: string
  tracker?: () => Promise<void>
}

const SIGNUP_STEP_CONFIG: SignupStepConfig[] = [
  {
    name: PreValidationSignupStep.Email,
    Component: SetEmail,
    accessibilityTitle: 'Adresse e-mail',
    tracker: analytics.logContinueSetEmail,
  },
  {
    name: PreValidationSignupStep.Password,
    Component: SetPassword,
    accessibilityTitle: 'Mot de passe',
    tracker: analytics.logContinueSetPassword,
  },
  {
    name: PreValidationSignupStep.Birthday,
    Component: SetBirthday,
    accessibilityTitle: 'Date de naissance',
    tracker: analytics.logContinueSetBirthday,
  },
  {
    name: PreValidationSignupStep.CGU,
    accessibilityTitle: 'CGU & Données',
    Component: AcceptCgu,
  },
  {
    name: PreValidationSignupStep.ConfirmationEmailSent,
    accessibilityTitle: 'Confirmation d‘envoi d‘e-mail',
    Component: SignupConfirmationEmailSent,
  },
]

export const SignupForm: FunctionComponent = () => {
  const signUpApiCall = useSignUp()
  const trustedDevice = useDeviceInfo()
  const enableTrustedDevice = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE)

  const [stepIndex, setStepIndex] = React.useState(0)
  const stepConfig = SIGNUP_STEP_CONFIG[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === 4
  const helmetTitle = `Étape ${
    stepIndex + 1
  } sur ${SIGNUP_NUMBER_OF_STEPS} - Inscription | pass Culture`
  const accessibilityLabelForNextStep =
    stepIndex < SIGNUP_NUMBER_OF_STEPS - 1
      ? `Continuer vers l’étape ${SIGNUP_STEP_CONFIG[stepIndex + 1].accessibilityTitle}`
      : undefined

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabNavConfig('Profile'))

  const goToPreviousStep = () => {
    if (isFirstStep) {
      goBackAndLeaveSignup()
    } else {
      setStepIndex((prevStepIndex) => Math.max(0, prevStepIndex - 1))
    }
  }

  const goToNextStep = (_signupData: Partial<SignupData>) => {
    setSignupData((previousSignupData) => ({ ...previousSignupData, ..._signupData }))
    setStepIndex((prevStepIndex) => Math.min(SIGNUP_NUMBER_OF_STEPS, prevStepIndex + 1))

    stepConfig.tracker?.()
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

  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
    postalCode: '',
  })

  async function signUp(token: string) {
    try {
      const signupResponse = await signUpApiCall({
        ...signupData,
        token,
        trustedDevice: enableTrustedDevice ? trustedDevice : undefined,
      })
      if (!signupResponse?.isSuccess) {
        throw new AsyncError('NETWORK_REQUEST_FAILED')
      } else {
        setStepIndex(SIGNUP_NUMBER_OF_STEPS - 1)
      }
    } catch (error) {
      ;(error as Error).name = 'SignUpError'
      eventMonitoring.captureException(error)
    }
  }

  const RightButton = isLastStep ? (
    <RightButtonText onClose={navigateToHome} wording="Fermer" />
  ) : (
    <RightButtonText onClose={showQuitSignupModal} wording="Annuler" />
  )

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <PageHeaderWithoutPlaceholder
        title="Inscription"
        shouldDisplayBackButton={!isLastStep}
        onGoBack={goToPreviousStep}
        RightButton={isFirstStep ? null : RightButton}>
        <ProgressBar totalStep={SIGNUP_NUMBER_OF_STEPS} currentStep={stepIndex + 1} />
      </PageHeaderWithoutPlaceholder>
      <StyledScrollView>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={8} />
        <stepConfig.Component
          goToNextStep={goToNextStep}
          signUp={signUp}
          email={signupData.email}
          accessibilityLabelForNextStep={accessibilityLabelForNextStep}
        />
      </StyledScrollView>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={stepConfig.name}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
