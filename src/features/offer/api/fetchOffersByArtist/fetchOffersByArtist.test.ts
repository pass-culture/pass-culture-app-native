import { SearchResponse } from '@algolia/client-search'

import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  HitOfferWithArtistAndEan,
  buildAlgoliaFilter,
  fetchOffersByArtist,
} from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Position } from 'libs/location'

const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
  {
    hits: [],
  } as unknown as SearchResponse<HitOfferWithArtistAndEan>,
  {
    hits: [],
  } as unknown as SearchResponse<HitOfferWithArtistAndEan>,
])

const mockUserLocation: Position = { latitude: 2, longitude: 2 }

describe('fetchOffersByArtist', () => {
  it('should execute the multiple queries if artist is provided, searchGroupName is a book, and artist is not "collectif"', async () => {
    await fetchOffersByArtist({
      artists: 'Eiichiro Oda',
      searchGroupName: SearchGroupNameEnumv2.LIVRES,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaOffersIndexNameB',
        query: '',
        params: {
          page: 0,
          filters: 'offer.artist:"Eiichiro Oda"',
          hitsPerPage: 100,
          aroundLatLng: '2, 2',
          aroundRadius: 'all',
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
          attributesToHighlight: [],
        },
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        query: '',
        params: {
          page: 0,
          filters: 'offer.artist:"Eiichiro Oda"',
          hitsPerPage: 4,
          aroundLatLng: '2, 2',
          aroundRadius: 'all',
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
          attributesToHighlight: [],
        },
      },
    ])
  })

  it('should not execute the query if artist is provided, searchGroupName is not a book and artist is not "collectif"', async () => {
    await fetchOffersByArtist({
      artists: 'Eiichiro Oda',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })

  it('should not execute the query if artist is provided, searchGroupName is a book, and artist is "COLLECTIF"', async () => {
    await fetchOffersByArtist({
      artists: 'COLLECTIF',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })

  it('should not execute the query if artist is provided, searchGroupName is a book, and artist is "COLLECTIFS"', async () => {
    await fetchOffersByArtist({
      artists: 'COLLECTIFS',
      searchGroupName: SearchGroupNameEnumv2.CINEMA,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })
})

describe('buildAlgoliaFilter', () => {
  it('should build the correct filter when artist is provided', () => {
    const filter = buildAlgoliaFilter({
      artists: 'Eiichiro Oda',
    })

    expect(filter).toEqual('offer.artist:"Eiichiro Oda"')
  })

  it('should handle multiple artists and ean', () => {
    const filter = buildAlgoliaFilter({
      artists: 'Eiichiro Oda ; Another Artist',
    })

    expect(filter).toEqual('offer.artist:"Eiichiro Oda"')
  })
})
