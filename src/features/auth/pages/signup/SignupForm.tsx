import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { ProgressBar } from 'features/auth/components/ProgressBar/ProgressBar'
import { PreValidationSignupStep } from 'features/auth/enums'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { QuitSignupModal } from 'features/auth/pages/signup/QuitSignupModal/QuitSignupModal'
import { useAppSignupMutation } from 'features/auth/queries/signup/useAppSignupMutation'
import { useSSOSignupMutation } from 'features/auth/queries/signup/useSSOSignupMutation'
import { DEFAULT_STEP_CONFIG, SSO_STEP_CONFIG } from 'features/auth/stepConfig'
import { SignupData } from 'features/auth/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSSOLoginMethod } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { eventMonitoring } from 'libs/monitoring/services'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'
import { Helmet } from 'ui/web/global/Helmet'

export const SignupForm: FunctionComponent<{ currentStep?: number }> = ({ currentStep = 0 }) => {
  const { mutateAsync: appSignup } = useAppSignupMutation()
  const loginAndRedirect = useLoginAndRedirect()

  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const { setParams } = useNavigation<UseNavigationType>()
  const accountCreationToken = params?.accountCreationToken
  const [stepIndex, setStepIndex] = React.useState(params?.stepIndex ?? currentStep)

  useEffect(() => {
    const navigationStepIndex = params?.stepIndex
    if (navigationStepIndex !== undefined && navigationStepIndex !== stepIndex) {
      setStepIndex(navigationStepIndex)
    }
    // stepIndex is not in the useEffect dependencies to avoid multiple re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.stepIndex])

  const syncStepIndexWithNavigation = useCallback(
    (newStepIndex: number | ((prev: number) => number)) => {
      setStepIndex((prev) => {
        const value = typeof newStepIndex === 'function' ? newStepIndex(prev) : newStepIndex
        setParams({ stepIndex: value })
        return value
      })
    },
    [setParams]
  )

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

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabHookConfig('Profile'))

  const goToPreviousStep = () => {
    if (isFirstStep) {
      goBackAndLeaveSignup()
    } else {
      if (isSecondStep) setParams({ accountCreationToken: undefined, email: undefined })
      syncStepIndexWithNavigation((prevStepIndex) => Math.max(0, prevStepIndex - 1))
    }
  }

  const goToNextStep = useCallback(
    (_signupData: Partial<SignupData>) => {
      setSignupData((previousSignupData) => ({ ...previousSignupData, ..._signupData }))
      syncStepIndexWithNavigation((prevStepIndex) => Math.min(numberOfSteps, prevStepIndex + 1))
    },
    [numberOfSteps, syncStepIndexWithNavigation]
  )

  const ssoType = accountCreationToken ? 'SSO_login' : 'SSO_signup'
  const stepperAnalyticsType = isSSOSubscription ? ssoType : undefined

  useEffect(() => {
    if (accountCreationToken && isFirstStep) {
      goToNextStep({ accountCreationToken, ssoProvider: params?.ssoProvider })
    }
  }, [accountCreationToken, goToNextStep, isFirstStep, params?.ssoProvider])

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
    Keyboard.dismiss()
    showFullPageModal()
  }

  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  })

  const { mutateAsync: ssoSignup } = useSSOSignupMutation(signupData.ssoProvider)

  const onSSOEmailNotFoundError = useCallback(() => setIsSSOSubscription(true), [])
  const onDefaultEmailSignup = useCallback(() => {
    setSignupData((previousSignupData) => ({
      ...previousSignupData,
      accountCreationToken: undefined,
    }))
    setIsSSOSubscription(false)
  }, [])

  const signUp = async (token: string, marketingEmailSubscription: boolean) => {
    try {
      const commonParams = {
        ...signupData,
        marketingEmailSubscription,
        token,
        trustedDevice: deviceInfoStoreSelectors.selectDeviceInfo(),
        firebasePseudoId: await firebaseAnalytics.getAppInstanceId(),
      }

      if (commonParams.accountCreationToken) {
        const {
          accountCreationToken,
          email: _email,
          password: _password,
          ssoProvider: _ssoProvider,
          ...rest
        } = commonParams
        const { accessToken, refreshToken } = await ssoSignup({
          ...rest,
          accountCreationToken,
        })
        const ssoProvider = signupData.ssoProvider
        if (!ssoProvider) {
          eventMonitoring.captureException(
            new Error('SSO signup finalization without ssoProvider'),
            { extra: { stepperAnalyticsType } }
          )
          return
        }
        await loginAndRedirect(
          { accessToken, refreshToken },
          {
            method: getSSOLoginMethod(
              ssoProvider,
              stepperAnalyticsType === 'SSO_login' ? 'login' : 'signup'
            ),
            analyticsType: stepperAnalyticsType,
          }
        )
      } else {
        await appSignup(commonParams)
        syncStepIndexWithNavigation(numberOfSteps - 1)
      }
    } catch (error) {
      eventMonitoring.captureException(error)
    }
  }

  const RightButton = isConfirmationEmailSentStep ? (
    <RightButtonText onClose={navigateToHome} wording="Fermer" />
  ) : (
    <RightButtonText onClose={showQuitSignupModal} wording="Quitter" />
  )

  return (
    <Page>
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
    </Page>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.designSystem.size.spacing.xl,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height, theme }) => ({
  height,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
