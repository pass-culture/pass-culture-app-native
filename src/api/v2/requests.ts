import { AxiosRequestConfig, AxiosResponse } from 'axios'

import {
  RefreshRequestV2,
  RefreshResponseV2,
  SigninRequestV2,
  SigninResponseV2,
  UserProfileResponse,
} from 'api/gen'
import apiClient from 'api/v2/client'

export const postNativeV2RefreshAccessToken = (
  body: RefreshRequestV2,
  options: AxiosRequestConfig = {}
): Promise<RefreshResponseV2> => apiClient.post('/native/v2/refresh_access_token', body, options)

export const postNativeV2Signin = (
  body: SigninRequestV2,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<SigninResponseV2>> =>
  apiClient.post('/native/v2/signin', body, { ...options, omitCredentials: true })

export const getNativeV1Me = (
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<UserProfileResponse>> => apiClient.get('/native/v1/me', options)
