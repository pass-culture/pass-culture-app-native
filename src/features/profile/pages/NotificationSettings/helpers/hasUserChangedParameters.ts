import { UserProfileResponse } from 'api/gen'
import { NotificationsSettingsState } from 'features/profile/types'
import { SubscriptionTheme } from 'features/subscription/types'

export const hasUserChangedSubscriptions = ({
  currentSubscriptions,
  stateSubscriptions,
}: {
  currentSubscriptions: string[]
  stateSubscriptions: SubscriptionTheme[]
}) => {
  return !(
    stateSubscriptions.length === currentSubscriptions.length &&
    stateSubscriptions.every((theme: SubscriptionTheme) => currentSubscriptions.includes(theme))
  )
}

export const hasUserChangedParameters = ({
  user,
  state,
}: {
  user?: UserProfileResponse
  state: NotificationsSettingsState
}): boolean => {
  if (!user?.subscriptions?.subscribedThemes) return false

  return (
    user.subscriptions.marketingEmail !== !!state.allowEmails ||
    user.subscriptions.marketingPush !== !!state.allowPush ||
    hasUserChangedSubscriptions({
      currentSubscriptions: user.subscriptions.subscribedThemes,
      stateSubscriptions: state.themePreferences,
    })
  )
}
