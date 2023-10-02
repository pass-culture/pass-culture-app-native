import React from 'react'
import { Animated, Share } from 'react-native'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

jest.mock('features/venue/api/useVenue')
jest.useFakeTimers({ legacyFakeTimers: true })

jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

describe('<VenueHeader />', () => {
  it('should render all icons', () => {
    const venueHeader = renderVenueHeader()
    expect(venueHeader.queryByTestId('animated-icon-back')).toBeOnTheScreen()
    expect(venueHeader.queryByTestId('animated-icon-share')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', () => {
    const { getByTestId } = renderVenueHeader()
    fireEvent.press(getByTestId('animated-icon-back'))
    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue, getByTestId } = renderVenueHeader()
    expect(getByTestId('venueHeaderName').props.accessibilityHidden).toBe(true)
    expect(getByTestId('venueHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.runAllTimers()
    })

    expect(getByTestId('venueHeaderName').props.accessibilityHidden).toBe(false)
    expect(getByTestId('venueHeaderName').props.style.opacity).toBe(1)
  })

  it('should log analytics when clicking on the share button', () => {
    const { getByLabelText } = renderVenueHeader()

    const shareButton = getByLabelText('Partager')
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Venue',
      from: 'venue',
      venue_id: venueResponseSnap.id,
    })
  })
})

function renderVenueHeader() {
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
