import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { GoogleAccountRequest } from 'api/gen'
import { logAdjustRegistrationEvents } from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { getAge } from 'shared/user/getAge'

export const useGoogleSignupMutation = () =>
  useMutation({
    mutationFn: (params: GoogleAccountRequest) =>
      api.postNativeV1OauthGoogleAccount(params, { credentials: 'omit' }),
    onSuccess: (_data, requestParams) =>
      logAdjustRegistrationEvents(getAge(requestParams.birthdate)),
  })
