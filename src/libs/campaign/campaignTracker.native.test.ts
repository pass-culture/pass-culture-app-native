import { campaignTracker } from 'libs/campaign/campaignTracker'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/requestIdfaTrackingConsent'

jest.mock('libs/trackingConsent/requestIdfaTrackingConsent')
const mockrequestIDFATrackingConsent = requestIDFATrackingConsent as jest.Mock

jest.mock('libs/firebase/analytics/analytics')

describe('campaignTracker', () => {
  it('should not request ATT when init parameter is false', async () => {
    campaignTracker.init(false)

    expect(mockrequestIDFATrackingConsent).not.toHaveBeenCalled()
  })

  it('should request ATT when init parameter is true', async () => {
    campaignTracker.init(true)

    expect(mockrequestIDFATrackingConsent).toHaveBeenCalledTimes(1)
  })
})
