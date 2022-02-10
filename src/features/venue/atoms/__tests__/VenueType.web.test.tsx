import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { parseType } from 'libs/parsers'
import { render } from 'tests/utils/web'

import { VenueType } from '../VenueType'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)

describe('VenueType', () => {
  it('should render correctly', () => {
    const renderAPI = render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display a correctly label', () => {
    const { getByText } = render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })
})
