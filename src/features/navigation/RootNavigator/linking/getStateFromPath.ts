import url from 'url'

import { getStateFromPath } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { storeUtmParams } from 'libs/utm'

type Params = Parameters<typeof getStateFromPath>
type Path = Params[0]
type Config = Params[1]

type QueryParams = Record<string, string>

export function customGetStateFromPath(path: Path, config: Config) {
  const queryParams = getQueryParamsFromPath(path)

  if (queryParams) {
    setUtmParameters(queryParams)
  }

  const state = getStateFromPath(path, config)
  if (state && state.routes) {
    const route = state.routes[0]
    const screen = route.name as keyof RootStackParamList
    addDeeplinkAnalytics(screen, route.params)
    // TO DO web : use a unique screen for path 'id-check' path (and not Login)
    if (screen === 'NextBeneficiaryStep') {
      const name: ScreenNames = 'Login'
      return {
        ...state,
        routes: [{ key: 'login-1', name, params: { followScreen: 'NextBeneficiaryStep' } }],
      }
    }
  }
  return state
}

function setUtmParameters(queryParams: QueryParams) {
  const { utm_campaign: campaign, utm_medium: medium, utm_source: source } = queryParams

  // we want to set the marketing parameters right after the user clicked on marketing link
  setImmediate(() => storeUtmParams({ campaign, medium, source }))
  analytics.setDefaultEventParameters({
    traffic_campaign: campaign || '',
    traffic_source: source || '',
    traffic_medium: medium || '',
  })
}

function addDeeplinkAnalytics<Screen extends keyof RootStackParamList>(
  screen: Screen,
  params: RootStackParamList[Screen]
) {
  if (screen === 'Offer' && params) {
    const { id: offerId } = params as RootStackParamList['Offer']
    analytics.logConsultOffer({ offerId, from: 'deeplink' })
  }
}

export function getQueryParamsFromPath(path: string): QueryParams | null {
  const { search: stringQueryParams } = url.parse(path, true)
  if (!stringQueryParams) {
    return null
  }

  const uri = decodeURI(stringQueryParams)
  const sanitizedUri = uri
    .trim()
    .replace(/^\/+|\/+$/g, '') // removes external '/'
    .replace(/^\?+/g, '') // removes initial '?'
    .replace(/^&+|&+$/g, '') // removes external '&'

  const parameterFields: QueryParams = {}
  sanitizedUri.split('&').forEach((field) => {
    const [key, value] = field.split('=')
    parameterFields[key] = value
  })

  return parameterFields
}
