import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { env } from 'libs/environment/env'
import { Offer } from 'shared/offer/types'

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearchForHits = client.searchForHits as jest.Mock

const mockCaptureAlgoliaError = jest.fn()
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: (error: unknown) => mockCaptureAlgoliaError(error),
}))

const userLocation = {
  latitude: 48.8566,
  longitude: 2.3522,
}

const mockOffer = (overrides?: Partial<Offer['offer']>): Offer =>
  ({
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      isEducational: false,
      name: 'Test Book',
      prices: [10],
      subcategoryId: 'LIVRE_PAPIER',
      thumbUrl: 'https://example.com/thumb.jpg',
      ...overrides,
    },
    objectID: '12345',
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

describe('fetchOffersByEan', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchForHits.mockResolvedValue({ results: [{ hits: [], nbHits: 0 }] })
  })

  it('should fetch with default search params and EAN list filter', async () => {
    const eanList = ['9782070584628', '9782070584635']

    await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
          query: '',
          page: 0,
          hitsPerPage: 2,
          facetFilters: expect.arrayContaining([['offer.isEducational:false']]),
          attributesToRetrieve: offerAttributesToRetrieve,
          attributesToHighlight: [],
        }),
      ],
    })
  })

  it('should set hitsPerPage to the length of eanList', async () => {
    const eanList = ['9782070584628', '9782070584635', '9782070584642', '9782070584659']

    await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          hitsPerPage: 4,
        }),
      ],
    })
  })

  it('should add underage filter when isUserUnderage is true', async () => {
    const eanList = ['9782070584628']

    await fetchOffersByEan({ eanList, userLocation, isUserUnderage: true })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          facetFilters: expect.arrayContaining([
            ['offer.isEducational:false'],
            ['offer.isForbiddenToUnderage:false'],
          ]),
        }),
      ],
    })
  })

  it('should filter out educational offers from results', async () => {
    const eanList = ['9782070584628', '9782070584635']
    const educationalOffer = mockOffer({ isEducational: true })
    const regularOffer = mockOffer({ isEducational: false })

    mockSearchForHits.mockResolvedValueOnce({
      results: [{ hits: [educationalOffer, regularOffer], nbHits: 2 }],
    })

    const result = await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(result).toHaveLength(1)
    expect(result[0]?.offer.isEducational).toBe(false)
  })

  it('should return empty array when no hits are returned', async () => {
    const eanList = ['9782070584628']
    mockSearchForHits.mockResolvedValueOnce({
      results: [{ hits: [], nbHits: 0 }],
    })

    const result = await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(result).toEqual([])
  })

  it('should return empty array when results are undefined', async () => {
    const eanList = ['9782070584628']
    mockSearchForHits.mockResolvedValueOnce({
      results: [{ hits: undefined }],
    })

    const result = await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(result).toEqual([])
  })

  it('should return empty array and capture error when search fails', async () => {
    const eanList = ['9782070584628']
    const error = new Error('Algolia search failed')
    mockSearchForHits.mockRejectedValueOnce(error)

    const result = await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(result).toEqual([])
    expect(mockCaptureAlgoliaError).toHaveBeenCalledWith(error)
  })

  it('should handle null userLocation', async () => {
    const eanList = ['9782070584628']

    await fetchOffersByEan({ eanList, userLocation: null, isUserUnderage: false })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
          query: '',
          page: 0,
          hitsPerPage: 1,
        }),
      ],
    })
  })

  it('should return all non-educational offers', async () => {
    const eanList = ['9782070584628', '9782070584635', '9782070584642']
    const offer1 = mockOffer({ isEducational: false, name: 'Book 1' })
    const offer2 = mockOffer({ isEducational: false, name: 'Book 2' })
    const offer3 = mockOffer({ isEducational: false, name: 'Book 3' })

    mockSearchForHits.mockResolvedValueOnce({
      results: [{ hits: [offer1, offer2, offer3], nbHits: 3 }],
    })

    const result = await fetchOffersByEan({ eanList, userLocation, isUserUnderage: false })

    expect(result).toHaveLength(3)
  })
})
