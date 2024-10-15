import React from 'react'

import { VenueMapLabel } from 'features/venueMap/components/VenueMapLabel/VenueMapLabel'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { render, screen, fireEvent } from 'tests/utils'

describe('<VenueMapLabel />', () => {
  it('should render the label with the correct text', () => {
    render(<VenueMapLabel venue={venuesFixture[0]} />)

    expect(screen.getByText('Cinéma de la fin')).toBeTruthy()
  })

  it('should apply the correct layout width when onLayout is triggered', () => {
    render(<VenueMapLabel venue={venuesFixture[0]} />)
    const label = screen.getByText('Cinéma de la fin')

    // Simulate a layout event with a width of 100
    fireEvent(label, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
        },
      },
    })

    expect(screen.getByTestId('label-container')).toHaveStyle({ transform: [{ translateX: -28 }] })
  })

  it('should correctly center the label based on its width', () => {
    render(<VenueMapLabel venue={venuesFixture[0]} />)
    const label = screen.getByText('Cinéma de la fin')

    // Simulate a layout event with a width of 80
    fireEvent(label, 'layout', {
      nativeEvent: {
        layout: {
          width: 80,
        },
      },
    })

    const expectedTranslateX = 22 - 80 / 2

    expect(screen.getByTestId('label-container')).toHaveStyle({
      transform: [{ translateX: expectedTranslateX }],
    })
  })
})
