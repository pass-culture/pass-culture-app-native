import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { AccountRequest } from 'api/gen'

export const useAppSignupMutation = () =>
  useMutation({
    mutationFn: (params: AccountRequest) =>
      api.postNativeV1Account(params, { credentials: 'omit' }),
  })
