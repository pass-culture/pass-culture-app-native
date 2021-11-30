import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'

import { ActivityEnum } from 'api/gen'
import { useIdentityCheckCheckpoint } from 'features/identityCheck/api'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckScreen, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import {
  IdentityCheckRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { identityCheckRoutes } from 'features/navigation/RootNavigator/identityCheckRoutes'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const isIdentityCheckRoute = (name: string): name is IdentityCheckScreen =>
  identityCheckRoutes.map((route) => route.name).includes(name as IdentityCheckScreen)

const identityCheckCurrentStep = (
  steps: StepConfig[],
  currentRoute: keyof IdentityCheckRootStackParamList
) => steps.find((step) => step.screens.includes(currentRoute))

export const useIdentityCheckNavigation = (): { navigateToNextScreen: () => void } => {
  const { dispatch, profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const steps = useIdentityCheckSteps()
  const { navigate } = useNavigation<UseNavigationType>()
  const { name } = useRoute()

  const currentRoute = isIdentityCheckRoute(name) ? name : null
  const currentStep = currentRoute ? identityCheckCurrentStep(steps, currentRoute) : null
  const nextScreenOrStep = getNextScreenOrStep(steps, currentRoute)

  const { mutate: patchProfile } = useIdentityCheckCheckpoint({
    values: {
      activity: profile.status as ActivityEnum,
      address: profile.address,
      city: profile.city?.name || '',
      firstName: profile.name?.firstName,
      lastName: profile.name?.lastName,
      postalCode: profile.city?.postalCode || '',
    },
    onSuccess: () => dispatch({ type: 'SET_STEP', payload: nextScreenOrStep?.step }),
    onError: () =>
      showErrorSnackBar({
        message: t`Une erreur est survenue lors de la mise à jour de votre profil`,
        timeout: SNACK_BAR_TIME_OUT,
      }),
  })

  const saveCheckpoint = (currentStep: IdentityCheckStep) => {
    if (currentStep === 'profile') patchProfile()
  }

  return {
    navigateToNextScreen: () => {
      if (!nextScreenOrStep) return
      if ('screen' in nextScreenOrStep) {
        navigate(nextScreenOrStep.screen)
      } else if ('step' in nextScreenOrStep) {
        saveCheckpoint(currentStep)
        // In this case, we just redirect to the stepper screen
        navigate('IdentityCheck')
      }
    },
  }
}

export const getNextScreenOrStep = (
  steps: StepConfig[],
  currentRoute: IdentityCheckScreen | null
): { screen: IdentityCheckScreen } | { step: IdentityCheckStep } | null => {
  if (!currentRoute) return null
  const currentStep = identityCheckCurrentStep(steps, currentRoute)
  if (!currentStep) return null

  // Step is not completed
  const currentScreenIndex = currentStep.screens.indexOf(currentRoute)
  const isLastScreen = currentScreenIndex === currentStep.screens.length - 1
  if (!isLastScreen) return { screen: currentStep.screens[currentScreenIndex + 1] }

  // Step is completed => find next step
  const currentStepIndex = steps.indexOf(currentStep)
  const isLastStep = currentStepIndex === steps.length - 1
  if (!isLastStep) return { step: steps[currentStepIndex + 1].name }

  // Step is complete and is last step
  return { step: IdentityCheckStep.END }
}
