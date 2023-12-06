import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueIconCaptions } from 'features/venue/components/VenueIconCaptions/VenueIconCaptions'
import { GeolocPermissionState } from 'libs/location'
import { parseType } from 'libs/parsers'
import { fireEvent, render, screen } from 'tests/utils'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)
const typeLabelNull = parseType(null)
const locationCoordinates = { latitude: 2, longitude: 4 }

let mockDistance: string | null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockPermissionState = GeolocPermissionState.NEVER_ASK_AGAIN
const mockShowGeolocPermissionModal = jest.fn()
const mockRequestGeolocPermission = jest.fn()

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    permissionState: mockPermissionState,
    requestGeolocPermission: mockRequestGeolocPermission,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

describe('<VenueIconCaptions />', () => {
  it('should change accessibilityLabel when geolocation is active or not', async () => {
    mockDistance = '10 km'
    const { rerender } = render(
      <VenueIconCaptions
        label={typeLabel}
        type={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.queryByLabelText('Distance depuis la localisation')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Activer la localisation')).not.toBeOnTheScreen()

    mockDistance = null
    rerender(
      <VenueIconCaptions
        label={typeLabel}
        type={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.queryByLabelText('Géolocalisation désactivée')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Distance depuis la localisation')).not.toBeOnTheScreen()
  })

  it('should display a default label "Autre type de lieu" for venue type if type is null', async () => {
    render(
      <VenueIconCaptions
        type={null}
        label={typeLabelNull}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.getByText('Autre type de lieu')).toBeOnTheScreen()
  })

  it('should display correct label for venue type if type is not null', () => {
    render(
      <VenueIconCaptions
        type={VenueTypeCodeKey.MOVIE}
        label={typeLabel}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.getByText('Cinéma - Salle de projections')).toBeOnTheScreen()
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'

    render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.queryByText('10 km')).toBeOnTheScreen()
  })

  it("should doesn't show distance if geolocation disabled", () => {
    mockDistance = null

    render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )

    expect(screen.queryByText('10 km')).not.toBeOnTheScreen()
    expect(screen.queryByText('Géolocalisation désactivée')).toBeOnTheScreen()
  })

  it('should open "Activate geolocation" modal when clicking on "Géolocalisation désactivée" if geolocation disabled', () => {
    mockDistance = null

    render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )

    fireEvent.press(screen.getByTestId('Géolocalisation désactivée'))

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })
})
