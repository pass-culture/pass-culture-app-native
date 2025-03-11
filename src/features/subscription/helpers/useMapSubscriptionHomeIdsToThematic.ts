import { SubscriptionTheme } from 'features/subscription/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export const useMapSubscriptionHomeIdsToThematic = (homeId: string): SubscriptionTheme | null => {
  const { subscriptionHomeEntryIds } = useRemoteConfigQuery()
  const ThematicList = Object.keys(subscriptionHomeEntryIds) as SubscriptionTheme[]
  return (
    ThematicList.find((key: SubscriptionTheme) => subscriptionHomeEntryIds[key] === homeId) ?? null
  )
}
