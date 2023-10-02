import { getStateFromPath } from '@react-navigation/native'

import { isScreen, RootNavigateParams } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { storeUtmParams } from 'libs/utm'
import { getUtmParamsConsent } from 'libs/utm/getUtmParamsConsent'

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

export async function setUtmParameters(queryParams: QueryParams) {
  const { acceptedTrafficCampaign, acceptedTrafficMedium, acceptedTrafficSource } =
    await getUtmParamsConsent()
  const { utm_campaign, utm_gen, utm_medium, utm_source } = queryParams

  const campaign = acceptedTrafficCampaign ? utm_campaign : undefined
  const gen = acceptedTrafficCampaign ? utm_gen : undefined
  const medium = acceptedTrafficMedium ? utm_medium : undefined
  const source = acceptedTrafficSource ? utm_source : undefined
  // we want to set the marketing parameters right after the user clicked on marketing link
  if (campaign || gen || medium || source) {
    await storeUtmParams({ campaign, gen, medium, source })
  }
  firebaseAnalytics.setDefaultEventParameters({
    traffic_campaign: campaign,
    traffic_gen: gen,
    traffic_medium: medium,
    traffic_source: source,
  })
}
