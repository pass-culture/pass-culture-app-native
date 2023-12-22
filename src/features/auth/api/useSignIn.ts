import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { SigninResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { LoginRequest, SignInResponseFailure } from 'features/auth/types'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'

export const useSignIn = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: (response: SigninResponse) => void
  onFailure: (error: SignInResponseFailure) => void
}) => {
  const loginRoutine = useLoginRoutine()
  const deviceInfo = useDeviceInfo()

  return useMutation(
    async (body: LoginRequest) => {
      const requestBody = { ...body, deviceInfo }
      if ('authorizationCode' in requestBody) {
        return api.postNativeV1OauthGoogleAuthorize(requestBody)
      }
      return api.postNativeV1Signin(requestBody, { credentials: 'omit' })
    },
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
