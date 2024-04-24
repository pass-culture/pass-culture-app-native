import { useState } from 'react'
import { Platform } from 'react-native'

import { UserProfileResponse } from 'api/gen'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { usePushPermission } from 'features/profile/pages/NotificationSettings/usePushPermission'
import { useMapSubscriptionHomeIdsToThematic } from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export type Props = {
  user?: UserProfileResponse
  homeId: string
  onUpdateSubscriptionSuccess: (thematic: SubscriptionTheme) => Promise<void>
}

export const useThematicSubscription = ({
  user,
  homeId,
  onUpdateSubscriptionSuccess,
}: Props): {
  isSubscribeButtonActive: boolean
  isAtLeastOneNotificationTypeActivated: boolean
  thematic: SubscriptionTheme | null
  updateSubscription: () => void
  updateSettings: ({ allowEmails, allowPush }: { allowEmails: boolean; allowPush: boolean }) => void
} => {
  const { pushPermission } = usePushPermission()
  const isPushPermissionGranted = pushPermission === 'granted'
  const thematic = useMapSubscriptionHomeIdsToThematic(homeId)

  const { showErrorSnackBar } = useSnackBarContext()

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

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    async () => {
      analytics.logNotificationToggle(!!state.allowEmails, !!state.allowPush)
      if (!isSubscribeButtonActive && thematic) {
        analytics.logSubscriptionUpdate({ from: 'thematicHome', type: 'in', entryId: homeId })
        await onUpdateSubscriptionSuccess?.(thematic)
      } else {
        analytics.logSubscriptionUpdate({ from: 'thematicHome', type: 'out', entryId: homeId })
      }
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue, veuillez réessayer',
        timeout: SNACK_BAR_TIME_OUT,
      })
      setState(initialState)
    }
  )

  if (!thematic) {
    return {
      isSubscribeButtonActive: false,
      isAtLeastOneNotificationTypeActivated: false,
      thematic,
      updateSubscription: () => 0,
      updateSettings: () => 0,
    }
  }

  const updateSubscription = () => {
    if (!isAtLeastOneNotificationTypeActivated || isUpdatingProfile) return

    updateProfile({
      subscriptions: {
        marketingEmail: user?.subscriptions.marketingEmail || false,
        marketingPush: user?.subscriptions.marketingPush || false,
        subscribedThemes: isThemeSubscribed
          ? state.themePreferences.filter((t) => t !== thematic)
          : [...state.themePreferences, thematic],
      },
    })
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
          : [...state.themePreferences, thematic],
      },
    })
  }

  return {
    isSubscribeButtonActive: !!isSubscribeButtonActive,
    isAtLeastOneNotificationTypeActivated: !!isAtLeastOneNotificationTypeActivated,
    thematic,
    updateSubscription,
    updateSettings,
  }
}
