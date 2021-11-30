import { useNavigation, useRoute } from '@react-navigation/native'

import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckScreen, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { identityCheckRoutes } from 'features/navigation/RootNavigator/identityCheckRoutes'

const isIdentityCheckRoute = (name: string): name is IdentityCheckScreen =>
  identityCheckRoutes.map((route) => route.name).includes(name as IdentityCheckScreen)

export const useIdentityCheckNavigation = (): { navigateToNextScreen: () => void } => {
  const { dispatch } = useIdentityCheckContext()
  const steps = useIdentityCheckSteps()
  const { navigate } = useNavigation<UseNavigationType>()
  const { name } = useRoute()

  const currentRoute = isIdentityCheckRoute(name) ? name : null
  const nextScreenOrStep = getNextScreenOrStep(steps, currentRoute)

  return {
    navigateToNextScreen: () => {
      if (!nextScreenOrStep) return
      if ('screen' in nextScreenOrStep) {
        navigate(nextScreenOrStep.screen)
      } else if ('step' in nextScreenOrStep) {
        // In this case, we just redirect to the stepper screen
        dispatch({ type: 'SET_STEP', payload: nextScreenOrStep.step })
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
  const currentStep = steps.find((step) => step.screens.includes(currentRoute))
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
