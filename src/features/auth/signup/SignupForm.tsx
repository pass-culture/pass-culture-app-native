import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Keyboard } from 'react-native'

import { SIGNUP_NUMBER_OF_STEPS, useSignUp } from 'features/auth/api'
import { QuitSignupModal } from 'features/auth/components/QuitSignupModal'
import { AcceptCgu } from 'features/auth/signup/SetPassword/AcceptCgu'
import { SetPassword } from 'features/auth/signup/SetPassword/SetPassword'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { AsyncError, MonitoringError } from 'libs/monitoring'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

import { PreValidationSignupStep } from './enums'
import { SetBirthday } from './SetBirthday'
import { SetEmail } from './SetEmail'
import { SignupData, PreValidationSignupStepProps } from './types'

type SignupStepConfig = {
  headerTitle: string
  Component: React.FunctionComponent<PreValidationSignupStepProps>
}

const SIGNUP_STEP_CONFIG: Record<PreValidationSignupStep, SignupStepConfig> = {
  [PreValidationSignupStep.Email]: {
    headerTitle: t`Adresse e-mail`,
    Component: SetEmail,
  },
  [PreValidationSignupStep.Password]: {
    headerTitle: t`Mot de passe`,
    Component: SetPassword,
  },
  [PreValidationSignupStep.Birthday]: {
    headerTitle: t`Ta date de naissance`,
    Component: SetBirthday,
  },
  [PreValidationSignupStep.CGU]: {
    headerTitle: t`CGU & Données`,
    Component: AcceptCgu,
  },
}

const SIGNUP_STEPS_ORDER = Object.keys(SIGNUP_STEP_CONFIG) as PreValidationSignupStep[]

type Props = StackScreenProps<RootStackParamList, 'SignupForm'>

export const SignupForm: FunctionComponent<Props> = ({ navigation, route }) => {
  const signUpApiCall = useSignUp()

  const [signupStep, setSignupStep] = useState(PreValidationSignupStep.Email)
  const [signupData, _setSignupData] = useState<SignupData>({
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
    postalCode: '',
  })
  const stepIndex = SIGNUP_STEPS_ORDER.indexOf(signupStep)
  const signupStepConfig = SIGNUP_STEP_CONFIG[signupStep]

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabNavConfig('Profile'))
  const isFirstStep = stepIndex === 0

  function goBack() {
    if (isFirstStep) {
      goBackAndLeaveSignup()
    } else {
      setSignupStep(SIGNUP_STEPS_ORDER[stepIndex - 1])
    }
  }

  function goNext(_signupData: Partial<SignupData>) {
    _setSignupData((previousSignupData) => ({ ...previousSignupData, ..._signupData }))
    setSignupStep(SIGNUP_STEPS_ORDER[stepIndex + 1])
  }

  async function signUp(token: string) {
    try {
      const signupResponse = await signUpApiCall({ ...signupData, token })
      if (!signupResponse?.isSuccess) {
        throw new AsyncError('NETWORK_REQUEST_FAILED')
      }
      navigation.navigate('SignupConfirmationEmailSent', { email: signupData.email })
    } catch (error) {
      const errorMessage = `Request info : ${JSON.stringify({
        ...signupData,
        password: 'excludedFromSentryLog',
        captchaSiteKey: env.SITE_KEY,
      })}`
      new MonitoringError(errorMessage, 'SignUpError')
      throw error
    }
  }

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // otherwise the logic of the "back action" would leak to other components / screens.
  useFocusEffect(() => {
    const unsubscribeFromNavigationListener = navigation.addListener('beforeRemove', (event) => {
      // For overriding iOS and Android go back and pop screen behaviour
      const isGoBackAction = ['GO_BACK', 'POP'].includes(event.data.action.type)
      if (!isGoBackAction) return // Remove screen
      goBack()
      event.preventDefault() // Do not remove screen
    })
    return unsubscribeFromNavigationListener
  })

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function showQuitSignupModal() {
    Keyboard.dismiss()
    showFullPageModal()
  }

  const disableGoingBack = isFirstStep && route.params?.preventCancellation
  const rightIconProps = disableGoingBack
    ? {
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
    : {
        rightIconAccessibilityLabel: t`Abandonner l'inscription`,
        rightIcon: Close,
        onRightIconPress: showQuitSignupModal,
      }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={signupStepConfig.headerTitle}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          {...rightIconProps}
        />
        <signupStepConfig.Component goToNextStep={goNext} signUp={signUp} />
        <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={stepIndex + 1} />
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={signupStep}
      />
    </React.Fragment>
  )
}
