import { UserProfileResponse } from 'api/gen'
import { NotificationsSettingsState } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { SubscriptionTheme } from 'features/subscription/types'

export const hasUserChangedParameters = (
  user: UserProfileResponse,
  state: NotificationsSettingsState
): boolean => {
  const hasChangeSubscriptions = !(
    user?.subscriptions.subscribedThemes?.length === state.themePreferences.length &&
    state.themePreferences.every((theme: SubscriptionTheme) =>
      user?.subscriptions.subscribedThemes?.includes(theme)
    )
  )

  return (
    user?.subscriptions.marketingEmail !== !!state.allowEmails ||
    user?.subscriptions.marketingPush !== !!state.allowPush ||
    hasChangeSubscriptions
  )
}
