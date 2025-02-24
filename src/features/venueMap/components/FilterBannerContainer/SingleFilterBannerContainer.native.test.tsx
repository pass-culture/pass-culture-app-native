import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { setVenueTypeCode } from 'features/venueMap/store/venueMapStore'
import { parseType } from 'libs/parsers/venueType'
import { ellipseString } from 'shared/string/ellipseString'
import { render, screen } from 'tests/utils'

import { SingleFilterBannerContainer } from './SingleFilterBannerContainer'

const VENUE_TYPE = VenueTypeCodeKey.MOVIE

describe('SingleFilterBannerContainer', () => {
  beforeEach(() => {
    setVenueTypeCode(VENUE_TYPE)
  })

  it('should render correctly', async () => {
    render(<SingleFilterBannerContainer />)

    expect(screen.getByText(ellipseString(parseType(VENUE_TYPE), 20))).toBeOnTheScreen()
  })

  it('Should filter with no venueCode', async () => {
    setVenueTypeCode(null)

    render(<SingleFilterBannerContainer />)

    expect(screen.getByText('Tous les lieux')).toBeOnTheScreen()
  })
})
