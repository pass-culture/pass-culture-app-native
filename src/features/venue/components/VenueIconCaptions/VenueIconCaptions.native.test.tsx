import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueIconCaptions } from 'features/venue/components/VenueIconCaptions/VenueIconCaptions'
import { GeolocPermissionState } from 'libs/geolocation'
import { parseType } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'

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

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    requestGeolocPermission: mockRequestGeolocPermission,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

describe('<VenueIconCaptions />', () => {
  it('should change accessibilityLabel when geolocation is active or not', async () => {
    mockDistance = '10 km'
    const { queryByLabelText, rerender } = render(
      <VenueIconCaptions
        label={typeLabel}
        type={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(queryByLabelText('Distance depuis la localisation')).toBeTruthy()
    expect(queryByLabelText('Activer la localisation')).toBeNull()

    mockDistance = null
    rerender(
      <VenueIconCaptions
        label={typeLabel}
        type={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(queryByLabelText('Géolocalisation désactivée')).toBeTruthy()
    expect(queryByLabelText('Distance depuis la localisation')).toBeNull()
  })

  it('should display a default label "Autre type de lieu" for venue type if type is null', async () => {
    const { getByText } = render(
      <VenueIconCaptions
        type={null}
        label={typeLabelNull}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(getByText('Autre type de lieu')).toBeTruthy()
  })

  it('should display correct label for venue type if type is not null', () => {
    const { getByText } = render(
      <VenueIconCaptions
        type={VenueTypeCodeKey.MOVIE}
        label={typeLabel}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(queryByText('10 km')).toBeTruthy()
  })

  it("should doesn't show distance if geolocation disabled", () => {
    mockDistance = null
    const { queryByText } = render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(queryByText('10 km')).toBeNull()
    expect(queryByText('Géolocalisation désactivée')).toBeTruthy()
  })

  it('should open "Activate geolocation" modal when clicking on "Géolocalisation désactivée" if geolocation disabled', () => {
    mockDistance = null

    const { getByTestId } = render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCodeKey.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    fireEvent.press(getByTestId('Géolocalisation désactivée'))
    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })
})
