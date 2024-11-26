import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import {
  useVenueTypeCode,
  useVenueTypeCodeActions,
} from 'features/venueMap/store/venueTypeCodeStore'
import { parseType } from 'libs/parsers/venueType'
import { ellipseString } from 'shared/string/ellipseString'
import { render, screen } from 'tests/utils'

import { SingleFilterBannerContainer } from './SingleFilterBannerContainer'

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockSetVenueTypeCode = jest.fn()
const mockUseVenueTypeCode = useVenueTypeCode as jest.Mock
const mockUseVenueTypeCodeActions = useVenueTypeCodeActions as jest.Mock

mockUseVenueTypeCodeActions.mockReturnValue({ setVenueTypeCode: mockSetVenueTypeCode })

const VENUE_TYPE = VenueTypeCodeKey.MOVIE

describe('SingleFilterBannerContainer', () => {
  beforeEach(() => {
    mockUseVenueTypeCode.mockReturnValue(VENUE_TYPE)
  })

  it('should render correctly', async () => {
    render(<SingleFilterBannerContainer />)

    expect(screen.getByText(ellipseString(parseType(VENUE_TYPE), 20))).toBeOnTheScreen()
  })

  it('Should filter with no venueCode', async () => {
    mockUseVenueTypeCode.mockReturnValueOnce(null)

    render(<SingleFilterBannerContainer />)

    expect(screen.getByText('Tous les lieux')).toBeOnTheScreen()
  })
})
