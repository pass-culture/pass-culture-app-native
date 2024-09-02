import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { VenueTile, VenueTileProps } from './VenueTile'

const venue = venuesSearchFixture.hits[0]

const props: VenueTileProps = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue,
  width: 100,
  height: 100,
}

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

describe('VenueTile component', () => {
  it('should navigate to the venue when clicking on the venue tile', async () => {
    renderVenueTile()

    fireEvent.press(screen.getByTestId(/Lieu/))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
    })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', () => {
    renderVenueTile()

    fireEvent.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
    })
  })

  it('should log analytics event ConsultVenue with homeEntryId when provided', () => {
    renderVenueTile({ homeEntryId: 'abcd' })

    fireEvent.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      homeEntryId: 'abcd',
    })
  })

  it('should show venue placeholder when no venue does not have image', () => {
    renderVenueTile({ venue: { ...venue, bannerUrl: undefined } })

    expect(screen.getByTestId('venue-type-tile')).toBeOnTheScreen()
  })

  it('should show distance prop when provided', () => {
    mockDistance = '10km'

    renderVenueTile()

    expect(screen.getByTestId('distance-tag')).toBeTruthy()
  })
})

const renderVenueTile = (additionalProps: Partial<VenueTileProps> = {}) =>
  render(reactQueryProviderHOC(<VenueTile {...props} {...additionalProps} />))
