import { useState } from 'react'
import { Platform } from 'react-native'

import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { SubscriptionAnalyticsParams, SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type AnalyticsInfos = { venueId: string; homeId?: never } | { homeId: string; venueId?: never }

export type Props = {
  user?: UserProfileResponseWithoutSurvey
  onUpdateSubscriptionSuccess: (thematic: SubscriptionTheme) => Promise<void>
  thematic?: SubscriptionTheme | null
} & AnalyticsInfos

export const useThematicSubscription = ({
  user,
  onUpdateSubscriptionSuccess,
  homeId,
  thematic,
  venueId,
}: Props): {
  isSubscribeButtonActive: boolean
  isAtLeastOneNotificationTypeActivated: boolean
  updateSubscription: () => void
  updateSettings: ({ allowEmails, allowPush }: { allowEmails: boolean; allowPush: boolean }) => void
} => {
  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'

  const isAtLeastOneNotificationTypeActivated =
    Platform.OS === 'web'
      ? user?.subscriptions?.marketingEmail
      : (isPushPermissionGranted && user?.subscriptions?.marketingPush) ||
        user?.subscriptions?.marketingEmail

  const initialState = {
    allowEmails: user?.subscriptions?.marketingEmail,
    allowPush: user?.subscriptions?.marketingPush,
    themePreferences:
      (user?.subscriptions?.subscribedThemes as unknown as SubscriptionTheme[]) || [],
  }

  const [state, setState] = useState(initialState)

  const isThemeSubscribed =
    (thematic && user?.subscriptions?.subscribedThemes?.includes(thematic)) ?? false

  const isSubscribeButtonActive = isAtLeastOneNotificationTypeActivated && isThemeSubscribed

  const { mutate: patchProfile, isPending: isUpdatingProfile } = usePatchProfileMutation({
    onSuccess: async () => {
      analytics.logNotificationToggle(!!state.allowEmails, !!state.allowPush)
      const analyticsParams = homeId
        ? { from: 'thematicHome', entryId: homeId }
        : { from: 'venue', venueId }
      if (!isSubscribeButtonActive && thematic) {
        analytics.logSubscriptionUpdate({
          ...analyticsParams,
          type: 'in',
        } as SubscriptionAnalyticsParams)
        await onUpdateSubscriptionSuccess?.(thematic)
      } else {
        analytics.logSubscriptionUpdate({
          ...analyticsParams,
          type: 'out',
        } as SubscriptionAnalyticsParams)
      }
    },
    onError: () => {
      showErrorSnackBar('Une erreur est survenue, veuillez réessayer')
      setState(initialState)
    },
  })

  if (!thematic) {
    return {
      isSubscribeButtonActive: false,
      isAtLeastOneNotificationTypeActivated: false,
      updateSubscription: () => 0,
      updateSettings: () => 0,
    }
  }

  const updateSubscription = () => {
    if (!isAtLeastOneNotificationTypeActivated || isUpdatingProfile) return

    patchProfile({
      subscriptions: {
        marketingEmail: user?.subscriptions.marketingEmail || false,
        marketingPush: user?.subscriptions.marketingPush || false,
        subscribedThemes: isThemeSubscribed
          ? state.themePreferences.filter((t) => t !== thematic)
          : [...state.themePreferences, thematic],
      },
      origin: homeId ? 'ThematicHome' : 'Venue',
    })
  }

  const updateSettings = ({
    allowEmails,
    allowPush,
  }: {
    allowEmails: boolean
    allowPush: boolean
  }) => {
    patchProfile({
      subscriptions: {
        marketingEmail: allowEmails,
        marketingPush: allowPush,
        subscribedThemes: isThemeSubscribed
          ? state.themePreferences
          : [...state.themePreferences, thematic],
      },
      origin: 'Profile',
    })
  }

  return {
    isSubscribeButtonActive: !!isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated: !!isAtLeastOneNotificationTypeActivated,
    updateSubscription,
    updateSettings,
  }
}
