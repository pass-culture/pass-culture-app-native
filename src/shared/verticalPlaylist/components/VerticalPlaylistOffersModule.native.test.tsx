import React from 'react'

import { ArtistPlaylistModule, HomepageModuleType, OffersModule } from 'features/home/types'
import { initialSearchState } from 'features/search/context/reducer'
import * as ArtistQueryModule from 'queries/artist/useArtistQuery' // 1. Importer tout le module
import { VerticalPlaylistOffersModule } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersModule'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('shared/verticalPlaylist/helpers/useGetOffersFromPlaylist', () => ({
  useGetOffersFromPlaylist: () => ({
    title: '',
    subtitle: '',
    items: [],
    searchId: '',
    searchQuery: '',
  }),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const useArtistQuerySpy = jest.spyOn(ArtistQueryModule, 'useArtistQuery')

describe('VerticalPlaylistOffersModule', () => {
  it('should call useArtistQuery when module type is ArtistPlaylistModule', () => {
    const formattedArtistPlaylistModule: ArtistPlaylistModule = {
      type: HomepageModuleType.ArtistPlaylistModule,
      id: '2DYuR6KoSLElDuiMMjxx8g',
      title: 'Fais le plein de lecture',
      artistId: 'dc9babd-4cd3-4971-ae5c-6f7775748807',
      displayParameters: {
        title: 'Fais le plein de lecture avec notre partenaire ',
        subtitle: 'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
        layout: 'two-items',
        minOffers: 1,
      },
      offersModuleParameters: [
        {
          title: 'Livre',
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 10,
          subcategories: ['Livre', 'Livre numérique, e-book'],
          minBookingsThreshold: 2,
          musicTypes: ['Pop', 'Gospel'],
          movieGenres: ['ACTION', 'BOLLYWOOD'],
          showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
          bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
        },
      ],
    }

    render(
      reactQueryProviderHOC(<VerticalPlaylistOffersModule module={formattedArtistPlaylistModule} />)
    )

    expect(useArtistQuerySpy).toHaveBeenCalledWith('dc9babd-4cd3-4971-ae5c-6f7775748807', {
      throwOnError: false,
      enabled: true,
    })
  })

  it('should call useArtistQuery with empty string and disabled when module type is NOT ArtistPlaylistModule', () => {
    const mockModule: OffersModule = {
      id: 'module-id',
      title: 'Fais le plein de lecture',
      type: HomepageModuleType.OffersModule,
      displayParameters: {
        title: 'Fais le plein de lecture avec notre partenaire ',
        subtitle: 'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
        layout: 'two-items',
        minOffers: 1,
      },
      offersModuleParameters: [
        {
          title: 'Livre',
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 10,
          subcategories: ['Livre', 'Livre numérique, e-book'],
          minBookingsThreshold: 2,
          musicTypes: ['Pop', 'Gospel'],
          movieGenres: ['ACTION', 'BOLLYWOOD'],
          showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
          bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
        },
      ],
    }

    render(reactQueryProviderHOC(<VerticalPlaylistOffersModule module={mockModule} />))

    expect(useArtistQuerySpy).toHaveBeenCalledWith('', {
      throwOnError: false,
      enabled: false,
    })
  })
})
