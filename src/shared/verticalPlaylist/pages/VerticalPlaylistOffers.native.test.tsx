import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { VerticalPlaylistOffers } from 'shared/verticalPlaylist/pages/VerticalPlaylistOffers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: '', searchId: '1' }, resetSearch: jest.fn() }),
}))

jest.mock('shared/verticalPlaylist/helpers/useGetOffersFromPlaylist', () => ({
  useGetOffersFromPlaylist: () => ({
    items: [{ objectID: '1', offer: { name: 'Module playlist' } }],
    title: 'mock',
    searchId: '1',
    searchQuery: '',
  }),
}))

jest.mock('shared/verticalPlaylist/helpers/useGetOffersSimilarsFromPlaylist', () => ({
  useGetOffersSimilarsFromPlaylist: () => ({
    items: [{ objectID: '1', offer: { name: 'Similar offer' } }],
    title: 'Similar playlist',
  }),
}))

jest.mock('queries/venue/useVenueOffersQuery', () => ({
  useVenueOffersQuery: () => ({
    data: { hits: [{ objectID: '1', offer: { name: 'Venue offer', subcategoryId: 123 } }] },
  }),
}))

jest.mock('features/venue/queries/useVenueQuery', () => ({
  useVenueQuery: () => ({ data: {} }),
}))

jest.mock('features/venue/helpers/useVenueSearchParameters', () => ({
  useVenueSearchParameters: () => ({}),
}))

describe('VerticalPlaylistOffers', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
  })

  it('should render VerticalPlaylistOffersModule', () => {
    useRoute.mockReturnValueOnce({
      params: { type: VerticalPlaylist.ModuleOffers, module: { title: 'Module playlist' } },
    })

    renderVerticalPlaylistOffers()

    expect(screen.getByText('Module playlist')).toBeOnTheScreen()
  })

  it('should render VerticalPlaylistVenueOffers', () => {
    useRoute.mockReturnValueOnce({
      params: {
        type: VerticalPlaylist.VenueOffers,
        module: { venueId: 123, playlistTitle: 'Venue playlist' },
      },
    })

    renderVerticalPlaylistOffers()

    expect(screen.getAllByText('Venue playlist')[0]).toBeOnTheScreen()
  })

  it('should render VerticalPlaylistSimilarsOffers', () => {
    useRoute.mockReturnValueOnce({
      params: {
        type: VerticalPlaylist.SimilarOffers,
        module: {
          offer: { id: 1 },
          offerSearchGroup: 'GROUP',
          searchGroupList: [],
          type: 'SOME_TYPE',
        },
      },
    })

    renderVerticalPlaylistOffers()

    expect(screen.getAllByText('Similar playlist')[0]).toBeOnTheScreen()
  })

  it('should render VerticalPlaylistSearchOffers', () => {
    useRoute.mockReturnValueOnce({
      params: {
        type: VerticalPlaylist.ThematicSearchOffers,
        module: {
          title: 'Thematic playlist',
          offers: { hits: [{ objectID: '1', offer: { name: 'Thematic offer' } }] },
        },
      },
    })

    renderVerticalPlaylistOffers()

    expect(screen.getAllByText('Thematic playlist')[0]).toBeOnTheScreen()
  })

  it('should render error when module is missing', () => {
    useRoute.mockReturnValueOnce({ params: { type: VerticalPlaylist.VenueOffers } })

    renderVerticalPlaylistOffers()

    expect(screen.getByText('Oups !')).toBeOnTheScreen()
  })

  it('should render error for unknown type', () => {
    useRoute.mockReturnValueOnce({ params: { type: 'UNKNOWN_TYPE', module: {} } })

    renderVerticalPlaylistOffers()

    expect(screen.getByText('Oups !')).toBeOnTheScreen()
  })
})

const renderVerticalPlaylistOffers = () => render(reactQueryProviderHOC(<VerticalPlaylistOffers />))
