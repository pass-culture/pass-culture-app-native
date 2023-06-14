import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { useSignUp } from 'features/auth/api/useSignUp'
import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/constants'
import { PreValidationSignupStep } from 'features/auth/enums'
import { ProgressBar } from 'features/auth/pages/signup/ProgressBar/ProgressBar'
import { QuitSignupModal } from 'features/auth/pages/signup/QuitSignupModal/QuitSignupModal'
import {
  PreValidationSignupNormalStepProps,
  PreValidationSignupLastStepProps,
  SignupData,
} from 'features/auth/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { BlurView } from 'ui/components/BlurView'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

import { AcceptCguV2 } from './AcceptCgu/AcceptCguV2'
import { SetBirthdayV2 } from './SetBirthday/SetBirthdayV2'
import { SetEmailV2 } from './SetEmail/SetEmailV2'
import { SetPasswordV2 } from './SetPassword/SetPasswordV2'

type SignupStepConfig = {
  name: PreValidationSignupStep
  Component:
    | React.FunctionComponent<PreValidationSignupNormalStepProps>
    | React.FunctionComponent<PreValidationSignupLastStepProps>
  tracker?: () => Promise<void>
}

const SIGNUP_STEP_CONFIG: SignupStepConfig[] = [
  {
    name: PreValidationSignupStep.Email,
    Component: SetEmailV2,
    tracker: analytics.logContinueSetEmail,
  },
  {
    name: PreValidationSignupStep.Password,
    Component: SetPasswordV2,
    tracker: analytics.logContinueSetPassword,
  },
  {
    name: PreValidationSignupStep.Birthday,
    Component: SetBirthdayV2,
    tracker: analytics.logContinueSetBirthday,
  },
  {
    name: PreValidationSignupStep.CGU,
    Component: AcceptCguV2,
  },
]

export const SignupForm: FunctionComponent = () => {
  const signUpApiCall = useSignUp()
  const trustedDevice = useDeviceInfo()
  const enableTrustedDevice = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE)

  const navigation = useNavigation<UseNavigationType>()

  const [stepIndex, setStepIndex] = React.useState(0)
  const stepConfig = SIGNUP_STEP_CONFIG[stepIndex]
  const isFirstStep = stepIndex === 0
  const helmetTitle = `Étape ${
    stepIndex + 1
  } sur ${SIGNUP_NUMBER_OF_STEPS} - Inscription | pass Culture`

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
      }
      navigation.navigate('SignupConfirmationEmailSent', { email: signupData.email })
    } catch (error) {
      ;(error as Error).name = 'SignUpError'
      eventMonitoring.captureException(error)
    }
  }

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <PageHeaderWithoutPlaceholder
        title="Inscription"
        shouldDisplayCloseButton={!isFirstStep}
        onClose={showQuitSignupModal}
        onGoBack={goToPreviousStep}>
        <ProgressBar totalStep={SIGNUP_NUMBER_OF_STEPS} currentStep={stepIndex + 1} />
      </PageHeaderWithoutPlaceholder>
      <StyledScrollView>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={8} />
        <stepConfig.Component goToNextStep={goToNextStep} signUp={signUp} />
      </StyledScrollView>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={stepConfig.name}
      />
      <BlurHeaderContainer height={headerHeight}>
        <BlurView />
      </BlurHeaderContainer>
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
}))``

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
