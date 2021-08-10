import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { parseType } from 'libs/parsers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { VenueIconCaptions } from '../VenueIconCaptions'

const mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const typeLabel = parseType(VenueTypeCode.MOVIE)
const typeLabelNull = parseType(null)
const locationCoordinates = { latitude: 2, longitude: 4 }

describe('<VenueIconCaptions />', () => {
  it('should match snapshot', async () => {
    const { toJSON } = render(
      reactQueryProviderHOC(
        <VenueIconCaptions
          label={typeLabel}
          type={VenueTypeCode.MOVIE}
          locationCoordinates={locationCoordinates}
        />
      )
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a default label "Autre" if type is null', async () => {
    const { getByText } = render(
      reactQueryProviderHOC(
        <VenueIconCaptions
          type={null}
          label={typeLabelNull}
          locationCoordinates={locationCoordinates}
        />
      )
    )
    expect(getByText('Autre')).toBeTruthy()
  })
})
