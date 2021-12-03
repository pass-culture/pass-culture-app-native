import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ActivityEnum, IdentificationSessionResponse } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { WEBAPP_V2_URL } from 'libs/environment'
import { MutationKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const REDIRECT_URL_UBBLE = `${WEBAPP_V2_URL}/verification-identite/fin`

export function useIdentificationUrl() {
  const [identificationUrl, setIdentificationUrl] = useState<string | undefined>()
  const { mutate: requestIdentificationUrl } = useMutation<IdentificationSessionResponse, void>(
    MutationKeys.IDENTIFICATION_URL,
    () => api.postnativev1ubbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE }),
    { onSuccess: (data) => setIdentificationUrl(data.identificationUrl) }
  )
  useEffect(() => {
    if (identificationUrl) return
    requestIdentificationUrl()
  }, [])

  return identificationUrl
}

export function usePatchProfile() {
  const { profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    () =>
      api.postnativev1subscriptionprofile({
        activity: profile.status as ActivityEnum,
        address: profile.address,
        city: profile.city?.name || '',
        firstName: profile.name?.firstName || '',
        lastName: profile.name?.lastName || '',
        postalCode: profile.city?.postalCode || '',
      }),
    {
      onError: () =>
        showErrorSnackBar({
          message: t`Une erreur est survenue lors de la mise à jour de votre profil`,
          timeout: SNACK_BAR_TIME_OUT,
        }),
    }
  )
}
