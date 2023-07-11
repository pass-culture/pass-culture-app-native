import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { SigninRequest, SigninResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { SignInResponseFailure } from 'features/auth/types'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useSignIn = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: (response: SigninResponse) => void
  onFailure: (error: SignInResponseFailure) => void
}) => {
  const loginRoutine = useLoginRoutine()
  const deviceInfo = useDeviceInfo()
  const enableTrustedDevice = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE)

  return useMutation(
    (body: SigninRequest) =>
      api.postnativev1signin(
        { ...body, deviceInfo: enableTrustedDevice ? deviceInfo : undefined },
        { credentials: 'omit' }
      ),
    {
      onSuccess: async (response) => {
        await loginRoutine(response, 'fromLogin')
        onSuccess(response)
      },
      onError: (error) => {
        const errorResponse: SignInResponseFailure = { isSuccess: false }
        if (isApiError(error)) {
          errorResponse.statusCode = error.statusCode
          errorResponse.content = error.content
        } else {
          errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
        }
        onFailure(errorResponse)
      },
    }
  )
}
