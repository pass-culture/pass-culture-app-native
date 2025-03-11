import { useMutation } from 'react-query'

import { api } from 'api/api'
import { GoogleAccountRequest } from 'api/gen'

export const useGoogleSignupMutation = () => {
  return useMutation((params: GoogleAccountRequest) =>
    api.postNativeV1OauthGoogleAccount(params, { credentials: 'omit' })
  )
}
