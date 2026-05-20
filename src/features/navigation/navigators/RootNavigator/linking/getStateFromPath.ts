import { getStateFromPath } from '@react-navigation/native'

import { RootNavigateParams } from 'features/navigation/navigators/RootNavigator/types'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
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
  const [_, params] = navigateParams
  if (params) {
    await setUtmParameters(params as QueryParams)
  }
}

export async function setUtmParameters(queryParams: QueryParams) {
  const { acceptedTrafficCampaign, acceptedTrafficMedium, acceptedTrafficSource } =
    await getUtmParamsConsent()
  const {
    utm_campaign = null,
    utm_content = null,
    utm_gen = null,
    utm_medium = null,
    utm_source = null,
  } = queryParams

  const campaign = acceptedTrafficCampaign ? utm_campaign : null
  const content = acceptedTrafficCampaign ? utm_content : null
  const gen = acceptedTrafficCampaign ? utm_gen : null
  const medium = acceptedTrafficMedium ? utm_medium : null
  const source = acceptedTrafficSource ? utm_source : null
  // we want to set the marketing parameters right after the user clicked on marketing link
  if (campaign || content || gen || medium || source) {
    await storeUtmParams({ campaign, content, gen, medium, source })
  }
  firebaseAnalytics.setDefaultEventParameters({
    traffic_campaign: campaign,
    traffic_content: content,
    traffic_gen: gen,
    traffic_medium: medium,
    traffic_source: source,
  })
}
