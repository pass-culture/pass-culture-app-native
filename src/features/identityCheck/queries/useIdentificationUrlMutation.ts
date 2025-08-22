import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { MaintenancePageType } from 'api/gen'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { MutationKeys } from 'libs/queryKeys'

export const useIdentificationUrlMutation = () => {
  const { data: subscription } = useGetStepperInfoQuery()
  const [identificationUrl, setIdentificationUrl] = useState<string | undefined>()
  const { navigate, replace } = useNavigation<UseNavigationType>()

  const { mutate: postIdentificationUrl } = useMutation(
    [MutationKeys.IDENTIFICATION_URL],
    async () => {
      try {
        const data = await api.postNativeV1UbbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE })
        setIdentificationUrl(data.identificationUrl)
      } catch (err) {
        const error = (err as ApiError)?.content.code
        if (error === 'IDCHECK_ALREADY_PROCESSED') {
          navigate(...getSubscriptionHookConfig('IdentityCheckPending'))
        } else {
          const withDMS = subscription?.maintenancePageType === MaintenancePageType['with-dms']
          replace(...getSubscriptionHookConfig('IdentityCheckUnavailable', { withDMS }))
        }
      }
    }
  )

  useEffect(() => {
    if (identificationUrl) return
    postIdentificationUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return identificationUrl
}
