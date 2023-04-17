import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { getNextScreenOrStep } from 'features/identityCheck/pages/helpers/getNextScreenOrStep'
import { invalidateStepperInfoQuery } from 'features/identityCheck/pages/helpers/invalidateStepperQuery'
import { isSubscriptionRoute } from 'features/identityCheck/pages/helpers/isSubscriptionRoute'
import { useCurrentSubscriptionStep } from 'features/identityCheck/pages/helpers/useCurrentSubscriptionStep'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import {
  DeprecatedIdentityCheckStep,
  IdentityCheckStep,
  NextScreenOrStep,
} from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

const useNextScreenOrStep = (): NextScreenOrStep => {
  const { name } = useRoute()
  const { stepsDetails } = useStepperInfo()
  const currentRoute = isSubscriptionRoute(name) ? name : null
  return getNextScreenOrStep(stepsDetails, currentRoute)
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

  const saveCheckpoint = async (nextStep: DeprecatedIdentityCheckStep | IdentityCheckStep) => {
    try {
      if (
        currentStep === DeprecatedIdentityCheckStep.PROFILE ||
        currentStep === IdentityCheckStep.PROFILE
      ) {
        setIsSavingCheckpoint(true)
        await patchProfile()
      }
      await queryClient.invalidateQueries([QueryKeys.NEXT_SUBSCRIPTION_STEP])
      invalidateStepperInfoQuery()
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
