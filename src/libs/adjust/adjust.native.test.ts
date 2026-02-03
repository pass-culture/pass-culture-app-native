import { Adjust as AdjustMock, addGranularOptionMock } from '__mocks__/react-native-adjust'
import { Adjust, resetHasAlreadyBeenInitializedForTests } from 'libs/adjust/adjust'
import { analytics } from 'libs/analytics/provider'

describe('Adjust', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetHasAlreadyBeenInitializedForTests()
  })

  describe('getOrRequestAppTrackingAuthorization', () => {
    it('should ask for consent when ATT status is NOT_DETERMINED', async () => {
      AdjustMock.getAppTrackingAuthorizationStatus.mockImplementationOnce((callback) => {
        callback(Adjust.TrackingStatus.NOT_DETERMINED)
      })

      Adjust.getOrRequestAppTrackingAuthorization()

      expect(AdjustMock.requestAppTrackingAuthorization).toHaveBeenCalledTimes(1)
    })

    it('should not ask for consent when ATT status is AUTHORIZED', async () => {
      AdjustMock.getAppTrackingAuthorizationStatus.mockImplementationOnce((callback) => {
        callback(Adjust.TrackingStatus.AUTHORIZED)
      })

      Adjust.getOrRequestAppTrackingAuthorization()

      expect(AdjustMock.requestAppTrackingAuthorization).toHaveBeenCalledTimes(0)
    })

    it('should not ask for consent when ATT status is RESTRICTED', async () => {
      AdjustMock.getAppTrackingAuthorizationStatus.mockImplementationOnce((callback) => {
        callback(Adjust.TrackingStatus.RESTRICTED)
      })

      Adjust.getOrRequestAppTrackingAuthorization()

      expect(AdjustMock.requestAppTrackingAuthorization).toHaveBeenCalledTimes(0)
    })

    it('should not ask for consent when ATT status is DENIED', async () => {
      AdjustMock.getAppTrackingAuthorizationStatus.mockImplementationOnce((callback) => {
        callback(Adjust.TrackingStatus.DENIED)
      })

      Adjust.getOrRequestAppTrackingAuthorization()

      expect(AdjustMock.requestAppTrackingAuthorization).toHaveBeenCalledTimes(0)
    })
  })

  describe('disable', () => {
    it('Remove consent and disable sdk if sdk was enabled', async () => {
      AdjustMock.isEnabled.mockImplementationOnce((callback) => {
        callback(true)
      })

      Adjust.disable()

      expect(AdjustMock.trackMeasurementConsent).toHaveBeenCalledWith(false)
      expect(AdjustMock.trackThirdPartySharing).toHaveBeenCalledWith({
        addGranularOption: addGranularOptionMock,
        isEnabled: false,
      })
      expect(AdjustMock.disable).toHaveBeenCalledTimes(1)
    })
  })

  describe('initOrEnable', () => {
    it('Adjust sdk is init if it has not yet been init', async () => {
      Adjust.initOrEnable()

      expect(AdjustMock.initSdk).toHaveBeenCalledTimes(1)
    })

    it('Adjust sdk is enabled and not init twice if it has already been init', async () => {
      Adjust.initOrEnable()
      Adjust.initOrEnable()

      expect(AdjustMock.initSdk).toHaveBeenCalledTimes(1)
      expect(AdjustMock.enable).toHaveBeenCalledTimes(1)
    })

    it('Try to ask for ATT consent when Adjust sdk is init', async () => {
      Adjust.initOrEnable()

      expect(AdjustMock.getAppTrackingAuthorizationStatus).toHaveBeenCalledTimes(1)
    })

    it('log a campaign tracker enabled event when Adjust sdk is init', async () => {
      Adjust.initOrEnable()

      expect(analytics.logCampaignTrackerEnabled).toHaveBeenCalledTimes(1)
    })

    it('Third party sharing enabled when init or enable Adjust sdk', async () => {
      Adjust.initOrEnable()

      expect(AdjustMock.trackThirdPartySharing).toHaveBeenCalledWith({
        addGranularOption: addGranularOptionMock,
        isEnabled: true,
      })
    })

    it('trackMeasurementConsent is called when init or enable Adjust sdk because of consents change', async () => {
      Adjust.initOrEnable()

      expect(AdjustMock.trackMeasurementConsent).toHaveBeenCalledWith(true)
    })

    it('trackMeasurementConsent is not called when init or enable Adjust sdk following the launch of the app', async () => {
      Adjust.initOrEnable(false)

      expect(AdjustMock.trackMeasurementConsent).toHaveBeenCalledTimes(0)
    })
  })
})
