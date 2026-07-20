import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import * as ABSegmentModule from 'shared/useABSegment/useABSegment'
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

const useABSegmentSpy = jest.spyOn(ABSegmentModule, 'useABSegment')

const user = userEvent.setup()
jest.useFakeTimers()

describe('VenueTile component', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
  })

  it('should navigate to the venue when clicking on the venue tile', async () => {
    renderVenueTile()

    await user.press(screen.getByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma'))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', async () => {
    renderVenueTile()

    await user.press(screen.getByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma'))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id.toString(),
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      displayAdvice: false,
    })
  })

  it('should log analytics event ConsultVenue with homeEntryId when provided', async () => {
    renderVenueTile({ homeEntryId: 'abcd' })

    await user.press(screen.getByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma'))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id.toString(),
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      homeEntryId: 'abcd',
      displayAdvice: false,
    })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile with pro advice AB testing segment A', async () => {
    useABSegmentSpy.mockReturnValueOnce('A')
    renderVenueTile()

    await user.press(screen.getByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma'))

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id.toString(),
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      displayAdvice: true,
    })
  })

  it('should show venue placeholder when no venue does not have image', () => {
    renderVenueTile({ venue: { ...venue, bannerUrl: undefined } })

    expect(screen.getByTestId('venue-type-tile')).toBeOnTheScreen()
  })

  it('should show distance when user has chosen geolocation', () => {
    locationActions.setGeolocPosition(DEFAULT_USER_LOCATION)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    renderVenueTile()

    expect(screen.getByTestId('distance-tag')).toBeTruthy()
  })

  it("should not show distance when user has chosen 'France Entière'", () => {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
    renderVenueTile()

    expect(screen.queryByTestId('distance-tag')).toBeFalsy()
  })
})

const renderVenueTile = (additionalProps: Partial<VenueTileProps> = {}) =>
  render(reactQueryProviderHOC(<VenueTile {...props} {...additionalProps} />))
