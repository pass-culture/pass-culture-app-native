import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

const setVenuesSpy = jest.spyOn(useVenueMapStore, 'setVenues')
const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueMapBlock />', () => {
  it('should display Explore la carte in text card', () => {
    render(<VenueMapBlock from="searchLanding" />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should reset selected venue in store', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    await user.press(screen.getByText('Explore la carte'))

    expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
  })

  it('should reset initial venues in store', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    await user.press(screen.getByText('Explore la carte'))

    expect(setVenuesSpy).toHaveBeenCalledTimes(1)
  })

  it('should navigate to venue map screen', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    await user.press(screen.getByText('Explore la carte'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
  })

  it('should trigger log ConsultVenueMap', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    await user.press(screen.getByText('Explore la carte'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchLanding' })
  })
})
