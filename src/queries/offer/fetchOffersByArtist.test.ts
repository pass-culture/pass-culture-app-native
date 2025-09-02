import { SearchResponse } from '@algolia/client-search'

import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

import { buildAlgoliaFilter, fetchOffersByArtist } from './fetchOffersByArtist'

const mockMultipleQueries = jest.spyOn(multipleQueriesAPI, 'multipleQueries')

const mockUserLocation: Position = { latitude: 2, longitude: 2 }

describe('fetchOffersByArtist', () => {
  it('should execute the multiple queries', async () => {
    mockMultipleQueries.mockResolvedValueOnce([
      {
        hits: [],
      } as unknown as SearchResponse<AlgoliaOfferWithArtistAndEan>,
      {
        hits: [],
      } as unknown as SearchResponse<AlgoliaOfferWithArtistAndEan>,
    ])
    await fetchOffersByArtist({
      artistId: '1',
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaOffersIndexName',
        query: '',
        params: {
          page: 0,
          filters: 'artists.id:1',
          hitsPerPage: 100,
          aroundLatLng: '2, 2',
          aroundRadius: 'all',
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean', 'artists'],
          attributesToHighlight: [],
        },
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        query: '',
        params: {
          page: 0,
          filters: 'artists.id:1',
          hitsPerPage: 4,
          aroundLatLng: '2, 2',
          aroundRadius: 'all',
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean', 'artists'],
          attributesToHighlight: [],
        },
      },
    ])
  })

  it('should return empty hits if multiple queries throw an error', async () => {
    mockMultipleQueries.mockRejectedValueOnce(new Error('Algolia error'))

    const result = await fetchOffersByArtist({
      artistId: '1',
      userLocation: mockUserLocation,
    })

    expect(result).toEqual({ playlistHits: [], topOffersHits: [] })
  })
})

describe('buildAlgoliaFilter', () => {
  it('should build the correct filter when artist is provided', () => {
    const filter = buildAlgoliaFilter({
      artistId: '1',
    })

    expect(filter).toEqual('artists.id:1')
  })

  it('should return an empty string when artist is undefined', () => {
    const filter = buildAlgoliaFilter({
      artistId: undefined,
    })

    expect(filter).toEqual('')
  })
})
