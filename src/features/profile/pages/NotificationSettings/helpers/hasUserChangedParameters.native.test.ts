import { hasUserChangedParameters } from 'features/profile/pages/NotificationSettings/helpers/hasUserChangedParameters'
import { NotificationsSettingsState } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'

describe('hasUserChangedParameters', () => {
  it('should return false if nothing is different between user and state', () => {
    const user = {
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
      },
    }
    const state: NotificationsSettingsState = {
      allowEmails: true,
      allowPush: true,
      themePreferences: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
    }

    expect(hasUserChangedParameters(user, state)).toBe(false)
  })

  it('should return true if user switch marketing email', () => {
    const user = {
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
      },
    }
    const state: NotificationsSettingsState = {
      allowEmails: false,
      allowPush: true,
      themePreferences: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
    }

    expect(hasUserChangedParameters(user, state)).toBe(true)
  })

  it('should return true if user subscribe at a theme and unsuscribe another', () => {
    const user = {
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.COURS],
      },
    }
    const state: NotificationsSettingsState = {
      allowEmails: true,
      allowPush: true,
      themePreferences: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
    }

    expect(hasUserChangedParameters(user, state)).toBe(true)
  })
})
