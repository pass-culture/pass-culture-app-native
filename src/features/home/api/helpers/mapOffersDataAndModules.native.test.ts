import { SearchResponse } from 'algoliasearch/lite'

import { mapOffersDataAndModules } from 'features/home/api/helpers/mapOffersDataAndModules'
import { OfferModuleParamsInfo } from 'features/home/types'
import { AlgoliaOffer } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

const createMockHit = (
  objectID: string,
  thumbUrl: string | null = 'https://example.com/thumb.jpg'
): Offer =>
  ({
    objectID,
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: `Offer ${objectID}`,
      prices: [10],
      subcategoryId: 'LIVRE_PAPIER',
      thumbUrl,
    },
    venue: {
      id: 1,
      name: 'Test Venue',
      publicName: 'Test Venue',
      address: '1 rue de la Paix',
      postalCode: '75001',
      city: 'Paris',
    },
    _geoloc: { lat: 48.8566, lng: 2.3522 },
  }) as Offer

const createMockSearchResponse = (hits: Offer[], nbHits?: number): SearchResponse<Offer> => ({
  hits,
  nbHits: nbHits ?? hits.length,
  page: 0,
  nbPages: 1,
  hitsPerPage: 10,
  exhaustiveNbHits: true,
  query: '',
  params: '',
  processingTimeMS: 1,
})

const createMockModuleParams = (
  moduleId: string,
  adaptedPlaylistParametersCount: number
): OfferModuleParamsInfo => ({
  moduleId,
  adaptedPlaylistParameters: Array(adaptedPlaylistParametersCount).fill(
    {}
  ) as OfferModuleParamsInfo['adaptedPlaylistParameters'],
})

const identityTransform = (hit: AlgoliaOffer): AlgoliaOffer => hit

describe('mapOffersDataAndModules', () => {
  it('should return empty array when modulesParams is empty', () => {
    const result = mapOffersDataAndModules({
      data: [],
      modulesParams: [],
      transformHits: identityTransform,
    })

    expect(result).toEqual([])
  })

  it('should filter out undefined modules', () => {
    const hit = createMockHit('1')
    const data = [createMockSearchResponse([hit])]
    const modulesParams = [undefined, createMockModuleParams('module1', 1), undefined]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.moduleId).toBe('module1')
  })

  it('should filter out modules with empty adaptedPlaylistParameters', () => {
    const hit = createMockHit('1')
    const data = [createMockSearchResponse([hit])]
    const moduleWithEmptyParams = createMockModuleParams('emptyModule', 0)
    const moduleWithParams = createMockModuleParams('validModule', 1)

    const result = mapOffersDataAndModules({
      data,
      modulesParams: [moduleWithEmptyParams, moduleWithParams],
      transformHits: identityTransform,
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.moduleId).toBe('validModule')
  })

  it('should map data correctly for a single module', () => {
    const hit1 = createMockHit('1')
    const hit2 = createMockHit('2')
    const data = [createMockSearchResponse([hit1, hit2], 10)]
    const modulesParams = [createMockModuleParams('module1', 1)]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      playlistItems: [hit1, hit2],
      nbPlaylistResults: 10,
      moduleId: 'module1',
    })
  })

  it('should map data correctly for multiple modules with multiple params', () => {
    const hit1 = createMockHit('1')
    const hit2 = createMockHit('2')
    const hit3 = createMockHit('3')
    const hit4 = createMockHit('4')

    const data = [
      createMockSearchResponse([hit1], 5),
      createMockSearchResponse([hit2], 3),
      createMockSearchResponse([hit3, hit4], 10),
    ]

    const modulesParams = [
      createMockModuleParams('module1', 2), // Should get first 2 responses
      createMockModuleParams('module2', 1), // Should get 3rd response
    ]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      playlistItems: [hit1, hit2],
      nbPlaylistResults: 8, // 5 + 3
      moduleId: 'module1',
    })
    expect(result[1]).toEqual({
      playlistItems: [hit3, hit4],
      nbPlaylistResults: 10,
      moduleId: 'module2',
    })
  })

  it('should filter out hits without thumbUrl', () => {
    const hitWithThumb = createMockHit('1', 'https://example.com/thumb.jpg')
    const hitWithoutThumb = createMockHit('2', null)
    const hitWithEmptyThumb = createMockHit('3', '')

    const data = [createMockSearchResponse([hitWithThumb, hitWithoutThumb, hitWithEmptyThumb])]
    const modulesParams = [createMockModuleParams('module1', 1)]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result[0]?.playlistItems).toHaveLength(1)
    expect((result[0]?.playlistItems[0] as Offer).objectID).toBe('1')
  })

  it('should apply transformHits function to all hits', () => {
    const hit = createMockHit('1')
    const data = [createMockSearchResponse([hit])]
    const modulesParams = [createMockModuleParams('module1', 1)]

    const transformHits = jest.fn((h: AlgoliaOffer) => ({
      ...h,
      offer: { ...h.offer, name: 'Transformed' },
    })) as unknown as (hit: AlgoliaOffer) => AlgoliaOffer

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits,
    })

    expect(transformHits).toHaveBeenCalledTimes(1)
    expect((result[0]?.playlistItems[0] as Offer).offer.name).toBe('Transformed')
  })

  it('should deduplicate hits by objectID', () => {
    const hit1 = createMockHit('1')
    const duplicateHit1 = createMockHit('1')
    const hit2 = createMockHit('2')

    const data = [createMockSearchResponse([hit1, hit2]), createMockSearchResponse([duplicateHit1])]
    const modulesParams = [createMockModuleParams('module1', 2)]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result[0]?.playlistItems).toHaveLength(2)
  })

  it('should handle nbHits being undefined', () => {
    const hit = createMockHit('1')
    const responseWithUndefinedNbHits: SearchResponse<Offer> = {
      hits: [hit],
      nbHits: undefined as unknown as number,
      page: 0,
      nbPages: 1,
      hitsPerPage: 10,
      exhaustiveNbHits: true,
      query: '',
      params: '',
      processingTimeMS: 1,
    }

    const data = [responseWithUndefinedNbHits]
    const modulesParams = [createMockModuleParams('module1', 1)]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result[0]?.nbPlaylistResults).toBe(0)
  })

  it('should handle empty hits array', () => {
    const data = [createMockSearchResponse([], 0)]
    const modulesParams = [createMockModuleParams('module1', 1)]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result[0]?.playlistItems).toEqual([])
    expect(result[0]?.nbPlaylistResults).toBe(0)
  })

  it('should correctly iterate through multiple modules', () => {
    const hits = Array.from({ length: 6 }, (_, i) => createMockHit(String(i + 1)))

    const data = hits.map((hit) => createMockSearchResponse([hit], 1))

    const modulesParams = [
      createMockModuleParams('module1', 2),
      createMockModuleParams('module2', 3),
      createMockModuleParams('module3', 1),
    ]

    const result = mapOffersDataAndModules({
      data,
      modulesParams,
      transformHits: identityTransform,
    })

    expect(result).toHaveLength(3)
    expect(result[0]?.playlistItems).toHaveLength(2)
    expect(result[1]?.playlistItems).toHaveLength(3)
    expect(result[2]?.playlistItems).toHaveLength(1)
    expect((result[0]?.playlistItems[0] as Offer).objectID).toBe('1')
    expect((result[1]?.playlistItems[0] as Offer).objectID).toBe('3')
    expect((result[2]?.playlistItems[0] as Offer).objectID).toBe('6')
  })
})
