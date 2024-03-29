import { SubscriptionTheme } from 'features/subscription/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'

export const useMapSubscriptionHomeIdsToTheme = (homeId: string): SubscriptionTheme | null => {
  const { subscriptionHomeEntryIds } = useRemoteConfigContext()
  const ThemeList = Object.keys(subscriptionHomeEntryIds) as SubscriptionTheme[]
  return (
    ThemeList.find((key: SubscriptionTheme) => subscriptionHomeEntryIds[key] === homeId) ?? null
  )
}
