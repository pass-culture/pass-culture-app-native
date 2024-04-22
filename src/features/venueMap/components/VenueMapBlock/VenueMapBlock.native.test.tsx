import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

describe('<VenueMapBlock />', () => {
  it('should display title venue map', () => {
    render(<VenueMapBlock from="searchLanding" />)

    expect(screen.getByText('Carte des lieux culturels')).toBeOnTheScreen()
  })

  it('should display card text', () => {
    render(<VenueMapBlock from="searchLanding" />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should navigate to venue map screen', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
    })
  })

  it('should trigger log ConsultVenueMap', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchLanding' })
    })
  })
})
