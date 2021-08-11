import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { parseType } from 'libs/parsers'
import { render } from 'tests/utils'

import { VenueIconCaptions } from '../VenueIconCaptions'

let mockDistance: string | null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const typeLabel = parseType(VenueTypeCode.MOVIE)
const typeLabelNull = parseType(null)
const locationCoordinates = { latitude: 2, longitude: 4 }

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

  it('should display a default label "Autre" for venue type if type is null', async () => {
    const { getByText } = render(
      <VenueIconCaptions
        type={null}
        label={typeLabelNull}
        locationCoordinates={locationCoordinates}
      />
    )
    expect(getByText('Autre')).toBeTruthy()
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
})
