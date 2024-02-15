import { SubscriptionScreen } from 'features/identityCheck/types'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'

export const isSubscriptionRoute = (name: string): name is SubscriptionScreen =>
  subscriptionRoutes.map((route) => route.name).includes(name as SubscriptionScreen)
