import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockVenues } from 'libs/algolia/__mocks__/mockedVenues'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { VenueTile, VenueTileProps } from './VenueTile'

jest.mock('react-query')

const venue = mockVenues.hits[0]

const props: VenueTileProps = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue,
  userPosition: null,
  width: 100,
  height: 100,
}

describe('VenueTile component', () => {
  it('should render correctly', () => {
    render(<VenueTile {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to the venue when clicking on the venue tile', async () => {
    render(<VenueTile {...props} />)

    fireEvent.press(screen.getByTestId(/Lieu/))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
    })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', () => {
    render(<VenueTile {...props} />)

    fireEvent.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
    })
  })

  it('should log analytics event ConsultVenue with homeEntryId when provided', () => {
    render(<VenueTile {...props} homeEntryId="abcd" />)

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
    render(<VenueTile {...props} venue={{ ...venue, bannerUrl: undefined }} />)

    expect(screen.getByTestId('venue-type-tile')).toBeOnTheScreen()
  })

  it('should show distance prop when provided', () => {
    render(<VenueTile {...props} userPosition={{ latitude: 2, longitude: 1 }} />)

    expect(screen.getByTestId('distance-tag')).toBeTruthy()
  })
})
