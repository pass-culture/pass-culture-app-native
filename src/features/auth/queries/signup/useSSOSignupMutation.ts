import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { SSOAccountRequest } from 'api/gen'
import { logAdjustRegistrationEvents } from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { getAge } from 'shared/user/getAge'

export const useSSOSignupMutation = (ssoProvider: 'google' | 'apple' | undefined) =>
  useMutation({
    mutationFn: (params: SSOAccountRequest) => {
      if (!ssoProvider) throw new Error('ssoProvider is required for SSO signup')
      return api.postNativeV1OauthssoProviderAccount(params, ssoProvider, { credentials: 'omit' })
    },
    onSuccess: (_data, requestParams) =>
      logAdjustRegistrationEvents(getAge(requestParams.birthdate)),
  })
