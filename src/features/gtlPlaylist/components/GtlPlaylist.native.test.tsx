import { SearchResponse } from '@algolia/client-search'
import React from 'react'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('react-query')

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

const venue: VenueResponse = venueResponseSnap
const playlists: GTLPlaylistResponse = [
  {
    title: 'Test',
    offers: {
      hits: [
        {
          offer: {
            name: 'Mon abonnement bibliothèque',
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          },
          venue,
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '12',
        },
      ],
      page: 0,
      nbPages: 1,
      nbHits: 1,
      hitsPerPage: 25,
      processingTimeMS: 1,
      exhaustiveNbHits: true,
      query: '',
      params: '',
    } as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
]

describe('GtlPlaylist', () => {
  it('should log ConsultOffer when pressing an item', () => {
    render(<GtlPlaylist playlist={playlists[0]} venue={venue} />)

    fireEvent.press(screen.queryAllByText('Mon abonnement bibliothèque')[0])

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      from: 'venue',
      index: 0,
      moduleId: '2xUlLBRfxdk6jeYyJszunX',
      offerId: 12,
      venueId: 5543,
    })
  })
})
