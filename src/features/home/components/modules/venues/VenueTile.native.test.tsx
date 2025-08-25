import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics/provider'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { VenueTile, VenueTileProps } from './VenueTile'

const venue = venuesSearchFixture.hits[0]

const props: VenueTileProps = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue,
  width: 100,
  height: 100,
}

const DEFAULT_USER_LOCATION = { latitude: 48, longitude: 2 }

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}
const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
}

const mockUseLocation = jest.fn((): Partial<ILocationContext> => EVERYWHERE_USER_POSITION)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('VenueTile component', () => {
  it('should navigate to the venue when clicking on the venue tile', async () => {
    renderVenueTile()

    await user.press(screen.getByTestId(/Lieu/))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', async () => {
    renderVenueTile()

    await user.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id.toString(),
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
    })
  })

  it('should log analytics event ConsultVenue with homeEntryId when provided', async () => {
    renderVenueTile({ homeEntryId: 'abcd' })

    await user.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id.toString(),
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

  it('should show distance when user has chosen geolocation', () => {
    mockUseLocation.mockReturnValueOnce(AROUND_ME_POSITION)
    renderVenueTile()

    expect(screen.getByTestId('distance-tag')).toBeTruthy()
  })

  it("should not show distance when user has chosen 'France Entière'", () => {
    mockUseLocation.mockReturnValueOnce(EVERYWHERE_USER_POSITION)
    renderVenueTile()

    expect(screen.queryByTestId('distance-tag')).toBeFalsy()
  })
})

const renderVenueTile = (additionalProps: Partial<VenueTileProps> = {}) =>
  render(reactQueryProviderHOC(<VenueTile {...props} {...additionalProps} />))
