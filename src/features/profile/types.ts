import { SubscriptionTheme } from 'features/subscription/types'

export type NotificationsSettingsState = {
  allowEmails?: boolean
  allowPush?: boolean
  themePreferences: SubscriptionTheme[]
}

export type ProfileFeatureFlagsProps = {
  featureFlags: {
    enablePassForAll: boolean
    enableProfileV2: boolean
    disableActivation: boolean
  }
}
