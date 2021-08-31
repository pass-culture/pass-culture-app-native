import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { mockDefaultSettings } from 'features/auth/__mocks__/settings'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffersWithOneOfferResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { AlgoliaHit } from 'libs/algolia'
import { render } from 'tests/utils'

import { VenueOffers } from '../VenueOffers'

const venueId = venueResponseSnap.id

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({ data: { ...mockDefaultSettings, useAppSearch: true } })),
}))
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = mocked(useVenueOffers)

describe('<VenueOffers />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<VenueOffers venueId={venueId} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display "En voir plus" button if hits is more than hits.length', () => {
    const { queryByText } = render(<VenueOffers venueId={venueId} />)
    expect(queryByText('En voir plus')).toBeTruthy()
  })

  it(`should doesn't display "En voir plus" button if hits is less than hits.length`, () => {
    mockUseVenueOffers.mockReturnValueOnce(({
      data: { hits: VenueOffersWithOneOfferResponseSnap, nbHits: 3 },
    } as unknown) as UseQueryResult<{ hits: AlgoliaHit[]; nbHits: number }, unknown>)

    const { queryByText } = render(<VenueOffers venueId={venueId} />)
    expect(queryByText('En voir plus')).toBeFalsy()
  })
})
