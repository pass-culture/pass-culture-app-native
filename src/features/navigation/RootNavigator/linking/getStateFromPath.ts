import { getStateFromPath } from '@react-navigation/native'

import { isScreen, RootNavigateParams } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { storeUtmParams } from 'libs/utm'

type Path = Parameters<typeof getStateFromPath>[0]
type Config = Parameters<typeof getStateFromPath>[1]
type NavigationState = ReturnType<typeof getStateFromPath>

type QueryParams = Record<string, string>

export function customGetStateFromPath(path: Path, config: Config) {
  const state = getStateFromPath(path, config)
  const [nestedScreen, params] = getNestedNavigationFromState(state)
  addLinkAnalytics(nestedScreen, params)
  return state
}

function getNestedNavigationFromState(state: NavigationState): RootNavigateParams {
  if (!state || !state.routes) {
    return ['PageNotFound', undefined]
  }
  const { routes } = state
  const route = routes[routes.length - 1]
  if (route.state) {
    return getNestedNavigationFromState(route.state)
  }
  return [route.name, route.params] as RootNavigateParams
}

async function addLinkAnalytics(...navigateParams: RootNavigateParams) {
  const [screen, params] = navigateParams
  if (params) {
    await setUtmParameters(params as QueryParams)
    if (isScreen('Offer', screen, params)) {
      analytics.logConsultOffer({ offerId: params.id, from: 'deeplink' })
    }
  }
}

async function setUtmParameters(queryParams: QueryParams) {
  const { utm_campaign: campaign, utm_medium: medium, utm_source: source } = queryParams
  // we want to set the marketing parameters right after the user clicked on marketing link
  if (campaign || medium || source) {
    await storeUtmParams({ campaign, medium, source })
  }
  analytics.setDefaultEventParameters({
    traffic_campaign: campaign || '',
    traffic_source: source || '',
    traffic_medium: medium || '',
  })
}
