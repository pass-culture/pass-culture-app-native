import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import { SubscriptionScreen } from 'ui/components/StepButton/types'

export const isSubscriptionRoute = (name: string): name is SubscriptionScreen =>
  subscriptionRoutes.map((route) => route.name).includes(name as SubscriptionScreen)
