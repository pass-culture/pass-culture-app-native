import { SubscriptionTheme } from 'features/subscription/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useMapSubscriptionHomeIdsToThematic = (homeId: string): SubscriptionTheme | null => {
  const { subscriptionHomeEntryIds } = useRemoteConfigContext()
  const ThematicList = Object.keys(subscriptionHomeEntryIds) as SubscriptionTheme[]
  return (
    ThematicList.find((key: SubscriptionTheme) => subscriptionHomeEntryIds[key] === homeId) ?? null
  )
}
