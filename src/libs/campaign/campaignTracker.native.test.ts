import { campaignTracker } from 'libs/campaign/campaignTracker'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'

jest.mock('libs/trackingConsent/useTrackingConsent')
const mockrequestIDFATrackingConsent = requestIDFATrackingConsent as jest.Mock

describe('campaignTracker', () => {
  it('should not request ATT when init parameter is false', async () => {
    campaignTracker.useInit(false)

    expect(mockrequestIDFATrackingConsent).not.toHaveBeenCalled()
  })

  it('should request ATT when init parameter is true', async () => {
    campaignTracker.useInit(true)

    expect(mockrequestIDFATrackingConsent).toHaveBeenCalledTimes(1)
  })
})
