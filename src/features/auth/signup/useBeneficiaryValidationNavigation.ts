import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'

import { api } from 'api/api'
import { SubscriptionStep } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSetIdCheckNavigationContext } from 'features/navigation/useSetIdCheckNavigationContext'
import { useIsUserUnderage } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useBeneficiaryValidationNavigation = () => {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const isUserUnderage = useIsUserUnderage()
  const navigateToIdCheck = useNavigateToIdCheck()
  useSetIdCheckNavigationContext()
  const { showErrorSnackBar } = useSnackBarContext()

  const navigateToNextBeneficiaryValidationStep = useCallback(async () => {
    try {
      const subscription = await api.getnativev1subscriptionnextStep()
      navigateToNextStep(subscription?.nextSubscriptionStep)
    } catch (_error) {
      throw new AsyncError('NETWORK_REQUEST_FAILED')
    }
  }, [settings?.allowIdCheckRegistration, showErrorSnackBar, navigateToIdCheck])

  function navigateToNextStep(nextStep?: SubscriptionStep | null) {
    if (nextStep === SubscriptionStep.PhoneValidation) {
      navigate('SetPhoneNumber')
    } else if (
      nextStep === SubscriptionStep.IdentityCheck ||
      nextStep === SubscriptionStep.ProfileCompletion
    ) {
      if (settings?.allowIdCheckRegistration) {
        try {
          analytics.logIdCheck('Profile')
          navigateToIdCheck()
        } catch (err) {
          eventMonitoring.captureException(err, { isEligible: true, nextStep })
          showErrorSnackBar({
            message: t`Désolé, tu as effectué trop de tentatives. Essaye de nouveau dans 12 heures.`,
            timeout: SNACK_BAR_TIME_OUT,
          })
        }
      } else {
        navigate('IdCheckUnavailable')
      }
    } else {
      isUserUnderage ? navigate('UnavailableEduConnect') : navigateToHome()
    }
  }

  return useMemo(
    () => ({ navigateToNextBeneficiaryValidationStep }),
    [navigateToNextBeneficiaryValidationStep]
  )
}
