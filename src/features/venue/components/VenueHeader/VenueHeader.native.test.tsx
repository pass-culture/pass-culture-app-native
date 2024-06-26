import React from 'react'
import { Animated, Share } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('features/venue/api/useVenue')
jest.useFakeTimers()

jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

describe('<VenueHeader />', () => {
  it('should render all icons', () => {
    renderVenueHeader()

    expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-share')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', () => {
    renderVenueHeader()
    fireEvent.press(screen.getByTestId('animated-icon-back'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue } = renderVenueHeader()

    expect(screen.getByTestId('venueHeaderName').props.accessibilityHidden).toBe(true)
    expect(screen.getByTestId('venueHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, {
        duration: 100,
        toValue: 1,
        useNativeDriver: false,
      }).start()
      jest.runAllTimers()
    })

    expect(screen.getByTestId('venueHeaderName').props.accessibilityHidden).toBe(false)
    expect(screen.getByTestId('venueHeaderName').props.style.opacity).toBe(1)
  })

  it('should log analytics when clicking on the share button', () => {
    renderVenueHeader()

    const shareButton = screen.getByLabelText('Partager')
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Venue',
      from: 'venue',
      venueId: venueResponseSnap.id,
    })
  })

  it('should display venue name if venue has no public name', async () => {
    const venue = { ...venueResponseSnap, publicName: null, name: 'venueNameWithoutPublicName' }
    render(
      reactQueryProviderHOC(<VenueHeader headerTransition={new Animated.Value(0)} venue={venue} />)
    )

    expect(await screen.findByText('venueNameWithoutPublicName')).toBeOnTheScreen()
  })
})

function renderVenueHeader() {
  const animatedValue = new Animated.Value(0)
  render(
    reactQueryProviderHOC(
      <VenueHeader headerTransition={animatedValue} venue={venueResponseSnap} />
    )
  )
  return { animatedValue }
}
