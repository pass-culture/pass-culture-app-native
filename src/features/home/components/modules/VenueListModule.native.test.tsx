import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueListModule />', () => {
  it('should display venue list', () => {
    render(<VenueListModule venues={venuesSearchFixture.hits} />)

    expect(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ')).toBeOnTheScreen()
  })

  it('should redirect to venue map when pressing on venue list title', () => {
    render(<VenueListModule venues={venuesSearchFixture.hits} />)

    fireEvent.press(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
  })

  it('should redirect to target venue when pressing on it', () => {
    render(<VenueListModule venues={venuesSearchFixture.hits} />)

    fireEvent.press(screen.getByText('Le Petit Rintintin 1'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'Venue', { id: 5543 })
  })
})
