import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'

import { BeneficiaryValidationStep } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

type PrefetchedInfo = {
  email: string | null
  nextBeneficiaryValidationStep: BeneficiaryValidationStep | null
}

export const useBeneficiaryValidationNavigation = () => {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetch } = useUserProfileInfo()
  const navigateToIdCheck = useNavigateToIdCheck({
    onIdCheckNavigationBlocked: () => navigate('IdCheckUnavailable'),
  })
  const { showErrorSnackBar } = useSnackBarContext()
  const [error, setError] = useState<Error | null>(null)

  const navigateToNextBeneficiaryValidationStep = useCallback(
    (prefetchedInfo?: PrefetchedInfo) => {
      if (!prefetchedInfo) {
        refetch()
          .then((value) => {
            const user = value.data
            const nextStep = user?.nextBeneficiaryValidationStep ?? null
            const email = user?.email ?? null
            navigateToNextStep(nextStep, email)
          })
          .catch(setError)
      } else {
        navigateToNextStep(prefetchedInfo.nextBeneficiaryValidationStep, prefetchedInfo.email)
      }
    },
    [settings?.allowIdCheckRegistration, showErrorSnackBar, navigateToIdCheck, refetch]
  )

  function navigateToNextStep(
    nextStep: PrefetchedInfo['nextBeneficiaryValidationStep'],
    email: PrefetchedInfo['email']
  ) {
    if (nextStep === BeneficiaryValidationStep.PhoneValidation && settings?.enablePhoneValidation) {
      navigate('SetPhoneNumber')
    } else if (nextStep === BeneficiaryValidationStep.IdCheck) {
      if (settings?.allowIdCheckRegistration && !!email) {
        try {
          analytics.logIdCheck('Profile')
          navigateToIdCheck(email)
        } catch (err) {
          eventMonitoring.captureException(err, { isEligible: true })
          showErrorSnackBar({
            message: t`Désolé, tu as effectué trop de tentatives. Essaye de nouveau dans 12 heures.`,
            timeout: SNACK_BAR_TIME_OUT,
          })
        }
      } else {
        navigate('IdCheckUnavailable')
      }
    } else {
      navigateToHome()
    }
  }

  return useMemo(() => ({ error, navigateToNextBeneficiaryValidationStep }), [
    error,
    navigateToNextBeneficiaryValidationStep,
  ])
}
