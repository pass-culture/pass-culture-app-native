import React from 'react'

import { VenueCard } from 'features/offer/components/VenueCard/VenueCard'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueCard />', () => {
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

    await fireEvent.press(screen.getByText('Jest'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
