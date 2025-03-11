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
  it('should execute the multiple queries if artist is provided, subcategory is a book, and artist is not "collectif"', async () => {
    mockMultipleQueries.mockResolvedValueOnce([
      {
        hits: [],
      } as unknown as SearchResponse<AlgoliaOfferWithArtistAndEan>,
      {
        hits: [],
      } as unknown as SearchResponse<AlgoliaOfferWithArtistAndEan>,
    ])
    await fetchOffersByArtist({
      artists: 'Eiichiro Oda',
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
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
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean'],
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
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean'],
          attributesToHighlight: [],
        },
      },
    ])
  })

  it('should return empty hits if multiple queries throw an error', async () => {
    mockMultipleQueries.mockRejectedValueOnce(new Error('Algolia error'))

    const result = await fetchOffersByArtist({
      artists: 'Eiichiro Oda',
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      userLocation: mockUserLocation,
    })

    expect(result).toEqual({ playlistHits: [], topOffersHits: [] })
  })

  it('should not execute the query if artist is provided, subcategory is not a book and artist is not "collectif"', async () => {
    await fetchOffersByArtist({
      artists: 'Eiichiro Oda',
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })

  it('should not execute the query if artist is provided, subcategory is a book, and artist is "COLLECTIF"', async () => {
    await fetchOffersByArtist({
      artists: 'COLLECTIF',
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      userLocation: mockUserLocation,
    })

    expect(mockMultipleQueries).not.toHaveBeenCalled()
  })

  it('should not execute the query if artist is provided, subcategory is a book, and artist is "COLLECTIFS"', async () => {
    await fetchOffersByArtist({
      artists: 'COLLECTIFS',
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
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

  it('should return an empty string when artist is null', () => {
    const filter = buildAlgoliaFilter({
      artists: null,
    })

    expect(filter).toEqual('')
  })

  it('should return an empty string when artist is undefined', () => {
    const filter = buildAlgoliaFilter({
      artists: undefined,
    })

    expect(filter).toEqual('')
  })
})
