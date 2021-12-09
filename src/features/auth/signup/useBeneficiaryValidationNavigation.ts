import { t } from '@lingui/macro'
import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  MaintenancePageType,
} from 'api/gen'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSetIdCheckNavigationContext } from 'features/navigation/useSetIdCheckNavigationContext'
import { useIsUserUnderage } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { useIsUnderUbbleLoadThreshold } from 'libs/firestore/ubbleLoad'
import { eventMonitoring } from 'libs/monitoring'
import { UserProfilingError } from 'libs/monitoring/errors'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useBeneficiaryValidationNavigation = (setError: (error: Error) => void) => {
  useSetIdCheckNavigationContext()
  const navigateToNextStep = useNavigateToNextSubscriptionStep(setError)

  const navigateToNextBeneficiaryValidationStep = useCallback(() => {
    return api.getnativev1subscriptionnextStep().then(navigateToNextStep).catch(setError)
  }, [navigateToNextStep])

  return { navigateToNextBeneficiaryValidationStep }
}

const useNavigateToNextSubscriptionStep = (setError: (error: Error) => void) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const isUserUnderage = useIsUserUnderage()
  const { showErrorSnackBar } = useSnackBarContext()
  const isUnderUbbleLoadThreshold = useIsUnderUbbleLoadThreshold()

  function navigateToNextSubscriptionStep(nextSubscriptionStep: NextSubscriptionStepResponse) {
    const {
      allowedIdentityCheckMethods,
      nextSubscriptionStep: nextStep,
      maintenancePageType,
    } = nextSubscriptionStep

    if (nextStep === SubscriptionStep.PhoneValidation) {
      navigate('SetPhoneNumber')
    } else if (nextStep === SubscriptionStep.Maintenance) {
      const shouldEnableDMS = maintenancePageType === MaintenancePageType.WithDms
      navigate('IdentityCheckUnavailable', { withDMS: shouldEnableDMS })
    } else if (
      nextStep === SubscriptionStep.IdentityCheck ||
      nextStep === SubscriptionStep.ProfileCompletion
    ) {
      if (redirectToUbble(allowedIdentityCheckMethods, isUnderUbbleLoadThreshold)) {
        navigate('IdentityCheck')
        return
      }

      try {
        analytics.logIdCheck('Profile')
        navigate(idCheckInitialRouteName)
      } catch (err) {
        eventMonitoring.captureException(err, { isEligible: true, nextStep })
        showErrorSnackBar({
          message: t`Désolé, tu as effectué trop de tentatives. Essaye de nouveau dans 12 heures.`,
          timeout: SNACK_BAR_TIME_OUT,
        })
        navigateToHome()
      }
    } else if (nextStep === SubscriptionStep.UserProfiling) {
      setError(new UserProfilingError('SubscriptionStep.UserProfiling', UserProfiling))
    } else if (isUserUnderage) {
      navigate('UnavailableEduConnect')
    } else {
      navigateToHome()
    }
  }

  return navigateToNextSubscriptionStep
}

const redirectToUbble = (
  allowedIdentityCheckMethods: IdentityCheckMethod[],
  isUnderUbbleLoadThreshold: boolean
): boolean =>
  isUnderUbbleLoadThreshold && allowedIdentityCheckMethods.includes(IdentityCheckMethod.Ubble)
