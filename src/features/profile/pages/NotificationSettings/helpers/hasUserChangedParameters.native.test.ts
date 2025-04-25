import { hasUserChangedParameters } from 'features/profile/pages/NotificationSettings/helpers/hasUserChangedParameters'
import { NotificationsSettingsState } from 'features/profile/types'
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

    expect(hasUserChangedParameters({ user, state })).toBe(false)
  })

  it('should return true when user changes email opt-in', () => {
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

    expect(hasUserChangedParameters({ user, state })).toBe(true)
  })

  it('should return true when user subscribes to a theme and unsusbcribes from another', () => {
    const user = {
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.ACTIVITES],
      },
    }
    const state: NotificationsSettingsState = {
      allowEmails: true,
      allowPush: true,
      themePreferences: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
    }

    expect(hasUserChangedParameters({ user, state })).toBe(true)
  })

  it('should return false when user has no subscribedTheme', () => {
    const user = {
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
      },
    }
    const state: NotificationsSettingsState = {
      allowEmails: true,
      allowPush: true,
      themePreferences: [SubscriptionTheme.CINEMA, SubscriptionTheme.MUSIQUE],
    }

    expect(hasUserChangedParameters({ state, user })).toBe(false)
  })
})
