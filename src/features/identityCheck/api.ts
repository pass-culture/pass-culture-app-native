import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { IdentificationSessionResponse, ProfileUpdateRequest } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckState } from 'features/identityCheck/context/types'
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

const getCommpleteProfile = (
  profile: IdentityCheckState['profile']
): ProfileUpdateRequest | null => {
  if (
    profile.status &&
    profile.address &&
    profile.city &&
    profile.city.name &&
    profile.city.postalCode &&
    profile.name &&
    profile.name.firstName &&
    profile.name.lastName
  ) {
    return {
      activity: profile.status,
      address: profile.address,
      city: profile.city.name,
      firstName: profile.name.firstName,
      lastName: profile.name.lastName,
      postalCode: profile.city.postalCode,
    }
  }
  return null
}

export function usePatchProfile() {
  const { profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    () => {
      const body = getCommpleteProfile(profile)
      return body ? api.postnativev1subscriptionprofile(body) : Promise.reject()
    },
    {
      onError: () =>
        showErrorSnackBar({
          message: t`Une erreur est survenue lors de la mise à jour de votre profil`,
          timeout: SNACK_BAR_TIME_OUT,
        }),
    }
  )
}
