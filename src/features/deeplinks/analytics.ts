import { RouteParams, AllNavParamList } from 'features/navigation/RootNavigator'
import { logConsultOfferFromDeeplink } from 'libs/analytics'

export const handleDeeplinkAnalytics = <Screen extends keyof AllNavParamList>(
  screen: Screen,
  params: RouteParams<AllNavParamList, Screen>
) => {
  if (screen === 'Offer') {
    logConsultOfferFromDeeplink((params as RouteParams<AllNavParamList, 'Offer'>).id)
  }
}
