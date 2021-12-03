import { t } from '@lingui/macro'
import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'

import { api } from 'api/api'
import { SubscriptionStep } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
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
      navigateToNextStep(subscription?.nextSubscriptionStep)
    } catch (_error) {
      throw new AsyncError('NETWORK_REQUEST_FAILED')
    }
  }

  return { navigateToNextBeneficiaryValidationStep }
}

const useNavigateToNextSubscriptionStep = () => {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const isUserUnderage = useIsUserUnderage()
  const { showErrorSnackBar } = useSnackBarContext()
  const redirectToUbble = useRedirectToUbble()

  return (nextStep?: SubscriptionStep | null) => {
    if (nextStep === SubscriptionStep.PhoneValidation) return navigate('SetPhoneNumber')
    if (
      nextStep === SubscriptionStep.IdentityCheck ||
      nextStep === SubscriptionStep.ProfileCompletion
    ) {
      if (!settings?.allowIdCheckRegistration) return navigate('IdCheckUnavailable')
      if (redirectToUbble) return navigate('IdentityCheck')

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

const useRedirectToUbble = () => {
  const isUnderUbbleLoadThreshold = useIsUnderUbbleLoadThreshold()
  const { data: user } = useUserProfileInfo()
  // TODO(antoinewg): use EligibilityCheckMethods
  const ubbleAllowed = ((user?.allowedEligibilityCheckMethods || []) as string[]).includes('ubble')

  return isUnderUbbleLoadThreshold && ubbleAllowed
}
