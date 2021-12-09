import { t } from '@lingui/macro'
import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'

import { api } from 'api/api'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  MaintenancePageType,
} from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSetIdCheckNavigationContext } from 'features/navigation/useSetIdCheckNavigationContext'
import { useIsUserUnderage } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { useIsUnderUbbleLoadThreshold } from 'libs/firestore/ubbleLoad'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useBeneficiaryValidationNavigation = () => {
  useSetIdCheckNavigationContext()
  const navigateToNextStep = useNavigateToNextSubscriptionStep()

  const navigateToNextBeneficiaryValidationStep = async () => {
    try {
      const subscription = await api.getnativev1subscriptionnextStep()
      navigateToNextStep(subscription)
    } catch (_error) {
      throw new AsyncError('NETWORK_REQUEST_FAILED')
    }
  }

  return { navigateToNextBeneficiaryValidationStep }
}

const useNavigateToNextSubscriptionStep = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const isUserUnderage = useIsUserUnderage()
  const { showErrorSnackBar } = useSnackBarContext()
  const isUnderUbbleLoadThreshold = useIsUnderUbbleLoadThreshold()

  return (nextSubscriptionStep: NextSubscriptionStepResponse) => {
    const {
      allowedIdentityCheckMethods,
      nextSubscriptionStep: nextStep,
      maintenancePageType,
    } = nextSubscriptionStep

    if (nextStep === SubscriptionStep.PhoneValidation) return navigate('SetPhoneNumber')
    if (nextStep === SubscriptionStep.Maintenance) {
      const shouldEnableDMS = maintenancePageType === MaintenancePageType.WithDms
      return navigate('IdentityCheckUnavailable', { withDMS: shouldEnableDMS })
    }
    if (
      nextStep === SubscriptionStep.IdentityCheck ||
      nextStep === SubscriptionStep.ProfileCompletion
    ) {
      if (redirectToUbble(allowedIdentityCheckMethods, isUnderUbbleLoadThreshold)) {
        return navigate('IdentityCheck')
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
      }
    } else {
      return isUserUnderage ? navigate('UnavailableEduConnect') : navigateToHome()
    }
  }
}

const redirectToUbble = (
  allowedIdentityCheckMethods: IdentityCheckMethod[],
  isUnderUbbleLoadThreshold: boolean
): boolean =>
  isUnderUbbleLoadThreshold && allowedIdentityCheckMethods.includes(IdentityCheckMethod.Ubble)
