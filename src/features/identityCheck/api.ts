import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { BeneficiaryInformationUpdateRequest, IdentificationSessionResponse } from 'api/gen'
import { WEBAPP_V2_URL } from 'libs/environment'
import { MutationKeys } from 'libs/queryKeys'

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

interface IdentityCheckPatchProfileOptions {
  values: BeneficiaryInformationUpdateRequest
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useIdentityCheckCheckpoint({
  values,
  onSuccess,
  onError,
}: IdentityCheckPatchProfileOptions) {
  const { activity, address, city, firstName, lastName, postalCode } = values
  return useMutation(
    () =>
      api.patchnativev1beneficiaryInformation({
        ...(activity ? { activity } : null),
        ...(address ? { address } : null),
        ...(city ? { city } : null),
        ...(firstName ? { firstName } : null),
        ...(lastName ? { lastName } : null),
        ...(postalCode ? { postalCode } : null),
      } as BeneficiaryInformationUpdateRequest),
    {
      onSuccess,
      onError,
    }
  )
}
