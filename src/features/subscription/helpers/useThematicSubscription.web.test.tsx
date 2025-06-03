import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
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

const homeId = 'homeId'

jest
  .spyOn(useMapSubscriptionHomeIdsToThematic, 'useMapSubscriptionHomeIdsToThematic')
  .mockReturnValue(SubscriptionTheme.CINEMA)

describe('useThematicSubscription', () => {
  describe('when the user has email notifications off and push notifications on', () => {
    it('should give the information that there is not at least one notification type active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
            subscribedThemes: [],
          },
        },
        thematic: SubscriptionTheme.CINEMA,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeFalsy()
      })
    })

    it('should consider subscribe button inactive', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
            subscribedThemes: [],
          },
        },
        thematic: SubscriptionTheme.CINEMA,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await waitFor(() => {
        expect(result.current.isSubscribeButtonActive).toBeFalsy()
      })
    })
  })

  describe('when the user has email notifications on and is subscribed to theme', () => {
    it('should give the information that there is at least one notification type active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: false,
            subscribedThemes: [],
          },
        },
        thematic: SubscriptionTheme.CINEMA,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
      })

      await waitFor(() => {
        expect(result.current.isAtLeastOneNotificationTypeActivated).toBeTruthy()
      })
    })

    it('should consider subscribe button active', async () => {
      const { result } = renderUseThematicSubscription({
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: false,
            subscribedThemes: [SubscriptionTheme.CINEMA],
          },
        },
        thematic: SubscriptionTheme.CINEMA,
        homeId,
        onUpdateSubscriptionSuccess: jest.fn(),
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
