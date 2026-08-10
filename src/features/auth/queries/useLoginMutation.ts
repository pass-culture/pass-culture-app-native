import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import { isApiError } from 'api/apiHelpers'
import { SigninRequestV2, SigninResponseV2 } from 'api/gen'
import { postNativeV2Signin } from 'api/v2/requests'
import { LoginRequest, SignInResponseFailure } from 'features/auth/types'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'

export const useLoginMutation = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: (response: AxiosResponse<SigninResponseV2>) => void
  onFailure: (error: SignInResponseFailure) => void
}) => {
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const requestBody = { ...body, deviceInfo: deviceInfoStoreSelectors.selectDeviceInfo() }
      return postNativeV2Signin(requestBody as SigninRequestV2)
    },
    onSuccess,
    onError: (error) => onFailure(generateErrorResponse(error)),
  })
}

export const generateErrorResponse = (error: Error) => {
  const errorResponse: SignInResponseFailure = { isSuccess: false }
  if (isApiError(error)) {
    errorResponse.statusCode = error.statusCode
    errorResponse.content = error.content
  } else {
    errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
  }
  return errorResponse
}
