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

import { EligibilityCheckMethods } from 'api/gen'
import { useNotifyIdCheckCompleted } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import { ScreenNavigationProp, UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
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
    navigate(...homeNavConfig)
  }

  function syncUserAndProceedToNextScreen() {
    queryClient.invalidateQueries(QueryKeys.USER_PROFILE).finally(() => {
      refetchUserProfileInfo().finally(goToBeneficiaryRequestSent)
    })
  }

  function onSuccess() {
    notifyIdCheckCompleted()
  }

  const eligibilityCheckMethods = userProfileInfo?.allowedEligibilityCheckMethods

  const resetContextValues = useCallback(() => {
    setIsEnteringIdCheck(false)
    async function enterIdCheck() {
      if (!setContextValue) return
      let shouldUseEduConnect
      try {
        const { data: updatedSettings } = await refetchSettings()
        const { data: updatedUserProfileInfo } = await refetchUserProfileInfo()

        shouldUseEduConnect =
          !!updatedSettings?.enableNativeEacIndividual &&
          eligibilityCheckMethods?.includes(EligibilityCheckMethods.educonnect)

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
            isEduconnectEnabled: shouldUseEduConnect,
          }),
          initialStep: updatedUserProfileInfo?.nextBeneficiaryValidationStep as Step,
          shouldUseEduConnect,
        })
      } catch (error) {
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
            isEduconnectEnabled: shouldUseEduConnect,
          }),
          initialStep: userProfileInfo?.nextBeneficiaryValidationStep as Step,
        })
      } finally {
        setIsEnteringIdCheck(true)
      }
    }
    enterIdCheck()
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
  isEduconnectEnabled = false,
}): StepConfig[] {
  return [
    {
      icon: IdCardIcon,
      name: 'id-check',
      text: 'Ton éligibilité',
      ...(isEduconnectEnabled
        ? {
            path: '/educonnect',
            screenName: 'EduConnect',
            screens: ['EduConnect', 'Validation'],
          }
        : {
            path: '/uploadDocument',
            screenName: 'UploadDocument',
            screens: isRetentionEnabled ? ['Conditions'] : ['Conditions', 'Validation'],
          }),
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
