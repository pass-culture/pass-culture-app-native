import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { AccountRequest } from 'api/gen'
import { logAdjustRegistrationEvents } from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { getAge } from 'shared/user/getAge'

export const useAppSignupMutation = () =>
  useMutation({
    mutationFn: (params: AccountRequest) =>
      api.postNativeV1Account(params, { credentials: 'omit' }),
    onSuccess: (_data, requestParams) =>
      logAdjustRegistrationEvents(getAge(requestParams.birthdate)),
  })
