import React from 'react'
import { Animated, Share, Platform } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { getVenueUrl } from 'features/venue/services/useShareVenue'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

jest.mock('features/venue/api/useVenue')

describe('<VenueHeader />', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render correctly', async () => {
    const { toJSON } = await renderVenueHeader()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render all icons', async () => {
    const venueHeader = await renderVenueHeader()
    expect(venueHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(venueHeader.queryByTestId('icon-share')).toBeTruthy()
  })

  it('should goBack when we press on the back button', async () => {
    const { getByTestId } = await renderVenueHeader()
    fireEvent.press(getByTestId('icon-back'))
    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = await renderVenueHeader()
    expect(getByTestId('venueHeaderName').props['aria-hidden']).toBeTruthy()
    expect(getByTestId('venueHeaderName').props.style.opacity).toBe(0)
    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })
    await waitForExpect(() =>
      expect(getByTestId('venueHeaderName').props['aria-hidden']).toBeFalsy()
    )
    await waitForExpect(() => expect(getByTestId('venueHeaderName').props.style.opacity).toBe(1))
  })

  it('should call Share with the right arguments on IOS', async () => {
    Platform.OS = 'ios'
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderVenueHeader()

    fireEvent.press(getByTestId('icon-share'))

    expect(share).toHaveBeenCalledTimes(1)
    const url = getVenueUrl(5543)
    const message = 'Retrouve "Le Petit Rintintin 1" sur le pass Culture'

    expect(share).toHaveBeenCalledWith(
      { message, title: message, url },
      { dialogTitle: message, subject: message }
    )
  })

  it('should call Share with the right arguments on Android', async () => {
    Platform.OS = 'android'
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderVenueHeader()

    fireEvent.press(getByTestId('icon-share'))

    expect(share).toHaveBeenCalledTimes(1)
    const url = getVenueUrl(5543)
    const message = 'Retrouve "Le Petit Rintintin 1" sur le pass Culture'
    const messageWithUrl = `${message}\n\n${url}`

    expect(share).toHaveBeenCalledWith(
      { message: messageWithUrl, title: message, url },
      { dialogTitle: message, subject: message }
    )
  })

  describe('<VenueHeader /> - Analytics', () => {
    it('should log ShareVenue once when clicking on the Share button', async () => {
      const { getByTestId } = await renderVenueHeader()

      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareVenue).toHaveBeenCalledTimes(1)
      expect(analytics.logShareVenue).toHaveBeenCalledWith(venueResponseSnap.id)

      fireEvent.press(getByTestId('icon-share'))
      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareVenue).toHaveBeenCalledTimes(1)
    })
  })
})

async function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <VenueHeader
        headerTransition={animatedValue}
        title={venueResponseSnap.name}
        venueId={venueResponseSnap.id}
      />
    )
  )
  return { ...wrapper, animatedValue }
}
