import * as API from 'api/api'
import { UserProfileResponse } from 'api/gen'
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import {
  useThematicSubscription,
  Props as useThematicSubscriptionProps,
} from 'features/subscription/helpers/useThematicSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest
  .spyOn(useMapSubscriptionHomeIdsToThematic, 'useMapSubscriptionHomeIdsToThematic')
  .mockReturnValue(SubscriptionTheme.CINEMA)

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
const homeId = 'homeId'

describe('useThematicSubscription', () => {
  describe('when the user has notifications on', () => {
    it('should give us the information that at least one notification is active', async () => {
      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsButNoSubscriptions,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeTruthy()
      })
    })

    describe('when the user is already subscribed to the page', () => {
      it('should consider subscribe button active', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsAndSubscribed,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        await waitFor(() => {
          expect(result.current.isSubscribeButtonActive).toBeTruthy()
        })
      })

      it('should unsubscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsAndSubscribed,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
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
      it('should consider subscribe button inactive', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsButNoSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        await waitFor(() => {
          expect(result.current.isSubscribeButtonActive).toBeFalsy()
        })
      })

      it('should subscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithNotificationsButNoSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        result.current.updateSubscription()

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

  describe('when the user has notifications off', () => {
    it('should give us the information that notifications are inactive', async () => {
      const { result } = renderUseThematicSubscription({
        user: userWithoutNotificationsAndWithoutSubscriptions,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeFalsy()
      })
    })

    describe('when the user is already subscribed to the page', () => {
      it('should consider subscribe button inactive', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsButWithSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        await waitFor(() => {
          expect(result.current.isSubscribeButtonActive).toBeFalsy()
        })
      })

      it('should not change subscribed themes when the user clicks subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsButWithSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
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
      it('should consider subscribe button inactive', async () => {
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsAndWithoutSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        await waitFor(() => {
          expect(result.current.isSubscribeButtonActive).toBeFalsy()
        })
      })

      it('should subscribe when the user clicks the subscribe button', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: userWithoutNotificationsAndWithoutSubscriptions,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
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

    describe("when we don't have the user", () => {
      it('should default to false for marketingEmail and marketingPush', async () => {
        mockServer.postApi('/v1/profile', {})
        const { result } = renderUseThematicSubscription({
          user: undefined,
          homeId,
          onUpdateSubscriptionSuccess: jest.fn(),
        })

        result.current.updateSettings({
          allowEmails: false,
          allowPush: false,
        })

        await waitFor(() => {
          expect(postProfileSpy).toHaveBeenCalledWith({
            subscriptions: {
              marketingEmail: false,
              marketingPush: false,
              subscribedThemes: [SubscriptionTheme.CINEMA],
            },
          })
        })
      })
    })
  })

  describe('API calls', () => {
    it('should show a snackbar when settings update fails', async () => {
      mockServer.postApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsButNoSubscriptions,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await act(async () => {
        result.current.updateSettings({
          allowEmails: true,
          allowPush: true,
        })
      })

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur est survenue, veuillez réessayer',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should call onSuccess when subscription update succeeds', async () => {
      mockServer.postApi('/v1/profile', {})
      const onUpdateSubscriptionSuccessMock = jest.fn()

      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsButNoSubscriptions,
        homeId,
        onUpdateSubscriptionSuccess: onUpdateSubscriptionSuccessMock,
      })

      await act(async () => {
        result.current.updateSubscription()
      })

      expect(onUpdateSubscriptionSuccessMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics', () => {
    it('should log when the user subscribes', async () => {
      mockServer.postApi('/v1/profile', {})
      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsButNoSubscriptions,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await act(async () => {
        result.current.updateSubscription()
      })

      expect(analytics.logSubscriptionUpdate).toHaveBeenCalledWith({
        from: 'thematicHome',
        type: 'in',
        entryId: homeId,
      })
    })

    it('should log when the user unsubscribes', async () => {
      mockServer.postApi('/v1/profile', {})
      const { result } = renderUseThematicSubscription({
        user: userWithNotificationsAndSubscribed,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await act(async () => {
        result.current.updateSubscription()
      })

      expect(analytics.logSubscriptionUpdate).toHaveBeenCalledWith({
        from: 'thematicHome',
        type: 'out',
        entryId: homeId,
      })
    })
  })
})

function renderUseThematicSubscription(props: useThematicSubscriptionProps) {
  return renderHook(() => useThematicSubscription(props), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
