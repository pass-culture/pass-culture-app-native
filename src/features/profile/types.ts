import { SubscriptionTheme } from 'features/subscription/types'

export type NotificationsSettingsState = {
  allowEmails?: boolean
  allowPush?: boolean
  themePreferences: SubscriptionTheme[]
}
