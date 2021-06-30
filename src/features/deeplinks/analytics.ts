import { RouteParams, AllNavParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'

export const handleDeeplinkAnalytics = <Screen extends keyof AllNavParamList>(
  screen: Screen,
  params: RouteParams<AllNavParamList, Screen>
) => {
  if (screen === 'Offer') {
    const { id: offerId } = params as RouteParams<AllNavParamList, 'Offer'>
    analytics.logConsultOffer({ offerId, from: 'deeplink' })
  }
}
