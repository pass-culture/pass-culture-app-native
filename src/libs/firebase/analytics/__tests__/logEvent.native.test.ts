import { AgentType } from 'api/gen'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

const mockLogEvent = jest.fn()
jest.mock('@react-native-firebase/analytics', () => () => ({
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: mockLogEvent,
}))

jest.unmock('libs/firebase/analytics/provider')
const { analytics } = jest.requireActual('libs/firebase/analytics/analytics')

describe('analytics - logEvent', () => {
  it('should cast offerId and bookingId from number to string', () => {
    analytics.logBookingConfirmation(123456, 789)
    expect(mockLogEvent).toHaveBeenCalledWith(AnalyticsEvent.BOOKING_CONFIRMATION, {
      agentType: AgentType.agent_mobile,
      offerId: '123456',
      bookingId: '789',
    })
  })
})
