import { getStateFromPath } from '@react-navigation/native'

import { isScreen, RootNavigateParams } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { storeUtmParams } from 'libs/utm'

import { getNestedNavigationFromState } from './getNestedNavigationFromState'

type Path = Parameters<typeof getStateFromPath>[0]
type Config = Parameters<typeof getStateFromPath>[1]

type QueryParams = Record<string, string>

export function customGetStateFromPath(path: Path, config: Config) {
  const state = getStateFromPath(path, config)
  const [nestedScreen, params] = getNestedNavigationFromState(state)
  addLinkAnalytics(nestedScreen, params)
  return state
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
