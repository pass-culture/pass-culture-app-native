import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { AgentType } from 'libs/firebase/analytics/types'
import { waitFor } from 'tests/utils'

const mockLogEvent = jest.fn()
jest.mock('@react-native-firebase/analytics', () => () => ({
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: mockLogEvent,
}))

jest.unmock('libs/firebase/analytics/provider')
jest.unmock('libs/firebase/analytics/analytics')
jest.unmock('libs/analytics/provider')
jest.unmock('libs/analytics/logEventAnalytics')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

const { analytics } = jest.requireActual('libs/analytics')

describe('analytics - logEvent', () => {
  it('should cast offerId and bookingId from number to string', async () => {
    analytics.logBookingConfirmation({ offerId: 123456, bookingId: 789 })
    await waitFor(() => {
      expect(mockLogEvent).toHaveBeenCalledWith(AnalyticsEvent.BOOKING_CONFIRMATION, {
        agentType: AgentType.agent_mobile,
        offerId: '123456',
        bookingId: '789',
        locationType: 'undefined',
      })
    })
  })
})
