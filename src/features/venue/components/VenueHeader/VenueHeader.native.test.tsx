import React from 'react'
import { Animated, Share } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('features/venue/queries/useVenueQuery')
jest.useFakeTimers()

jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')
const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueHeader />', () => {
  it('should render all icons', () => {
    renderVenueHeader()

    expect(screen.getByLabelText('Revenir en arrière')).toBeOnTheScreen()
    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', async () => {
    renderVenueHeader()
    await user.press(screen.getByLabelText('Revenir en arrière'))

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

  it('should log analytics when clicking on the share button', async () => {
    renderVenueHeader()

    const shareButton = screen.getByLabelText('Partager')
    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Venue',
      from: 'venue',
      venueId: venueDataTest.id,
    })
  })
})

const renderVenueHeader = () => {
  const animatedValue = new Animated.Value(0)
  render(
    reactQueryProviderHOC(<VenueHeader headerTransition={animatedValue} venue={venueDataTest} />)
  )
  return { animatedValue }
}
