import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueType } from 'features/venue/components/VenueType/VenueType'
import { parseType } from 'libs/parsers'
import { render } from 'tests/utils'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)

describe('VenueType', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a correctly label', () => {
    const { getByText } = render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })
})
