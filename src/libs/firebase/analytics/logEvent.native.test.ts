import { AnalyticsEvent } from 'libs/firebase/analytics/events'
import { AgentType } from 'libs/firebase/analytics/types'
import { waitFor } from 'tests/utils'

const mockLogEvent = jest.fn()

jest.mock('libs/firebase/shims/analytics', () => ({
  getAnalytics: jest.fn(() => ({ _isMockInstance: true })),
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: mockLogEvent,
}))

jest.unmock('libs/firebase/analytics/provider')
jest.unmock('libs/firebase/analytics/analytics')
jest.unmock('libs/analytics/provider')
jest.unmock('libs/analytics/logEventAnalytics')

const { analytics } = jest.requireActual('libs/analytics/provider')

describe('analytics - logEvent', () => {
  it('should cast offerId and bookingId from number to string', async () => {
    analytics.logBookingConfirmation({ offerId: 123456, bookingId: 789 })

    await waitFor(() => {
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.anything(), // The analytics instance passed from getAnalytics()
        AnalyticsEvent.BOOKING_CONFIRMATION,
        {
          agentType: AgentType.agent_mobile,
          offerId: '123456',
          bookingId: '789',
          locationType: 'undefined',
        }
      )
    })
  })
})
