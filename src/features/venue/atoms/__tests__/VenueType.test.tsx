import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { parseType } from 'libs/parsers'
import { render } from 'tests/utils'

import { VenueType } from '../VenueType'

const typeLabel = parseType(VenueTypeCode.MOVIE)

describe('VenueType', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<VenueType type={VenueTypeCode.MOVIE} label={typeLabel} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a correctly label', () => {
    const { getByText } = render(<VenueType type={VenueTypeCode.MOVIE} label={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })
})
