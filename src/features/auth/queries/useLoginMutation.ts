import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import { isApiError } from 'api/apiHelpers'
import { OAuthSigninRequestV2, SigninRequestV2, SigninResponseV2 } from 'api/gen'
import { postNativeV2OauthSSOProviderAuthorize, postNativeV2Signin } from 'api/v2/requests'
import { LoginRequestV2, OAuthLoginRequest, SignInResponseFailure } from 'features/auth/types'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'

export const useLoginMutation = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: (response: AxiosResponse<SigninResponseV2>) => void
  onFailure: (error: SignInResponseFailure) => void
}) =>
  useMutation({
    mutationFn: async (body: LoginRequestV2) => {
      const requestBody: SigninRequestV2 = {
        ...body,
        deviceInfo: deviceInfoStoreSelectors.selectDeviceInfo(),
      }
      return postNativeV2Signin(requestBody)
    },
    onSuccess,
    onError: (error) => onFailure(generateErrorResponse(error)),
  })

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

export const useSSOLoginMutation = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: (response: AxiosResponse<SigninResponseV2>) => void
  onFailure: (error: SignInResponseFailure) => void
}) =>
  useMutation({
    mutationFn: async (body: OAuthLoginRequest) => {
      const requestBody: OAuthSigninRequestV2 = {
        ...body,
        deviceInfo: deviceInfoStoreSelectors.selectDeviceInfo(),
      }
      return postNativeV2OauthSSOProviderAuthorize(body.provider, requestBody)
    },
    onSuccess,
    onError: (error) => onFailure(generateErrorResponse(error)),
  })
