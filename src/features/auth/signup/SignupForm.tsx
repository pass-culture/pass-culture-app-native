import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState, useCallback } from 'react'
import { Keyboard } from 'react-native'

import { SIGNUP_NUMBER_OF_STEPS, useSignUp } from 'features/auth/api'
import { QuitSignupModal } from 'features/auth/components/QuitSignupModal'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

import { AcceptCgu } from './AcceptCgu'
import { PreValidationSignupStep } from './enums'
import { SetBirthday } from './SetBirthday'
import { SetEmail } from './SetEmail'
import { SetPassword } from './SetPassword'
import { SignupData, PreValidationSignupStepProps } from './types'

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
    tracker: async () => {
      await amplitude.logEvent('user_set_email_clicked_front')
      await analytics.logContinueSetEmail()
    },
  },
  {
    name: PreValidationSignupStep.Password,
    headerTitle: 'Mot de passe',
    Component: SetPassword,
    tracker: async () => {
      await analytics.logContinueSetPassword()
    },
  },
  {
    name: PreValidationSignupStep.Birthday,
    headerTitle: 'Date de naissance',
    Component: SetBirthday,
    tracker: async () => {
      await analytics.logContinueSetBirthday()
    },
  },
  {
    name: PreValidationSignupStep.CGU,
    headerTitle: 'CGU & Données',
    Component: AcceptCgu,
    tracker: async () => {
      await analytics.logContinueCGU()
    },
  },
]
const SIGNUP_STEP_CONFIG_MAX_INDEX = SIGNUP_STEP_CONFIG.length - 1

type Props = StackScreenProps<RootStackParamList, 'SignupForm'>

export const SignupForm: FunctionComponent<Props> = ({ navigation, route }) => {
  const signUpApiCall = useSignUp()

  const [stepIndex, setStepIndex] = useState(0)
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
    postalCode: '',
  })
  const stepConfig = SIGNUP_STEP_CONFIG[stepIndex]
  const accessibilityLabelForNextStep =
    stepIndex < SIGNUP_STEP_CONFIG_MAX_INDEX
      ? `Continuer vers l’étape ${SIGNUP_STEP_CONFIG[stepIndex + 1].headerTitle}`
      : undefined
  const isFirstStep = stepIndex === 0
  const helmetTitle = `Étape ${
    stepIndex + 1
  } sur ${SIGNUP_NUMBER_OF_STEPS} - Inscription | pass Culture`

  const { goBack: goBackAndLeaveSignup } = useGoBack(...getTabNavConfig('Profile'))

  function goToPreviousStep() {
    setStepIndex((prevStepIndex) => Math.max(0, prevStepIndex - 1))
  }

  function goToNextStep(_signupData: Partial<SignupData>) {
    setSignupData((previousSignupData) => ({ ...previousSignupData, ..._signupData }))
    setStepIndex((prevStepIndex) => Math.min(SIGNUP_STEP_CONFIG_MAX_INDEX, prevStepIndex + 1))

    const { tracker } = stepConfig
    if (tracker) {
      tracker()
    }
  }

  async function signUp(token: string) {
    try {
      const signupResponse = await signUpApiCall({ ...signupData, token })
      if (!signupResponse?.isSuccess) {
        throw new AsyncError('NETWORK_REQUEST_FAILED')
      }
      navigation.navigate('SignupConfirmationEmailSent', { email: signupData.email })

      await amplitude.logEvent('user_accepted_terms_clicked_front')
    } catch (error) {
      ;(error as Error).name = 'SignUpError'
      eventMonitoring.captureException(error)
    }
  }

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // otherwise the logic of the "back action" would leak to other components / screens.
  useFocusEffect(
    useCallback(() => {
      return navigation.addListener('beforeRemove', (event) => {
        // For overriding iOS and Android go back and pop screen behaviour
        const isGoBackAction = ['GO_BACK', 'POP'].includes(event.data.action.type)
        if (!isGoBackAction || isFirstStep) return // Remove screen
        goToPreviousStep()
        event.preventDefault() // Do not remove screen
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFirstStep])
  )

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function showQuitSignupModal() {
    Keyboard.dismiss()
    showFullPageModal()
  }

  const disableQuitSignup = isFirstStep && route.params?.preventCancellation
  const rightIconProps = disableQuitSignup
    ? {
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
    : {
        rightIconAccessibilityLabel: 'Abandonner l’inscription',
        rightIcon: Close,
        onRightIconPress: showQuitSignupModal,
      }

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <BottomContentPage>
        <ModalHeader
          title={stepConfig.headerTitle}
          leftIconAccessibilityLabel="Revenir en arrière"
          leftIcon={ArrowPrevious}
          onLeftIconPress={isFirstStep ? goBackAndLeaveSignup : goToPreviousStep}
          {...rightIconProps}
        />
        <Spacer.Column numberOfSpaces={5} />
        <BottomCardContentContainer>
          <stepConfig.Component
            goToNextStep={goToNextStep}
            signUp={signUp}
            accessibilityLabelForNextStep={accessibilityLabelForNextStep}
          />
        </BottomCardContentContainer>
        <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={stepIndex + 1} />
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={stepConfig.name}
      />
    </React.Fragment>
  )
}
