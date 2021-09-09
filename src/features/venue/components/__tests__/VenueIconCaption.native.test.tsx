import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { GeolocPermissionState } from 'libs/geolocation'
import { parseType } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'

import { VenueIconCaptions } from '../VenueIconCaptions'

const typeLabel = parseType(VenueTypeCode.MOVIE)
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
  it('should match snapshot', async () => {
    mockDistance = '10 km'
    const { toJSON } = render(
      <VenueIconCaptions
        label={typeLabel}
        type={VenueTypeCode.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(toJSON()).toMatchSnapshot()
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
        type={VenueTypeCode.MOVIE}
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
        label={VenueTypeCode.MOVIE}
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
        label={VenueTypeCode.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(queryByText('10 km')).toBeFalsy()
    expect(queryByText('Géolocalisation désactivée')).toBeTruthy()
  })

  it('should open "Activate geolocation" modal when clicking on iconLocation if geolocation disabled', () => {
    mockDistance = null

    const { getByTestId } = render(
      <VenueIconCaptions
        type={null}
        label={VenueTypeCode.MOVIE}
        locationCoordinates={locationCoordinates}
      />
    )
    fireEvent.press(getByTestId('iconLocation'))
    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })
})
