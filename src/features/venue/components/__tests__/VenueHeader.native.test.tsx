import React from 'react'
import { Animated, Share, Platform } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { getWebappVenueUrl } from 'features/venue/services/useShareVenue'
import { WEBAPP_V1_URL } from 'libs/environment/useWebAppUrl'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { VenueHeader } from '../VenueHeader'

jest.mock('features/venue/api/useVenue')

describe('<VenueHeader />', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(jest.clearAllMocks)

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
    expect(goBack).toBeCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = await renderVenueHeader()
    expect(getByTestId('venueHeaderName').props.style.opacity).toBe(0)
    Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    jest.advanceTimersByTime(100)
    await waitForExpect(() => expect(getByTestId('venueHeaderName').props.style.opacity).toBe(1))
  })

  it('should call Share with the right arguments on IOS', async () => {
    Platform.OS = 'ios'
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderVenueHeader()

    fireEvent.press(getByTestId('icon-share'))

    waitForExpect(() => {
      expect(share).toHaveBeenCalledTimes(1)
      const fullWebappUrlWithParams = getWebappVenueUrl(5543, WEBAPP_V1_URL)
      const url = generateLongFirebaseDynamicLink(fullWebappUrlWithParams)
      const message = 'Retrouve "Le Petit Rintintin 1" sur le pass Culture'
      expect(share).toHaveBeenCalledWith(
        { message, title: message, url },
        { dialogTitle: message, subject: message }
      )
    })
  })

  it('should call Share with the right arguments on Android', async () => {
    Platform.OS = 'android'
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderVenueHeader()

    fireEvent.press(getByTestId('icon-share'))

    waitForExpect(() => {
      expect(share).toHaveBeenCalledTimes(1)
      const fullWebappUrlWithParams = getWebappVenueUrl(5543, WEBAPP_V1_URL)
      const url = generateLongFirebaseDynamicLink(fullWebappUrlWithParams)
      const message = 'Retrouve "Le Petit Rintintin 1" sur le pass Culture'
      const messageWithUrl = `${message}\n\n${url}`
      expect(share).toHaveBeenCalledWith(
        { message: messageWithUrl, title: message, url },
        { dialogTitle: message, subject: message }
      )
    })
  })
})

async function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
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
