import {
  useThematicSubscription,
  Props as useThematicSubscriptionProps,
} from 'features/subscription/helpers/useThematicSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils/web'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

describe('useThematicSubscription', () => {
  describe('if the user has email notifications off and push notifications on', () => {
    it('we get the information that there is not at least one notification type active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
            subscribedThemes: [],
          },
        },
        theme: SubscriptionTheme.CINEMA,
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeFalsy()
      })
    })

    it('the subscribe button should be inactive', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
            subscribedThemes: [],
          },
        },
        theme: SubscriptionTheme.CINEMA,
      })

      await waitFor(() => {
        expect(result.current.isSubscribeButtonActive).toBeFalsy()
      })
    })
  })

  describe('if the user has email notifications on and is subscribed to theme', () => {
    it('we get the information that there is at least one notification type active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: false,
            subscribedThemes: [],
          },
        },
        theme: SubscriptionTheme.CINEMA,
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeTruthy()
      })
    })

    it('the subscribe button should be active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: false,
            subscribedThemes: [SubscriptionTheme.CINEMA],
          },
        },
        theme: SubscriptionTheme.CINEMA,
      })

      await waitFor(() => {
        expect(result.current.isSubscribeButtonActive).toBeTruthy()
      })
    })
  })
})

function renderUseThematicSubscription(props: useThematicSubscriptionProps) {
  return renderHook(() => useThematicSubscription(props), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
