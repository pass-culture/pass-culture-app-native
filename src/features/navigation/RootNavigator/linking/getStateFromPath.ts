import url from 'url'

import { getStateFromPath } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { storeUtmParams } from 'libs/utm'

type Params = Parameters<typeof getStateFromPath>
type Path = Params[0]
type Config = Params[1]

export function customGetStateFromPath(path: Path, config: Config) {
  const { search: stringQueryParams } = url.parse(path, true)

  if (stringQueryParams) parseAndSetUtmParameters(stringQueryParams)

  const state = getStateFromPath(path, config)
  if (state && state.routes) {
    const screenName = state.routes[0].name as ScreenNames
    // TO DO web : use a unique screen for path 'id-check' path (and not Login)
    if (screenName === 'NextBeneficiaryStep') {
      const name: ScreenNames = 'Login'
      return {
        ...state,
        routes: [{ key: 'login-1', name, params: { followScreen: 'NextBeneficiaryStep' } }],
      }
    }
  }
  return state
}

function parseAndSetUtmParameters(search: string) {
  const queryParams = getUrlQueryParams(search)
  const { utm_campaign: campaign, utm_medium: medium, utm_source: source } = queryParams

  // we want to set the marketing parameters right after the user clicked on marketing link
  setImmediate(() => storeUtmParams({ campaign, medium, source }))
  analytics.setDefaultEventParameters({
    traffic_campaign: campaign || '',
    traffic_source: source || '',
    traffic_medium: medium || '',
  })
}

export function getUrlQueryParams(encodedUri: string) {
  const uri = decodeURI(encodedUri)
  const sanitizedUri = uri
    .trim()
    .replace(/^\/+|\/+$/g, '') // removes external '/'
    .replace(/^\?+/g, '') // removes initial '?'
    .replace(/^&+|&+$/g, '') // removes external '&'

  const parameterFields: Record<string, string> = {}
  sanitizedUri.split('&').forEach((field) => {
    const [key, value] = field.split('=')
    parameterFields[key] = value
  })

  return parameterFields
}
