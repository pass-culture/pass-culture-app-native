import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import {
  buildAlgoliaFilter,
  fetchOffersByArtist,
} from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Position } from 'libs/location'

const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries')

const mockUserLocation: Position = { latitude: 2, longitude: 2 }

describe('fetchOffersByArtist', () => {
  it('should execute the multiple queries if artist is provided and subcategory compatible with the artist page', async () => {
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
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaOffersIndexNameB',
        query: '',
        params: {
          page: 0,
          filters: 'artists.id:"1"',
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
          filters: 'artists.id:"1"',
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
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      userLocation: mockUserLocation,
    })

    expect(result).toEqual({ playlistHits: [], topOffersHits: [] })
  })

  it('should not execute the query if artist is provided and subcategory not compatible with the artist page', async () => {
    await fetchOffersByArtist({
      artistId: '1',
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })
})

describe('buildAlgoliaFilter', () => {
  it('should build the correct filter when artist is provided', () => {
    const filter = buildAlgoliaFilter({
      artistId: '1',
    })

    expect(filter).toEqual('artists.id:"1"')
  })

  it('should return an empty string when artist is undefined', () => {
    const filter = buildAlgoliaFilter({
      artistId: undefined,
    })

    expect(filter).toEqual('')
  })
})
