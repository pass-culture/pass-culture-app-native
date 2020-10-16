import CookieManager from '@react-native-community/cookies'
import { Alert } from 'react-native'

import { env } from 'libs/environment'
import { getCookie, setCookieFromResponse } from 'libs/storage'

export async function post<Body>(url: string, request: RequestInit): Promise<Body> {
  request.method = 'POST'
  request.body = JSON.stringify(request.body)
  return makeRequest<Body>(url, request)
}

async function makeRequest<Body>(url: string, request: RequestInit): Promise<Body> {
  await CookieManager.clearAll() // clear cookies stored natively before each request
  const cookie = await getCookie()
  const config = {
    ...request,
    headers: {
      cookie: cookie || '',
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  }

  const response = await fetch(env.API_BASE_URL + url, config)

  try {
    setCookieFromResponse(response)
  } catch (err) {
    Alert.alert(err)
  }
  const json = await response.json()
  return json
}
