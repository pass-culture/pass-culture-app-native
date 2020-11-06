import { t } from '@lingui/macro'
import { Alert } from 'react-native'
import { useQuery } from 'react-query'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { get, post } from 'libs/fetch'
import { _ } from 'libs/i18n'
import { saveToken } from 'libs/storage'
import {getRefreshToken, storeRefreshToken} from "libs/keychain";

type Credentials = {
  email: string
  password: string
}

type SigninResponse = {
  access_token: string
}

export async function signin({ email, password }: Credentials): Promise<boolean> {
  const body = { identifier: email, password }
  try {
    const { access_token } = await post<SigninResponse>('/native/v1/signin', {
      body,
      credentials: 'omit',
    })
    await saveToken(access_token)
    await storeRefreshToken(email, access_token)

    const token = await getRefreshToken()
    console.log('token', token)

    await analytics.logLogin({ method: env.API_BASE_URL })
    return true
  } catch (error) {
    Alert.alert(_(t`Échec de la connexion au Pass Culture: ${error.message}`))
    return false
  }
}

type LoggedInAs = {
  logged_in_as: string
}

export function useCurrentUser() {
  const { data: email, isFetching, refetch, error, isError } = useQuery<string>({
    querykey: 'currentUser',
    queryFn: async function () {
      const json = await get<LoggedInAs>('/native/v1/protected')
      return json.logged_in_as
    },
  })
  return { email, isFetching, refetch, error, isError }
}
