import { useState } from 'react'
import { Platform } from 'react-native'

import { UserProfileResponse } from 'api/gen'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics'

export type Props = {
  user: UserProfileResponse | undefined
  theme: SubscriptionTheme
}

export const useThematicSubscription = ({
  user,
  theme,
}: Props): {
  isSubscribeButtonActive: boolean
  isAtLeastOneNotificationTypeActivated: boolean
  updateSubscription: () => void
  updateSettings: ({ allowEmails, allowPush }: { allowEmails: boolean; allowPush: boolean }) => void
} => {
  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'

  const isAtLeastOneNotificationTypeActivated =
    (Platform.OS === 'web' && !user?.subscriptions.marketingEmail) ||
    (Platform.OS !== 'web' &&
      !(
        (isPushPermissionGranted && user?.subscriptions.marketingPush) ||
        user?.subscriptions.marketingEmail
      ))

  const initialState = {
    allowEmails: user?.subscriptions.marketingEmail,
    allowPush: user?.subscriptions.marketingPush,
    themePreferences:
      (user?.subscriptions.subscribedThemes as unknown as SubscriptionTheme[]) || [],
  }

  const [state, setState] = useState(initialState)

  const isThemeSubscribed = user?.subscriptions?.subscribedThemes?.includes(theme) ?? false

  const isSubscribeButtonActive = isAtLeastOneNotificationTypeActivated && isThemeSubscribed

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    () => {
      analytics.logNotificationToggle(!!state.allowEmails, !!state.allowPush)
    },
    () => {
      setState(initialState)
    }
  )

  const updateSubscription = () => {
    if (!isAtLeastOneNotificationTypeActivated || isUpdatingProfile) {
      return
    } else {
      updateProfile({
        subscriptions: {
          marketingEmail: user?.subscriptions.marketingEmail || false,
          marketingPush: user?.subscriptions.marketingPush || false,
          subscribedThemes: isThemeSubscribed
            ? state.themePreferences.filter((t) => t !== theme)
            : [...state.themePreferences, theme],
        },
      })
    }
  }

  const updateSettings = ({
    allowEmails,
    allowPush,
  }: {
    allowEmails: boolean
    allowPush: boolean
  }) => {
    updateProfile({
      subscriptions: {
        marketingEmail: allowEmails,
        marketingPush: allowPush,
        subscribedThemes: isThemeSubscribed
          ? state.themePreferences
          : [...state.themePreferences, theme],
      },
    })
  }

  return {
    isSubscribeButtonActive: isSubscribeButtonActive || false,
    isAtLeastOneNotificationTypeActivated: isAtLeastOneNotificationTypeActivated || false,
    updateSubscription,
    updateSettings,
  }
}
