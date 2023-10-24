import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueType } from 'features/venue/components/VenueType/VenueType'
import { parseType } from 'libs/parsers'
import { render, screen } from 'tests/utils'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)

describe('VenueType', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a correctly label', () => {
    render(<VenueType type={VenueTypeCodeKey.MOVIE} label={typeLabel} />)

    expect(screen.getByText('Cinéma - Salle de projections')).toBeOnTheScreen()
  })
})
