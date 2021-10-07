import {
  ConfirmationIcon,
  IdCardIcon,
  IdCheckHomePage,
  ProfileIcon,
  Step,
  StepConfig,
  useIdCheckContext,
} from '@pass-culture/id-check'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'

import { useNotifyIdCheckCompleted } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { ScreenNavigationProp, UseNavigationType } from 'features/navigation/RootNavigator'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { LoadingPage } from 'ui/components/LoadingPage'

export const IdCheckV2 = function IdCheckV2(props: ScreenNavigationProp<'IdCheckV2'>) {
  const { setContextValue } = useIdCheckContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings, refetch: refetchSettings } = useAppSettings()
  const queryClient = useQueryClient()
  const { mutate: notifyIdCheckCompleted } = useNotifyIdCheckCompleted({
    onSuccess: syncUserAndProceedToNextScreen,
    onError: syncUserAndProceedToNextScreen,
  })
  const [isEnteringIdCheck, setIsEnteringIdCheck] = useState(true)

  const { refetch: refetchUserProfileInfo, data: userProfileInfo } = useUserProfileInfo({
    cacheTime: 0,
  })

  function goToBeneficiaryRequestSent() {
    navigate('BeneficiaryRequestSent')
  }

  function onAbandon() {
    navigate(...homeNavigateConfig)
  }

  function syncUserAndProceedToNextScreen() {
    queryClient.invalidateQueries(QueryKeys.USER_PROFILE).finally(() => {
      refetchUserProfileInfo().finally(goToBeneficiaryRequestSent)
    })
  }

  function onSuccess() {
    notifyIdCheckCompleted()
  }

  const resetContextValues = useCallback(() => {
    setIsEnteringIdCheck(false)
    if (setContextValue) {
      refetchSettings()
        .then(({ data: updatedSettings }) =>
          refetchUserProfileInfo().then(({ data: updatedUserProfileInfo }) => ({
            updatedSettings,
            updatedUserProfileInfo,
          }))
        )
        .then(({ updatedSettings, updatedUserProfileInfo }) => {
          setContextValue({
            onAbandon,
            onSuccess,
            displayDmsRedirection: !!updatedSettings?.displayDmsRedirection,
            isLicenceTokenChecked: false,
            retention: !!updatedSettings?.enableIdCheckRetention,
            debug: !!updatedSettings?.enableNativeIdCheckVerboseDebugging,
            addressAutoCompletion: !!updatedSettings?.idCheckAddressAutocompletion,
            stepsConfigs: getStepsConfigs({
              isRetentionEnabled: !!updatedSettings?.enableIdCheckRetention,
              isPhoneValidationEnabled: !!updatedSettings?.enablePhoneValidation,
            }),
            initialStep: updatedUserProfileInfo?.nextBeneficiaryValidationStep as Step,
          })
        })
        .catch((error) => {
          eventMonitoring.captureException(error)
          setContextValue({
            onAbandon,
            onSuccess,
            displayDmsRedirection: !!settings?.displayDmsRedirection,
            isLicenceTokenChecked: false,
            retention: !!settings?.enableIdCheckRetention,
            debug: !!settings?.enableNativeIdCheckVerboseDebugging,
            addressAutoCompletion: !!settings?.idCheckAddressAutocompletion,
            stepsConfigs: getStepsConfigs({
              isRetentionEnabled: !!settings?.enableIdCheckRetention,
              isPhoneValidationEnabled: !!settings?.enablePhoneValidation,
            }),
            initialStep: userProfileInfo?.nextBeneficiaryValidationStep as Step,
          })
        })
        .finally(() => setIsEnteringIdCheck(true))
    }
  }, [setContextValue])

  useFocusEffect(resetContextValues)

  if (!isEnteringIdCheck) {
    return <LoadingPage />
  }

  // @ts-expect-error : props typing issue with IdCheck screen from module.
  // Probably needs some change on the side of the module.
  return <IdCheckHomePage {...props} />
}

function getStepsConfigs({
  isRetentionEnabled = false,
  isPhoneValidationEnabled = false,
}): StepConfig[] {
  return [
    {
      icon: IdCardIcon,
      name: 'id-check',
      path: '/uploadDocument',
      screenName: 'UploadDocument',
      screens: isRetentionEnabled ? ['Conditions'] : ['Conditions', 'Validation'],
      text: 'Ton éligibilité',
    },
    {
      icon: ProfileIcon,
      name: 'beneficiary-information',
      path: isPhoneValidationEnabled ? '/status' : '/phone',
      screenName: isPhoneValidationEnabled ? 'Status' : 'Phone',
      screens: isPhoneValidationEnabled
        ? ['Status', 'City', 'Address']
        : ['Phone', 'Status', 'City', 'Address'],
      text: 'Ton profil',
    },
    {
      icon: ConfirmationIcon,
      name: 'confirmation',
      path: '/honor',
      screenName: 'Honor',
      screens: ['Honor'],
      text: 'Confirmation',
    },
  ]
}
