import React from 'react'
import { Text } from 'react-native'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'

import * as TrackOpenApp from 'libs/campaign/logOpenApp'
import { useTrackingConsent } from 'libs/trackingConsent/useTrackingConsent'
import { render } from 'tests/utils'

jest.mock('react-native-tracking-transparency')
const mockGetTrackingStatus = getTrackingStatus as jest.Mock
const mockRequestTrackingPermission = requestTrackingPermission as jest.Mock
const logOpenAppMock = jest.spyOn(TrackOpenApp, 'logOpenApp')

const TestComponent = () => {
  const { consentTracking, consentAsked } = useTrackingConsent()

  return (
    <React.Fragment>
      <Text testID="consentTracking">{consentTracking}</Text>
      <Text testID="consentAsked">{consentAsked}</Text>
    </React.Fragment>
  )
}

describe('useTrackingConsent', () => {
  it('should ask for consent when it has not already been asked', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('denied')

    const { findByTestId } = render(<TestComponent />)
    await findByTestId('consentAsked')

    expect(mockRequestTrackingPermission).toHaveBeenCalledWith()
  })

  it('should call log open app event when user accepts tracking', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('authorized')

    const { findByTestId } = render(<TestComponent />)
    await findByTestId('consentAsked')

    expect(logOpenAppMock).toHaveBeenCalledWith('authorized')
  })

  it('should not ask for consent when it has already been asked', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('denied')

    const { findByTestId } = render(<TestComponent />)
    await findByTestId('consentAsked')

    expect(mockRequestTrackingPermission).not.toHaveBeenCalled()
  })

  it('should not ask for consent when it is not available', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('unavailable')

    const { findByTestId } = render(<TestComponent />)
    await findByTestId('consentAsked')

    expect(mockRequestTrackingPermission).not.toHaveBeenCalled()
  })

  it('should return that consent have been asked when it has been asked', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('denied')

    const { findByTestId } = render(<TestComponent />)

    const consentAsked = await findByTestId('consentAsked')
    expect(consentAsked.props.children).toEqual(true)
  })

  it('should return that consent have been asked when it is not available', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('unavailable')

    const { findByTestId } = render(<TestComponent />)

    const consentAsked = await findByTestId('consentAsked')
    expect(consentAsked.props.children).toEqual(true)
  })

  it('should return that consent have not been asked when it has not been asked', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('not-determined')

    const { findByTestId } = render(<TestComponent />)

    const consentAsked = await findByTestId('consentAsked')
    expect(consentAsked.props.children).toEqual(false)
  })

  it('should return that user has consented when he hit confirmation', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('authorized')

    const { findByTestId } = render(<TestComponent />)

    const consentTracking = await findByTestId('consentTracking')
    expect(consentTracking.props.children).toEqual(true)
  })

  it('should return that user has not consented when he denied', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('denied')

    const { findByTestId } = render(<TestComponent />)

    const consentTracking = await findByTestId('consentTracking')
    expect(consentTracking.props.children).toEqual(false)
  })

  it('should return that user has consented when tracking consent is not available', async () => {
    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('unavailable')

    const { findByTestId } = render(<TestComponent />)

    const consentTracking = await findByTestId('consentTracking')
    expect(consentTracking.props.children).toEqual(true)
  })

  it('should return that user has not consented when the device is restricted', async () => {
    // For more info about restricted devices, see:
    // https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/authorizationstatus/restricted

    mockGetTrackingStatus.mockResolvedValueOnce('not-determined')
    mockRequestTrackingPermission.mockResolvedValueOnce('restricted')

    const { findByTestId } = render(<TestComponent />)

    const consentTracking = await findByTestId('consentTracking')
    expect(consentTracking.props.children).toEqual(false)
  })
})
