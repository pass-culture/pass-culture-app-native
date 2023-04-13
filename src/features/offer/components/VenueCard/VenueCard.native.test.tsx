import React from 'react'

import { VenueCard } from 'features/offer/components/VenueCard/VenueCard'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueCard />', () => {
  it('should render <VenueDetails />', () => {
    render(
      <VenueCard
        title="Jest"
        address="Somewhere in your memory"
        venueType={null}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByTestId('venue-details')).toBeTruthy()
  })

  it('should handle on press', async () => {
    const onPress = jest.fn()

    render(
      <VenueCard
        title="Jest"
        address="Somewhere in your memory"
        venueType={null}
        onPress={onPress}
      />
    )

    const root = screen.getByTestId('venue-card')

    await fireEvent.press(root)
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
