import * as TrackingTransparency from 'react-native-tracking-transparency'

import * as TrackOpenApp from 'libs/campaign/logOpenApp'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/requestIdfaTrackingConsent'

const getTrackingStatusSpy = jest.spyOn(TrackingTransparency, 'getTrackingStatus')
const requestTrackingPermissionSpy = jest.spyOn(TrackingTransparency, 'requestTrackingPermission')
const logOpenAppMock = jest.spyOn(TrackOpenApp, 'logOpenApp')

describe('requestIDFATrackingConsent', () => {
  it('should ask for consent when it has not already been asked', async () => {
    getTrackingStatusSpy.mockResolvedValueOnce('not-determined')
    requestTrackingPermissionSpy.mockResolvedValueOnce('denied')

    await requestIDFATrackingConsent()

    expect(requestTrackingPermissionSpy).toHaveBeenCalledTimes(1)
  })

  it('should log openApp event once consent choice has been made', async () => {
    getTrackingStatusSpy.mockResolvedValueOnce('not-determined')
    requestTrackingPermissionSpy.mockResolvedValueOnce('denied')

    const callback = jest.fn()
    await requestIDFATrackingConsent(callback)

    expect(logOpenAppMock).toHaveBeenCalledTimes(1)
  })

  it('should call callback when consent has already been asked', async () => {
    getTrackingStatusSpy.mockResolvedValueOnce('authorized')

    const callback = jest.fn()
    await requestIDFATrackingConsent(callback)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should call callback once consent choice has been made', async () => {
    getTrackingStatusSpy.mockResolvedValueOnce('not-determined')
    requestTrackingPermissionSpy.mockResolvedValueOnce('denied')

    const callback = jest.fn()
    await requestIDFATrackingConsent(callback)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
