import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import { usePatchProfile } from 'features/identityCheck/api/api'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SubscriptionScreen, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useSubscriptionSteps } from 'features/identityCheck/useSubscriptionSteps'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import {
  SubscriptionRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

type NextScreenOrStep = { screen: SubscriptionScreen } | { step: IdentityCheckStep } | null

const isSubscriptionRoute = (name: string): name is SubscriptionScreen =>
  subscriptionRoutes.map((route) => route.name).includes(name as SubscriptionScreen)

const getCurrentStep = (steps: StepConfig[], currentRoute: keyof SubscriptionRootStackParamList) =>
  steps.find((step) => step.screens.includes(currentRoute)) || null

const useCurrentSubscriptionStep = (): IdentityCheckStep | null => {
  const { name } = useRoute()
  const steps = useSubscriptionSteps()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  const currentStep = currentRoute ? getCurrentStep(steps, currentRoute) : null
  return currentStep ? currentStep.name : null
}

const useNextScreenOrStep = (): NextScreenOrStep => {
  const { name } = useRoute()
  const steps = useSubscriptionSteps()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  return getNextScreenOrStep(steps, currentRoute)
}

export const useSubscriptionNavigation = (): {
  navigateToNextScreen: () => void
  isSavingCheckpoint: boolean
} => {
  const { dispatch } = useSubscriptionContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const currentStep = useCurrentSubscriptionStep()
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
  currentRoute: SubscriptionScreen | null
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
