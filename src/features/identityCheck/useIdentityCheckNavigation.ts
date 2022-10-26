import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import { usePatchProfile } from 'features/identityCheck/api/api'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { IdentityCheckScreen, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useSubscriptionSteps } from 'features/identityCheck/useSubscriptionSteps'
import {
  IdentityCheckRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { identityCheckRoutes } from 'features/navigation/RootNavigator/identityCheckRoutes'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

type NextScreenOrStep = { screen: IdentityCheckScreen } | { step: IdentityCheckStep } | null

const isIdentityCheckRoute = (name: string): name is IdentityCheckScreen =>
  identityCheckRoutes.map((route) => route.name).includes(name as IdentityCheckScreen)

const getCurrentStep = (steps: StepConfig[], currentRoute: keyof IdentityCheckRootStackParamList) =>
  steps.find((step) => step.screens.includes(currentRoute)) || null

const useCurrentIdentityCheckStep = (): IdentityCheckStep | null => {
  const { name } = useRoute()
  const steps = useSubscriptionSteps()
  const currentRoute = isIdentityCheckRoute(name) ? name : null
  const currentStep = currentRoute ? getCurrentStep(steps, currentRoute) : null
  return currentStep ? currentStep.name : null
}

const useNextScreenOrStep = (): NextScreenOrStep => {
  const { name } = useRoute()
  const steps = useSubscriptionSteps()
  const currentRoute = isIdentityCheckRoute(name) ? name : null
  return getNextScreenOrStep(steps, currentRoute)
}

export const useIdentityCheckNavigation = (): {
  navigateToNextScreen: () => void
  isSavingCheckpoint: boolean
} => {
  const { dispatch } = useSubscriptionContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const currentStep = useCurrentIdentityCheckStep()
  const nextScreenOrStep = useNextScreenOrStep()
  const queryClient = useQueryClient()

  const [isSavingCheckpoint, setIsSavingCheckpoint] = useState(false)

  const { mutateAsync: patchProfile } = usePatchProfile()

  const saveCheckpoint = async (nextStep: IdentityCheckStep) => {
    try {
      if (currentStep === IdentityCheckStep.PROFILE) {
        setIsSavingCheckpoint(true)
        await patchProfile()
      }
      await queryClient.invalidateQueries(QueryKeys.NEXT_SUBSCRIPTION_STEP)
      setIsSavingCheckpoint(false)
      dispatch({ type: 'SET_STEP', payload: nextStep })
    } catch (error) {
      setIsSavingCheckpoint(false)
      eventMonitoring.captureException(error)
    }
  }

  return {
    navigateToNextScreen: async () => {
      if (!nextScreenOrStep) return
      if ('screen' in nextScreenOrStep) {
        navigate(nextScreenOrStep.screen)
      } else if ('step' in nextScreenOrStep) {
        await saveCheckpoint(nextScreenOrStep.step)
        navigate('IdentityCheckStepper')
      }
    },
    isSavingCheckpoint,
  }
}

export const getNextScreenOrStep = (
  steps: StepConfig[],
  currentRoute: IdentityCheckScreen | null
): NextScreenOrStep => {
  if (!currentRoute) return null
  const currentStep = getCurrentStep(steps, currentRoute)
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
