import { AgentType } from 'api/gen'

import { AnalyticsEvent } from './events'

const mockLogEvent = jest.fn()
jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: mockLogEvent,
}))

jest.unmock('./provider')
const { analytics } = jest.requireActual('./analytics')

describe('analytics', () => {
  describe('logEvent', () => {
    it('should cast offerId and bookingId from number to string', () => {
      analytics.logBookingConfirmation(123456, 789)
      expect(mockLogEvent).toHaveBeenCalledWith(AnalyticsEvent.BOOKING_CONFIRMATION, {
        agentType: AgentType.agent_mobile,
        offerId: '123456',
        bookingId: '789',
      })
    })
  })
})
