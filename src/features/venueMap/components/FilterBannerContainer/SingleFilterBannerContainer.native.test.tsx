import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { parseType } from 'libs/parsers/venueType'
import { ellipseString } from 'shared/string/ellipseString'
import { render, screen } from 'tests/utils'

import { SingleFilterBannerContainer } from './SingleFilterBannerContainer'

const VENUE_TYPE = VenueTypeCodeKey.MOVIE

describe('SingleFilterBannerContainer', () => {
  beforeEach(() => {
    venuesFilterActions.setVenuesFilters([VENUE_TYPE])
  })

  it('should render correctly', async () => {
    render(<SingleFilterBannerContainer />)

    expect(screen.getByText(ellipseString(parseType(VENUE_TYPE), 20))).toBeOnTheScreen()
  })

  it('Should filter with no venueCode', async () => {
    venuesFilterActions.setVenuesFilters([])

    render(<SingleFilterBannerContainer />)

    expect(screen.getByText('Tous les lieux')).toBeOnTheScreen()
  })
})
