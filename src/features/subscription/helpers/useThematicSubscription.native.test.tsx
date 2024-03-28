import * as API from 'api/api'
import { UserProfileResponse } from 'api/gen'
import {
  useThematicSubscription,
  Props as useThematicSubscriptionProps,
} from 'features/subscription/helpers/useThematicSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const postProfileSpy = jest.spyOn(API.api, 'postNativeV1Profile')

const userWithNotificationsAndSubscribed: UserProfileResponse = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
    subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.ACTIVITES],
  },
}
const userWithoutNotificationsButWithSubscriptions: UserProfileResponse = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: false,
    marketingPush: false,
    subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.ACTIVITES],
  },
}
const userWithNotificationsButNoSubscriptions: UserProfileResponse = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
    subscribedThemes: [],
  },
}
const userWithoutNotificationsAndWithoutSubscriptions: UserProfileResponse = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: false,
    marketingPush: false,
    subscribedThemes: [],
  },
}

describe('useThematicSubscription', () => {
  describe('when the user has notifications on', () => {
    it('should return false', async () => {
      const { result } = renderUseThematicSubscription({
        user: userWithoutNotificationsAndWithoutSubscriptions,
        theme: SubscriptionTheme.ACTIVITES,
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeFalsy()
      })
    })

    describe('when the user is already subscribed to the page', () => {
      it('should return active button', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsAndSubscribed,
          theme: SubscriptionTheme.ACTIVITES,
        })

        await waitFor(() => {
          expect(result.current).toMatchObject({
            isSubscribeButtonActive: true,
            updateSubscription: expect.anything(),
            updateSettings: expect.anything(),
          })
        })
      })

      it('should unsubscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsAndSubscribed,
          theme: SubscriptionTheme.CINEMA,
        })

        result.current.updateSubscription()

        await waitFor(() => {
          expect(postProfileSpy).toHaveBeenCalledWith({
            subscriptions: {
              marketingEmail: true,
              marketingPush: true,
              subscribedThemes: [SubscriptionTheme.ACTIVITES],
            },
          })
        })
      })
    })

    describe("when the user isn't subscribed to the current page", () => {
      it('should return inactive button', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsButNoSubscriptions,
          theme: SubscriptionTheme.ACTIVITES,
        })

        await waitFor(() => {
          expect(result.current).toMatchObject({
            isSubscribeButtonActive: false,
            updateSubscription: expect.anything(),
            updateSettings: expect.anything(),
          })
        })
      })

      it('should subscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsButNoSubscriptions,
          theme: SubscriptionTheme.MUSIQUE,
        })

        result.current.updateSubscription()

        await waitFor(() => {
          expect(postProfileSpy).toHaveBeenCalledWith({
            subscriptions: {
              marketingEmail: true,
              marketingPush: true,
              subscribedThemes: [SubscriptionTheme.MUSIQUE],
            },
          })
        })
      })
    })
  })

  describe('when the user has notifications off (opens modal when hook is use of thematic home)', () => {
    it('should return true', async () => {
      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsButNoSubscriptions,
        theme: SubscriptionTheme.ACTIVITES,
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeTruthy()
      })
    })

    describe('when the user is already subscribed to the page', () => {
      it('should return inactive button', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsButWithSubscriptions,
          theme: SubscriptionTheme.CINEMA,
        })

        await waitFor(() => {
          expect(result.current).toMatchObject({
            isSubscribeButtonActive: false,
            updateSubscription: expect.anything(),
            updateSettings: expect.anything(),
          })
        })
      })

      it('should not subscribe when the user clicks subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsButWithSubscriptions,
          theme: SubscriptionTheme.CINEMA,
        })

        result.current.updateSettings({
          allowEmails: true,
          allowPush: true,
        })

        await waitFor(() => {
          expect(postProfileSpy).toHaveBeenCalledWith({
            subscriptions: {
              marketingEmail: true,
              marketingPush: true,
              subscribedThemes: [SubscriptionTheme.CINEMA, SubscriptionTheme.ACTIVITES],
            },
          })
        })
      })
    })

    describe("when the user isn't subscribed to the current page", () => {
      it('should return inactive button', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsAndWithoutSubscriptions,
          theme: SubscriptionTheme.CINEMA,
        })

        await waitFor(() => {
          expect(result.current).toMatchObject({
            isSubscribeButtonActive: false,
            updateSubscription: expect.anything(),
            updateSettings: expect.anything(),
          })
        })
      })

      it('should subscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsAndWithoutSubscriptions,
          theme: SubscriptionTheme.CINEMA,
        })

        result.current.updateSettings({
          allowEmails: true,
          allowPush: true,
        })

        await waitFor(() => {
          expect(postProfileSpy).toHaveBeenCalledWith({
            subscriptions: {
              marketingEmail: true,
              marketingPush: true,
              subscribedThemes: [SubscriptionTheme.CINEMA],
            },
          })
        })
      })
    })
  })
})

function renderUseThematicSubscription(props: useThematicSubscriptionProps) {
  return renderHook(() => useThematicSubscription(props), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
