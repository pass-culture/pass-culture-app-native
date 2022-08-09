import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse, UserProfileUpdateRequest } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'

export enum CHANGE_EMAIL_ERROR_CODE {
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  EMAIL_UPDATE_ATTEMPTS_LIMIT = 'EMAIL_UPDATE_ATTEMPTS_LIMIT',
}

export interface ChangeEmailRequest {
  email: string
  password: string
}

type ResetRecreditAmountToShowMutationOptions = {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useUpdateProfileMutation(
  onSuccessCallback: (data: UserProfileResponse) => void,
  onErrorCallback: (error: unknown) => void
) {
  const client = useQueryClient()
  return useMutation((body: UserProfileUpdateRequest) => api.postnativev1profile(body), {
    onSuccess(response: UserProfileResponse) {
      client.setQueryData(QueryKeys.USER_PROFILE, (old: UserProfileResponse | undefined) => ({
        ...(old || {}),
        ...response,
      }))
      onSuccessCallback(response)
    },
    onError: onErrorCallback,
  })
}

export function useResetRecreditAmountToShow({
  onSuccess,
  onError,
}: ResetRecreditAmountToShowMutationOptions) {
  return useMutation(() => api.postnativev1resetRecreditAmountToShow(), {
    onSuccess,
    onError,
  })
}

const STALE_TIME_USER_PROFILE = 5 * 60 * 1000

export function useUserProfileInfo(options = {}) {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return usePersistQuery<UserProfileResponse>(QueryKeys.USER_PROFILE, () => api.getnativev1me(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    ...options,
  })
}
