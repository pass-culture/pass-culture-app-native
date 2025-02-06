import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { useSignUp } from 'features/auth/api/useSignUp'
import { ProgressBar } from 'features/auth/components/ProgressBar/ProgressBar'
import { PreValidationSignupStep } from 'features/auth/enums'
import { QuitSignupModal } from 'features/auth/pages/signup/QuitSignupModal/QuitSignupModal'
import { DEFAULT_STEP_CONFIG, SSO_STEP_CONFIG } from 'features/auth/stepConfig'
import { SignupData } from 'features/auth/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics/provider'
import { AsyncError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

export const SignupForm: FunctionComponent = () => {
  const signUpApiCall = useSignUp()
  const trustedDevice = useDeviceInfo()

  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const accountCreationToken = params?.accountCreationToken

  const [stepIndex, setStepIndex] = React.useState(0)
  const [isSSOSubscription, setIsSSOSubscription] = React.useState(!!accountCreationToken)
  const signupStepConfig = isSSOSubscription ? SSO_STEP_CONFIG : DEFAULT_STEP_CONFIG
  const stepConfig = signupStepConfig[stepIndex]
  const numberOfSteps = signupStepConfig.length
  const isFirstStep = stepIndex === 0
  const isSecondStep = stepIndex === 1
  const isConfirmationEmailSentStep =
    signupStepConfig[stepIndex]?.name === PreValidationSignupStep.ConfirmationEmailSent
  const helmetTitle = `Étape ${stepIndex + 1} sur ${numberOfSteps} - Inscription | pass Culture`
  const nextStep = signupStepConfig[stepIndex + 1]
  const accessibilityLabelForNextStep =
    stepIndex < numberOfSteps - 1 && nextStep?.accessibilityTitle
      ? `Continuer vers l’étape ${nextStep.accessibilityTitle}`
      : undefined

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabNavConfig('Profile'))

  const goToPreviousStep = () => {
    if (isFirstStep) {
      goBackAndLeaveSignup()
    } else {
      if (isSecondStep) setParams({ accountCreationToken: undefined, email: undefined })
      setStepIndex((prevStepIndex) => Math.max(0, prevStepIndex - 1))
    }
  }

  const goToNextStep = useCallback(
    (_signupData: Partial<SignupData>) => {
      setSignupData((previousSignupData) => ({ ...previousSignupData, ..._signupData }))
      setStepIndex((prevStepIndex) => Math.min(numberOfSteps, prevStepIndex + 1))
    },
    [numberOfSteps]
  )

  const ssoType = accountCreationToken ? 'SSO_login' : 'SSO_signup'
  const stepperAnalyticsType = isSSOSubscription ? ssoType : undefined

  useEffect(() => {
    if (accountCreationToken) {
      goToNextStep({ accountCreationToken })
    }
  }, [accountCreationToken, goToNextStep])

  useEffect(() => {
    if (params?.from && stepConfig?.name) {
      analytics.logStepperDisplayed(params.from, stepConfig.name, stepperAnalyticsType)
    }
    // stepperAnalyticsType is not in the useEffect dependencies to avoid multiple re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.from, stepConfig?.name])

  const headerHeight = useGetHeaderHeight()

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function showQuitSignupModal() {
    if (stepConfig?.Component.name) {
      analytics.logQuitSignup(stepConfig.Component.name)
    }
    Keyboard.dismiss()
    showFullPageModal()
  }

  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  })

  const onSSOEmailNotFoundError = useCallback(() => setIsSSOSubscription(true), [])
  const onDefaultEmailSignup = useCallback(() => {
    setSignupData((previousSignupData) => ({
      ...previousSignupData,
      accountCreationToken: undefined,
    }))
    setIsSSOSubscription(false)
  }, [])

  async function signUp(token: string, marketingEmailSubscription: boolean) {
    try {
      const signupResponse = await signUpApiCall(
        {
          ...signupData,
          marketingEmailSubscription,
          token,
          trustedDevice,
        },
        stepperAnalyticsType
      )
      if (!signupResponse?.isSuccess) {
        throw new AsyncError('NETWORK_REQUEST_FAILED')
      } else if (!isSSOSubscription) {
        setStepIndex(numberOfSteps - 1)
      }
    } catch (error) {
      ;(error as Error).name = 'SignUpError'
      eventMonitoring.captureException(error)
    }
  }

  const RightButton = isConfirmationEmailSentStep ? (
    <RightButtonText onClose={navigateToHome} wording="Fermer" />
  ) : (
    <RightButtonText onClose={showQuitSignupModal} wording="Quitter" />
  )

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <PageHeaderWithoutPlaceholder
        title="Inscription"
        shouldDisplayBackButton={!isConfirmationEmailSentStep}
        onGoBack={goToPreviousStep}
        RightButton={isFirstStep ? null : RightButton}>
        <ProgressBar totalStep={numberOfSteps} currentStep={stepIndex + 1} />
      </PageHeaderWithoutPlaceholder>
      <StyledScrollView>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={8} />
        {stepConfig ? (
          <React.Fragment>
            <stepConfig.Component
              email={signupData.email}
              accessibilityLabelForNextStep={accessibilityLabelForNextStep}
              previousSignupData={signupData}
              isSSOSubscription={isSSOSubscription}
              goToNextStep={goToNextStep}
              signUp={signUp}
              onSSOEmailNotFoundError={onSSOEmailNotFoundError}
              onDefaultEmailSignup={onDefaultEmailSignup}
            />
            <QuitSignupModal
              visible={fullPageModalVisible}
              resume={hideFullPageModal}
              signupStep={stepConfig.name}
            />
          </React.Fragment>
        ) : null}
      </StyledScrollView>

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
